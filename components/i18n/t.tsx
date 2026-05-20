import type { ReactNode } from "react";

/**
 * Bilingual string. Both sides render to DOM; CSS hides the inactive one via
 *   :root[data-lang="ru"] [data-i18n="en"] { display: none }  (and vice versa)
 * in globals.css.
 */
export function T({ ru, en }: { ru: ReactNode; en: ReactNode }) {
  return (
    <>
      <span data-i18n="ru">{ru}</span>
      <span data-i18n="en">{en}</span>
    </>
  );
}
