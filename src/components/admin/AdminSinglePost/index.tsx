import { findPostByIdFromApiAdmin } from "@/lib/post/admin";
import { notFound } from "next/navigation";
import { ManagePostForm } from "../ManagePostForm";
import { PublicPostSchemaForApi } from "@/lib/post/schemas";

type AdminSinglePostPageProps = {
  idParam: Promise<{ id: string }>;
};

export async function AdminSinglePost({ idParam }: AdminSinglePostPageProps) {
  const { id } = await idParam;
  const postRes = await findPostByIdFromApiAdmin(id);

  if (!postRes.success) {
    (console.log(postRes.errors), notFound());
  }

  const post = postRes.data;
  const publicPost = PublicPostSchemaForApi.parse(post);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-extrabold">Editar post</h1>
      <ManagePostForm mode="update" publicPost={publicPost} />
    </div>
  );
}
