import { chromium, webkit } from '@playwright/test';
const base=process.env.FVF_TEST_URL??'http://localhost:4173';
const browser=await chromium.launch({headless:true});
for(const width of [320,768,1440]){
 const page=await browser.newPage({viewport:{width,height:width===320?1000:1050},reducedMotion:'reduce'});
 await page.goto(base+'/arena/season-01',{waitUntil:'networkidle'});
 await page.locator('.lab-stage').screenshot({path:`artifacts/v2/lab-scene-${width}.png`});
 if(width===1440){
  await page.getByLabel('Scrub through the mutations').fill('4');
  await page.locator('.lab-stage').screenshot({path:'artifacts/v2/fly-stage-5.png'});
  await page.locator('.mutation-panel').getByRole('button',{name:'Astra',exact:true}).click();
  await page.getByLabel('Scrub through the mutations').fill('4');
  await page.locator('.lab-stage').screenshot({path:'artifacts/v2/astra-stage-5.png'});
  await page.goto(base+'/docs#fee-flow',{waitUntil:'networkidle'});
  await page.locator('.fee-flow').screenshot({path:'artifacts/v2/fee-flow.png'});
 }
 await page.close();
}
await browser.close();
const safari=await webkit.launch({headless:true});
const page=await safari.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await page.goto(base+'/arena/season-01',{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/v2/lab-webkit.png'});
await safari.close();
console.log('Lab stages, narrow/tablet layouts, fee flow and WebKit captured');
