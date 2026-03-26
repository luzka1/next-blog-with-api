import clsx from "clsx";
import { useId } from "react";

type InputTextProps = { labelText?: string } & React.ComponentProps<"input">;

export function InputText({ labelText = "", ...rest }: InputTextProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      {labelText && (
        <label className="text-sm" htmlFor={id}>
          {labelText}
        </label>
      )}
      <input
        {...rest}
        className={clsx(
          "bg-white outline-0 ring-2 ring-slate-400 rounded p-2 transition focus:ring-blue-400 disabled:bg-slate-300 disabled:placeholder-slate-400 disabled:text-slate-400 read-only:bg-slate-100",
          rest.className
        )}
        id={id}
      />
    </div>
  );
}
