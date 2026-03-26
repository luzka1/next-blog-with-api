"use client";
import { loginAction } from "@/actions/login/login-action";
import { showMessage } from "@/adapters/showMessage";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { LoaderCircleIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";

export function LoginForm() {
  const initialState = {
    email: "",
    errors: [],
  };
  const [state, action, isPending] = useActionState(loginAction, initialState);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userChanged = searchParams.get("userChanged");
  const created = searchParams.get("created");

  useEffect(() => {
    if (userChanged === "1") {
      showMessage.dismiss();
      showMessage.success("Usuário alterado com sucesso!");
      const url = new URL(window.location.href);
      url.searchParams.delete("userChanged");
      router.replace(url.toString());
    }

    if (created === "1") {
      showMessage.dismiss();
      showMessage.success("Usuário criado com sucesso!");
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      router.replace(url.toString());
    }
  }, [userChanged, created, router]);

  useEffect(() => {
    if (state.errors.length > 0) {
      showMessage.dismiss();
      state.errors.forEach((e) => showMessage.error(e));
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center text-center max-w-sm mt-16 mb-32 mx-auto">
      <form action={action} className="flex-1 flex flex-col gap-6">
        <InputText
          type="email"
          name="email"
          placeholder="Seu e-mail"
          labelText="E-mail"
          disabled={isPending}
          defaultValue={state.email}
          required
        />
        <InputText
          type="password"
          name="password"
          placeholder="Sua senha"
          labelText="Senha"
          disabled={isPending}
          required
        />
        <Button disabled={isPending} type="submit" className="mt-4">
          {!isPending && (
            <>
              <LogInIcon />
              Entrar
            </>
          )}

          {isPending && (
            <div className="flex gap-2 items-center justify-center">
              <LoaderCircleIcon className="animate-spin" />
              Carregando...
            </div>
          )}
        </Button>

        <p className="text-blue-500">
          <Link href="/user/new">Criar a minha conta</Link>
        </p>
      </form>
    </div>
  );
}
