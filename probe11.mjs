import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
await page.waitForTimeout(500);
const d = await page.evaluate(() => {
  // reach into the scene: THREE is bundled, not global. But objects are reachable via __paint? No.
  // Use __bonesList? Not exposed. Try walking from a known exposed object: none exposes scene.
  // Alternative: __setPose a big head turn and see if rightHand... no. Use __boneLocal on raw names after override:
  window.__setPose('rightUpperArm', 0, 0, 60);
  return true;
});
await page.waitForTimeout(400);
const d2 = await page.evaluate(() => {
  const loc = window.__boneLocal(['upperarm_r','lowerarm_r','hand_r','upperarm_l']);
  return { loc, rh: window.__glbDebug.rightHand };
});
console.log(JSON.stringify(d2));
await browser.close();
process.exit(0);
