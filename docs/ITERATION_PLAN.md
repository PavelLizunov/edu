# План итераций (≈100 шагов, ≈10 часов)

> Источник истины для автономного цикла. Оркестратор после каждой итерации помечает `[x]` и переходит к следующему. Снизу — буфер.

## Phase 0: Прелюдия (5 шагов)
- [ ] **001** Инициализация Next.js 16 + TS strict + Turbopack: `bunx create-next-app@latest . --typescript --tailwind --app --turbopack --no-src-dir`
- [ ] **002** Удалить демо-страницу, очистить `app/page.tsx` до заглушки
- [ ] **003** Подключить Tailwind v4 CSS-переменные из `docs/DESIGN_TOKENS.md` в `app/globals.css`
- [ ] **004** Установить зависимости: `next-mdx-remote`, `gray-matter`, `shiki`, `lucide-react`, `next-themes`, `class-variance-authority`, `clsx`, `tailwind-merge`
- [ ] **005** Инициализировать shadcn/ui: `bunx shadcn@latest init`, добавить Button, Card, Badge, Sheet

## Phase 1: Дизайн-система (10 шагов)
- [ ] **006** Создать `lib/utils.ts` с `cn()`
- [ ] **007** Подключить локальные шрифты в `app/fonts.ts` (sans + mono из публичной папки)
- [ ] **008** Theme provider (`next-themes`) + `ThemeToggle` компонент
- [ ] **009** Реализовать root layout с шрифтами, theme provider, метаданными
- [ ] **010** Реализовать главный header (логотип + theme toggle)
- [ ] **011** Реализовать footer (мини, с ссылками на ninitux.com и github)
- [ ] **012** Создать `lib/categories.ts` — конфиг категорий (icon, color, order, slug, title, description)
- [ ] **013** Создать `lib/content.ts` — функции `getAllTopics()`, `getTopicBySlug()`, `getTopicsByCategory()`
- [ ] **014** Создать `lib/mdx-components.tsx` — реестр AnalogyBox/ConceptCard/CodeBlock/QuizCard
- [ ] **015** Проверка: `bun run dev` стартует, главная отображается заглушкой

## Phase 2: Wiki-компоненты (12 шагов)
- [ ] **016** `components/wiki/AnalogyBox.tsx` — server component с дизайном из брифа
- [ ] **017** ui-reviewer: AnalogyBox → фиксы
- [ ] **018** `components/wiki/ConceptCard.tsx` — server component с поддержкой `icon` prop
- [ ] **019** ui-reviewer: ConceptCard → фиксы
- [ ] **020** `components/wiki/CodeBlock.tsx` — server component (подсветка) + client wrapper для copy кнопки
- [ ] **021** ui-reviewer: CodeBlock → фиксы
- [ ] **022** `components/wiki/QuizCard.tsx` — client component с useState и feedback
- [ ] **023** ui-reviewer: QuizCard → фиксы
- [ ] **024** Изолированная тест-страница `/preview` где видны все 4 компонента в живую
- [ ] **025** Build + skрин через Chrome CDP, визуальная проверка
- [ ] **026** Commit: `feat: wiki components (AnalogyBox, ConceptCard, CodeBlock, QuizCard)`

## Phase 3: Навигация (8 шагов)
- [ ] **027** `components/navigation/DesktopSidebar.tsx` — server, по `lib/content.ts` строит дерево
- [ ] **028** ui-reviewer: DesktopSidebar
- [ ] **029** `components/navigation/MobileBottomNav.tsx` — client, sticky bottom, 3 иконки
- [ ] **030** `components/navigation/MobileTopicsDrawer.tsx` — client, через shadcn/ui Sheet
- [ ] **031** ui-reviewer: Mobile navigation
- [ ] **032** Адаптивный лейаут в `app/layout.tsx` — сайдбар на md+, нижняя нав на мобиле
- [ ] **033** `aria-current` для активной ссылки, фокус-стили
- [ ] **034** Commit: `feat: navigation (desktop sidebar + mobile bottom nav + drawer)`

## Phase 4: Эталонная тема — Kubernetes (10 шагов)
- [ ] **035** Создать `content/devops/` директорию
- [ ] **036** `topic-author`: написать `content/devops/kubernetes.mdx` (эталон)
- [ ] **037** `content-reviewer`: Kubernetes → правки
- [ ] **038** Применить правки, повторное ревью если нужно
- [ ] **039** Создать `app/[category]/[slug]/page.tsx` с `generateStaticParams`
- [ ] **040** Добавить хлебные крошки (`components/navigation/Breadcrumbs.tsx`)
- [ ] **041** Добавить «следующая тема» в подвале страницы темы
- [ ] **042** SEO metadata через `generateMetadata`
- [ ] **043** Открыть в Chrome — проверить визуал, fix issues
- [ ] **044** Commit: `content: kubernetes (template topic)`

## Phase 5: Остальные 7 тем (параллельно, 21 шаг ≈ 3 на тему)
Для каждой темы (Ansible/Docker, Terraform, Сети, TLS, PostgreSQL, MongoDB, ELK):
- [ ] **045–051** `topic-author` × 7 в параллельных Agent-вызовах
- [ ] **052–058** `content-reviewer` × 7 проверка
- [ ] **059–065** Применение правок, финал

## Phase 6: Главная (8 шагов)
- [ ] **066** `app/page.tsx` — hero (заголовок + подзаголовок)
- [ ] **067** Секция категорий — карточки `CategoryCard`
- [ ] **068** Список тем в категории `devops` (8 шт)
- [ ] **069** "Скоро" placeholder для `databases`, `backend` категорий
- [ ] **070** ui-reviewer: главная
- [ ] **071** Open Graph картинка (статика в `public/og-default.png` или через `next/og`)
- [ ] **072** Robots.txt + sitemap.xml через `app/robots.ts` / `app/sitemap.ts`
- [ ] **073** Commit: `feat: home page with categories and topic listing`

## Phase 7: Качество (10 шагов)
- [ ] **074** Прогон `bun run lint`, фиксы
- [ ] **075** Прогон `bun run type-check`, фиксы
- [ ] **076** Прогон `bun run build`, фиксы
- [ ] **077** Lighthouse / a11y проверка через Chrome CDP
- [ ] **078** Контраст в обеих темах
- [ ] **079** Мобильный вид 320px / 375px / 414px
- [ ] **080** Открыть все 8 тем подряд, заметить визуальные баги
- [ ] **081** Quiz нажимать все варианты — проверить feedback
- [ ] **082** Code copy — реально копируется
- [ ] **083** Commit: `fix: ...` (что нашли)

## Phase 8: Деплой (10 шагов)
- [ ] **084** `Dockerfile` — multi-stage (deps → builder → runner)
- [ ] **085** `docker-compose.yml` — service `edu`, порт 18900, restart unless-stopped
- [ ] **086** `.dockerignore`
- [ ] **087** SSH на 207, `mkdir /home/user/edu`, `git clone` (нужно завести репу в Forgejo)
- [ ] **088** `docker compose build` на 207
- [ ] **089** `docker compose up -d`
- [ ] **090** Проверить `curl http://127.0.0.1:18900` с 207
- [ ] **091** Запросить SSL для `edu.ninitux.com` (нужна DNS-запись)
- [ ] **092** Дописать nginx server block, reload
- [ ] **093** `curl https://edu.ninitux.com/` снаружи

## Phase 9: Финальная проверка + резерв (10 шагов)
- [ ] **094** Прогнать все темы на проде, скриншоты
- [ ] **095** Submit в Umami (analytics)
- [ ] **096** Обновить README с реальным URL
- [ ] **097** Закрытие прогресс-лога
- [ ] **098–103** Резерв на фиксы

## Out of scope для MVP (но потенциально на «после»)
- Поиск (требует индекс — Fuse.js или встроенная Next.js search)
- i18n (EN добавится — но дизайн уже билингв)
- Прогресс-бар «пройдено X из 8»
- Закладки (требует localStorage)
- Принт-стили (для распечатки)
- RSS/Atom фид
- GitHub-style правка-предложение
