import { PostModelFromApi } from "@/models/post/post-model";
import { postRepository } from "@/repositories/post";
import { apiRequest } from "@/utils/api-request";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

export const findAllPublicPosts = cache(async () => {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  return await postRepository.findAllPublic();
});

export const findAllPublicPostsFromApi = cache(async () => {
  const postsReponse = await apiRequest<PostModelFromApi[]>(`/post`, {});

  return postsReponse;
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

export const findPublicPostBySlugFromApi = cache(async (slug: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`post-${slug}`);

  const postsReponse = await apiRequest<PostModelFromApi>(`/post/${slug}`, {
    next: {
      tags: [`post-${slug}`],
      revalidate: 86400,
    },
  });

  return postsReponse;
});
