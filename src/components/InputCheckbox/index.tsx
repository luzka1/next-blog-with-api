import clsx from "clsx";
import { useId } from "react";

type InputTextProps = {
  labelText?: string;
  type?: "checkbox";
} & React.ComponentProps<"input">;

export function InputCheckbox({
  labelText = "",
  type = "checkbox",
  ...rest
}: InputTextProps) {
  const id = useId();

  return (
    <div className="flex items-center flex-row gap-2">
      <input
        {...rest}
        className={clsx(
         "w-4 h-4", "outline-none focus:ring-2 focus:ring-blue-400",
          rest.className
        )}
        id={id}
        type={type}
      />

      {labelText && (
        <label className="text-sm" htmlFor={id}>
          {labelText}
        </label>
      )}
    </div>
  );
}
