# Edu — инженерная wiki-шпаргалка

## Что это
Сайт-шпаргалка для инженеров уровня Middle+ для подготовки к повышению грейда.
Главный продукт владельца — Virtual Penguin Network (VPN-роутер) на `ninitux.com`.
`edu.ninitux.com` — второй продукт в той же экосистеме.

## Scope
Стартовый набор тем — DevOps (8 шт), но архитектура спроектирована под расширение
в Backend / System Design / Архитектура / Алгоритмы. Группировка через поле `category`
во frontmatter MDX.

### Стартовые темы (категория `devops`)
1. Ansible & Docker
2. Terraform
3. Kubernetes
4. Сетевой контур (iptables, NAT, VLAN)
5. Сертификаты & TLS (OpenSSL, Let's Encrypt)
6. PostgreSQL
7. MongoDB
8. ELK Stack & Grok

### Унифицированный формат темы
1. **Аналогия** — бытовая, без терминов (компонент `AnalogyBox`)
2. **4–6 концепций** в карточках (`ConceptCard` с иконкой)
3. **Примеры кода** — рабочие сниппеты с копированием/подсветкой (`CodeBlock`)
4. **Мини-квиз** — 1 вопрос, 3 варианта, 1 правильный, объяснение (`QuizCard`)

Контент — на **русском**.

## Stack
- Next.js 16, App Router, TypeScript strict, Turbopack
- Tailwind CSS v4 + shadcn/ui
- **Bun** как пакетный менеджер и рантайм (НЕ npm/yarn)
- MDX через `next-mdx-remote/rsc`
- Shiki для подсветки кода
- Lucide React для иконок
- Docker для деплоя, nginx (wb-nginx на проде) для TLS-терминации

## Структура
```
app/
  page.tsx                  — главная: категории → темы
  [category]/[slug]/page.tsx — страница темы
  layout.tsx                — корневой layout (шрифты, theme provider)
components/
  wiki/                     — AnalogyBox, ConceptCard, CodeBlock, QuizCard
  navigation/               — DesktopSidebar, MobileBottomNav, ThemeToggle
  ui/                       — shadcn/ui примитивы
content/
  devops/                   — 8 MDX файлов (одна тема = один файл)
  backend/                  — задел под будущее расширение (пока пусто)
lib/
  mdx-components.tsx        — реестр MDX компонентов
  content.ts                — загрузка и парсинг MDX, генерация манифеста тем
  categories.ts             — конфигурация категорий (icon, color, order)
public/
  fonts/                    — локальные шрифты (без подгрузок с CDN)
docs/                       — методология, дизайн-бриф, прогресс
.claude/                    — конфиги Claude Code (агенты, скиллы, хуки)
docker-compose.yml          — описание сервиса
Dockerfile                  — multi-stage build (deps → builder → runner)
```

## Frontmatter темы
```yaml
---
title: "Kubernetes"
slug: "kubernetes"
category: "devops"
icon: "Boxes"           # имя из lucide-react
order: 3                # порядок в категории
tags: ["orchestration", "containers"]
description: "Аналогия → концепции → код → квиз"
---
```

## Commands
- `bun dev` — dev-сервер на 3000
- `bun run build` — production build
- `bun run start` — production server
- `bun run lint` — ESLint
- `bun run type-check` — `tsc --noEmit`
- `bun run check` — lint + type-check + build (gate перед push)

## Conventions
- Server Components по умолчанию. `"use client"` ТОЛЬКО для интерактива
  (useState/useEffect/обработчики событий, theme toggle, quiz, copy button)
- Все цвета через Tailwind CSS variables (`bg-background`, `text-foreground`, `text-muted-foreground`),
  никаких хардкод hex/rgb
- MDX компоненты регистрируются в `lib/mdx-components.tsx`
- Импорты абсолютные через `@/` алиас
- Никаких external CDN для шрифтов / иконок — всё локально или статически
- Темизация — dark/light через `next-themes`, дефолт = dark
- Метаданные SEO в каждом topic page (Open Graph, Twitter Card, structured data)

## Rules
@.claude/rules/git.md
@.claude/rules/nextjs.md
@.claude/rules/security.md
@.claude/rules/content.md

## On compaction
Preserve:
- список изменённых файлов в этой сессии
- последние ошибки сборки/типов и их причина
- незакрытые задачи из TodoWrite
- текущее состояние deploy
