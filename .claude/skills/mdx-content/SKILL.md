---
name: mdx-content
description: Strict template and rules for writing wiki topic MDX files. Use when creating or editing content in content/*/*.mdx.
---

## Шаблон MDX-файла (v2: developed)

Структура из **10 секций**, целевой объём **350–450 строк** на тему:

```mdx
---
title: "Kubernetes"
slug: "kubernetes"
category: "devops"
icon: "Boxes"
order: 3
tags: ["kubernetes", "orchestration", "containers", "ops"]
description: "От подов до Ingress: оркестрация контейнеров на проде"
---

## Зачем это вообще

2–3 предложения мотивации. Какую боль это решает в проде. Без аналогии и без терминов.

## Аналогия

<AnalogyBox>
Бытовая аналогия на 3–4 предложения. Бабушка должна понять. Можно `<b>` для подсветки
ключевых сущностей.
</AnalogyBox>

## Картина мира

<Diagram label="control plane → data plane" code={`
ASCII-схема через ┌─┐ │ ├ ┴ ▶ ▼ ▲
Главное: показать поток / связь между ключевыми сущностями.
Ширина ≤ 70 символов, чтобы влезла на ноуте.
`} />

1–2 предложения комментария после диаграммы — что главное в ней видеть.

## Ключевые концепции

6–8 карточек в `<ConceptGrid>`. Каждая — одна сущность, 2–4 предложения.

## Жизненный цикл / пайплайн

ВТОРАЯ диаграмма (опционально): что происходит в типичном сценарии,
шаг за шагом. Полезно для топиков с явным flow (deploy, request handling,
TLS handshake, EXPLAIN plan).

## Примеры

3–5 fenced code-блоков. Реальные команды/конфиги. С комментариями ПОЧЕМУ.

## Грабли

Список из 6–8 пунктов через `<ul className="pitfalls">` + `<li>...</li>`.
Каждый — реальный фейл с пояснением почему. Markdown внутри `<li>` работает
(`**bold**`, inline `code`).

## Когда что выбирать

Markdown-таблица для решений:

| Хочу X | Используй |
| --- | --- |
| ... | `...` |

## Проверь себя

1–3 квиза (`<QuizCard>`). Если 2 — один на понимание границы концепции,
второй на troubleshooting / best practice.

## Шпаргалка

`<div className="cheatsheet">` оборачивает один fenced bash-блок с 10–15
самыми нужными командами. Можно копировать целиком.
```

## Компоненты — API

Импорты делать НЕ нужно — компоненты регистрируются автоматически через `lib/mdx-components.tsx`.

### `<AnalogyBox>`
```mdx
<AnalogyBox>
Текст аналогии. Можно <b>выделять важное</b>.
</AnalogyBox>
```

### `<ConceptGrid>` + `<ConceptCard>`
```mdx
<ConceptGrid>
  <ConceptCard title="Заголовок" icon="LucideIconName">
  Одно-два предложения. Можно использовать `inline code`.
  </ConceptCard>
  …
</ConceptGrid>
```
- 6–8 карточек на тему (было 4–6, сделали глубже)
- `icon` — из `lucide-react`, см. список ниже
- Цвета карточек ротируются автоматически через `:nth-of-type` (c-1..c-6)

Доступные иконки (`components/icon.tsx`):
`AlertTriangle Archive ArrowRight Boxes BookOpen Cable Check Cloud Container Copy Cpu Database FileCode FileText Filter GitBranch Globe HardDrive Hash Key KeyRound Layers Lightbulb Link ListTree Lock Moon Network Package Pickaxe Pipette Play Plug RefreshCw Repeat RotateCcw Route Search Server Settings Shield ShieldCheck Shuffle Sun Table Tag Terminal TrendingUp Workflow Zap`

### Диаграммы

**Дефолт — `<MermaidDiagram>`** (текст → реальный SVG с авто-layout, v4-палитра):

```mdx
<MermaidDiagram label="control plane → data plane" code={`
flowchart TD
  U([kubectl apply]) --> API[API Server]
  API <--> ETCD[(etcd)]
  API --> SCH[Scheduler]
  SCH --> N1[Node 1<br/>kubelet → Pod]
  CLI([клиент]) --> SVC{{Service}}
  SVC --> N1
`} />
```

Mermaid типы для нашего контента:
- `flowchart TD/LR` — архитектурные схемы, пайплайны
- `sequenceDiagram` — handshakes, request flows (TLS, OAuth)
- `stateDiagram-v2` — жизненные циклы (Pod, transaction)
- `erDiagram` — схемы БД

Mermaid формы узлов (используй их семантически):
- `[прямоугольник]` — обычный шаг/компонент
- `([овал])` — старт / конец
- `[(цилиндр)]` — БД / хранилище
- `{{шестиугольник}}` — сервис / прокси
- `{ромб}` — условие
- `((круг))` — узел сети

**Запасной — `<Diagram>` для простого ASCII**, когда нужен фиксированный layout:
```mdx
<Diagram label="..." code={`
  A → B → C
`} />
```
Используй редко, в основном Mermaid.

### Код — **markdown-fenced**, не `<CodeBlock>`
```mdx
**filename.yaml**

\`\`\`yaml
content with {{ jinja }} and ${env} works fine
\`\`\`
```
- `lang`: yaml, bash, sh, json, dockerfile, hcl, javascript, typescript, python, sql, nginx, ini, toml, diff, html, css, text
- Лейбл (имя файла) — отдельной жирной строкой перед блоком: `**deployment.yaml**`

### Список граблей `<ul className="pitfalls">`
```mdx
<ul className="pitfalls">
<li>**Заголовок проблемы** — пояснение почему она бьёт и как избежать. Inline `code` работает.</li>
<li>...</li>
</ul>
```
- 6–8 пунктов. Каждый — одна строка в MDX источнике (markdown внутри работает)
- Красный ✕ marker рендерится автоматически

### Таблица «когда что выбирать»
Стандартный markdown:
```mdx
| Хочу X | Используй |
| --- | --- |
| Stateless API | `Deployment` |
| База с порядком | `StatefulSet` |
```
- Левая колонка автоматически становится жёлтой подсветкой (это «вопрос»)
- Правая — рекомендация. Используй inline `code` для технических терминов

### `<QuizCard>`
```mdx
<QuizCard
  question="..."
  options={["...", "...", "...", "..."]}
  correct={1}
  explanation="..."
  label="quiz · 01"
/>
```
- 1–3 квиза на тему
- `correct` — индекс (0-based)
- Дистракторы — правдоподобные ошибки реального инженера
- `label` (опционально) — короткая метка типа `quiz · 01`

### Шпаргалка в конце
```mdx
<div className="cheatsheet">

\`\`\`bash
# самые нужные команды
\`\`\`

</div>
```
- 10–15 строк квинтэссенции
- Lime offset shadow — визуально отличается от обычных code-блоков

## Жёсткие правила

1. **Frontmatter обязателен** — все 7 полей.
2. **Все 10 секций обязательны** (включая «Зачем это вообще», «Картина мира», «Грабли», «Когда что выбирать», «Шпаргалка»). Если в каком-то топике секция не имеет смысла — лучше сделать её короче, чем выкинуть; единообразие важно.
3. **Минимум 1 диаграмма** (главная — «Картина мира»). Идеально 2.
4. **6–8 ConceptCard** (было 4–6 — расширили).
5. **3–5 примеров кода** (было 2–3). Команды копируются и работают.
6. **6–8 пунктов в граблях**.
7. **1–3 квиза** (было 1).
8. **На «ты»**. Технические термины не транслитерируем (Pod, Deployment, MVCC, NAT).
9. **Версии фиксируй**: `nginx:1.27-alpine`, `postgres:16`, не `:latest`.
10. **Эмодзи запрещены в теле**. Иконки — через `lucide` в `<ConceptCard icon=...>`.
11. **Никаких «Давайте...», «Важно отметить...», «Стоит подчеркнуть...»** — сухо, по делу.
12. **Никакого маркетинга** — это личный конспект, а не лендинг.
