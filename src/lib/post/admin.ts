import { PostModelFromApi } from "@/models/post/post-model";
import { postRepository } from "@/repositories/post";
import { authenticatedApiRequest } from "@/utils/authenticaded-api-request";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

export const findPostById = cache(async (slug: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("single-post");

  return await postRepository.findById(slug);
});

export async function findPostByIdFromApiAdmin(id: string) {
  const postsResponse = await authenticatedApiRequest<PostModelFromApi>(
    `/post/me/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  return postsResponse;
}

export const findAllPosts = cache(async () => {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  return await postRepository.findAll();
});

export async function findAllPostFromApiAdmin() {
  const postsResponse = await authenticatedApiRequest<PostModelFromApi[]>(
    `/post/me/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  return postsResponse;
}
