import { formatDateTime } from "@/utils/format-datetime";

export type PostDateProps ={
    dateTime: string;
}

export function PostDate({dateTime}: PostDateProps) {
  return (
    <time
      className="text-slate-600 text-sm/tight"
      dateTime={dateTime}
      title={formatDateTime(dateTime)}
    >
      {formatDateTime(dateTime)}
    </time>
  );
}
