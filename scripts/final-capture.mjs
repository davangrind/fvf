import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 320, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.clock.install();
await page.goto("http://localhost:5173/battle/season-01");
console.log(
  "narrow",
  await page.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .map((el) => ({
        cls: el.className,
        tag: el.tagName,
        right: el.getBoundingClientRect().right,
        width: el.getBoundingClientRect().width,
      }))
      .filter((e) => e.right > innerWidth + 1 && e.width),
  ),
);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://localhost:5173/battle/season-01", {
  waitUntil: "networkidle",
});
await page
  .getByRole("button", { name: "Simulate $25K in fees" })
  .first()
  .click();
await page.getByRole("button", { name: "Fast-forward finale" }).click();
await page
  .locator(".arena")
  .screenshot({ path: "artifacts/screenshots/finale-warning.png" });
await page.clock.runFor(9500);
await expect(page.locator(".arena")).toHaveClass(/phase-fighting/);
await page
  .locator(".arena")
  .screenshot({ path: "artifacts/screenshots/finale-combat.png" });
await page.clock.runFor(10000);
await expect(page.locator(".arena")).toHaveClass(/phase-finished/);
await page
  .locator(".arena")
  .screenshot({ path: "artifacts/screenshots/finale-winner.png" });
await context.close();
await browser.close();
