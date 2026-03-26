import { MenuAdminLayout } from "@/components/admin/MenuAdminLayout";
import { Suspense } from "react";

export default async function AdminPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<>Carregando...</>}>
        <MenuAdminLayout children={children} />
      </Suspense>
    </>
  );
}
