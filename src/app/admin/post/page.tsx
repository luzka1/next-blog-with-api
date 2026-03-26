import { PostsListAdmin } from "@/components/admin/PostsListAdmin";
import { SpinLoader } from "@/components/SpinLoader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Post Admin",
};

export default async function AdminPostPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<SpinLoader />}>
        <PostsListAdmin />
      </Suspense>
    </div>
  );
}
