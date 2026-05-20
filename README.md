# Edu — инженерная wiki-шпаргалка

`edu.ninitux.com` — wiki-шпаргалка для инженеров Middle+. Аналогии → концепции → код → квиз.
Часть экосистемы [ninitux.com](https://ninitux.com).

> **Статус**: scaffold готов, ждёт дизайн-токены от Claude Design → автономный билд → MVP.

## Стек

- Next.js 16 (App Router, RSC, Turbopack)
- TypeScript strict
- Tailwind CSS v4 + shadcn/ui
- Bun runtime + package manager
- MDX через `next-mdx-remote/rsc`
- Shiki для подсветки кода
- Docker для деплоя за `wb-nginx` (см. [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md))

## Запуск (когда код будет)

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # production build
bun run start    # production server
bun run lint
bun run type-check
```

## Структура

- `AGENTS.md` — главный манифест и конвенции
- `docs/` — методология автономной разработки, дизайн-бриф, план итераций
- `.claude/` — конфиги Claude Code: агенты, скиллы, правила, хуки

## Как мы это строим

1. ✅ Scaffold + методология + дизайн-бриф
2. ⏳ Получить дизайн-токены через Claude Design (бриф в [docs/DESIGN_BRIEF.md](./docs/DESIGN_BRIEF.md))
3. ⏳ Автономный multi-agent билд по плану в [docs/ITERATION_PLAN.md](./docs/ITERATION_PLAN.md)
4. ⏳ Деплой на `edu.ninitux.com`

## Прогресс

См. [docs/PROGRESS_LOG.md](./docs/PROGRESS_LOG.md) (append-only).
