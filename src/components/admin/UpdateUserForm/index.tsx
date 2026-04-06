"use client";

import { deleteUserAction } from "@/actions/user/delete-user-action";
import { updateUserAction } from "@/actions/user/update-user-action";
import { showMessage } from "@/adapters/showMessage";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { InputText } from "@/components/InputText";
import { PublicUserDto } from "@/lib/user/schemas";
import { asyncDelay } from "@/utils/async-delay";
import { CircleXIcon, LockKeyholeIcon, UserPenIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";

type UpdateUserProps = {
  user: PublicUserDto;
};

export function UpdateUserForm({ user }: UpdateUserProps) {
  const [state, action, isPending] = useActionState(updateUserAction, {
    user,
    errors: [],
    success: false,
  });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isTransitioning, startTransition] = useTransition();
  const safetyDelay = 10000;
  const inElementsDisabled = isTransitioning || isPending;

  function showDeleteAccountDialog(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    e.preventDefault();
    setIsDialogVisible(true);

    startTransition(async () => {
      await asyncDelay(safetyDelay);
    });
  }

  function handleDeleteUserAccount() {
    startTransition(async () => {
      if (!confirm("Tem certeza que deseja cotinuar?")) return;

      const result = await deleteUserAction();

      if (result.errors) {
        showMessage.dismiss();
        result.errors.forEach((e) => showMessage.error(e));
      }

      setIsDialogVisible(false);
    });
  }

  useEffect(() => {
    showMessage.dismiss();

    if (state.errors.length > 0) {
      state.errors.forEach((error) => showMessage.error(error));
    }

    if (state.success) {
      showMessage.success("Usuário atualizado com sucesso!");
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center text-center max-w-sm mt-16 mb-32 mx-auto">
      <form action={action} className="flex-1 flex flex-col gap-6">
        <InputText
          type="text"
          name="name"
          labelText="Nome"
          placeholder="Seu nome"
          disabled={inElementsDisabled}
          defaultValue={state.user.name}
        />

        <InputText
          type="email"
          name="email"
          labelText="E-mail"
          placeholder="Seu e-mail"
          disabled={inElementsDisabled}
          defaultValue={state.user.email}
        />

        <Button type="submit">
          <UserPenIcon />
          <span>Atualizar</span>
        </Button>

        <div className="flex w-auto justify-between">
          <Link
            href="/admin/user/password"
            className="flex items-center gap-2 transition hover:text-gray-500"
            type="button"
          >
            <LockKeyholeIcon />
            <span>Trocar senha</span>
          </Link>

          <Link
            href="#"
            onClick={showDeleteAccountDialog}
            className="text-red-500 flex items-center gap-2 transtion hover:text-red-700"
            type="button"
          >
            <CircleXIcon />
            <span>Apagar conta</span>
          </Link>
        </div>
      </form>

      <Dialog
        content={
          <p>
            Ao apagar meu usuário, meus dados e todos os meus posts serão
            excluídos. Essa opção é <strong>IRREVERSÍVEL</strong>. Em alguns
            segundos os botões serão liberados. Clique em <b>OK</b> para
            confirmar ou <b>Cancelar</b> para fechar essa janela
          </p>
        }
        disabled={inElementsDisabled}
        onCancel={() => setIsDialogVisible(false)}
        onConfirm={handleDeleteUserAccount}
        isVisible={isDialogVisible}
        title="Apagar meu usuário"
      />
    </div>
  );
}
