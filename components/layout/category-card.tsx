import Link from "next/link";
import type { CategoryConfig } from "@/types/content";
import { T } from "@/components/i18n/t";

interface CategoryCardProps {
  category: CategoryConfig;
  count: number;
  /** 1-based position controls the colour scheme (cat-1 / cat-2 / cat-3). */
  position: number;
}

/**
 * Sticker-style category card. cat-1 = big featured (blue), cat-2/3 = compact (paper / cream).
 */
export function CategoryCard({ category, count, position }: CategoryCardProps) {
  const colorClass = `cat-${Math.min(position, 3)}`;
  const isAvailable = category.available;

  const ribbon = isAvailable ? (
    <span className="ribbon">
      <T ru="★ готово" en="★ ready" />
    </span>
  ) : (
    <span className="ribbon">
      <T ru="скоро" en="soon" />
    </span>
  );

  const label = isAvailable ? (
    <span className="cat-label">
      <T
        ru={`${count} тем · ~${count * 5} концепций`}
        en={`${count} topics · ~${count * 5} concepts`}
      />
    </span>
  ) : (
    <span className="cat-label">Q3 ’26</span>
  );

  const inner = (
    <>
      {ribbon}
      {label}
      <h3 className="cat-title">{category.title}</h3>
      <p className="cat-desc">
        <T ru={category.description} en={category.description} />
      </p>
      {isAvailable && (
        <p className="cat-count">
          →&nbsp;<T ru="читать" en="read" />
        </p>
      )}
    </>
  );

  if (!isAvailable) {
    return (
      <div className={`cat ${colorClass}`} data-soon aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link href="#topics" className={`cat ${colorClass}`}>
      {inner}
    </Link>
  );
}
