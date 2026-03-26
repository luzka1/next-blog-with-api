import { findAllPublicPosts } from "@/lib/post/public";
import { PostCoverImage } from "../PostCoverImage";
import { PostSummary } from "../PostSummary";

export async function PostsList() {
  const posts = await findAllPublicPosts();

  if (posts.length <= 1) return null;

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 mb-16">
      {posts.slice(1).map((post) => {
        const postLink = `/post/${post.slug}`;
        return (
          <div key={post.id} className="flex flex-col gap-4 group">
            <PostCoverImage
              linkProps={{
                href: postLink,
              }}
              imageProps={{
                width: 1200,
                height: 720,
                src: post.coverImageUrl,
                alt: post.title,
              }}
            />

            <PostSummary
              title={post.title}
              excerpt={post.excerpt}
              createdAt={post.createdAt}
              postHeading="h2"
              postLink={postLink}
            />
          </div>
        );
      })}
    </div>
  );
}
