import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllTopicParams,
  getTopic,
  getTopicSiblings,
} from "@/lib/content";
import { mdxComponents } from "@/lib/mdx-components";
import { T } from "@/components/i18n/t";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllTopicParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const topic = await getTopic(category, slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    keywords: topic.tags,
    openGraph: {
      type: "article",
      title: `${topic.title} ★ edu.ninitux`,
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
        // remark-gfm enables GitHub-flavoured markdown: tables, strikethrough,
        // task lists, autolinks. Needed for our "Когда что выбирать" tables.
        remarkPlugins: [remarkGfm],
      },
    },
  });

  const siblings = await getTopicSiblings(topic.category, topic.slug);

  return (
    <>
      <p className="crumb-bar">
        <Link href="/">edu</Link>
        <span className="sep">/</span>
        <Link href={`/#${topic.category}`}>{topic.category}</Link>
        <span className="sep">/</span>
        <span className="cur">{topic.slug}</span>
      </p>

      <header className="topic-head">
        <h1>
          <span className="hash" aria-hidden="true">
            #
          </span>
          <em>{topic.title}</em>
        </h1>
        {topic.description && <p className="sub">{topic.description}</p>}
      </header>

      <article className="topic-body">{content}</article>

      {(siblings.prev || siblings.next) && (
        <nav className="prevnext" aria-label="Соседние темы">
          {siblings.prev ? (
            <Link href={siblings.prev.href} className="prev">
              <span className="label">
                ←&nbsp;<T ru="предыдущая" en="previous" />
              </span>
              <span className="title">
                <span className="hash">#</span>
                {siblings.prev.title}
              </span>
            </Link>
          ) : (
            <Link href="/" className="prev">
              <span className="label">
                ←&nbsp;<T ru="все темы" en="all topics" />
              </span>
              <span className="title">
                <T ru="домой" en="home" />
              </span>
            </Link>
          )}
          {siblings.next ? (
            <Link href={siblings.next.href} className="next">
              <span className="label">
                <T ru="следующая" en="next" />&nbsp;→
              </span>
              <span className="title">
                <span className="hash">#</span>
                {siblings.next.title}
              </span>
            </Link>
          ) : (
            <Link href="/" className="next last">
              <span className="label">
                <T ru="все темы" en="all topics" />&nbsp;→
              </span>
              <span className="title">
                <T ru="домой" en="home" />
              </span>
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
