import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
await page.waitForTimeout(500);
// probe: what do the RAW upper arm bone quaternions hold? Set override 0 and compare raw bone world pos with/without.
// We can't reach bones directly, but __boneLocal uses bones map (raw). After override z=0:
await page.evaluate(() => window.__setPose('leftUpperArm', 0, 0, 0));
await page.waitForTimeout(300);
const a = await page.evaluate(() => window.__boneLocal(['upperarm_l','lowerarm_l']));
// now set override to a known quaternion and check __boneLocal raw delta again:
await page.evaluate(() => window.__setPose('leftUpperArm', 0, 0, 30));
await page.waitForTimeout(300);
const b = await page.evaluate(() => window.__boneLocal(['upperarm_l','lowerarm_l']));
console.log('raw local angle, override z=0:', JSON.stringify(a));
console.log('raw local angle, override z=30:', JSON.stringify(b));
await browser.close();
process.exit(0);
