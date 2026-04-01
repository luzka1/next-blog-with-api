"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import {
  CreatePostForApiSchema,
  PublicPostForApiDto,
  PublicPostSchemaForApi,
} from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticaded-api-request";
import { getZodErrorMessages } from "@/utils/get-zod-error-messages";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

type CreatePostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi();

  const makeResult = ({
    formState = PublicPostSchemaForApi.parse(prevState.formState),
    errors = [],
  }: {
    formState?: PublicPostForApiDto;
    errors?: string[];
  }) => ({
    formState,
    errors,
  });

  if (!(formData instanceof FormData))
    return makeResult({
      formState: PublicPostSchemaForApi.parse(prevState.formState),
      errors: ["Dados inválidos"],
    });

  const formDataToObject = Object.fromEntries(formData.entries());
  const zodParsedObject = CreatePostForApiSchema.safeParse(formDataToObject);

  if (!isAuthenticated) {
    return makeResult({
      formState: PublicPostSchemaForApi.parse(prevState.formState),
      errors: ["Faça login em outra aba e tente novamente!"],
    });
  }

  if (!zodParsedObject.success) {
    const errors = getZodErrorMessages(zodParsedObject.error.format());

    return makeResult({
      formState: PublicPostSchemaForApi.parse(formDataToObject),
      errors,
    });
  }

  const newPost = zodParsedObject.data;

  const createPostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    },
  );

  if (!createPostResponse.success) {
    return makeResult({
      formState: PublicPostSchemaForApi.parse(formDataToObject),
      errors: createPostResponse.errors,
    });
  }

  const createdPost = createPostResponse.data;

  updateTag("posts");
  redirect(`/admin/post/${createdPost.id}?created=1`);
}
