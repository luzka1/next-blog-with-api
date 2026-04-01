"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import { authenticatedApiRequest } from "@/utils/authenticaded-api-request";

type UploadImageAction = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadImageAction> {
  const isAuthenticated = await getLoginSessionForApi();

  const makeResult = ({ url = "", error = "" }) => ({ url, error });

  if (!(formData instanceof FormData)) {
    return makeResult({ error: "Imagem inválida" });
  }

  if (!isAuthenticated)
    return makeResult({
      error: "Usuário não autenticado, faça login novamente!",
    });

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return makeResult({ error: "Arquivo inválido" });
  }

  if (!file.type.startsWith("image/")) {
    return makeResult({ error: "Imagem inválida" });
  }

  const uploadResponse = await authenticatedApiRequest<{ url: string }>(
    `/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!uploadResponse.success) {
    return makeResult({
      error: uploadResponse.errors[0],
    });
  }

  console.log(uploadResponse.data);

  const url = `${process.env.IMAGE_SERVER_URL}${uploadResponse.data.url}`;

  return makeResult({ url });
}
