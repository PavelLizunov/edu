# Design tokens — edu.ninitux.com

Derived from ninitux.com landing. Same family. Arctic accent on slate neutrals.
Tailwind v4 / shadcn-compatible CSS variables. Dark is the default; `:root` selector ships dark, `[data-theme="light"]` overrides.

---

## Palette

### Dark (default)

```css
:root,
:root[data-theme="dark"] {
  color-scheme: dark;

  /* Surfaces */
  --background:           #070A14;   /* slate-950 — app bg */
  --foreground:           #EEF1F6;
  --card:                 #0F1320;   /* slate-900 */
  --card-foreground:      #EEF1F6;
  --popover:              #1C2231;   /* slate-800 */
  --popover-foreground:   #EEF1F6;

  /* Brand & actions */
  --primary:              #38BDF8;   /* arctic-400 — brand accent */
  --primary-foreground:   #070A14;
  --secondary:            #1C2231;
  --secondary-foreground: #A6B0C2;

  /* Muted text & subtle surfaces */
  --muted:                #0F1320;
  --muted-foreground:     #6C788F;   /* slate-500-ish, only for meta */

  /* AnalogyBox — softer arctic, distinguishable from --primary */
  --accent:               #67E8F9;   /* arctic-300 */
  --accent-foreground:    #070A14;
  --accent-bg:            rgba(56, 189, 248, 0.10);
  --accent-border:        rgba(56, 189, 248, 0.40);

  /* Destructive */
  --destructive:          #EF4444;
  --destructive-foreground: #FEE2E2;

  /* Form / outline */
  --border:               rgba(255, 255, 255, 0.08);
  --border-strong:        rgba(255, 255, 255, 0.16);
  --input:                rgba(255, 255, 255, 0.08);
  --ring:                 rgba(56, 189, 248, 0.40);

  /* Quiz states */
  --quiz-correct:         rgba(34, 197, 94, 0.15);
  --quiz-correct-border:  rgba(34, 197, 94, 0.45);
  --quiz-correct-fg:      #4ADE80;
  --quiz-incorrect:       rgba(239, 68, 68, 0.15);
  --quiz-incorrect-border:rgba(239, 68, 68, 0.45);
  --quiz-incorrect-fg:    #FCA5A5;

  /* Code block syntax (paired with shiki theme = github-dark-default) */
  --code-bg:              #1C2231;
  --code-fg:              #EEF1F6;
  --code-gutter:          #6C788F;
}
```

### Light

```css
:root[data-theme="light"] {
  color-scheme: light;

  --background:           #FBFCFD;
  --foreground:           #0F1320;
  --card:                 #FFFFFF;
  --card-foreground:      #0F1320;
  --popover:              #FFFFFF;
  --popover-foreground:   #0F1320;

  --primary:              #0284C7;   /* arctic-600, AA on white */
  --primary-foreground:   #FFFFFF;
  --secondary:            #EBEEF3;
  --secondary-foreground: #475067;

  --muted:                #F5F7FA;
  --muted-foreground:     #475067;

  --accent:               #0369A1;   /* arctic-700 */
  --accent-foreground:    #FFFFFF;
  --accent-bg:            rgba(2, 132, 199, 0.08);
  --accent-border:        rgba(2, 132, 199, 0.35);

  --destructive:          #DC2626;
  --destructive-foreground: #FFFFFF;

  --border:               rgba(15, 19, 32, 0.08);
  --border-strong:        rgba(15, 19, 32, 0.16);
  --input:                rgba(15, 19, 32, 0.10);
  --ring:                 rgba(2, 132, 199, 0.30);

  --quiz-correct:         #DCFCE7;
  --quiz-correct-border:  #86EFAC;
  --quiz-correct-fg:      #15803D;
  --quiz-incorrect:       #FEE2E2;
  --quiz-incorrect-border:#FCA5A5;
  --quiz-incorrect-fg:    #B91C1C;

  --code-bg:              #F5F7FA;
  --code-fg:              #0F1320;
  --code-gutter:          #94A0B2;
}
```

---

## Typography

System stacks only. No webfont CDN.

```css
:root {
  --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont,
               "Segoe UI Variable", "Segoe UI", system-ui,
               "Helvetica Neue", Arial, sans-serif;

  --font-mono: ui-monospace, "JetBrains Mono", "SF Mono",
               "Segoe UI Mono", Menlo, Consolas, monospace;
}
```

If a single local font family is preferred, drop `Geist` or `Inter` into `/public/fonts/` and set `--font-sans` to it; do **not** add a Google Fonts link.

### Scale (Tailwind defaults, kept)

| token        | px   | use                                  |
|---           |---   |---                                   |
| `text-xs`    | 12   | meta, kbd, code captions             |
| `text-sm`    | 14   | body, ConceptCard description, CodeBlock |
| `text-base`  | 16   | nav, button, ConceptCard title       |
| `text-lg`    | 18   | AnalogyBox body, QuizCard question   |
| `text-xl`    | 20   | section sub-headings                 |
| `text-2xl`   | 24   | topic page H1 small variant          |
| `text-3xl`   | 30   | topic page H1                        |
| `text-4xl`   | 36   | home hero title                      |
| `text-5xl`   | 48   | reserved (rarely)                    |

### Line-height & tracking

```css
--lh-heading: 1.15;
--lh-body:    1.65;
--lh-code:    1.5;
--tracking-heading: -0.02em;
--tracking-meta:    0.08em;   /* uppercase section eyebrow */
--tracking-code:    0;
```

Headings: `font-weight: 700`, color `--foreground`, `letter-spacing: -0.02em`.
Section eyebrows (`# DEVOPS`): `text-xs`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.08em`, color `--muted-foreground`, with `::before { content: "# "; color: var(--primary); opacity: .7 }`.

---

## Spacing & layout

Tailwind 4-px grid kept verbatim.

```css
--radius:     0.5rem;   /* 8px — cards, inputs, code blocks */
--radius-sm:  0.25rem;  /* 4px — badges, kbd */
--radius-pill: 9999px;
```

**Containers**

| context           | width        |
|---                |---           |
| content (article) | `max-w-3xl`  (768px) |
| layout (sidebar + content) | `max-w-7xl` (1280px) |
| sidebar           | `280px` fixed, sticky |

**Section vertical rhythm**

```css
section { padding-block: 40px; border-top: 1px solid var(--border); }
section + section { margin-block-start: 0; }
section > h2 { margin-bottom: 20px; }
```

---

## Motion

```css
--ease-out:     cubic-bezier(0.2, 0.8, 0.2, 1);
--dur-instant:  80ms;
--dur-fast:    140ms;
--dur-base:    200ms;
--dur-slow:    300ms;
```

Honour `prefers-reduced-motion: reduce` by zeroing all transitions and animations.

---

## Component recipes

### `AnalogyBox`

```html
<aside class="analogy">
  <div class="analogy-mark">💡</div>
  <p class="analogy-body">Представь дирижёра большого оркестра…</p>
</aside>
```

```css
.analogy {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 14px;
  padding: 16px 18px;
  background: var(--accent-bg);
  border-left: 3px solid var(--primary);
  border-radius: var(--radius);
}
.analogy-mark { font-size: 18px; line-height: 1.2; opacity: .8; }
.analogy-body { font-size: 18px; line-height: 1.55; color: var(--foreground); margin: 0; }
```

No italic, no fancy fonts — the left bar + tinted bg carry the emphasis.

### `ConceptCard`

```css
.concept-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 768px)  { .concept-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .concept-grid { grid-template-columns: repeat(3, 1fr); } }

.concept {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  transition: border-color var(--dur-fast) var(--ease-out);
}
.concept:hover { border-color: var(--border-strong); }
.concept-icon { color: var(--muted-foreground); width: 24px; height: 24px; margin-bottom: 10px; }
.concept-title { font-size: 16px; font-weight: 600; margin: 0 0 4px; color: var(--card-foreground); }
.concept-desc  { font-size: 14px; color: var(--muted-foreground); margin: 0; line-height: 1.55; }
```

Icons from `lucide-react`. **Stroke only**, never filled, `stroke-width: 1.75`.

### `CodeBlock`

Follow the landing's `.code` recipe verbatim:

```css
.code {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  display: flex; align-items: stretch; overflow: hidden;
  margin-block: 12px;
}
.code pre {
  margin: 0; flex: 1; padding: 14px 16px;
  font-family: var(--font-mono); font-size: 13.5px; line-height: 1.55;
  color: var(--code-fg); overflow-x: auto; white-space: pre;
}
.code .copy {
  appearance: none; background: transparent; border: 0;
  border-left: 1px solid var(--border);
  color: var(--muted-foreground); padding: 0 14px;
  font: inherit; font-size: 12px; cursor: pointer;
  display: flex; align-items: center; gap: 6px; min-width: 72px; justify-content: center;
}
.code .copy:hover { color: var(--foreground); background: rgba(255,255,255,0.03); }
.code .copy.ok   { color: var(--quiz-correct-fg); }
```

Optional `label` line above the block: `<div class="code-label">deployment.yaml</div>` — `font-family: var(--font-mono)`, `font-size: 12px`, `color: var(--muted-foreground)`, `margin-bottom: 6px`.

### `QuizCard`

```css
.quiz { padding-block: 8px 4px; }
.quiz-q { font-size: 18px; font-weight: 600; margin: 0 0 12px; color: var(--foreground); }
.quiz-options { display: flex; flex-direction: column; gap: 8px; }
.quiz-opt {
  text-align: left; padding: 12px 14px;
  border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--card); color: var(--card-foreground);
  font: inherit; font-size: 15px; cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out),
              background var(--dur-fast) var(--ease-out);
}
.quiz-opt:hover:not(:disabled) { border-color: var(--border-strong); }
.quiz-opt[data-state="correct"]   { border-color: var(--quiz-correct-border);   background: var(--quiz-correct); }
.quiz-opt[data-state="incorrect"] { border-color: var(--quiz-incorrect-border); background: var(--quiz-incorrect); }
.quiz-opt:disabled { cursor: default; }
.quiz-explain {
  margin-top: 12px; padding: 12px 14px;
  border: 1px dashed var(--border-strong); border-radius: var(--radius);
  font-size: 14px; color: var(--muted-foreground); line-height: 1.55;
  display: grid; grid-template-columns: 20px 1fr; gap: 10px;
}
```

All `transition` durations: `var(--dur-fast)` (140ms). No spring, no bounce.

### `Sidebar` (desktop)

```css
.sidebar {
  width: 280px; flex: 0 0 280px;
  position: sticky; top: 0; align-self: start;
  height: 100dvh; overflow-y: auto;
  border-right: 1px solid var(--border);
  padding: 24px 16px;
  font-size: 14px;
}
.sidebar h4 {
  font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  color: var(--muted-foreground); margin: 18px 0 6px;
}
.sidebar h4::before { content: "# "; color: var(--primary); opacity: .7; }
.sidebar a {
  display: block; padding: 4px 8px; border-radius: var(--radius-sm);
  color: var(--muted-foreground); text-decoration: none;
}
.sidebar a:hover { color: var(--foreground); background: var(--muted); }
.sidebar a[aria-current="page"] {
  color: var(--foreground);
  background: var(--accent-bg);
  border-left: 2px solid var(--primary);
  padding-left: 6px;
}
```

### Mobile bottom nav

```css
.mobile-nav {
  position: fixed; inset: auto 0 0 0; z-index: 50;
  display: grid; grid-template-columns: repeat(3, 1fr);
  background: var(--background);
  border-top: 1px solid var(--border);
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
}
.mobile-nav a {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 6px; font-size: 11px; color: var(--muted-foreground); text-decoration: none;
}
.mobile-nav a[aria-current="page"] { color: var(--primary); }
.mobile-nav svg { width: 20px; height: 20px; }
```

Hide sidebar on `<768px`, replace with `<Sheet>` (shadcn) opened via the middle "Темы" item.

---

## Iconography

`lucide-react` only. Always stroke (1.75). Always `currentColor`. No fills, no duotone, no custom illustrations. Common usage:

| icon          | where           |
|---            |---              |
| `Lightbulb`   | AnalogyBox      |
| `Boxes`       | ConceptCard for "контейнеризация" |
| `Network`     | ConceptCard for "сети"            |
| `Terminal`    | CodeBlock label, when no specific tool |
| `Copy` / `Check` | CodeBlock copy button state    |
| `BookOpen`    | bottom nav — Главная             |
| `Layers`      | bottom nav — Темы                 |
| `Sun` / `Moon`| theme toggle                      |

---

## Brand tokens — shared with ninitux.com

| token            | value                              |
|---               |---                                 |
| brand name       | `edu.ninitux.com`                  |
| parent           | `ninitux.com — Virtual Penguin Network` |
| mascot           | white penguin (svg, `/public/penguin.svg`); inverts to dark on light theme via `filter: invert(1)` |
| favicon          | inline SVG 🐧 (same as landing)    |
| header brand     | mascot 22px + monospace-y `edu.ninitux` |
| accent gloss     | none — flat colors only            |

---

## Hard rules (don't drift)

1. **One accent only.** `--primary` carries it. No purple, no green for decoration — only for state (`quiz-*`, `destructive`).
2. **No gradients.** Anywhere. Flat fills.
3. **No emoji as icons.** The two exceptions allowed: 🐧 in eyebrow / favicon, 💡 in AnalogyBox mark.
4. **No drop-shadows on cards.** Border + bg-step only. Reserve shadows for modals/popovers.
5. **No rounded corners > 0.5rem on layout containers.** Hero, sidebar, sections — square.
6. **Section eyebrows always uppercase with `#` prefix.** `## ` for sub-sections (rare).
7. **Code blocks always have a copy button.** Even if the snippet is one word.
8. **Type ≥ 14px in body.** Only meta/kbd/labels go to 12.
9. **Hit targets ≥ 32px** on touch.
10. **Honour `prefers-reduced-motion`.** Wrap every transition in a query.

---

## Sourced from

ninitux.com landing — `/index.html`. Same palette. Same type scale (extended for documentation-density). Same minimalism.
