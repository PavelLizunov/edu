import { Children, isValidElement } from "react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { AnalogyBox } from "@/components/wiki/analogy-box";
import { ConceptCard, ConceptGrid } from "@/components/wiki/concept-card";
import { CodeBlock } from "@/components/wiki/code-block";
import { QuizCard } from "@/components/wiki/quiz-card";

interface CodeChildProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Map a Markdown fenced code block (`'```lang\n...\n```'`) onto our styled
 * CodeBlock. Markdown is safer than `<CodeBlock>{`...`}</CodeBlock>` because
 * MDX does NOT parse JSX expressions inside fenced code — so `{{ jinja }}`,
 * `${env}`, JSON objects etc. just work.
 */
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
 * Registry of components available inside MDX topic files.
 * Topic authors use these as JSX inside the .mdx body.
 */
export const mdxComponents: MDXComponents = {
  AnalogyBox,
  ConceptCard,
  ConceptGrid,
  CodeBlock,
  QuizCard,
  // Markdown-fenced code blocks render via our styled CodeBlock too.
  pre: PreOverride,
};
