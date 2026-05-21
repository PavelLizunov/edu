/**
 * End-to-end QA against https://edu.ninitux.com using puppeteer-core connected
 * to the headless-chrome container on 192.168.0.142:9222.
 *
 * Run: bun run scripts/qa.ts
 */
import puppeteer, { type Browser, type Page } from "puppeteer-core";
import { promises as fs } from "node:fs";
import path from "node:path";

const TARGET = process.env.EDU_URL ?? "https://edu.ninitux.com";
const CDP_URL = process.env.CDP_URL ?? "http://192.168.0.142:9222";
const OUT_DIR = "/tmp/edu-qa";

const TOPICS = [
  "ansible-docker",
  "terraform",
  "kubernetes",
  "networking",
  "tls",
  "postgresql",
  "mongodb",
  "elk",
] as const;

const results: Array<{ name: string; ok: boolean; note?: string }> = [];
let browser: Browser;

function ok(name: string, note?: string) {
  results.push({ name, ok: true, note });
  console.log(`✓ ${name}${note ? ` — ${note}` : ""}`);
}

function fail(name: string, note: string) {
  results.push({ name, ok: false, note });
  console.log(`✗ ${name} — ${note}`);
}

async function connect() {
  const versionRes = await fetch(`${CDP_URL}/json/version`);
  const version = (await versionRes.json()) as { webSocketDebuggerUrl: string };
  browser = await puppeteer.connect({
    browserWSEndpoint: version.webSocketDebuggerUrl,
    defaultViewport: null,
  });
  console.log(`connected to chromium @ ${CDP_URL}`);
}

async function newPage(width = 1400, height = 900, lang = "ru-RU"): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.setExtraHTTPHeaders({ "Accept-Language": `${lang},${lang.split("-")[0]};q=0.9` });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  return page;
}

async function shot(page: Page, name: string) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`) as `${string}.png`,
    fullPage: false,
  });
}

// ──────────────────────────────────────────────────────────────────────────────

async function testMarqueeAnimates() {
  const page = await newPage(1400, 220);
  await page.goto(TARGET, { waitUntil: "networkidle2" });
  const x1 = await page.$eval(".marquee .track", (el) => {
    const m = getComputedStyle(el).transform.match(/matrix\(([^)]+)\)/);
    return m ? Number(m[1].split(",")[4]) : 0;
  });
  await new Promise((r) => setTimeout(r, 2500));
  const x2 = await page.$eval(".marquee .track", (el) => {
    const m = getComputedStyle(el).transform.match(/matrix\(([^)]+)\)/);
    return m ? Number(m[1].split(",")[4]) : 0;
  });
  if (Math.abs(x2 - x1) > 5) {
    ok("marquee animates", `Δx = ${(x2 - x1).toFixed(1)}px in 2.5s`);
  } else {
    fail("marquee animates", `Δx = ${(x2 - x1).toFixed(1)}px (animation stalled)`);
  }
  await shot(page, "01-marquee");
  await page.close();
}

async function testTopbarSticky() {
  const page = await newPage(1400, 900);
  await page.goto(TARGET, { waitUntil: "networkidle2" });

  const topbarTop0 = await page.$eval(".topbar", (el) => el.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 200));
  const topbarTopAfter = await page.$eval(".topbar", (el) => el.getBoundingClientRect().top);

  if (Math.abs(topbarTopAfter) <= 2) {
    ok("topbar sticks at top after scroll", `top = ${topbarTopAfter.toFixed(1)}px (was ${topbarTop0.toFixed(1)}px)`);
  } else {
    fail("topbar sticks at top after scroll", `top = ${topbarTopAfter.toFixed(1)}px — should be ~0`);
  }
  await shot(page, "02-topbar-sticky");
  await page.close();
}

async function testAllTopicsRender() {
  const page = await newPage(1400, 900);
  for (const slug of TOPICS) {
    const url = `${TARGET}/devops/${slug}`;
    const res = await page.goto(url, { waitUntil: "networkidle2" });
    const status = res?.status() ?? 0;
    // 200 = fresh, 304 = cached, both indicate route serves OK
    if (status !== 200 && status !== 304) {
      fail(`topic ${slug}`, `HTTP ${status}`);
      continue;
    }
    const hasAnalogy = await page.$(".analogy") !== null;
    const hasH1 = await page.$eval("h1", (h) => h.textContent?.includes("#") ?? false);
    if (hasAnalogy && hasH1) {
      ok(`topic /devops/${slug}`, "h1 with hash + analogy block present");
    } else {
      fail(`topic /devops/${slug}`, `analogy=${hasAnalogy} h1=${hasH1}`);
    }
  }
  await page.close();
}

async function testQuizInteraction() {
  const page = await newPage(1400, 1200);
  await page.goto(`${TARGET}/devops/kubernetes`, { waitUntil: "networkidle2" });
  // Scope to FIRST quiz only — topic pages now have multiple quizzes.
  // :first-of-type matches the first element of the SAME TAG TYPE among
  // siblings, not the first match of a class — so we use the array form.
  const quizzes = await page.$$(".quiz");
  if (quizzes.length === 0) {
    fail("quiz initial state", "no .quiz found on page");
    await page.close();
    return;
  }
  const firstQuiz = quizzes[0];
  await firstQuiz.evaluate((el) => el.scrollIntoView({ block: "center" }));

  const optsBefore = await firstQuiz.$$eval(".opt", (els) =>
    els.map((e) => ({ disabled: (e as HTMLButtonElement).disabled, state: e.getAttribute("data-state") }))
  );
  if (optsBefore.every((o) => !o.disabled && o.state === null)) {
    ok("quiz initial state", `${optsBefore.length} options, all enabled, no state`);
  } else {
    fail("quiz initial state", JSON.stringify(optsBefore));
  }

  const firstOpt = await firstQuiz.$(".opt:nth-of-type(1)");
  if (!firstOpt) {
    fail("quiz after click", "no .opt:nth-of-type(1) found in first quiz");
    await page.close();
    return;
  }
  await firstOpt.click();
  await new Promise((r) => setTimeout(r, 300));

  const optsAfter = await firstQuiz.$$eval(".opt", (els) =>
    els.map((e) => ({ disabled: (e as HTMLButtonElement).disabled, state: e.getAttribute("data-state") }))
  );
  const explainVisible = await firstQuiz
    .$eval(".explain", (el) => !el.hasAttribute("hidden"))
    .catch(() => false);
  const someCorrect = optsAfter.some((o) => o.state === "correct");
  const allDisabled = optsAfter.every((o) => o.disabled);
  if (someCorrect && allDisabled && explainVisible) {
    ok("quiz after click", `correct revealed, all disabled, explain visible`);
  } else {
    fail("quiz after click", `correct=${someCorrect} disabled=${allDisabled} explain=${explainVisible}`);
  }
  await shot(page, "03-quiz-answered");
  await page.close();
}

async function testCopyButton() {
  const page = await newPage(1400, 1200);
  // Grant clipboard permission to the page origin so navigator.clipboard works
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(TARGET, ["clipboard-read", "clipboard-write"]);
  await page.goto(`${TARGET}/devops/kubernetes`, { waitUntil: "networkidle2" });
  await page.$eval(".code .copy", (el) => el.scrollIntoView({ block: "center" }));
  await page.click(".code .copy");
  await new Promise((r) => setTimeout(r, 200));
  const label = await page.$eval(".code .copy", (el) => el.textContent ?? "");
  if (label.toLowerCase().includes("cop")) {
    ok("copy button feedback", `button text now: "${label}"`);
  } else {
    fail("copy button feedback", `expected feedback, got: "${label}"`);
  }
  await page.close();
}

async function testLangToggle() {
  const page = await newPage(1400, 900);
  await page.goto(TARGET, { waitUntil: "networkidle2" });
  // Give the client a moment to hydrate + LangProvider/LangToggle effects to run
  await new Promise((r) => setTimeout(r, 600));
  const langBefore = await page.$eval("html", (h) => h.getAttribute("data-lang"));
  const otherLang = langBefore === "ru" ? "en" : "ru";
  await page.evaluate((label) => {
    const btns = Array.from(
      document.querySelectorAll(".lang-seg button")
    ) as HTMLButtonElement[];
    const target = btns.find((b) => b.textContent?.trim().toLowerCase() === label);
    target?.click();
  }, otherLang);
  await new Promise((r) => setTimeout(r, 300));
  const langAfter = await page.$eval("html", (h) => h.getAttribute("data-lang"));
  if (langAfter === otherLang) {
    ok("RU/EN toggle", `${langBefore} → ${langAfter}`);
  } else {
    fail("RU/EN toggle", `before=${langBefore} after=${langAfter} (wanted ${otherLang})`);
  }
  await page.close();
}

async function testMobileDrawer() {
  const page = await newPage(390, 800);
  await page.goto(TARGET, { waitUntil: "networkidle2" });
  // Mobile drawer button should be visible at this width
  const drawerOpenBtn = await page.$(".nav-mobile button");
  if (!drawerOpenBtn) {
    fail("mobile drawer", "no .nav-mobile button at 390px width");
    await page.close();
    return;
  }
  await drawerOpenBtn.click();
  await new Promise((r) => setTimeout(r, 200));
  const drawer = await page.$(".mobile-drawer-bg");
  if (drawer) {
    ok("mobile drawer opens", "drawer-bg present");
  } else {
    fail("mobile drawer opens", "no .mobile-drawer-bg after click");
  }
  // Test Esc to close
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 200));
  const drawerStill = await page.$(".mobile-drawer-bg");
  if (!drawerStill) {
    ok("mobile drawer Esc-closes", "drawer gone after Esc");
  } else {
    fail("mobile drawer Esc-closes", "still present");
  }
  await shot(page, "04-mobile");
  await page.close();
}

async function testFontsCyrillic() {
  const page = await newPage(1400, 900);
  await page.goto(TARGET, { waitUntil: "networkidle2" });
  const heroFont = await page.$eval(".hero h1", (el) =>
    getComputedStyle(el).fontFamily
  );
  const bodyFont = await page.$eval(".hero .lede", (el) =>
    getComputedStyle(el).fontFamily
  );
  const heroOk = /Unbounded|font-display/i.test(heroFont) || heroFont.includes("Unbounded");
  const bodyOk = /Manrope|font-sans-loaded/i.test(bodyFont) || bodyFont.includes("Manrope");
  if (heroOk && bodyOk) {
    ok("Cyrillic fonts", `hero=${heroFont.split(",")[0]}, body=${bodyFont.split(",")[0]}`);
  } else {
    fail("Cyrillic fonts", `hero=${heroFont}, body=${bodyFont}`);
  }
  await page.close();
}

async function testConsoleErrors() {
  const page = await newPage(1400, 900);
  const errors: string[] = [];
  page.on("pageerror", (err: Error) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto(TARGET, { waitUntil: "networkidle2" });
  await page.goto(`${TARGET}/devops/kubernetes`, { waitUntil: "networkidle2" });
  if (errors.length === 0) {
    ok("no console errors", "0 errors across home + kubernetes");
  } else {
    fail("no console errors", `${errors.length}: ${errors.slice(0, 3).join(" | ")}`);
  }
  await page.close();
}

async function main() {
  await connect();
  try {
    await testMarqueeAnimates();
    await testTopbarSticky();
    await testAllTopicsRender();
    await testQuizInteraction();
    await testCopyButton();
    await testLangToggle();
    await testMobileDrawer();
    await testFontsCyrillic();
    await testConsoleErrors();
  } finally {
    await browser.disconnect();
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n──────── ${passed} passed · ${failed} failed ────────`);
  if (failed > 0) {
    console.log("\nFailures:");
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  ✗ ${r.name} — ${r.note}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
