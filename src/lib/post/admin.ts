import { postRepository } from "@/repositories/post";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

export const findPostById = cache(async (slug: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("single-post");

  return await postRepository.findById(slug);
});

export const findAllPosts = cache(async () => {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  return await postRepository.findAll();
});
