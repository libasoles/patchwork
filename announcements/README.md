# Patchwork — Douat announcement kit

Ready-to-paste drafts and localized screenshots for announcing **https://patchwork.com.ar/** in
tiling / decorative-art / generative communities, pointing at the two Douat articles.

> Posting is done by you (these communities need your own accounts). Attach your own video where the
> platform accepts video; otherwise use the screenshots below.

## Articles being promoted

| Article | EN | ES | FR |
|---|---|---|---|
| Douat: An Alphabet of Tiles | [/articles/douat](https://patchwork.com.ar/articles/douat) | [/es/…](https://patchwork.com.ar/es/articles/douat) | [/fr/…](https://patchwork.com.ar/fr/articles/douat) |
| Douat's Table of 256 Designs | [/articles/douat-256-designs](https://patchwork.com.ar/articles/douat-256-designs) | [/es/…](https://patchwork.com.ar/es/articles/douat-256-designs) | [/fr/…](https://patchwork.com.ar/fr/articles/douat-256-designs) |

## Drafts

- `drafts/reddit.md` — EN. r/tiling, r/generative / r/generativeart, r/proceduralgeneration, r/math.
- `drafts/hackernews.md` — EN. "Show HN" title + first comment.
- `drafts/math-tiling-art.md` — EN + FR. Mathstodon / tiling forums / recreational math.
- `drafts/spanish-design.md` — ES. Spanish-language design/art communities.

## Screenshots

Dark theme, retina (2×), one set per locale under `screenshots/<en|es|fr>/`:

- `douat-carousel.png` — the interactive carousel (color picker + a full plate). Best hero image.
- `256-alphabet.png` — the A/B/C/D orientation legend.
- `256-table.png` — the top rows of the 256-block dictionary grid.

Pick the locale that matches where you post.

## Per-community checklist

| Community | Draft | Language | Attach |
|---|---|---|---|
| r/tiling, r/generative*, r/proceduralgeneration, r/math | `reddit.md` | EN | `screenshots/en/douat-carousel.png` (+ video) |
| Hacker News (Show HN) | `hackernews.md` | EN | links only (HN has no images); video link optional in comment |
| Mathstodon / tiling forums | `math-tiling-art.md` | EN or FR | `screenshots/en|fr/*` (+ video) |
| Spanish design/art communities | `spanish-design.md` | ES | `screenshots/es/*` (+ video) |

Before posting anywhere: check the community's self-promotion rules, and disclose it's your own
project. Lead with the 1722 Truchet→Douat history and the live-from-letter-codes angle, not the app.

## Regenerating the screenshots

They were captured with a throwaway Playwright script against `npm run dev` (Chromium, dark color
scheme, 1500px viewport, 2× scale) — carousel via the "Previous design" button's container, the
256-page alphabet via the first `figure`, the grid via the `.rounded-xl.bg-slate-900` container
clipped to its top. Re-shoot by running the dev server and screenshotting those elements per locale.
