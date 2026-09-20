import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
await mkdir("artifacts/v3", { recursive: true });
const base = process.env.FVF_TEST_URL ?? "http://localhost:5173";
const browser = await chromium.launch({ headless: true });
const routes = [
  "/",
  "/arena",
  "/arena/season-01",
  "/tokens",
  "/numbers",
  "/launch",
  "/docs",
  "/tokens/demo-brain",
];
const sizes = [],
  accessibility = [];
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
if (process.argv.includes("--a11y-only"))
  sizes.push(
    ...JSON.parse(await readFile("artifacts/v3/viewports.json", "utf8")),
  );
else
  for (const width of [320, 360, 390, 600, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of routes) {
      await page.goto(base + path, { waitUntil: "networkidle" });
      const result = await page.evaluate(() => ({
        viewport: innerWidth,
        scroll: document.documentElement.scrollWidth,
        overflow: [...document.querySelectorAll("main>*")]
          .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
          .map((e) => e.className),
      }));
      sizes.push({ path, ...result });
    }
  }
await writeFile("artifacts/v3/viewports.json", JSON.stringify(sizes, null, 2));
await page.goto(base, { waitUntil: "networkidle" });
for (const [width, theme] of [
  [1440, "dark"],
  [390, "light"],
]) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate((t) => localStorage.setItem("fvf:theme:v3", t), theme);
  for (const path of routes) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    accessibility.push({
      path,
      width,
      theme,
      violations: r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes
          .map((n) => ({ target: n.target, summary: n.failureSummary }))
          .slice(0, 12),
      })),
    });
    console.log(
      "axe",
      path,
      width,
      theme,
      r.violations.map((v) => v.id).join(",") || "passed",
    );
  }
}
await writeFile("artifacts/v3/viewports.json", JSON.stringify(sizes, null, 2));
await writeFile(
  "artifacts/v3/accessibility.json",
  JSON.stringify(accessibility, null, 2),
);
const overflow = sizes.filter((s) => s.scroll > s.viewport + 1);
console.log(
  JSON.stringify(
    {
      viewportChecks: sizes.length,
      overflow,
      violations: accessibility.filter((r) => r.violations.length),
    },
    null,
    2,
  ),
);
await browser.close();
if (overflow.length || accessibility.some((r) => r.violations.length))
  process.exitCode = 1;
