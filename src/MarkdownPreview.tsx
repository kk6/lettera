import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownPreviewProps = {
  body: string;
};

export function MarkdownPreview({ body }: MarkdownPreviewProps) {
  return (
    <Markdown
      skipHtml
      remarkPlugins={[remarkGfm]}
      components={{
        a({ children }) {
          return <span>{children}</span>;
        },
        img({ alt }) {
          return <span>{alt ?? ""}</span>;
        },
      }}
    >
      {body}
    </Markdown>
  );
}
