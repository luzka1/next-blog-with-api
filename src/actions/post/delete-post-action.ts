"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import { PublicPostForApiDto } from "@/lib/post/schemas";
import { postRepository } from "@/repositories/post";
import { authenticatedApiRequest } from "@/utils/authenticaded-api-request";
import { error } from "console";
import { updateTag } from "next/cache";

export async function deletePostAction(id: string) {
  const isAuthenticated = await getLoginSessionForApi();

  if (!isAuthenticated) {
    return {
      error: "Usuário não autenticado, faça login novamente!",
    };
  }

  if (!id || typeof id !== "string") {
    return {
      error: "Dados inválidos",
    };
  }

  const postReponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      headers: {
        "Content-Type": "application-json",
      },
    },
  );

  if (!postReponse.success) {
    return {
      error: "Erro ao encontrar post",
    };
  }

  const deletePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application-json",
      },
    },
  );

  if (!deletePostResponse.success) {
    return {
      error: "Erro ao apagar o post",
    };
  }

  updateTag("posts");
  updateTag(`post-${postReponse.data.slug}`);
  updateTag("single-post");

  return {
    error: "",
  };
}
