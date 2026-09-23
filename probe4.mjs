import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
const d = await page.evaluate(() => {
  const names = window.__glbDebug.boneNames;
  const pick = names.filter(n => /arm|hand|shoulder/i.test(n)).slice(0, 30);
  const loc = window.__boneLocal(['upperarm_l','upperarm_r','lowerarm_l','lowerarm_r']);
  return { count: names.length, pick, loc };
});
console.log(JSON.stringify(d, null, 1));
await browser.close();
process.exit(0);
