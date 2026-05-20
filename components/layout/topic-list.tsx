import Link from "next/link";
import type { TopicMeta } from "@/types/content";

interface TopicListProps {
  topics: TopicMeta[];
}

export function TopicList({ topics }: TopicListProps) {
  return (
    <ul className="topics">
      {topics.map((topic) => (
        <li key={topic.slug}>
          <Link href={topic.href}>
            <span className="ttl">
              <b>{topic.title}</b>
              {topic.description && ` — ${topic.description}`}
            </span>
            <span className="meta">
              {topic.conceptCount ?? 0} концепций · 1 квиз
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
