import type { ReactNode } from "react";

interface DiagramProps {
  /** Optional caption shown above the diagram (e.g. "control plane → data plane"). */
  label?: string;
  /** Monospace diagram content — pass as a JS string via `code` to avoid MDX parsing
   * curly braces / dollars inside ASCII. */
  code?: string;
  /** Fallback children (only used if `code` not provided). */
  children?: ReactNode;
}

/**
 * Visual diagram block — monospace ASCII art on cream/paper background with a
 * blue offset shadow (distinct from CodeBlock which uses dark + pink shadow).
 *
 * Diagrams are conceptual maps, not runnable code, so they get a different
 * visual treatment: lighter background, no copy button, blue accent.
 */
export function Diagram({ label, code, children }: DiagramProps) {
  const content = code ?? (typeof children === "string" ? children : "");
  return (
    <div className="diagram-wrap">
      {label && (
        <div className="diagram-label">
          <span>{label}</span>
          <span className="diagram-tag">схема</span>
        </div>
      )}
      <pre className="diagram">{content}</pre>
    </div>
  );
}
