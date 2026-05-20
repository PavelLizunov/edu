"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { CategoryConfig, TopicMeta } from "@/types/content";
import { T } from "@/components/i18n/t";

interface MobileDrawerProps {
  topics: TopicMeta[];
  categories: readonly CategoryConfig[];
  onClose: () => void;
}

export function MobileDrawer({
  topics,
  categories,
  onClose,
}: MobileDrawerProps) {
  const pathname = usePathname();

  // Close on Esc + lock body scroll while open.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="mobile-drawer-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside className="mobile-drawer-panel" aria-label="Меню">
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <h5># nav</h5>
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          onClick={onClose}
        >
          <T ru="главная" en="home" />
        </Link>

        {categories.map((cat) => {
          const list = topics.filter((t) => t.category === cat.slug);
          return (
            <div
              key={cat.slug}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <h5># {cat.slug}</h5>
              {cat.available && list.length > 0
                ? list.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={topic.href}
                      onClick={onClose}
                      aria-current={
                        pathname === topic.href ? "page" : undefined
                      }
                    >
                      {topic.title}
                    </Link>
                  ))
                : (
                  <span
                    style={{
                      padding: "9px 14px",
                      color: "var(--ink-mute)",
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                    }}
                  >
                    <T ru="скоро" en="soon" />
                  </span>
                )}
            </div>
          );
        })}

        <h5># <T ru="внешнее" en="elsewhere" /></h5>
        <a href="https://ninitux.com">★ ninitux.com</a>
        <a
          href="https://github.com/PavelLizunov"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </aside>
    </div>
  );
}
