import { highlight } from "@/lib/shiki";
import { CopyButton } from "@/components/wiki/copy-button";
import type { ReactNode } from "react";

interface CodeBlockProps {
  /** Code as raw string. When used in MDX as <CodeBlock>...</CodeBlock>, children is the raw text. */
  children: ReactNode;
  /** Language for syntax highlighting (yaml, bash, ts, ...). */
  lang?: string;
  /** Alias of `lang`. Accepted for ergonomics; if both are set, `lang` wins. */
  language?: string;
  /** Optional label above the block: e.g. "deployment.yaml". */
  label?: string;
}

function childrenToString(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToString).join("");
  if (children && typeof children === "object" && "props" in children) {
    const props = (children as { props: { children?: ReactNode } }).props;
    return childrenToString(props.children);
  }
  return "";
}

export async function CodeBlock({
  children,
  lang,
  language,
  label,
}: CodeBlockProps) {
  const code = childrenToString(children).replace(/\n+$/, "");
  const effectiveLang = lang ?? language;
  const html = await highlight(code, effectiveLang);
  return (
    <div className="code-wrap">
      {label && (
        <div className="code-label">
          <span>{label}</span>
          {effectiveLang && <span className="lang">{effectiveLang}</span>}
        </div>
      )}
      <div className="code">
        <div
          className="code-pre-wrap"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <CopyButton text={code} />
      </div>
    </div>
  );
}
