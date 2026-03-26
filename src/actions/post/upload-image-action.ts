"use server";

import { verifyLoginSession } from "@/lib/login/manage-login";
import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";

type UploadImageAction = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData
): Promise<UploadImageAction> {

  const isAuthenticated = await verifyLoginSession();

  const makeResult = ({ url = "", error = "" }) => ({ url, error });

  if (!(formData instanceof FormData)) {
    return makeResult({ error: "Imagem inválida" });
  }

  if (!isAuthenticated) return makeResult({error: "Usuário não autenticado, faça login novamente!"})

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return makeResult({ error: "Arquivo inválido" });
  }

  if (!file.type.startsWith("image/")) {
    return makeResult({ error: "Imagem inválida" });
  }

  const imageExtension = extname(file.name);
  const uniqueImageName = `${Date.now()}${imageExtension}`;

  const uploadDir = process.env.IMAGE_UPLOADER_DIR || "uploads";
  const uploadFullPath = resolve(process.cwd(), "public", uploadDir);
  await mkdir(uploadFullPath, { recursive: true });

  const fileArrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileArrayBuffer);

  const fileFullPath = resolve(uploadFullPath, uniqueImageName);

  await writeFile(fileFullPath, buffer);

  const imgServerUrl = process.env.IMAGE_SERVER_URL || "http://localhost:3000/uploads";

  const url = `${imgServerUrl}/${uniqueImageName}`;

  return makeResult({ url });
}
