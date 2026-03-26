"use client";
import { loginAction } from "@/actions/login/login-action";
import { showMessage } from "@/adapters/showMessage";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { CircleXIcon, LoaderCircleIcon, LogInIcon } from "lucide-react";
import { useActionState, useEffect } from "react";

export function LoginForm() {
  const initialState = {
    username: "",
    error: "",
  };
  const [state, action, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.error) {
      showMessage.dismiss();
      showMessage.error(state.error);
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center text-center max-w-sm mt-16 mb-32 mx-auto">
      <form action={action} className="flex-1 flex flex-col gap-6">
        <InputText
          type="text"
          name="username"
          placeholder="Seu usuário"
          labelText="Usuário"
          disabled={isPending}
          defaultValue={state.username}
        />
        <InputText
          type="password"
          name="password"
          placeholder="Sua senha"
          labelText="Senha"
          disabled={isPending}
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

        {state.error && (
          <div className="bg-red-500 min-w-xs mx-auto text-white font-bold rounded-lg py-2 shadow-md flex flex-row items-center justify-center gap-2">
            <CircleXIcon /> <span>{state.error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
