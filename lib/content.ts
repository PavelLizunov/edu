import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  type CategorySlug,
  type Topic,
  type TopicFrontmatter,
  type TopicMeta,
  type TopicSiblings,
} from "@/types/content";
import { CATEGORIES, isCategorySlug } from "@/lib/categories";

const CONTENT_DIR = path.join(process.cwd(), "content");

function validateFrontmatter(
  data: Record<string, unknown>,
  file: string
): TopicFrontmatter {
  const required = [
    "title",
    "slug",
    "category",
    "icon",
    "order",
    "description",
  ] as const;
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) {
      throw new Error(
        `[content] ${file}: missing required frontmatter field "${key}"`
      );
    }
  }
  const category = String(data.category);
  if (!isCategorySlug(category)) {
    throw new Error(`[content] ${file}: invalid category "${category}"`);
  }
  return {
    title: String(data.title),
    slug: String(data.slug),
    category,
    icon: String(data.icon),
    order: Number(data.order),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    description: String(data.description),
  };
}

function toMeta(fm: TopicFrontmatter): TopicMeta {
  return {
    ...fm,
    href: `/${fm.category}/${fm.slug}`,
  };
}

function countConcepts(body: string): number {
  // Crude count of <ConceptCard> usages in MDX. Good enough for listings.
  return (body.match(/<ConceptCard\b/g) ?? []).length;
}

/**
 * List all topic MDX files across categories.
 * Returns meta only — fast, used for sidebar + home.
 */
export async function getAllTopics(): Promise<TopicMeta[]> {
  const out: TopicMeta[] = [];
  for (const cat of CATEGORIES) {
    if (!cat.available) continue;
    const dir = path.join(CONTENT_DIR, cat.slug);
    let entries: string[];
    try {
      entries = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.endsWith(".mdx")) continue;
      const file = path.join(dir, entry);
      const raw = await fs.readFile(file, "utf-8");
      const { data, content } = matter(raw);
      const fm = validateFrontmatter(data, file);
      out.push({ ...toMeta(fm), conceptCount: countConcepts(content) });
    }
  }
  return out.sort((a, b) => {
    if (a.category !== b.category) {
      const ai = CATEGORIES.findIndex((c) => c.slug === a.category);
      const bi = CATEGORIES.findIndex((c) => c.slug === b.category);
      return ai - bi;
    }
    return a.order - b.order;
  });
}

export async function getTopicsByCategory(
  category: CategorySlug
): Promise<TopicMeta[]> {
  const all = await getAllTopics();
  return all.filter((t) => t.category === category);
}

/**
 * Load a single topic with body (for the topic page).
 */
export async function getTopic(
  category: string,
  slug: string
): Promise<Topic | null> {
  if (!isCategorySlug(category)) return null;
  const file = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const fm = validateFrontmatter(data, file);
  return { ...toMeta(fm), body: content };
}

/**
 * Compute prev/next within the same category, ordered by `order`.
 */
export async function getTopicSiblings(
  category: CategorySlug,
  slug: string
): Promise<TopicSiblings> {
  const list = await getTopicsByCategory(category);
  const idx = list.findIndex((t) => t.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev:
      idx > 0
        ? { href: list[idx - 1].href, title: list[idx - 1].title }
        : null,
    next:
      idx < list.length - 1
        ? { href: list[idx + 1].href, title: list[idx + 1].title }
        : null,
  };
}

/**
 * All [category, slug] tuples for generateStaticParams.
 */
export async function getAllTopicParams(): Promise<
  Array<{ category: string; slug: string }>
> {
  const list = await getAllTopics();
  return list.map((t) => ({ category: t.category, slug: t.slug }));
}
