import type { ReactNode } from "react";

interface AnalogyBoxProps {
  children: ReactNode;
}

/**
 * Highlighted analogy block at the top of every topic.
 * The 💡 emoji is one of the two emoji exceptions allowed by the design system
 * (the other is 🐧 in the brand mark).
 */
export function AnalogyBox({ children }: AnalogyBoxProps) {
  return (
    <aside className="analogy" aria-label="Аналогия">
      <div className="analogy-mark" aria-hidden="true">
        💡
      </div>
      <div className="analogy-body">{children}</div>
    </aside>
  );
}
