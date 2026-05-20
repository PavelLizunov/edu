## Next.js 16 правила

### App Router / Server Components
- Дефолт — Server Component
- `"use client"` ТОЛЬКО при наличии: `useState`, `useEffect`, `useMemo`, `useCallback`, event handlers, browser APIs, контекстов
- Если интерактивная часть мала — вынеси её в отдельный client-компонент, обёртка остаётся server
- Никогда не импортируй server-only код (db, env, fs) в client-компоненты

### Data fetching
- В Server Component — прямой `fetch()` или прямой вызов loader из `lib/`
- Кэширование Next.js работает «из коробки» для `fetch` — учитывай это
- Для MDX контента — читать с диска через `lib/content.ts`, парсить gray-matter

### Метаданные
- В каждой странице — `export const metadata: Metadata = { ... }` или `generateMetadata`
- Open Graph, Twitter, canonical обязательны для topic page
- Title pattern: `{topic} — Edu` для тем, `Edu — инженерная шпаргалка` для главной

### Маршрутизация
- `app/page.tsx` — главная
- `app/[category]/[slug]/page.tsx` — динамическая тема
- `generateStaticParams` обязателен для тем (SSG, не SSR)

### Образы и шрифты
- `next/image` всегда (никогда `<img>`), `width`/`height` обязательны
- `next/font/local` для шрифтов в `public/fonts/`
- Никаких Google Fonts через CDN — приватность и оффлайн

### MDX
- `next-mdx-remote/rsc` — Server Component совместимый
- Компоненты регистрируются в `lib/mdx-components.tsx`
- Подсветка — `rehype-pretty-code` или `shiki` (выбор — за дизайном)

### Производительность
- `dynamic()` для тяжёлых клиентских компонентов с `ssr: false` если нужно
- `Suspense` boundaries для медленной асинхронной загрузки
- Streaming где уместно (но для нашего MDX-сайта — статика быстрее)

### Запреты
- НЕТ `getServerSideProps` / `getStaticProps` (это pages router, мы на app)
- НЕТ `useRouter` из `next/router` (только `next/navigation`)
- НЕТ inline `<style>` (Tailwind или CSS Modules)
