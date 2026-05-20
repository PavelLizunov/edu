"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "ok">("idle");

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setState("ok");
      setTimeout(() => setState("idle"), 1200);
    } catch {
      /* no clipboard API — ignore silently */
    }
  }

  return (
    <button
      type="button"
      className={state === "ok" ? "copy ok" : "copy"}
      onClick={onClick}
      aria-label="Копировать"
    >
      {state === "ok" ? "copied" : "copy"}
    </button>
  );
}
