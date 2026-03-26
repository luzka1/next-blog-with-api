"use server";

import {
  createLoginSession,
  createLoginSessionFromApi,
  verifyPassword,
} from "@/lib/login/manage-login";
import { LoginSchema } from "@/lib/login/schemas";
import { apiRequest } from "@/utils/api-request";
import { asyncDelay } from "@/utils/async-delay";
import { getZodErrorMessages } from "@/utils/get-zod-error-messages";
import { redirect } from "next/navigation";

type LoginActionState = {
  email: string;
  errors: string[];
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  const makeResult = ({ email = "", errors = [""] }) => ({ email, errors });

  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return makeResult({
      errors: ["Login não autorizado!"],
    });
  }

  const simulateWaitMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0;

  await asyncDelay(simulateWaitMs);

  if (!(formData instanceof FormData))
    return makeResult({ errors: ["Login não autorizado!"] });

  const formObj = Object.fromEntries(formData.entries());
  const formEmail = formObj?.email?.toString() || "";
  const parsedFormData = LoginSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      email: formEmail,
      errors: getZodErrorMessages(parsedFormData.error.format()),
    };
  }

  const loginResponse = await apiRequest<{ accessToken: string }>(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedFormData.data),
    },
  );

  if (!loginResponse.success) {
    return makeResult({
      email: formEmail,
      errors: loginResponse.errors,
    });
  }

  await createLoginSessionFromApi(loginResponse.data.accessToken);
  redirect("/admin/post");
}
