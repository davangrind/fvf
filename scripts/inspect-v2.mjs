import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.FVF_TEST_URL ?? "http://localhost:5173";
await mkdir("artifacts/v2", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
for (const width of [1440, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: width === 1440 ? 1000 : 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const [name, path] of [
    ["home", "/"],
    ["arena", "/arena"],
    ["lab", "/arena/season-01"],
    ["tokens", "/tokens"],
    ["numbers", "/numbers"],
    ["launch", "/launch"],
    ["docs", "/docs"],
    ["token", "/tokens/demo-brain"],
  ]) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `artifacts/v2/${name}-${width}.png`,
      fullPage: name !== "docs",
    });
    await page.screenshot({
      path: `artifacts/v2/${name}-${width}-viewport.png`,
    });
    const layout = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: innerWidth,
      heading: document.querySelector("h1")?.textContent,
      headingsWithPeriods: [...document.querySelectorAll("h1,h2,h3")]
        .filter((e) => /\.$/.test(e.textContent.trim()))
        .map((e) => e.textContent),
      emoji: [...document.querySelectorAll("main,header,footer")]
        .map((e) => e.textContent)
        .join(" ")
        .match(/[\u{1F300}-\u{1FAFF}\u2700-\u27BF\u2190-\u21FF]/gu),
    }));
    results.push({ name, width, ...layout, errors: [...errors] });
  }
  await page.goto(base + "/");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.screenshot({
    path: `artifacts/v2/home-light-${width}.png`,
    fullPage: true,
  });
  await context.close();
}
await writeFile(
  "artifacts/v2/inspection.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
await browser.close();
