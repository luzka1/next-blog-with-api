import { findPublicPostBySlugFromApi } from "@/lib/post/public";
import Image from "next/image";
import { PostHeading } from "../PostHeading";
import { PostDate } from "../PostDate";
import { SafeMarkDown } from "../SafeMarkDown";
import { notFound } from "next/navigation";

type SinglePostProps = {
  slugParam: Promise<{ slug: string }>;
};

export async function SinglePost({ slugParam }: SinglePostProps) {
  const { slug } = await slugParam;

  const postRes = await findPublicPostBySlugFromApi(slug);

  if (!postRes.success) {
    notFound();
  }

  const post = postRes.data;

  return (
    <article className="mb-16">
      <header className="flex flex-col gap-4 mb-4">
        <Image
          className="rounded-xl"
          src={post.coverImageUrl}
          width={1200}
          height={720}
          alt={post.title}
        />

        <PostHeading url={`/post/${post.slug}`}>{post.title}</PostHeading>

        <p>
          {post.author.name} | <PostDate dateTime={post.createdAt} />
        </p>
      </header>

      <p className="mb-4 text-xl text-slate-600">{post.excerpt}</p>

      <div>
        <SafeMarkDown markdown={post.content} />
      </div>
    </article>
  );
}
