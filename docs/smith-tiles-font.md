# Smith Tiles Font (`smith-tiles.ttf`)

A small, hand-authored supplementary font that supplies the **Smith (1987) Truchet
tiles**, which the main BIT BLOCKS font does not contain. It lives at
[`public/smith-tiles.ttf`](../public/smith-tiles.ttf) and is **generated** by
[`scripts/generate-smith-font.py`](../scripts/generate-smith-font.py) — never edit the
`.ttf` by hand; change the script and regenerate.

## Background

Sébastien Truchet's tile (1704) is a square split by a diagonal. Cyril Stanley Smith, in
his 1987 *Leonardo* article, introduced variants — most famously replacing the diagonal
with a **quarter-circle arc** connecting the midpoints of two adjacent edges. Each Smith
arc/line tile carries **two connectors covering all four edge midpoints**, so *any* two
adjacent tiles always connect — random arrangements therefore produce closed, labyrinthine
regions. The font also includes Smith's "retain only the diagonal line" variant (the
paper's Figure 3): a single corner-to-corner diagonal with two orientations.

## Font metrics

Chosen to match `BIT BLOCKS TTF BRK.ttf` so Smith tiles align on the same grid:

| Metric | Value |
|---|---|
| Units per em (UPM) | 1000 |
| hhea ascent / descent | 700 / 0 |
| Advance width | 700 |
| Tile box side `S` | 700 |
| Family / style name | "Smith Tiles" / "Regular" |

## Styles, weights and codepoints

Three **styles**, each in two **stroke weights**, at Private Use Area codepoints
**U+E000–U+E015** (thin = `E00x`, thick = `E01x`):

| Style | Orientation | Thin | Thick |
|---|---|---|---|
| arc | S-shape (TR + BL corners) | U+E000 | U+E010 |
| arc | reverse-S (TL + BR corners) | U+E001 | U+E011 |
| double-band ("diagonal lines") | straight S | U+E002 | U+E012 |
| double-band ("diagonal lines") | straight reverse-S | U+E003 | U+E013 |
| single diagonal (Fig. 3) | `/` (BL ↔ TR) | U+E004 | U+E014 |
| single diagonal (Fig. 3) | `\` (TL ↔ BR) | U+E005 | U+E015 |

- **arcs** — the canonical quarter-circle Smith tiles.
- **diagonal lines** — a Patchwork addition: the arcs' straight equivalent, a *double*
  parallel band cutting opposite corners. Connects flush with the arcs.
- **single diagonal** — Smith's single corner-to-corner diagonal (Fig. 3), the classic
  two-orientation diagonal Truchet tile.

### Stroke weights

| Weight | Stroke | Rationale |
|---|---|---|
| **thin** | ~50-unit band (≈7% of the tile; arcs ~50 perpendicular, double-band ~35) | The original Patchwork weight. Kept unchanged. |
| **thick** | **175-unit perpendicular stroke** (25% of the tile) | Matches the measured BIT BLOCKS glyph stroke (consistently 175/1000 units) so Smith tiles read at the same weight as the rest of the catalog. |

## Geometry

All connector bands are **centred on the edge midpoint at 350** (in the 700-unit box), which
is what guarantees arcs, double-bands and any-weight tiles interconnect.

Per-weight parameters in the generator (`THIN` / `THICK` dicts):

| Param | Meaning | Thin | Thick |
|---|---|---|---|
| `OR` / `IR` | arc outer / inner **radius** (radial band = `OR-IR`) | 375 / 325 | 438 / 263 |
| `OR_DB` / `IR_DB` | double-band edge crossings at `S-OR_DB` … `S-IR_DB` | 375 / 325 → 325…375 | 474 / 226 → 226…474 |
| `A` | single-diagonal offset; perpendicular stroke = `A·√2` | `round(50/√2)=35` | `round(175/√2)=124` |

- **Arcs** are approximated by a single quadratic Bézier per 90° sweep, control point at the
  sector's bounding-box corner (~2% geometric error, invisible at tile size).
- **Double-band** = two straight strips clipped to the square, each between two parallel
  diagonals crossing the edges within the 350-centred band.
- **Single diagonal** = one hexagonal strip straddling the tile diagonal (`y=x` for `/`,
  `x+y=S` for `\`), clipped to the square.

## How it's wired into the app

1. **CSS** — [`src/styles/globals.css`](../src/styles/globals.css) declares two relevant
   `@font-face`s from the same file:
   - `font-family: blocks` with `unicode-range: U+E000-U+E0FF` — makes the Smith glyphs
     available to the **main app** (the `.tile` class uses the `blocks` family). Any new
     Smith codepoint must fall inside this range.
   - `font-family: smith-tiles` (whole file) — used by the `.smith-tile` class on the
     catalog/article pages.
2. **Palette** — [`src/config.tsx`](../src/config.tsx) `tilesMap`: one entry per glyph with
   `group` set to `"smith arcs"`, `"diagonal lines"` or `"single diagonal"`. Thin and thick
   share a group (no separate "bold" groups). `tilesMap` order = palette order, so keep a
   group's entries contiguous.
3. **Catalog** — [`src/data/tileGroups.ts`](../src/data/tileGroups.ts):
   - `supplementaryFontGroups` lists the Smith group names so they're excluded from the
     auto-generated BIT BLOCKS catalog (no duplication).
   - `smithTilesFontFamily` holds the human-readable family + per-glyph descriptions shown
     on `/block-groups` and `/articles/tile-groups` (both iterate `allTileGroupFamilies`).

## Regenerating / extending

Requires Python with `fonttools`.

```bash
python3 scripts/generate-smith-font.py   # rewrites public/smith-tiles.ttf
```

To **add a glyph**: draw it in the generator, regenerate, then — if it uses a new codepoint
— make sure it's inside the `blocks` `unicode-range`, and add matching entries to
`tilesMap` (config.tsx) and `smithTilesFontFamily` (tileGroups.ts). The
[`/add-tile`](../.claude/commands/add-tile.md) skill encodes this checklist. After
regenerating, **hard-refresh** the browser to bust the cached `.ttf`.
