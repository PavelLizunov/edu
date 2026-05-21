"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidDiagramProps {
  /** Mermaid source. Pass as `code` (template literal) to avoid MDX parsing { }. */
  code?: string;
  /** Fallback children when `code` not given. */
  children?: string;
  /** Optional caption above the diagram. */
  label?: string;
}

/**
 * Mermaid diagram rendered on the client.
 *
 * Perf: the library (~280KB gz) is dynamically imported only when the diagram's
 * wrapper enters the viewport via IntersectionObserver. Pages with diagrams
 * below the fold don't pay the cost until the user scrolls there.
 * The theme is tuned to the v4 sticker-bomb palette (yellow nodes, ink borders,
 * blue offset shadow on the wrapper).
 */
export function MermaidDiagram({ code, children, label }: MermaidDiagramProps) {
  const id = useId().replace(/[:_]/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const source = (code ?? children ?? "").trim();

  // Defer mermaid import until the diagram is near the viewport.
  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof IntersectionObserver === "undefined") {
      // SSR or very old browser — just load eagerly.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldLoad(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShouldLoad(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!source || !shouldLoad) return;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          fontFamily:
            "var(--font-mono-loaded), var(--font-sans-loaded), system-ui, sans-serif",
          themeVariables: {
            // ─ v4 sticker-bomb palette ─
            background: "#FFF8DC", // paper
            primaryColor: "#FFE600", // yellow node fill
            primaryTextColor: "#0A0907", // ink text
            primaryBorderColor: "#0A0907",
            secondaryColor: "#9DE7FF", // sky for secondary nodes
            secondaryTextColor: "#0A0907",
            secondaryBorderColor: "#0A0907",
            tertiaryColor: "#C8FF3D", // lime
            tertiaryTextColor: "#0A0907",
            tertiaryBorderColor: "#0A0907",
            // Edges
            lineColor: "#0A0907",
            textColor: "#0A0907",
            // Labels on edges
            edgeLabelBackground: "#FFFBEC",
            // Notes
            noteBkgColor: "#C8FF3D",
            noteTextColor: "#0A0907",
            noteBorderColor: "#0A0907",
            // Cluster
            clusterBkg: "rgba(45, 91, 255, 0.08)",
            clusterBorder: "#0A0907",
            // Sequence
            actorBkg: "#FFE600",
            actorBorder: "#0A0907",
            actorTextColor: "#0A0907",
            actorLineColor: "#0A0907",
            signalColor: "#0A0907",
            signalTextColor: "#0A0907",
            labelBoxBkgColor: "#C8FF3D",
            labelBoxBorderColor: "#0A0907",
            labelTextColor: "#0A0907",
            loopTextColor: "#0A0907",
            activationBorderColor: "#FF3E8E",
            activationBkgColor: "#FF3E8E",
            sequenceNumberColor: "#FFFBEC",
            // Misc
            mainBkg: "#FFE600",
          },
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            useMaxWidth: true,
            padding: 12,
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
          },
        });

        const { svg: rendered } = await mermaid.render(`mm-${id}`, source);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source, id, shouldLoad]);

  return (
    <div className="diagram-wrap">
      {label && (
        <div className="diagram-label">
          <span>{label}</span>
          <span className="diagram-tag">схема</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="diagram-mermaid"
        // Mermaid output is trusted (we generate the source); securityLevel:"loose"
        // still escapes user input, and our source is hard-coded in MDX files.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {error && (
        <div
          className="diagram-mermaid-error"
          role="status"
        >
          [mermaid error] {error}
        </div>
      )}
      {!svg && !error && (
        <div className="diagram-mermaid-skeleton" aria-hidden="true">
          ⌬ загружается диаграмма…
        </div>
      )}
    </div>
  );
}
