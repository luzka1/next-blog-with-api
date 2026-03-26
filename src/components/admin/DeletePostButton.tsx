"use client";

import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { Dialog } from "../Dialog";
import { deletePostAction } from "@/actions/post/delete-post-action";
import { showMessage } from "@/adapters/showMessage";

type DeletePostButtonProps = {
  title: string;
  id: string;
};

export function DeletePostButton({ title, id }: DeletePostButtonProps) {
  const [isLoading, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);

  function handleClick() {
    setShowDialog(true);
  }

  function handleConfirm() {
    showMessage.dismiss();

    startTransition(async () => {
      const result = await deletePostAction(id);
      setShowDialog(false);

      if (result.error) {
        showMessage.error(`Erro: ${result.error}`);
        return;
      }

      showMessage.success("Post excluído com sucesso!");
    });
  }

  return (
    <>
      {showDialog && (
        <Dialog
          isVisible={showDialog}
          title="Apagar post?"
          content={`Tem certeza que deseja excluir o post ${title}`}
          onCancel={() => setShowDialog(false)}
          onConfirm={handleConfirm}
          disabled={isLoading}
        />
      )}
      <button
        className={clsx(
          "text-red-500",
          "[&_svg]:w-4",
          "[&_svg]:h-4",
          "transition",
          "hover:scale-120",
          "cursor-pointer",
          "disabled:text-neutral-400",
          "disabled:hover:scale-100",
          "disabled:cursor-progress"
        )}
        aria-label={`Excluir post: ${title}`}
        title={`Excluir post: ${title}`}
        onClick={handleClick}
        disabled={isLoading}
      >
        <Trash2Icon />
      </button>
    </>
  );
}
