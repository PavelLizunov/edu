/**
 * One-shot transform: convert `<CodeBlock lang="..." label="...">content</CodeBlock>`
 * into Markdown-fenced code blocks. MDX parses fenced blocks as literal text,
 * so `{}`, `${}`, JSON, Jinja, etc. work without escaping.
 *
 * Usage: bun run scripts/codeblocks-to-fenced.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

const CODEBLOCK_RE =
  /<CodeBlock\s+([^>]*?)>([\s\S]*?)<\/CodeBlock>/g;

function parseAttrs(raw: string): { lang?: string; label?: string } {
  const out: { lang?: string; label?: string } = {};
  for (const m of raw.matchAll(/(\w+)\s*=\s*"([^"]*)"/g)) {
    if (m[1] === "lang" || m[1] === "language") out.lang = m[2];
    if (m[1] === "label") out.label = m[2];
  }
  return out;
}

async function processFile(file: string): Promise<number> {
  const original = await fs.readFile(file, "utf-8");
  let changes = 0;
  const next = original.replace(
    CODEBLOCK_RE,
    (_match, attrs: string, body: string) => {
      changes += 1;
      const { lang = "text", label } = parseAttrs(attrs);
      const fence = body.includes("```") ? "````" : "```";
      const trimmed = body.replace(/^\n+/, "").replace(/\n+$/, "");
      const labelLine = label ? `**${label}**\n\n` : "";
      return `${labelLine}${fence}${lang}\n${trimmed}\n${fence}`;
    }
  );
  if (changes > 0) {
    await fs.writeFile(file, next, "utf-8");
  }
  return changes;
}

async function main() {
  const dirs = await fs.readdir(CONTENT_DIR);
  let total = 0;
  for (const d of dirs) {
    const sub = path.join(CONTENT_DIR, d);
    let entries: string[];
    try {
      entries = await fs.readdir(sub);
    } catch {
      continue;
    }
    for (const e of entries) {
      if (!e.endsWith(".mdx")) continue;
      const fpath = path.join(sub, e);
      const n = await processFile(fpath);
      console.log(`${fpath}: ${n} blocks converted`);
      total += n;
    }
  }
  console.log(`\nTotal: ${total} CodeBlock(s) converted to fenced markdown.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
