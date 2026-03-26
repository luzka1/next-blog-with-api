import { findAllPublicPosts } from "@/lib/post/public";
import { PostCoverImage } from "../PostCoverImage";
import { PostSummary } from "../PostSummary";
import ErrorMessage from "../ErrorMessage";

export async function FeaturedPost() {
  const posts = await findAllPublicPosts();

  if (posts.length <= 0)
    return (
      <ErrorMessage
        contentTitle="Ops!"
        content="Ainda não criamos nenhum post 😢"
      />
    );

  const featuredPost = posts[0];

  const postLink = `/post/${featuredPost.slug}`;

  return (
    <section className="grid grid-cols-1 gap-8 mb-16 sm:grid-cols-2 group">
      <PostCoverImage
        linkProps={{
          href: postLink,
        }}
        imageProps={{
          width: 1200,
          height: 720,
          src: featuredPost.coverImageUrl,
          alt: featuredPost.title,
          priority: true,
        }}
      />

      <PostSummary
        title={featuredPost.title}
        excerpt={featuredPost.excerpt}
        createdAt={featuredPost.createdAt}
        postHeading="h1"
        postLink={postLink}
      />
    </section>
  );
}
