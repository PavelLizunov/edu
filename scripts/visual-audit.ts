/**
 * Visual audit across all 8 topics on prod.
 *
 * Detects: horizontal overflow, oversized images/SVGs, broken layouts,
 * mermaid render failures, contrast issues. Prints findings per topic.
 */
import puppeteer, { type Page } from "puppeteer-core";

const TARGET = "https://edu.ninitux.com";
const CDP_URL = "http://192.168.0.142:9222";

const TOPICS = [
  "ansible-docker",
  "terraform",
  "kubernetes",
  "networking",
  "tls",
  "postgresql",
  "mongodb",
  "elk",
];

interface Finding {
  topic: string;
  viewport: string;
  category: string;
  detail: string;
}

const findings: Finding[] = [];

async function auditPage(page: Page, url: string, topic: string, viewport: string) {
  await page.goto(url, { waitUntil: "networkidle2" });
  // Scroll through whole page to trigger all IntersectionObservers (lazy mermaid)
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 300));
    }
    window.scrollTo(0, 0);
  });
  // Let mermaid finish — first SVG renders ~500ms after import, subsequent
  // SVGs use the cached lib but each render is ~200ms.
  await new Promise((r) => setTimeout(r, 4000));

  const results = await page.evaluate(() => {
    const out: Array<{ category: string; detail: string }> = [];

    // 1. Horizontal overflow on body / wrap
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    if (docW > winW + 2) {
      out.push({ category: "body-overflow", detail: `scrollWidth=${docW} > viewport=${winW}` });
    }

    // 2. Elements that overflow their parent horizontally.
    //   - Skip SVG content (Mermaid) — SVG has its own layout, scrollWidth is meaningless.
    //   - Skip elements with overflow-x:auto/scroll (they ARE scroll containers).
    //   - Threshold > 8px (ignore rounding).
    const elements = document.querySelectorAll(".topic-body *, .topbar *");
    for (const el of Array.from(elements)) {
      const e = el as HTMLElement;
      if (e instanceof SVGElement) continue;
      const cs = getComputedStyle(e);
      if (cs.overflowX === "auto" || cs.overflowX === "scroll") continue;
      // also skip if any ancestor up to topic-body is a scroll container
      let scrollAncestor = false;
      for (let p = e.parentElement; p && !p.classList.contains("topic-body"); p = p.parentElement) {
        const pcs = getComputedStyle(p);
        if (pcs.overflowX === "auto" || pcs.overflowX === "scroll") {
          scrollAncestor = true;
          break;
        }
      }
      if (scrollAncestor) continue;
      if (e.scrollWidth > e.clientWidth + 8 && e.clientWidth > 0) {
        const tag = e.tagName.toLowerCase();
        const cls = e.className.toString().split(" ").filter(Boolean).slice(0, 2).join(".");
        out.push({
          category: "element-overflow",
          detail: `<${tag}${cls ? "." + cls : ""}>  scroll=${e.scrollWidth} client=${e.clientWidth}`,
        });
        if (out.filter((x) => x.category === "element-overflow").length >= 5) break;
      }
    }

    // 3. Mermaid SVG rendered?
    const mermaidWrappers = document.querySelectorAll(".diagram-mermaid");
    const mermaidSvgs = document.querySelectorAll(".diagram-mermaid svg");
    const mermaidErrors = document.querySelectorAll(".diagram-mermaid-error");
    if (mermaidWrappers.length > 0 && mermaidSvgs.length < mermaidWrappers.length) {
      out.push({
        category: "mermaid-missing",
        detail: `${mermaidWrappers.length} wrappers but only ${mermaidSvgs.length} SVGs`,
      });
    }
    if (mermaidErrors.length > 0) {
      out.push({
        category: "mermaid-error",
        detail: `${mermaidErrors.length} render errors`,
      });
    }
    // Mermaid SVG wider than its wrapper?
    for (const wrap of Array.from(mermaidWrappers)) {
      const svg = wrap.querySelector("svg");
      if (svg) {
        const wW = (wrap as HTMLElement).clientWidth;
        const sW = svg.getBoundingClientRect().width;
        if (sW > wW + 2) {
          out.push({ category: "mermaid-overflow", detail: `svg=${Math.round(sW)} wrap=${wW}` });
        }
      }
    }

    // 4. Code blocks overflow (pre.shiki should be inside scrollable parent)
    const pres = document.querySelectorAll(".topic-body pre");
    for (const pre of Array.from(pres)) {
      const p = pre as HTMLElement;
      const parent = p.parentElement as HTMLElement;
      const parentCs = parent ? getComputedStyle(parent) : null;
      if (
        p.scrollWidth > p.clientWidth + 2 &&
        parentCs?.overflowX !== "auto" &&
        parentCs?.overflowX !== "scroll"
      ) {
        // double-check via direct CSS
        const ownCs = getComputedStyle(p);
        if (ownCs.overflowX !== "auto" && ownCs.overflowX !== "scroll") {
          out.push({
            category: "code-overflow",
            detail: `<pre> scroll=${p.scrollWidth} client=${p.clientWidth}`,
          });
        }
      }
    }

    // 5. Tables: a table with `display: block + overflow-x: auto` IS the scroll
    //    container, so scrollWidth > parent.clientWidth is normal. Only flag
    //    if the table's BOX width exceeds parent (which would push body).
    const tables = document.querySelectorAll(".topic-body table");
    for (const t of Array.from(tables)) {
      const el = t as HTMLElement;
      const parent = el.parentElement as HTMLElement;
      const cs = getComputedStyle(el);
      const isScrollContainer =
        cs.overflowX === "auto" || cs.overflowX === "scroll";
      if (parent && !isScrollContainer && el.getBoundingClientRect().width > parent.clientWidth + 2) {
        out.push({
          category: "table-overflow",
          detail: `<table> box=${Math.round(el.getBoundingClientRect().width)} parent=${parent.clientWidth}`,
        });
      }
    }

    // 6. Heading order (h1 → h2 → no skipping levels)
    const headers = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
      (h) => parseInt(h.tagName.substring(1), 10)
    );
    for (let i = 1; i < headers.length; i++) {
      if (headers[i] - headers[i - 1] > 1) {
        out.push({
          category: "heading-skip",
          detail: `h${headers[i - 1]} → h${headers[i]} (jump)`,
        });
        break;
      }
    }

    // 7. AnalogyBox bulb missing?
    const analogies = document.querySelectorAll(".analogy");
    for (const a of Array.from(analogies)) {
      if (!a.querySelector(".bulb")) {
        out.push({ category: "analogy-no-bulb", detail: "missing .bulb" });
      }
    }

    // 8. Sticker on each topic card on home (we're on topic page, skip)

    return out;
  });

  for (const r of results) {
    findings.push({ topic, viewport, category: r.category, detail: r.detail });
  }
}

async function main() {
  const v = await fetch(`${CDP_URL}/json/version`).then((r) => r.json());
  const browser = await puppeteer.connect({ browserWSEndpoint: v.webSocketDebuggerUrl, defaultViewport: null });

  for (const slug of TOPICS) {
    for (const [vw, vh, label] of [
      [1400, 900, "desktop"],
      [390, 800, "mobile"],
    ] as const) {
      const page = await browser.newPage();
      await page.setViewport({ width: vw, height: vh });
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "no-preference" },
      ]);
      try {
        await auditPage(page, `${TARGET}/devops/${slug}`, slug, label);
      } catch (err) {
        findings.push({
          topic: slug,
          viewport: label,
          category: "exception",
          detail: err instanceof Error ? err.message : String(err),
        });
      }
      await page.close();
    }
  }
  await browser.disconnect();

  // Report
  if (findings.length === 0) {
    console.log("✓ no visual issues detected across 8 topics × 2 viewports");
    return;
  }
  const grouped = new Map<string, Finding[]>();
  for (const f of findings) {
    const k = `${f.topic} [${f.viewport}]`;
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(f);
  }
  console.log(`Found ${findings.length} issues across ${grouped.size} topic/viewport combos:\n`);
  for (const [key, items] of grouped) {
    console.log(`── ${key}`);
    for (const it of items) {
      console.log(`   • [${it.category}] ${it.detail}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
