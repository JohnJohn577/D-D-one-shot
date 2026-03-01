# The Road Beyond Home (Chapter 1 MVP)

A solo, browser-based narrative RPG prototype built with plain HTML/CSS/JS and chapter content loaded from JSON.

## What this includes

- Single-page story UI (chapter title, scene image, story text, choices, roll log).
- Preset level 1 Fighter protagonist.
- d20 rolling with advantage/disadvantage and visible breakdowns.
- Skill checks with branching outcomes.
- Minimal SRD-style combat flow (player first, then enemy).
- Gentle defeat path (no game over): if HP hits 0, story continues.
- Reset Chapter button to restart Chapter 1 from the beginning.

## Run locally

Because chapter content is loaded with `fetch`, running from `file://` can fail in most browsers.

### Option A: Open directly

- Open `index.html` in your browser.
- This may fail to load chapter JSON due to browser `fetch` security rules.

### Option B: Use a tiny local server (recommended)

From the repository root:

- Node.js (`npx`):
  - `npx http-server -p 8080`
- Python 3:
  - `python3 -m http.server 8080`

Then open:

- `http://localhost:8080`

## Add future chapters

1. Add a new chapter JSON file under `content/chapters/` (for example `ch02.json`).
2. Keep the same schema shape (`chapterId`, `title`, `startSceneId`, `scenes`, `enemies`).
3. In `main.js`, change `loadChapter("ch01")` to the desired chapter id.

This allows scaling by content files without rewriting the engine.

## SRD attribution

See `content/srd/attribution.txt` for the required SRD 5.2.1 attribution text.
