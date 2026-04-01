import { findAllPostFromApiAdmin, findAllPosts } from "@/lib/post/admin";
import clsx from "clsx";
import Link from "next/link";
import { DeletePostButton } from "../DeletePostButton";
import ErrorMessage from "../../ErrorMessage";

export async function PostsListAdmin() {
  const postsRes = await findAllPostFromApiAdmin();

  if (!postsRes.success) {
    return (
      <ErrorMessage
        contentTitle="Epa 😜"
        content="Tente fazer login novamente!"
      />
    );
  }

  const posts = postsRes.data;
  if (posts.length <= 0) {
    return (
      <ErrorMessage
        contentTitle="Epa 😜"
        content="Vamos por a mão na massa e criar novos posts?"
      />
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className={clsx(
            "p-2 flex justify-between items-center gap-2",
            !post.published && "bg-slate-200",
          )}
        >
          <Link href={`/admin/post/${post.id}`}>{post.title}</Link>
          {!post.published && (
            <span className="text-xs text-slate-600">Não publicado</span>
          )}

          <DeletePostButton id={post.id} title={post.title} />
        </div>
      ))}
    </div>
  );
}
