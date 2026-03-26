import { MenuAdmin } from "@/components/admin/MenuAdmin";
import { requireLoginSessioOrRedirect } from "@/lib/login/manage-login";

export async function MenuAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireLoginSessioOrRedirect();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
