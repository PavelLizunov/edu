/**
 * Types for content layer: topics (MDX), categories, navigation.
 */

export type CategorySlug = "devops" | "databases" | "backend";

export interface CategoryConfig {
  slug: CategorySlug;
  title: string;
  description: string;
  /** Lucide icon name */
  icon: string;
  order: number;
  /** False if the category is announced but has no topics yet */
  available: boolean;
}

/** Frontmatter shape, validated when loading MDX */
export interface TopicFrontmatter {
  title: string;
  slug: string;
  category: CategorySlug;
  /** Lucide icon name for the topic */
  icon: string;
  /** Order within the category */
  order: number;
  tags: string[];
  /** One-line description for SEO + listing */
  description: string;
}

export interface TopicMeta extends TopicFrontmatter {
  /** "/devops/kubernetes" */
  href: string;
  /** Raw count of concepts in the body, populated after parse */
  conceptCount?: number;
}

export interface Topic extends TopicMeta {
  /** Raw MDX body without frontmatter */
  body: string;
}

export interface TopicNavLink {
  href: string;
  title: string;
}

export interface TopicSiblings {
  prev: TopicNavLink | null;
  next: TopicNavLink | null;
}
