import type { ReactNode } from "react";
import { Icon } from "@/components/icon";

interface ConceptCardProps {
  /** Lucide icon name (kept for backwards compat with existing MDX) */
  icon?: string;
  title: string;
  /** Optional short badge label shown in the top-right corner; defaults to the title */
  badge?: string;
  children: ReactNode;
}

export function ConceptCard({
  icon = "Boxes",
  title,
  badge,
  children,
}: ConceptCardProps) {
  return (
    <article className="concept">
      <span className="badge">{badge ?? title}</span>
      <span className="ico" aria-hidden="true">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

interface ConceptGridProps {
  children: ReactNode;
}

export function ConceptGrid({ children }: ConceptGridProps) {
  return <div className="concept-grid">{children}</div>;
}
