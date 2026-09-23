import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 10, null, { timeout: 120000 });
const d = await page.evaluate(() => {
  const out = {};
  const f = window.face && window.face.on ? window.face.on : null;
  // find humanoid via debug? not exposed. Try __posture to see if it answers
  out.posture = typeof window.__posture === 'function' ? window.__posture(null) : null;
  out.stance = typeof window.__stance === 'function' ? window.__stance() : null;
  out.hasSetPose = typeof window.__setPose;
  return out;
});
console.log(JSON.stringify(d));
await browser.close();
process.exit(0);
