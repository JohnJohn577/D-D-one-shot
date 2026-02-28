# D-D-one-shot
A D&D inspired one shot game.

## Run locally
Because chapter data is loaded with `fetch`, run this project from a web server:

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173/` (defaults to chapter `ch01`)
- `http://localhost:4173/?chapter=ch01`

## Content model
Chapters live in `content/chapters/*.json`. The renderer reads:

- `id`
- `title`
- `startSceneId`
- `scenes[]` with `id`, `title`, `body`, and `choices[]`
- each choice has `label` and `nextSceneId`

Add new chapters by dropping new JSON files into the chapters folder and opening them with `?chapter=<chapter-id>`.
