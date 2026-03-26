"use server";

import { createLoginSession, verifyPassword } from "@/lib/login/manage-login";
import { asyncDelay } from "@/utils/async-delay";
import { redirect } from "next/navigation";

type LoginActionState = {
  username: string;
  error: string;
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  const makeResult = ({ username = "", error = "" }) => ({ username, error });

  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return makeResult({
      error: "Login não autorizado!",
    });
  }

  const simulateWaitMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0;

  await asyncDelay(simulateWaitMs);

  if (!(formData instanceof FormData))
    return makeResult({ error: "Dados inválidos" });

  const username = formData.get("username")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";

  if (!username || !password) {
    return makeResult({ username, error: "Digite o usuário e a senha" });
  }

  const isUsernameValid = username == process.env.LOGIN_USER;
  const isPasswordValid = await verifyPassword(
    password,
    process.env.LOGIN_PASS || "",
  );

  if (!isUsernameValid || !isPasswordValid) {
    return makeResult({ username, error: "Usuário ou senha inválidos" });
  }

  await createLoginSession(username);
  redirect("/admin/post");
}
