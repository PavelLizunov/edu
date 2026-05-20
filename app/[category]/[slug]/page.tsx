import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getAllTopicParams,
  getTopic,
  getTopicSiblings,
} from "@/lib/content";
import { mdxComponents } from "@/lib/mdx-components";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllTopicParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const topic = await getTopic(category, slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    keywords: topic.tags,
    openGraph: {
      type: "article",
      title: `${topic.title} — edu.ninitux`,
      description: topic.description,
      url: `https://edu.ninitux.com${topic.href}`,
      locale: "ru_RU",
    },
    alternates: {
      canonical: topic.href,
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { category, slug } = await params;
  const topic = await getTopic(category, slug);
  if (!topic) notFound();

  const { content } = await compileMDX({
    source: topic.body,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
  });

  const siblings = await getTopicSiblings(topic.category, topic.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "edu" },
          { href: `/#${topic.category}`, label: topic.category },
          { label: topic.slug },
        ]}
      />

      <h1 className="topic-h1">
        <span className="hash" aria-hidden="true">
          #
        </span>
        {topic.title}
      </h1>
      {topic.description && <p className="topic-sub">{topic.description}</p>}

      <article>{content}</article>

      {(siblings.prev || siblings.next) && (
        <nav className="next-prev" aria-label="Соседние темы">
          {siblings.prev ? (
            <Link href={siblings.prev.href} className="prev">
              <span className="label">← предыдущая</span>
              <span className="ttl">{siblings.prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {siblings.next ? (
            <Link href={siblings.next.href} className="next">
              <span className="label">следующая →</span>
              <span className="ttl">{siblings.next.title}</span>
            </Link>
          ) : null}
        </nav>
      )}
    </>
  );
}
