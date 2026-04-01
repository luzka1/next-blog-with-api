"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import {
  PostUpdateSchema,
  PublicPostForApiDto,
  PublicPostSchemaForApi,
  UpdatePostForApiSchema,
} from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticaded-api-request";
import { getZodErrorMessages } from "@/utils/get-zod-error-messages";
import { makeRandomString } from "@/utils/make-random-string";
import { updateTag } from "next/cache";

type UpdatePostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData,
): Promise<UpdatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi();

  const makeResult = ({
    formState = PublicPostSchemaForApi.parse(prevState.formState),
    errors = [],
    success,
  }: {
    formState?: PublicPostForApiDto;
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
  const zodParsedObject = UpdatePostForApiSchema.safeParse(formDataToObject);

  if (!isAuthenticated) {
    return makeResult({
      formState: PublicPostSchemaForApi.parse(formDataToObject),
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

  const updatePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    },
  );

  if (!updatePostResponse.success) {
    return makeResult({
      formState: PublicPostSchemaForApi.parse(formDataToObject),
      errors: updatePostResponse.errors,
    });
  }

  const post = updatePostResponse.data;
  (updateTag("posts"), updateTag(`post-${post.slug}`));

  return makeResult({
    formState: PublicPostSchemaForApi.parse(post),
    success: makeRandomString(),
  });
}
