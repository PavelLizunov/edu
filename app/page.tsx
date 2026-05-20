import { getAllTopics } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { CategoryCard } from "@/components/layout/category-card";
import { TopicList } from "@/components/layout/topic-list";

export const dynamic = "force-static";

export default async function HomePage() {
  const topics = await getAllTopics();
  const devopsTopics = topics.filter((t) => t.category === "devops");

  return (
    <>
      <section className="hero">
        <h1>
          Шпаргалка инженера
          <br />
          для подготовки к Middle+
        </h1>
        <p className="lede">
          Восемь DevOps-тем.{" "}
          <b>Аналогии → концепции → рабочие команды → проверка себя.</b>{" "}
          Без воды, без маркетинга, без stock-фото.
        </p>
        <div className="stats">
          <span>
            <b>{devopsTopics.length}</b> тем
          </span>
          <span>
            <b>
              ~
              {devopsTopics.reduce(
                (sum, t) => sum + (t.conceptCount ?? 0),
                0
              )}
            </b>{" "}
            концепций
          </span>
          <span>
            <b>{devopsTopics.length}</b> квизов
          </span>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 className="eyebrow">категории</h2>
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              count={
                cat.available
                  ? topics.filter((t) => t.category === cat.slug).length
                  : 0
              }
            />
          ))}
        </div>
      </section>

      {devopsTopics.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 className="eyebrow">
            devops · {devopsTopics.length} тем
          </h2>
          <TopicList topics={devopsTopics} />
        </section>
      )}
    </>
  );
}
