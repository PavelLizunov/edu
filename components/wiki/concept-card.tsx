import type { ReactNode } from "react";
import { Icon } from "@/components/icon";

interface ConceptCardProps {
  /** Lucide icon name. Falls back to "Boxes" if unknown. */
  icon?: string;
  title: string;
  children: ReactNode;
}

export function ConceptCard({ icon = "Boxes", title, children }: ConceptCardProps) {
  return (
    <article className="concept">
      <Icon name={icon} className="concept-icon" aria-hidden="true" />
      <h3 className="concept-title">{title}</h3>
      <div className="concept-desc">{children}</div>
    </article>
  );
}

interface ConceptGridProps {
  children: ReactNode;
}

export function ConceptGrid({ children }: ConceptGridProps) {
  return <div className="concept-grid">{children}</div>;
}
