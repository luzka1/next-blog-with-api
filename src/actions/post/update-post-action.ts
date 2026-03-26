"use server";

import {
  makePartialPublicPost,
  makePublicPostFromDb,
  PublicPostDTO,
} from "@/dto/post/dto";
import { verifyLoginSession } from "@/lib/login/manage-login";
import { PostUpdateSchema } from "@/lib/post/validations";
import { postRepository } from "@/repositories/post";
import { getZodErrorMessages } from "@/utils/get-zod-error-messages";
import { makeRandomString } from "@/utils/make-random-string";
import { updateTag } from "next/cache";

type UpdatePostActionState = {
  formState: PublicPostDTO;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData,
): Promise<UpdatePostActionState> {
  const isAuthenticated = await verifyLoginSession();

  const makeResult = ({
    formState = makePartialPublicPost(prevState.formState),
    errors = [],
    success,
  }: {
    formState?: PublicPostDTO;
    errors?: string[];
    success?: string;
  }) => ({
    formState,
    errors,
    success,
  });

  if (!(formData instanceof FormData))
    return makeResult({
      formState: prevState.formState,
      errors: ["Dados inválidos"],
    });

  const id = formData.get("id")?.toString() || "";

  if (!id || typeof id != "string") {
    return makeResult({ errors: ["ID inválido!"] });
  }

  const formDataToObject = Object.fromEntries(formData.entries());
  const zodParsedObject = PostUpdateSchema.safeParse(formDataToObject);

  if (!isAuthenticated) {
    return makeResult({
      formState: makePartialPublicPost(formDataToObject),
      errors: ["Faça login em outra aba e tente novamente!"],
    });
  }

  if (!zodParsedObject.success) {
    const errors = getZodErrorMessages(zodParsedObject.error.format());

    return makeResult({
      formState: makePartialPublicPost(formDataToObject),
      errors,
    });
  }

  const validPostData = zodParsedObject.data;

  const newPost = {
    ...validPostData,
  };

  let post;

  try {
    post = await postRepository.update(id, newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return makeResult({
        formState: makePartialPublicPost(formDataToObject),
        errors: [e.message],
      });
    }
    return makeResult({
      formState: makePartialPublicPost(formDataToObject),
      errors: ["Erro desconhecido!"],
    });
  }

  updateTag("posts");
  updateTag(`post-${post.slug}`);

  return makeResult({
    formState: makePublicPostFromDb(post),
    success: makeRandomString(),
  });
}
