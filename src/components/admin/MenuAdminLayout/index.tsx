import { MenuAdmin } from "@/components/admin/MenuAdmin";
import { requireLoginSessioForApiOrRedirect } from "@/lib/login/manage-login";

export async function MenuAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireLoginSessioForApiOrRedirect();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
