import type { ReactNode } from "react";

interface AnalogyBoxProps {
  children: ReactNode;
  /** Single emoji shown in the green bulb circle. Default 💡. */
  bulb?: string;
}

/**
 * Highlighted analogy block. Yellow card on pink offset shadow,
 * lime "bulb" circle on the left, dark "представь" label sticker on top.
 */
export function AnalogyBox({ children, bulb = "💡" }: AnalogyBoxProps) {
  return (
    <aside className="analogy" aria-label="Аналогия">
      <span className="label" data-i18n="ru">💡 представь</span>
      <span className="label" data-i18n="en">💡 imagine</span>
      <div className="bulb" aria-hidden="true">
        {bulb}
      </div>
      <div className="body">{children}</div>
    </aside>
  );
}
