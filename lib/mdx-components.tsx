import type { MDXComponents } from "mdx/types";
import { AnalogyBox } from "@/components/wiki/analogy-box";
import { ConceptCard, ConceptGrid } from "@/components/wiki/concept-card";
import { CodeBlock } from "@/components/wiki/code-block";
import { QuizCard } from "@/components/wiki/quiz-card";

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
};
