"use client";

import { uploadImageAction } from "@/actions/post/upload-image-action";
import { showMessage } from "@/adapters/showMessage";
import { Button } from "@/components/Button";
import { ImageUpIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";

type ImageUploaderProps = {
  disabled?: boolean;
};

export function ImageUploader({ disabled }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();
  const [imgUrl, setImgUrl] = useState("");

  function handleChooseFile() {
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  }

  function handleChange() {
    showMessage.dismiss();

    if (!fileInputRef.current) {
      setImgUrl("");
      return;
    }

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      fileInput.value = "";
      setImgUrl("");
      return;
    }

    const uploadMaxSize =
      Number(process.env.NEXT_PUBLIC_IMAGE_UPLOADER_MAX_SIZE) || 921600;

    if (file.size > uploadMaxSize) {
      const readableMaxSize = (uploadMaxSize / 1024).toFixed(2);

      showMessage.error(
        `Imagem muito grande. Tamanho máximo: ${readableMaxSize}KB`
      );
      setImgUrl("");
      fileInput.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadImageAction(formData);

      if (result.error) {
        showMessage.error(result.error);
        setImgUrl("");
        fileInput.value = "";
        return;
      }

      setImgUrl(result.url);
      showMessage.success("Imagem enviada!");
    });

    fileInput.value = "";
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <Button
        disabled={isUploading || disabled}
        onClick={handleChooseFile}
        type="button"
        className="self-start"
      >
        <ImageUpIcon /> Enviar uma imagem
      </Button>

      {!!imgUrl && (
        <div className="flex flex-col gap-y-4">
          <p>
            <b>URL: </b>
            {imgUrl}
          </p>
          <img className="rounded-lg" src={imgUrl} />
        </div>
      )}

      <input
        className="hidden"
        ref={fileInputRef}
        onChange={handleChange}
        name="file"
        type="file"
        accept="image/*"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
