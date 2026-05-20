"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TopicMeta, CategoryConfig } from "@/types/content";

interface MobileTopicsDrawerProps {
  topics: TopicMeta[];
  categories: readonly CategoryConfig[];
}

export function MobileTopicsDrawer({
  topics,
  categories,
}: MobileTopicsDrawerProps) {
  const pathname = usePathname();

  return (
    <div style={{ marginTop: 16 }}>
      <h4 className="sidebar-eyebrow" style={{ marginTop: 0 }}>
        edu
      </h4>
      <ul className="sidebar-list">
        <li>
          <Link
            href="/"
            className="sidebar-link"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Главная
          </Link>
        </li>
      </ul>

      {categories.map((cat) => {
        const list = topics.filter((t) => t.category === cat.slug);
        return (
          <div key={cat.slug}>
            <h4 className="sidebar-eyebrow">{cat.slug}</h4>
            <ul className="sidebar-list">
              {cat.available && list.length > 0 ? (
                list.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={topic.href}
                      className="sidebar-link"
                      aria-current={
                        pathname === topic.href ? "page" : undefined
                      }
                    >
                      {topic.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <span
                    className="sidebar-link"
                    data-disabled="true"
                    aria-disabled="true"
                  >
                    скоро
                  </span>
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
