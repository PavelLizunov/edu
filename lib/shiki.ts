import { createHighlighter, type Highlighter } from "shiki";

const LANGS = [
  "bash",
  "sh",
  "shell",
  "yaml",
  "yml",
  "json",
  "dockerfile",
  "docker",
  "hcl",
  "terraform",
  "tf",
  "javascript",
  "js",
  "typescript",
  "ts",
  "tsx",
  "python",
  "py",
  "sql",
  "nginx",
  "ini",
  "toml",
  "diff",
  "html",
  "css",
] as const;

const THEMES = ["github-light-default", "github-dark-default"] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function ensureHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [...THEMES],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

const LANG_FALLBACK = "text";

function normalizeLang(lang: string | undefined): string {
  if (!lang) return LANG_FALLBACK;
  return (LANGS as readonly string[]).includes(lang) ? lang : LANG_FALLBACK;
}

/**
 * Highlight code into HTML with dual-theme CSS variables.
 * The output relies on .shiki rules in globals.css to swap colors on theme change.
 */
export async function highlight(code: string, lang?: string): Promise<string> {
  const highlighter = await ensureHighlighter();
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(lang),
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
    defaultColor: false,
  });
}
