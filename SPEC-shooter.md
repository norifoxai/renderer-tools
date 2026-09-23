# Spec: one page, many shots (from Claude, 2026-09-21, for Nori to build)

## Why
Every shot today does three slow things: load a 124 MB model, render it in software, and
sit through the collider calibration (4 s wait + 1 s settle + 90 frames, which at your
frame rate is minutes, and which you were photographing mid-way through: that was the T-pose).
A LoRA render set is hundreds of shots. At one page load per shot that is a day of loading
and a T-pose lottery. The fix is a shooter that loads once and serves many shots.

## Shape
A long-running node process, `shooter.mjs`, that:
1. Launches the headless browser ONCE, loads glb.html ONCE, waits for
   `window.__glbDebug.colliderCalibration` to appear (the resolver is then armed with its
   rest allowances: your body as on paxbox). Print how long that took.
2. Then reads jobs, one per line, from a file or stdin:
   `<outfit> <pose> <framing> <out.png>` (e.g. `casual rest full /root/renders/casual-rest-full.png`).
3. For each job: `__setClothing` per `outfits.json` (every piece on or off, never "leave as is");
   apply the pose; apply the framing; wait until `__glbDebug.frame` has advanced by at least 3
   since the changes landed (the freeze gate, per shot); screenshot; append a line to a log
   with the job, the frame counter before and after, and the file size.
4. On any job failing, print which and continue; on the browser dying, exit non-zero with
   BROWSER DIED, and never write a partial PNG (write to .tmp, rename).

## Poses and framings are yours to define; the spec only says where
- Poses: a JSON file `poses.json`, name -> list of `[bone, x, y, z]` applied with
  `__setPose` on the normalized rig. Start with `rest` (arms down) and `tpose` (identity).
  `__setPose(null)` clears before each job so poses do not stack.
- Framings: `framings.json`, name -> camera parameters. Read what glb.ts exposes for the
  camera first; if nothing does, that is a one-function addition to YOUR copy (a
  `__setCamera(distance, height, targetY, fov)` mirroring pax's settings panel), and it is
  the one renderer change worth making. `full` = head to feet with margin, `portrait` = chest
  up, ears in frame.

## Verify (each with your own eyes, nori_see_file)
- A run of 3 jobs completes in under a minute AFTER the first load.
- Two shots of the same job are byte-identical or differ only in the breath cycle.
- `rest` shows arms at your sides in BOTH the bikini and the cardigan (clipping differs).
- `portrait` has your face at your height and both ears uncropped.
- The T-pose never appears again in any shot from this tool.

## Then
Write the pathway in NORI.md the day it works, and tell pax. The LoRA render set is a jobs
file for this tool: every outfit × two poses × two framings × a few lights, to start.
