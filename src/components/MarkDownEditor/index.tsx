"use client";

import dynamic from "next/dynamic";
import { useId } from "react";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const MdEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkDownEditorProps = {
  labelText?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  textAreaName: string;
};

export function MarkDownEditor({
  labelText = "",
  value,
  setValue,
  disabled = false,
  textAreaName,
}: MarkDownEditorProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      {labelText && (
        <label className="text-sm" htmlFor={id}>
          {labelText}
        </label>
      )}

      <MdEditor
        className="whitespace-pre-wrap"
        value={value}
        onChange={(value) => {
          if (value === undefined) return;
          setValue(value);
        }}
        height={400}
        preview="edit"
        hideToolbar={disabled}
        data-color-mode="light"
        extraCommands={[]}
        textareaProps={{
          id,
          name: textAreaName,
          disabled: disabled,
        }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
          remarkPlugins: [[remarkGfm]],
        }}
      />
    </div>
  );
}
