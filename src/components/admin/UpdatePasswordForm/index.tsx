"use client";

import { updatePasswordAction } from "@/actions/user/update-user-password-action";
import { showMessage } from "@/adapters/showMessage";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { LockKeyholeIcon } from "lucide-react";
import { useActionState, useEffect } from "react";

export function UpdatePasswordForm() {
  const [state, action, isPending] = useActionState(updatePasswordAction, {
    errors: [],
    success: false,
  });

  useEffect(() => {
    showMessage.dismiss();

    if (state.errors.length > 0) {
      state.errors.forEach((e) => showMessage.error(e));
    }

    if (state.success) {
      showMessage.success("Atualizado com sucesso");
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center mb-16 text-center max-w-sm mt-16 mx-auto">
      <form action={action} className="flex-1 flex flex-col gap-6">
        <InputText
          type="password"
          name="currentPassword"
          labelText="Senha atual"
          placeholder="Sua senha atual"
          disabled={isPending}
          defaultValue={""}
        />

        <InputText
          type="password"
          name="newPassword"
          labelText="Nova senha"
          placeholder="Sua nova senha"
          disabled={isPending}
          defaultValue={""}
        />

        <InputText
          type="password"
          name="newPassword2"
          labelText="Repita a nova senha"
          placeholder="Sua nova senha novamente"
          disabled={isPending}
          defaultValue={""}
        />

        <div className="flex items-center justify-center mt-4">
          <Button disabled={isPending} type="submit">
            <LockKeyholeIcon />
            Atualizar senha
          </Button>
        </div>
      </form>
    </div>
  );
}
