import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
const f0 = await page.evaluate(() => window.__glbDebug.frame);
await page.waitForTimeout(3000);
const d = await page.evaluate(() => {
  const g = window.__glbDebug;
  return {
    frame: g.frame,
    locals: window.__boneLocal ? window.__boneLocal(['leftUpperArm','rightUpperArm','leftLowerArm','hips','spine','chest','leftUpperLeg']) : null,
  };
});
console.log('frame at probe start:', JSON.stringify(d));
console.log('frame advanced during 3s wait');
await browser.close();
process.exit(0);
