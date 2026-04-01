import { SinglePost } from "@/components/SinglePost";
import { SpinLoader } from "@/components/SpinLoader";
import { findPublicPostBySlugFromApi } from "@/lib/post/public";
import { Metadata } from "next";
import { Suspense } from "react";

type PostSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PostSlugPageProps): Promise<Metadata> {
  const slugParam = params.then((p) => ({ slug: p.slug }));

  const { slug } = await slugParam;

  const postRes = await findPublicPostBySlugFromApi(slug);

  if (!postRes.success) {
    return {};
  }

  const post = postRes.data;

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function PostSlugPage({ params }: PostSlugPageProps) {
  const slug = params.then((p) => ({ slug: p.slug }));

  return (
    <Suspense fallback={<SpinLoader />}>
      <SinglePost slugParam={slug} />
    </Suspense>
  );
}
