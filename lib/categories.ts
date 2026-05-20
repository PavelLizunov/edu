import type { CategoryConfig, CategorySlug } from "@/types/content";

/**
 * Catalogue of categories. Order here drives sidebar + home rendering.
 *
 * Adding a new category:
 *   1. Add a CategorySlug literal in types/content.ts
 *   2. Append an entry below
 *   3. Drop MDX files into content/<slug>/
 */
export const CATEGORIES: readonly CategoryConfig[] = [
  {
    slug: "devops",
    title: "DevOps",
    description: "Ansible, Docker, Kubernetes, сети, TLS, базы, ELK",
    icon: "Boxes",
    order: 1,
    available: true,
  },
  {
    slug: "databases",
    title: "Databases",
    description: "Глубже в PostgreSQL, MongoDB, Redis, ClickHouse",
    icon: "Database",
    order: 2,
    available: false,
  },
  {
    slug: "backend",
    title: "Backend",
    description: "Паттерны, очереди, кеши, надёжность",
    icon: "Server",
    order: 3,
    available: false,
  },
] as const;

const CATEGORY_BY_SLUG = new Map<CategorySlug, CategoryConfig>(
  CATEGORIES.map((c) => [c.slug, c])
);

export function getCategory(slug: string): CategoryConfig | null {
  return CATEGORY_BY_SLUG.get(slug as CategorySlug) ?? null;
}

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_BY_SLUG.has(value as CategorySlug);
}
