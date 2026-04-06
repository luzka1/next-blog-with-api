import { UpdatePasswordForm } from "@/components/admin/UpdatePasswordForm";
import { SpinLoader } from "@/components/SpinLoader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Trocar senha",
};

export default function ChangeUserPasswordPage() {
  return (
    <Suspense fallback={<SpinLoader className="mb-16" />}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
