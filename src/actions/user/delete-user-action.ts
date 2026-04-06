"use server";

import { deleteLoginSession } from "@/lib/login/manage-login";
import { getUserFromApi } from "@/lib/user/api/get-user";
import { authenticatedApiRequest } from "@/utils/authenticaded-api-request";
import { redirect } from "next/navigation";

type DeleteUserActionState = {
  errors: string[];
  success: boolean;
};

export async function deleteUserAction(): Promise<DeleteUserActionState> {
  const user = await getUserFromApi();

  if (!user) {
    return {
      errors: ["Você precisa fazer login novamente!"],
      success: false,
    };
  }

  const deleteUserResponse =
    await authenticatedApiRequest<DeleteUserActionState>(`/user/me`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

  if (!deleteUserResponse.success) {
    return {
      errors: deleteUserResponse.errors,
      success: false,
    };
  }

  await deleteLoginSession();
  redirect("/login");
}
