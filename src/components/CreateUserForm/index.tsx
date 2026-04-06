"use client";

import { InputText } from "@/components/InputText";
import { Button } from "@/components/Button";
import { UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { createUserAction } from "@/actions/user/create-user-action";
import { useActionState, useEffect } from "react";
import { PublicUserSchema } from "@/lib/user/schemas";
import { showMessage } from "@/adapters/showMessage";
import { HoneypotInput } from "../HoneypotInput";

export function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUserAction, {
    user: PublicUserSchema.parse({}),
    errors: [],
    success: false,
  });

  useEffect(() => {
    showMessage.dismiss();
    if (state.errors.length > 0) {
      state.errors.forEach((error) => showMessage.error(error));
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center text-center max-w-sm mt-16 mb-32 mx-auto">
      <form action={action} className="flex-1 flex flex-col gap-4">
        <InputText
          type="text"
          name="name"
          labelText="Nome"
          placeholder="Seu nome"
          disabled={isPending}
          defaultValue={state.user.name}
          required
        />

        <InputText
          type="email"
          name="email"
          labelText="E-mail"
          placeholder="Seu e-mail"
          disabled={isPending}
          defaultValue={state.user.email}
          required
        />

        <InputText
          type="password"
          name="password"
          labelText="Senha"
          placeholder="Sua senha"
          disabled={isPending}
          defaultValue={""}
          required
        />

        <InputText
          type="password"
          name="password2"
          labelText="Repetir senha"
          placeholder="Sua senha novamente"
          disabled={isPending}
          defaultValue={""}
          required
        />

        <HoneypotInput />

        <Button disabled={isPending} type="submit" className="mt-4">
          <UserRoundIcon /> {isPending && "Criando..."}{" "}
          {!isPending && "Criar conta"}
        </Button>

        <div>
          <p>
            Já possui uma conta?{" "}
            <Link className="text-blue-500" href="/login">
              Clique aqui
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
