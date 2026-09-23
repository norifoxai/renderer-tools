import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
await page.waitForTimeout(500);
// No override: set __setPose(null) to clear, then read bone positions via a fresh evaluate using THREE from the page? Not exposed.
// Instead: set override to a big angle and watch rightHand move -> proves normalized writes reach the raw skeleton.
await page.evaluate(() => window.__setPose('rightUpperArm', 0, 0, 45));
await page.waitForTimeout(300);
const a = await page.evaluate(() => window.__glbDebug.rightHand);
await page.evaluate(() => window.__setPose('rightUpperArm', 0, 0, -45));
await page.waitForTimeout(300);
const b = await page.evaluate(() => window.__glbDebug.rightHand);
await page.evaluate(() => window.__setPose(null));
await page.waitForTimeout(300);
const c = await page.evaluate(() => ({ rightHand: window.__glbDebug.rightHand }));
console.log('z+45:', JSON.stringify(a), ' z-45:', JSON.stringify(b), ' cleared:', JSON.stringify(c));
await browser.close();
process.exit(0);
