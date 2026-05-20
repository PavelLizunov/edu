# Edu — инженерная wiki-шпаргалка

[`edu.ninitux.com`](https://edu.ninitux.com) — wiki-шпаргалка для инженеров Middle+. Аналогии → концепции → код → квиз.
Часть экосистемы [ninitux.com](https://ninitux.com).

> **Статус**: MVP в проде. 8 тем DevOps (Ansible & Docker, Terraform, Kubernetes, Сети, TLS, PostgreSQL, MongoDB, ELK).

## Стек

- Next.js 16 (App Router, RSC, Turbopack), TypeScript strict
- Tailwind CSS v4 (CSS-переменные нативно)
- Bun runtime + package manager
- MDX через `next-mdx-remote/rsc`
- Shiki — двухтемная подсветка (github-light-default + github-dark-default)
- `lucide-react` для иконок (stroke-only, 1.75)
- `next-themes` — dark/light с `data-theme` атрибутом, dark = default
- Docker (multi-stage, standalone output) за `wb-nginx` на 192.168.0.207
- Let's Encrypt cert auto-renewable

## Запуск локально

```bash
bun install
bun dev           # http://localhost:3000
bun run build     # production build (SSG, ~12 страниц)
bun run start     # production server
bun run lint
bun run type-check
bun run check     # lint + type-check + build (gate перед push)
```

## Структура

```
app/
  page.tsx                     — главная: hero + категории + topic list
  layout.tsx                   — root: theme provider, header, sidebar/article grid, mobile nav
  [category]/[slug]/page.tsx   — динамическая страница темы (SSG + generateMetadata)
components/
  wiki/                        — AnalogyBox, ConceptCard, CodeBlock, QuizCard, CopyButton
  navigation/                  — DesktopSidebar, MobileBottomNav, MobileTopicsDrawer, Breadcrumbs, SidebarLink
  layout/                      — Header, CategoryCard, TopicList
  theme-provider.tsx           — next-themes wrapper
  theme-toggle.tsx             — Sun/Moon кнопка
  icon.tsx                     — lucide icon by name (whitelist 50+)
content/
  devops/                      — 8 MDX тем
  databases/                   — задел (пусто)
  backend/                     — задел (пусто)
lib/
  content.ts                   — gray-matter + валидация frontmatter, prev/next
  categories.ts                — конфиг категорий
  mdx-components.tsx           — реестр + pre-override (markdown fence → CodeBlock)
  shiki.ts                     — highlighter (lazy init, dual theme)
  utils.ts                     — cn()
types/
  content.ts                   — типы Topic, Category
public/penguin.png             — маскот (инвертится фильтром на dark)
docs/                          — методология, дизайн-токены, мок, прогресс-лог
```

## Дизайн

Дизайн-токены, style paragraph и HTML-мок — в [docs/](./docs/):
- `DESIGN_TOKENS.md` — CSS-переменные + рецепты компонентов
- `DESIGN_STYLE.md` — стиль одним абзацем
- `DESIGN_MOCKS/edu-ninitux-mock.html` — pixel-perfect референс с 3 экранами

Источник — landing [ninitux.com](https://ninitux.com). Палитра arctic-blue (`#38BDF8`) на slate-950, system sans + mono, флэт-фон без градиентов.

## Контент

Каждая тема — один MDX-файл с фиксированной структурой:
1. Аналогия (`<AnalogyBox>`)
2. 4–6 концепций в `<ConceptGrid>` → `<ConceptCard>`
3. Примеры кода: markdown-fenced блоки ` ```lang...``` ` (рендерятся через стилизованный CodeBlock с copy-кнопкой)
4. Квиз (`<QuizCard>`)

Гайд для агентов: [.claude/skills/mdx-content/SKILL.md](./.claude/skills/mdx-content/SKILL.md).

## Деплой

См. [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md). Текущая инфра:
- Docker container на 192.168.0.207, порт 127.0.0.1:18900
- `wb-nginx` (host network) с TLS-терминацией для `edu.ninitux.com`
- Отдельный Let's Encrypt cert: `/etc/letsencrypt/live/edu.ninitux.com/`

Regular deploy:
```bash
ssh user@192.168.0.207 'cd /home/user/edu && git pull && docker compose up -d --build'
```

## Как мы это строили

1. ✅ Scaffold + методология + дизайн-бриф
2. ✅ Дизайн от Claude Design (`docs/DESIGN_TOKENS.md`, `docs/DESIGN_MOCKS/`)
3. ✅ Foundation: токены в globals.css, layout, theme provider, lib/content
4. ✅ 4 wiki-компонента + навигация (десктоп + мобайл)
5. ✅ 8 параллельных topic-author агентов → 8 MDX тем DevOps
6. ✅ Dockerfile + docker-compose + nginx + Let's Encrypt
7. ⏳ Расширение: Databases, Backend, System Design (по мере поступления)

## Прогресс-лог

См. [docs/PROGRESS_LOG.md](./docs/PROGRESS_LOG.md) (append-only).
