import Link from "next/link";
import { Icon } from "@/components/icon";
import type { CategoryConfig } from "@/types/content";

interface CategoryCardProps {
  category: CategoryConfig;
  count: number;
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  const isAvailable = category.available;
  const href = isAvailable ? `/#${category.slug}` : "#";
  const countLabel = isAvailable ? `${count} тем · готово` : "скоро";

  const inner = (
    <>
      <div className="head">
        <span className="ico" aria-hidden="true">
          <Icon name={category.icon} />
        </span>
        <span className="title">{category.title}</span>
      </div>
      <div className="count">{countLabel}</div>
    </>
  );

  if (!isAvailable) {
    return (
      <div className="cat" data-soon aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} className="cat">
      {inner}
    </Link>
  );
}
