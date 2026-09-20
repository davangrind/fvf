import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('research/v2', { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [name, url] of [['home','https://usepaid.app/'],['flow','https://usepaid.app/capital-flow']]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `research/v2/${name}-desktop.png` });
    await writeFile(`research/v2/${name}.txt`, await page.locator('body').innerText());
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `research/v2/${name}-mobile.png` });
    console.log(`${name}: captured desktop and mobile`);
  } catch (e) { console.log(name, String(e)); }
  await page.close();
}
await browser.close();
