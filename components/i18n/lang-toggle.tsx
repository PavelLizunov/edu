"use client";

import { useCallback, useEffect, useState } from "react";

type Lang = "ru" | "en";

export function LangToggle() {
  const [lang, setLang] = useState<Lang>("ru");

  // Sync from DOM on mount (LangProvider may have changed it).
  useEffect(() => {
    const v = document.documentElement.getAttribute("data-lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (v === "ru" || v === "en") setLang(v);
  }, []);

  const set = useCallback((value: Lang) => {
    setLang(value);
    document.documentElement.setAttribute("data-lang", value);
    document.documentElement.setAttribute("lang", value);
    try {
      localStorage.setItem("edu_lang", value);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="lang-seg" role="group" aria-label="Language">
      <button
        type="button"
        aria-pressed={lang === "ru"}
        onClick={() => set("ru")}
      >
        RU
      </button>
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => set("en")}
      >
        EN
      </button>
    </div>
  );
}
