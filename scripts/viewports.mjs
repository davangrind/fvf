import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const report = [];
for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  for (const path of [
    "/",
    "/battle/season-01",
    "/launch",
    "/tokens",
    "/activity",
    "/docs",
  ]) {
    await page.goto("http://localhost:5173" + path, {
      waitUntil: "networkidle",
    });
    const dimensions = await page.evaluate(() => ({
      viewport: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    report.push({ path, width, ...dimensions });
  }
  if (width === 320 || width === 768) {
    await page.goto("http://localhost:5173/");
    await page.screenshot({
      path: `artifacts/screenshots/home-${width}-viewport.png`,
    });
  }
  await context.close();
}
await browser.close();
await writeFile("artifacts/viewports.json", JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      checked: report.length,
      failures: report.filter((r) => r.scroll > r.viewport),
    },
    null,
    2,
  ),
);
