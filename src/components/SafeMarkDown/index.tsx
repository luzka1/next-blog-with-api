import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type SafeMarkDownProps = {
  markdown: string;
};

export function SafeMarkDown({ markdown }: SafeMarkDownProps) {
  return (
    <div
      className={clsx(
        "prose prose-slate w-full max-w-none prose-a:text-blue-500 prose-a:hover:text-blue-500 prose-a:no-underline prose-a:hover:underline prose-img:mx-auto md:prose-lg"
      )}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => {
            if (!node?.children) return "";

            return (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]" {...props}></table>
              </div>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
