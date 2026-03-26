import { postRepository } from "@/repositories/post";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

export const findAllPublicPosts = cache(async () => {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  return await postRepository.findAllPublic();
});

export const findPostBySlug = cache(async (slug: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`post-${slug}`);

  const post = await postRepository
    .findBySlugPublic(slug)
    .catch(() => undefined);

  if (!post) notFound();

  return post;
});
