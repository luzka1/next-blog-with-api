import { makePublicPostFromDb } from "@/dto/post/dto";
import { findPostById } from "@/lib/post/admin";
import { notFound } from "next/navigation";
import { ManagePostForm } from "../ManagePostForm";

type AdminSinglePostPageProps = {
  idParam: Promise<{ id: string }>;
};

export async function AdminSinglePost({ idParam }: AdminSinglePostPageProps) {
  const { id } = await idParam;
  const post = await findPostById(id);

  if (!post) return notFound();

  const publicPost = makePublicPostFromDb(post);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-extrabold">Editar post</h1>
      <ManagePostForm mode="update" publicPost={publicPost} />
    </div>
  );
}
