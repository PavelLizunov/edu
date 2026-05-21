import { Children, isValidElement } from "react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { AnalogyBox } from "@/components/wiki/analogy-box";
import { ConceptCard, ConceptGrid } from "@/components/wiki/concept-card";
import { CodeBlock } from "@/components/wiki/code-block";
import { Diagram } from "@/components/wiki/diagram";
import { MermaidDiagram } from "@/components/wiki/mermaid-diagram";
import { QuizCard } from "@/components/wiki/quiz-card";

interface CodeChildProps {
  className?: string;
  children?: ReactNode;
}

function PreOverride(props: ComponentProps<"pre">) {
  const child = Children.only(props.children) as ReactElement<CodeChildProps>;
  if (!isValidElement<CodeChildProps>(child) || child.type !== "code") {
    return <pre {...props} />;
  }
  const codeProps = child.props;
  const className = codeProps.className ?? "";
  const langMatch = /language-(\S+)/.exec(className);
  const lang = langMatch ? langMatch[1] : undefined;
  const code =
    typeof codeProps.children === "string"
      ? codeProps.children
      : Array.isArray(codeProps.children)
        ? codeProps.children.filter((x) => typeof x === "string").join("")
        : "";
  return <CodeBlock lang={lang}>{code}</CodeBlock>;
}

/**
 * Section eyebrow — markdown `## Аналогия` etc. renders as a sticker pill.
 * Colour cycling between lime/pink/blue/yellow lives in globals.css via :nth-of-type.
 */
function H2Eyebrow({ children, ...props }: ComponentProps<"h2">) {
  return (
    <h2 className="eb" {...props}>
      {children}
    </h2>
  );
}

export const mdxComponents: MDXComponents = {
  AnalogyBox,
  ConceptCard,
  ConceptGrid,
  CodeBlock,
  Diagram,
  MermaidDiagram,
  QuizCard,
  // Markdown-fenced code blocks render via our styled CodeBlock too.
  pre: PreOverride,
  // ## section headings become sticker eyebrows.
  h2: H2Eyebrow,
};
