import { getAllTopics } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { CategoryCard } from "@/components/layout/category-card";
import { TopicList } from "@/components/layout/topic-list";
import { T } from "@/components/i18n/t";

export const dynamic = "force-static";

export default async function HomePage() {
  const topics = await getAllTopics();
  const devopsTopics = topics.filter((t) => t.category === "devops");
  const totalConcepts = devopsTopics.reduce(
    (sum, t) => sum + (t.conceptCount ?? 0),
    0
  );

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          <span className="ico" aria-hidden="true"></span>
          <T
            ru={<>edu.ninitux · Middle+</>}
            en={<>edu.ninitux · Middle+</>}
          />
        </p>

        <h1>
          <span data-i18n="ru">
            Шпаргалка
            <br />
            <span className="pop">инженера</span>
            <br />
            для <span className="yel">Middle+</span>
          </span>
          <span data-i18n="en">
            DevOps
            <br />
            <span className="pop">cheatsheet</span>
            <br />
            for <span className="yel">Middle+</span>
          </span>
        </h1>

        <p className="lede">
          <span data-i18n="ru">
            Восемь DevOps-тем.{" "}
            <b>Аналогии → концепции → рабочие команды → проверка себя.</b> Без
            воды, без маркетинга, без stock-фото. Сделано для тех кто читает{" "}
            <code>man</code>, а не блоги.
          </span>
          <span data-i18n="en">
            Eight DevOps topics.{" "}
            <b>Analogies → concepts → working commands → self-check.</b> No
            water, no marketing, no stock photos. Made for people who read{" "}
            <code>man</code>, not blogs.
          </span>
        </p>

        <div className="stats-row">
          <span className="stat-pill">
            <b>{devopsTopics.length}</b>&nbsp;
            <T ru="тем" en="topics" />
          </span>
          <span className="stat-pill">
            <b>~{totalConcepts}</b>&nbsp;
            <T ru="концепций" en="concepts" />
          </span>
          <span className="stat-pill">
            <b>{devopsTopics.length}</b>&nbsp;
            <T ru="квизов" en="quizzes" />
          </span>
          <span className="stat-pill">
            <b>~{totalConcepts * 3}</b>&nbsp;
            <T ru="сниппетов" en="snippets" />
          </span>
        </div>
      </section>

      <section className="section" id="cats">
        <div className="section-h">
          <div className="num" style={{ color: "var(--pink)" }}>
            01
          </div>
          <h2>
            <span data-i18n="ru">
              <em>Категории</em>.
            </span>
            <span data-i18n="en">
              <em>Categories</em>.
            </span>
          </h2>
          <div className="meta">
            <T
              ru="// 1 готова · 2 в работе"
              en="// 1 done · 2 in progress"
            />
          </div>
        </div>

        <div className="cats">
          {CATEGORIES.map((cat, idx) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              count={
                cat.available
                  ? topics.filter((t) => t.category === cat.slug).length
                  : 0
              }
              position={idx + 1}
            />
          ))}
        </div>
      </section>

      {devopsTopics.length > 0 && (
        <section className="section" id="topics">
          <div className="section-h">
            <div className="num" style={{ color: "var(--blue)" }}>
              02
            </div>
            <h2>
              <em>DevOps</em>&nbsp;·&nbsp;
              <T
                ru={`${devopsTopics.length} тем`}
                en={`${devopsTopics.length} topics`}
              />
            </h2>
            <div className="meta">
              <T ru="// кликни любую" en="// click any" />
            </div>
          </div>

          <TopicList topics={devopsTopics} />
        </section>
      )}
    </>
  );
}
