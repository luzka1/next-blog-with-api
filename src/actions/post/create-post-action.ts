"use server";

import { makePartialPublicPost, PublicPostDTO } from "@/dto/post/dto";
import { verifyLoginSession } from "@/lib/login/manage-login";
import { PostCreateSchema } from "@/lib/post/validations";
import { PostModel } from "@/models/post/post-model";
import { postRepository } from "@/repositories/post";
import { getZodErrorMessages } from "@/utils/get-zod-error-messages";
import { makeSlugFromText } from "@/utils/make-slug-from-text";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

type CreatePostActionState = {
  formState: PublicPostDTO;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData
): Promise<CreatePostActionState> {
  const isAuthenticated = await verifyLoginSession(); 

  const makeResult = ({
    formState = makePartialPublicPost(prevState.formState),
    errors = [],
  }: {
    formState?: PublicPostDTO;
    errors?: string[];
  }) => ({
    formState,
    errors,
  });

  if (!(formData instanceof FormData))
    return makeResult({
      formState: prevState.formState,
      errors: ["Dados inválidos"],
    });

  const formDataToObject = Object.fromEntries(formData.entries());
  const zodParsedObject = PostCreateSchema.safeParse(formDataToObject);

  if (!isAuthenticated) {
    return makeResult({
      formState: makePartialPublicPost(prevState.formState),
      errors: ["Faça login em outra aba e tente novamente!"],
    })
  }

  if (!zodParsedObject.success) {
    const errors = getZodErrorMessages(zodParsedObject.error.format());

    return makeResult({
      formState: makePartialPublicPost(formDataToObject),
      errors,
    });
  }

  const validPostData = zodParsedObject.data;

  const newPost: PostModel = {
    ...validPostData,
    id: uuidV4(),
    slug: makeSlugFromText(validPostData.title),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await postRepository.create(newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return makeResult({ formState: newPost, errors: [e.message] });
    }
    return makeResult({ formState: newPost, errors: ["Erro desconhecido!"] });
  }

  updateTag("posts");

  redirect(`/admin/post/${newPost.id}?created=1`);
}
