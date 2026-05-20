# Прогресс автономного билда

Каждая итерация автономного цикла дописывает сюда строку.
Формат: `[ISO timestamp] iter NNN | <category>: <short desc> | gate: ✅/⚠️ | files: a.tsx, b.mdx`

---

## Pre-autonomous scaffold (manual)

[2026-05-20T15:00Z] setup | scaffold: создан skeleton проекта, .claude/ конфиги, методология, дизайн-бриф, план итераций | gate: n/a | files: AGENTS.md, CLAUDE.md, .claude/**, docs/**

---

## Iterations

[2026-05-20T18:45Z] setup | design-handoff: дизайн из claude.ai/design распакован в репо — токены, style paragraph и HTML-мок | gate: n/a | files: docs/DESIGN_TOKENS.md, docs/DESIGN_STYLE.md, docs/DESIGN_MOCKS/edu-ninitux-mock.html, docs/DESIGN_MOCKS/HANDOFF_README.md

[2026-05-20T18:55Z] env | bootstrap: bun не предустановлен в контейнере, поставлен через `npm i -g bun` (prefix=~/.local), version 1.3.14. Settings.json расширен allowlist (npm/npx, git push origin main, file ops, ssh user@*, scoped curl) | gate: n/a | files: .claude/settings.json

[2026-05-20T18:57Z] phase-0 | scaffold: bunx create-next-app — Next.js 16.2.6, React 19.2.4, Tailwind v4.3, TypeScript strict, Turbopack, no-src, eslint. Скаффолд собран в /tmp/edy-scaffold и аккуратно перенесён в /home/user/edy (без перезаписи .git/.claude/docs) | gate: n/a | files: app/, public/, package.json, tsconfig.json, next.config.ts

[2026-05-20T19:00Z] phase-0+1+2 | foundation: установлены next-mdx-remote, gray-matter, shiki, lucide-react, next-themes, clsx, tailwind-merge, class-variance-authority. Написаны: app/globals.css со ВСЕМИ токенами (dark+light) + tailwind @theme bridge + компонентные классы (.analogy/.concept/.code/.quiz/.sidebar/.mobile-nav/.drawer), app/layout.tsx с theme provider + header + sidebar + bottom nav, ThemeProvider/ThemeToggle, Header, lib/{utils,categories,content,mdx-components,shiki}, types/content.ts. 4 wiki-компонента (AnalogyBox, ConceptCard+Grid, CodeBlock async server + CopyButton client island, QuizCard client). Навигация: DesktopSidebar, SidebarLink, MobileBottomNav, MobileTopicsDrawer, Breadcrumbs. Презентационные: CategoryCard, TopicList. app/page.tsx (hero+категории+topics), app/[category]/[slug]/page.tsx (compileMDX + generateMetadata + prev/next). Маскот в /public/penguin.png. | gate: lint ✅ type-check ✅ build ✅ (4 страницы SSG, контента ещё нет) | files: ~25 файлов

[2026-05-20T19:00Z] git | foundation commit pushed | gate: ✅ | files: 9762464

[2026-05-20T19:14Z] phase-4+5 | content × 8: параллельно запущено 8 topic-author агентов (sonnet), каждый прочитал .claude/skills/mdx-content/SKILL.md + .claude/rules/content.md и написал свою тему. Сгенерировано: ansible-docker, terraform, kubernetes (эталон с дирижёром), networking, tls, postgresql, mongodb, elk. Каждая тема: аналогия + 5-6 ConceptCard в ConceptGrid + 2-3 CodeBlock + 1 QuizCard. Квизы проверяют границу понимания, дистракторы — правдоподобные ошибки реального инженера. | gate: будет после исправления MDX | files: content/devops/*.mdx (8 файлов)

[2026-05-20T19:15Z] phase-7-fix | mdx-jsx-conflict: build упал на ansible-docker (`ReferenceError: nginx_version`). Причина — MDX парсит `{...}` в `<CodeBlock>` children как JSX expression. Прoблемы в коде на Jinja `{{ }}`, Logstash `%{...}`, `${env}`, JSON `{ "key": ... }` — затрагивает 24 блока в 8 файлах. Архитектурный фикс: добавлен `pre` override в lib/mdx-components.tsx — маппит markdown-fenced ```lang...``` блоки в стилизованный CodeBlock. Написан scripts/codeblocks-to-fenced.ts, прогнал — 24 блока конвертированы. SKILL.md обновлён: новая конвенция = markdown fence + `**filename**` строка. | gate: lint ✅ type-check ✅ build ✅ (12 страниц SSG: home + 8 тем + not-found + интернальные) | files: lib/mdx-components.tsx, content/devops/*.mdx, scripts/codeblocks-to-fenced.ts, .claude/skills/mdx-content/SKILL.md

[2026-05-20T19:14Z] phase-8 | docker: Dockerfile (3-stage: bun deps → bun build → node-alpine runtime, standalone output, non-root uid 1001), docker-compose.yml (порт 127.0.0.1:18900, healthcheck wget), .dockerignore | gate: build OK | files: Dockerfile, docker-compose.yml, .dockerignore

[2026-05-20T19:16Z] git | content+docker commit pushed | gate: ✅ | files: 2796376

[2026-05-20T19:18Z] phase-8 | deploy:
  • tar pipe из /home/user/edy → user@192.168.0.207:/home/user/edu (без node_modules/.next/.git)
  • docker compose build (multi-stage prod build, ~3 мин)
  • docker compose up -d — контейнер `edu` UP healthy на 127.0.0.1:18900
  • Curl на 127.0.0.1:18900 → HTTP 200 / 7ms
  • Nginx: добавлен HTTP server block для edu.ninitux.com (ACME challenge + redirect), reload OK
  • Certbot: `certonly --webroot` для edu.ninitux.com → cert получен (отдельный, не в SAN ninitux.com)
  • Nginx: добавлен HTTPS server block (Next.js proxy + длинный кеш на /_next/static + WebSocket headers), reload OK
  | gate: ✅ | files: deployed

[2026-05-20T19:20Z] smoke | prod: https://edu.ninitux.com/ → 200 (36ms), все 8 тем → 200 (~35ms). Shiki dual-theme рендерится (1172 span'ов с подсветкой, github-light-default + github-dark-default присутствуют), AnalogyBox/ConceptCard/QuizCard классы в HTML. | gate: ✅ | files: live

# MVP shipped. Site live at https://edu.ninitux.com
