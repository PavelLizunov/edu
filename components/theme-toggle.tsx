"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — the server doesn't know the user's preference.
  // The canonical next-themes pattern uses setState in a mount-only effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const next = isDark ? "light" : "dark";
  const label = isDark ? "Светлая тема" : "Тёмная тема";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
    >
      {mounted ? (
        isDark ? (
          <Sun aria-hidden="true" strokeWidth={1.75} />
        ) : (
          <Moon aria-hidden="true" strokeWidth={1.75} />
        )
      ) : (
        <span style={{ width: 16, height: 16, display: "inline-block" }} />
      )}
    </button>
  );
}
