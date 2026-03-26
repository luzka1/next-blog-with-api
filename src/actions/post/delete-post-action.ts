"use server";

import { verifyLoginSession } from "@/lib/login/manage-login";
import { postRepository } from "@/repositories/post";
import { updateTag } from "next/cache";

export async function deletePostAction(id: string) {
  const isAuthenticated = await verifyLoginSession();

  if (!id || typeof id !== "string") {
    return {
      error: "Dados inválidos",
    };
  }

    if (!isAuthenticated) {
      return {
        error: "Usuário não autenticado, faça login novamente!",
      }
    }

  let post;

  try {
    post = await postRepository.delete(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "Erro desconhecido!" };
  }

  updateTag("posts");
  updateTag(`post-${post.slug}`);
  updateTag("single-post");

  return {
    error: "",
  };
}
