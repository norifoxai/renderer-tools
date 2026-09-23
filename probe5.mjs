import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
const d = await page.evaluate(() => {
  // use __bones probe if exists, else use setPose override trick: set leftUpperArm override and read rightHand report
  const r1 = window.__setPose('leftUpperArm', 0, 0, 0);
  return { r1, humanoidBones: window.__glbDebug.humanoidBones };
});
console.log(JSON.stringify(d).slice(0, 600));
await browser.close();
process.exit(0);
