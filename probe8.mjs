import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
await page.waitForTimeout(1000);
const d = await page.evaluate(() => {
  const out = {};
  // __bonepos style probe exists? try __rigExport lightly: it's heavy. Use setPose override to see if rightHand report appears (proves override path runs)
  window.__setPose('rightUpperArm', 0, 0, 0);
  return out;
});
await page.waitForTimeout(500);
const d2 = await page.evaluate(() => ({ rightHand: window.__glbDebug.rightHand, frame: window.__glbDebug.frame }));
console.log('rightHand after override:', JSON.stringify(d2));
await browser.close();
process.exit(0);
