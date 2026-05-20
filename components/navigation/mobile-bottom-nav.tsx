"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BookOpen, Layers, Moon, Sun, X } from "lucide-react";
import { MobileTopicsDrawer } from "@/components/navigation/mobile-topics-drawer";
import type { TopicMeta } from "@/types/content";
import type { CategoryConfig } from "@/types/content";

interface MobileBottomNavProps {
  /** Topics + categories, optional — when omitted the drawer is empty. Server passes via root layout. */
  topics?: TopicMeta[];
  categories?: readonly CategoryConfig[];
}

export function MobileBottomNav({
  topics = [],
  categories = [],
}: MobileBottomNavProps = {}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close the drawer when the route changes. The new react-hooks rule flags this,
  // but it's the right pattern for synchronizing UI state to URL transitions.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const isHome = pathname === "/";

  function toggleTheme(e: React.MouseEvent) {
    e.preventDefault();
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <>
      <nav className="mobile-nav" aria-label="Мобильная навигация">
        <Link href="/" aria-current={isHome ? "page" : undefined}>
          <BookOpen strokeWidth={1.75} />
          Главная
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Открыть список тем"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "6px 4px",
            fontSize: 10,
            color: "var(--muted-foreground)",
            background: "transparent",
            border: 0,
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          <Layers strokeWidth={1.75} />
          Темы
        </button>
        <a href="#" onClick={toggleTheme} aria-label="Переключить тему">
          {mounted ? (
            isDark ? <Sun strokeWidth={1.75} /> : <Moon strokeWidth={1.75} />
          ) : (
            <Sun strokeWidth={1.75} />
          )}
          Тема
        </a>
      </nav>

      {open && (
        <>
          <div
            className="drawer-bg"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="drawer" aria-label="Темы">
            <button
              type="button"
              className="drawer-close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              <X strokeWidth={1.75} size={16} />
            </button>
            <MobileTopicsDrawer topics={topics} categories={categories} />
          </aside>
        </>
      )}
    </>
  );
}
