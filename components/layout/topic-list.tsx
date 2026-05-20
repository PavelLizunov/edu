import Link from "next/link";
import type { TopicMeta } from "@/types/content";
import { T } from "@/components/i18n/t";

interface TopicListProps {
  topics: TopicMeta[];
}

/**
 * Cycling sticker labels for the first card on the list (the example/featured one).
 * Mirrors the design where Kubernetes (the only fully-written topic in the mock)
 * carries a "★ example" sticker and the rest use short fX.NN code labels.
 */
const STICKERS = [
  "★", // first card — accent
  "f.02",
  "IaC",
  "OSI",
  "★",
  "SQL",
  "NoSQL",
  "logs",
] as const;

export function TopicList({ topics }: TopicListProps) {
  return (
    <div className="topic-grid" id="topic-grid">
      {topics.map((topic, idx) => {
        const tn = ((idx) % 8) + 1; // t-1..t-8 colour rotation
        const sticker = STICKERS[idx] ?? `t.${idx + 1}`;
        return (
          <Link
            key={topic.slug}
            href={topic.href}
            className={`topic-card t-${tn}`}
          >
            <span className="sticker">
              {sticker === "★" ? (
                <>
                  ★&nbsp;<T ru="пример" en="example" />
                </>
              ) : (
                sticker
              )}
            </span>
            <h3 className="name">
              <span className="hash">#</span>
              {topic.title}
            </h3>
            <p className="desc">{topic.description}</p>
            <p className="meta">
              <b>{topic.conceptCount ?? 0}</b>&nbsp;
              <T ru="концепций" en="concepts" />
              &nbsp;·&nbsp;
              <b>1</b>&nbsp;
              <T ru="квиз" en="quiz" />
            </p>
          </Link>
        );
      })}
    </div>
  );
}
