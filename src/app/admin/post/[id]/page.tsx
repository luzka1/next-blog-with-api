import { AdminSinglePost } from "@/components/admin/AdminSinglePost";
import { SpinLoader } from "@/components/SpinLoader";
import { Metadata } from "next";
import { Suspense } from "react";

type AdminSinglePostPage = {
  params: Promise<{ id: string }>;
};

export const metadata:Metadata = {
  title: "Editar post"
}

export default function AdminSinglePostPage({ params }: AdminSinglePostPage) {
  const idParam = params.then((p) => ({ id: p.id }));

  return (
    <Suspense fallback={<SpinLoader />}>
      <AdminSinglePost idParam={idParam} />
    </Suspense>
  );
}
