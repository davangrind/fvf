import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const [name, path] of [
    ["home", "/"],
    ["battle", "/battle/season-01"],
    ["launch", "/launch"],
    ["tokens", "/tokens"],
    ["activity", "/activity"],
    ["docs", "/docs"],
  ]) {
    await page.goto("http://localhost:5173" + path, {
      waitUntil: "networkidle",
    });
    await page.screenshot({
      path: `artifacts/screenshots/${name}-${viewport.width}.png`,
      fullPage: true,
    });
    await page.screenshot({
      path: `artifacts/screenshots/${name}-${viewport.width}-viewport.png`,
    });
    const layout = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: innerWidth,
      overflows: [...document.querySelectorAll("main *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width &&
            r.right > innerWidth + 2 &&
            getComputedStyle(el).position !== "absolute"
          );
        })
        .map((el) => el.className)
        .slice(0, 10),
    }));
    results.push({
      name,
      width: viewport.width,
      ...layout,
      errors: [...errors],
    });
  }
  await context.close();
}
await writeFile("artifacts/inspection.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
