# Zaal vs Germs: notes for agents

A browser game that Ashkan is building with his son Zaal (7). Zaal co-designs every level. Read this before changing anything or starting a new level.

## Who it's for, and the design rules

- **Zaal is 7, clever and well-read about the body.** He checks the facts, so every body fact must be accurate. Pitch the language for a bright 7-year-old and keep the maths slightly above his age (it adapts on its own).
- **Tone: gross, realistic and funny.** Think Osmosis Jones, not horror. Poo, farts, snot and burps are welcome. Use real medical terms with "say it like" pronunciations.
- **Gameplay is The Lost Vikings plus Lemmings.** There are 3 heroes with different powers and you switch between them. Rescue "walkers" (red blood cells in Level 1, good bacteria in Level 2) walk by themselves and turn around when they bump into a hero standing still.
- **Every power costs a maths problem.** "💡 Show me how" teaches the method. A wrong answer has a funny, harmless effect, never a punishing one.
- **Forgiving and gentle.** Zaal did **not** like the rising acid timer in Level 1. Don't add game-over timers. Use gentle, funny pressure instead (the brain chatting from "upstairs", squeeze waves that only make heroes hop). Lost walkers go back to the start for another go.
- **Each level follows the same shape:** title screen → fly-in through the body (captions, organ labels, the patient faces us so *their* right is *our* left) → story pages with tappable glossary words, read aloud → "Meet your team" → mission page → the level → a finale or celebration → an end screen with a fact list and the **secret code** for the next level.
- British spelling (haemoglobin, diarrhoea, oesophagus).
- **Discuss ideas with the user before building.** Pitch 2–3 concepts with a recommendation, ask Zaal's questions, write a plan, then build.

## Level codes

| Code | Opens | Shown when you finish |
|---|---|---|
| GERM | Level 1 · The Bleeding Ulcer (stomach, H. pylori) | |
| PLOP | Level 2 · The Great Poo Escape (colon, C. diff) | Level 1 |
| BURP | Level 3 · Wart Undercover (palm of Zaal's left hand, HPV) | Level 2 |
| GOOP | Level 4 · Snot Storm (inside Dad's nose, rhinovirus) | Level 3 |
| ITCH | Level 5 (not built yet) | Level 4 |

The URL hash picks the level (`index.html#PLOP`). The title screen's 🔑 Enter code box sets the hash and reloads.

## Files and architecture

- `index.html`: styles, overlays (fly-in, story, maths, glossary, end screen) and the script tags. `voice/index.js` loads first, then `engine.js`, then the `levelN.js` files, then `boot()`.
- `engine.js`: the shared parts. Grid physics (`T=24`, a 40×22 grid, fixed 60 fps step), speech, sound, glossary, maths, the hero/germ/walker helpers, the HUD, story pages, the fly-in and scene system, input, level codes and `boot()`.
- `levelN.js`: `LEVELS[n] = (() => { ...; return {...}; })();`. Each level is a closure, so two levels can use the same internal names. It returns:
  - `num, code, award, title, facts, exit, escort: {total, need, color}`
  - `solid(tile)`, `reset()`, `usePower(hero)`, `update(dt)`, `render(ctx)`, `renderBackground(c)`, `renderTerrain(c)`
  - `story` (HTML pages), `fly` (route steps), `flyExtras(c, z)` (level-specific drawing on the body map), and optionally `finale` (scene steps) and `lines` (extra speakable strings)
  - `onStart()`, `onRelease()`, and optionally `dbg()`, which exposes private state for testing
- Shared helpers a level should reuse: `makeHero`, `makeGerm`, `updateHeroes(dt, after, pre)`, `updateGerms(dt, special)`, `spawnWalkers`, `walkStep`, `updateParticles`, `nearestGerm`, `gapCells`, `fillCells`, `drawHeroes`, `drawParts`, `drawFloats`, `hudTop`, `hudBottom`, `showEnd(title, html, award)`, `fact(key)`, `say(entity, text)`, `speak(html)`, `openMath(prompt, onRight, onWrong)`, and `flyStart(steps, done)` for cut-scenes. A scene step is `{ text, dur, draw(c, t), onShow }`.
- Add new glossary words with `Object.assign(GLOSS, {...})` and portraits with `Object.assign(IMG, {...})`, using keys no other level uses.

## Adding a level: checklist

1. Agree the concept and plan with the user first (see the design rules above).
2. Copy the shape of `level2.js`: constants, `FACTS`, `GLOSS` additions, `buildGrid`, `solid`, `reset`, powers, update, drawing, story, fly route, return object. Give it `code` (the previous level's `award`) and a new `award`.
3. Add `<script src="levelN.js">` to `index.html`.
4. **Check that every puzzle can be solved in the obvious way, with no way to get stuck.** Try every order the player might take (see the lessons below).
5. Re-record the voice (next section). Add any new sound effects to `sfx/` and `SAMPLES` in `engine.js`, with credits.
6. Test (see Testing), then commit.

## Voice and sound

- **Voice:** every fixed line is pre-recorded with Kokoro (British voice `bf_emma`) as `voice/<hash>.m4a`. That covers story pages, fly captions, scene captions, `Body fact! …`, glossary entries, `Brain says: …`, praise and level codes. A clip is keyed by an FNV hash of its **exact spoken text** (`voiceKey(speechText(html))`). Any line without a clip, such as maths questions or a line you just edited, falls back to the browser voice.
- **After adding or editing any spoken text:** open the game served over http and run `JSON.stringify(allSpeech())` in the browser. Save the result as `tools/voice/lines.json` (a JSON array, not a quoted string), then run:
  `tools/voice/.venv/bin/python tools/voice/render.py tools/voice/lines.json`
  It only renders missing clips, at about 2 s each. Afterwards, delete clips that are no longer in `lines.json` and regenerate `voice/index.js`.
- Mispronounced words go in `SAY_AS` in `render.py` (e.g. "C. diff" → "see diff").
- The tooling setup: a Python 3.12 venv made with `uv` (the system Python is 3.9 and too old for kokoro-onnx), plus the int8 model in `tools/voice/models/`. Both are git-ignored. To recreate them: `~/Library/Python/3.9/bin/uv venv --python 3.12 tools/voice/.venv && uv pip install --python tools/voice/.venv/bin/python kokoro-onnx soundfile`, then download `kokoro-v1.0.int8.onnx` and `voices-v1.0.bin` from the kokoro-onnx GitHub release `model-files-v1.0`. In cloud (Linux) sessions `tools/voice/setup.sh` does all of this; the SessionStart hook in `.claude/settings.json` runs it automatically. On Linux `render.py` uses `ffmpeg` instead of `afconvert` to make the m4a clips.
- **Sound effects:** CC0 clips from Freesound (preview MP3s download without a login) in `sfx/`, credited in `sfx/CREDITS.md`. They play through plain `Audio` elements, so they work from `file://`. Each has a synth fallback in `sfx()`. Only use files whose own page says CC0, and ask the user before downloading anything new.
- Chrome sometimes never fires `onend` for long browser speech. The speech queue has a watchdog timer for this, so keep it.

## Testing

- **Zaal plays it by double-clicking `index.html` (`file://`).** Keep it that way: classic `<script src>` tags only, no ES modules, no `fetch()` of game data.
- To test, serve the folder: `python3 -m http.server 8765 --bind 127.0.0.1 --directory <game folder>`, run in the background from Bash. A launch config can't start it because the desktop's privacy settings block it.
- The desktop browser pane shows `file://` pages as static snapshots, and when the pane is hidden it throttles animation and stops repainting, so screenshots there go stale. **Use the headless Playwright tools for screenshots and scripted tests.**
- The http server sends no cache headers, so edited files can be served stale. Before reloading, run `fetch(f, {cache: 'reload'})` for each changed file.
- A scripted test pattern (in `browser_evaluate`):
  - Set `readAloud = false; muted = true`, then `document.getElementById('btnJourney').click(); flyEnd(); startGame();`.
  - `const run = n => { for (let i = 0; i < n; i++) { paused = false; update(STEP); } }` advances the game.
  - Answer a maths problem with `mathCtx.typed = String(mathCtx.p.a); submitMath();`, then wait 1 s.
  - Place heroes by setting `x`/`y` directly, and press keys with `keys.right = true`.
  - Use `LV.dbg()` to read private level state.
- Before calling a level done, test: every power, each puzzle in every order, a full walk of all walkers from the release point to home, the win → finale → end screen with its code, the "Next level" button, a wrong code, and Level 1 still working.

## Lessons learned

- **A level-local function named like an engine function hides the engine's version** inside that level. Name level painters `paintTerrain`/`paintBackground` and map them in the return object (`renderTerrain: paintTerrain`). Calling `renderTerrain()` from inside a level must reach the engine's version.
- **Push puzzles must work in the natural direction.** A boulder that could only be pushed from its far side (from the bare-wall side, back towards the crack) was unsolvable for the players. Put pushable objects on the side you approach from, let rows of them move together, and add a hint until the puzzle is done.
- **Don't let hazards or waves move parked heroes.** A squeeze wave that shoved heroes pushed the "walls" into the walkers' path and broke the Lemmings puzzle. Waves now only make heroes hop.
- Walkers step up 1-tile ledges on their own (`canStep`). To stop them, a wall must be at least 2 tiles high. `gapCells` bridges at most 4 tiles.
- Watch for overlapping labels (crapsule text vs. ceiling folds, sphincter labels vs. the bare-wall sign). Screenshot every new layout.
- Fact cards cover part of the screen for 12 s. Place them per level (`#facts.lvN` in CSS) away from where the action starts.
- The end panel overflows when a level adds art. `#end .panel` scrolls and has a max height, so keep fact lists short.
- **Parked heroes anywhere on the walkers' path block it.** Give each level off-path parking spots (Level 3: left of the lymph vessel, and inside the King's chamber) and test a full walk with every hero parked.
- If the Playwright MCP browser is locked by another session, drive the installed Chrome with the cached `playwright` package in `~/.npm/_npx/*/node_modules/playwright` (`chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })`).
- Test in this order: refactor with no change in behaviour → verify Level 1 → add the new level. Commit after each step (the folder is a git repo).

## Working agreements

- Give mechanical, well-defined jobs (rendering audio, finding or converting assets, bulk edits, scripted checks) to **Sonnet subagents**. Keep design, game feel and fact accuracy in the main session, and verify subagent output before reporting it.
- Commit after each working step, with clear messages.
- Ask the user before downloading new files or installing software.
