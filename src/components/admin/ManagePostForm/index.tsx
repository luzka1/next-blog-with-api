"use client";

import { InputCheckbox } from "@/components/InputCheckbox";
import { InputText } from "@/components/InputText";
import { MarkDownEditor } from "@/components/MarkDownEditor";
import { useActionState, useEffect, useState } from "react";
import { ImageUploader } from "../ImageUploader";
import { makePartialPublicPost, PublicPostDTO } from "@/dto/post/dto";
import { createPostAction } from "@/actions/post/create-post-action";
import { Button } from "@/components/Button";
import { showMessage } from "@/adapters/showMessage";
import { updatePostAction } from "@/actions/post/update-post-action";
import { useRouter, useSearchParams } from "next/navigation";
import { ur } from "zod/locales";

type ManagePostFormUpdateProps = {
  mode: "update";
  publicPost: PublicPostDTO;
};

type ManagePostFormCreateProps = {
  mode: "create";
};

type ManagePostFormProps =
  | ManagePostFormCreateProps
  | ManagePostFormUpdateProps;

export function ManagePostForm(props: ManagePostFormProps) {
  const { mode } = props;
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const router = useRouter();

  let publicPost;

  if (mode === "update") {
    publicPost = props.publicPost;
  }

  const actionsMap = {
    create: createPostAction,
    update: updatePostAction,
  };

  const initialState = {
    formState: makePartialPublicPost(publicPost),
    errors: [],
  };

  const [state, action, isPending] = useActionState(
    actionsMap[mode],
    initialState
  );

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((error) => showMessage.error(error));
    }
  }, [state.errors]);

  useEffect(() => {
    if (state.success) {
      showMessage.dismiss();
      showMessage.success("Post atualizado com sucesso!");
    }
  }, [state.success]);

    useEffect(() => {
    if (created === "1") {
      showMessage.dismiss();
      showMessage.success("Post criado com sucesso!");
      const url = new URL(window.location.href)
      url.searchParams.delete("created");
      router.replace(url.toString());
    }
  }, [created, router]);

  const { formState } = state;
  const [contentValue, setContentValue] = useState(formState.content);

  return (
    <form action={action} className="mb-16">
      <div className="flex flex-col gap-4">
        <InputText
          labelText="ID"
          name="id"
          placeholder="ID gerado automaticamente"
          type="text"
          readOnly
          defaultValue={formState.id}
          disabled={isPending}
        />

        <InputText
          labelText="Slug"
          name="slug"
          placeholder="Slug gerada automaticamente"
          type="text"
          readOnly
          defaultValue={formState.slug}
          disabled={isPending}
        />

        <InputText
          labelText="Autor"
          name="author"
          placeholder="Digite o nome do autor"
          type="text"
          defaultValue={formState.author}
          disabled={isPending}
        />

        <InputText
          labelText="Título"
          name="title"
          placeholder="Digite o título"
          type="text"
          defaultValue={formState.title}
          disabled={isPending}
        />

        <InputText
          labelText="Excerto"
          name="excerpt"
          placeholder="Digite o resumo do post"
          type="text"
          defaultValue={formState.excerpt}
          disabled={isPending}
        />

        <MarkDownEditor
          labelText="Conteúdo"
          value={contentValue}
          setValue={setContentValue}
          textAreaName="content"
          disabled={isPending}
        />

        <ImageUploader disabled={isPending} />

        <InputText
          labelText="URL da imagem de capa"
          name="coverImageUrl"
          placeholder="Digite a url da imagem"
          type="text"
          defaultValue={formState.coverImageUrl}
          disabled={isPending}
        />

        <InputCheckbox
          labelText="Publicar?"
          name="published"
          type="checkbox"
          defaultChecked={formState.published || false}
          disabled={isPending}
        />

        <Button type="submit" className="self-start">
          Enviar
        </Button>
      </div>
    </form>
  );
}
