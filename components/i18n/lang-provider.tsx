"use client";

import { useEffect } from "react";

/**
 * Reads saved language from localStorage on mount and applies it to <html data-lang>.
 * The CSS in globals.css hides the inactive language via [data-lang="..."] selectors,
 * so all translatable strings live as sibling spans with data-i18n="ru" / data-i18n="en".
 *
 * SSR defaults to "ru" (set in app/layout.tsx). On client mount, if the user has a
 * stored preference or their navigator language is English, we switch — but only
 * after first paint so SSR HTML matches.
 */
export function LangProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let target: "ru" | "en" = "ru";
    try {
      const stored = localStorage.getItem("edu_lang");
      if (stored === "ru" || stored === "en") {
        target = stored;
      } else if (
        typeof navigator !== "undefined" &&
        !navigator.language?.toLowerCase().startsWith("ru")
      ) {
        target = "en";
      }
    } catch {
      /* ignore — fall back to ru */
    }
    if (document.documentElement.getAttribute("data-lang") !== target) {
      document.documentElement.setAttribute("data-lang", target);
      document.documentElement.setAttribute("lang", target);
    }
  }, []);

  return <>{children}</>;
}
