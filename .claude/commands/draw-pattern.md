---
description: Draw or describe tile patterns using Patchwork tile families (Truchet, Smith, etc.)
argument-hint: Pattern description — e.g. "4x4 random Truchet original", "8x8 Smith maze", "6x6 checkerboard arch yellow"
---

# Drawing patterns with Patchwork tiles

Use this skill to generate static pattern arrays for articles, tests, or demos — or to explain how the live canvas would be populated.

## Step 1 — Pick a tile family

Read `/tile-families` (or `src/data/tileGroups.ts`) for the full list. Most common:

| Goal | Family | Tiles to use |
|---|---|---|
| Classic diagonal Truchet | `truchet-original` | `›` `œ` `\x9D` `\x9E` |
| Flowing organic curves (Smith) | `smith-1987` | `–` `—` `˜` `™` |
| Wave / scallop | `semi-circle` | `Ù` `Û` `Ú` `Ü` |
| Maze / road network | `roadway` | `P` `Q` `R` `S` |
| Arch / vault | `arch` | `Z` `[` `\` `]` |

## Step 2 — Choose a layout algorithm

**Checkerboard alternation** (simple, regular, shows all 4 rotations):
```ts
const tiles = ['–', '—', '˜', '™']; // smith-1987
const grid = Array.from({ length: rows }, (_, r) =>
  Array.from({ length: cols }, (_, c) => tiles[(r + c) % 4])
);
```

**2×2 tile block** (creates nice repeating unit):
```ts
// row-pair, col-pair determines which of the 4 tiles
const grid = Array.from({ length: rows }, (_, r) =>
  Array.from({ length: cols }, (_, c) => tiles[(r % 2) * 2 + (c % 2)])
);
```

**Pseudo-random (seeded, reproducible)**:
```ts
function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
const rand = seeded(42);
const grid = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => tiles[Math.floor(rand() * tiles.length)])
);
```

## Step 3 — Render in JSX

> **Tiles never have rounded corners.** Do not add `rounded-*` to tile wrappers or individual tile cells — tiles must look like a continuous grid, not card UI.

```tsx
import { truchetFamilies } from '@/data/tileGroups';

const family = truchetFamilies.find(f => f.id === 'smith-1987')!;
const tileChars = family.tiles.map(t => t.symbol);

// Build grid (8 cols, 6 rows, checkerboard)
const grid = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 8 }, (_, c) => tileChars[(r + c) % 4])
);

// Render
<div
  className="inline-grid bg-slate-800 p-2 leading-none"
  style={{ gridTemplateColumns: `repeat(8, 1fr)` }}
>
  {grid.flat().map((ch, i) => (
    <span key={i} className="tile text-teal-400 text-2xl">{ch}</span>
  ))}
</div>
```

## Step 4 — Canvas store interaction (for live drawing)

If writing to the actual Zustand canvas store rather than a static JSX grid:

```ts
import { useStore } from '@/store/store';
import { createTile } from '@/factory';
import { tilesMap } from '@/config';

// Find a tile by id
const tileDef = tilesMap.find(t => t.id === 8211)!; // Smith tile 0
const tile = createTile(tileDef);

// Place at row r, col c on a 50-wide canvas
const index = r * 50 + c;
useStore.getState().canvasApi.updateCellInBurst(index, tile, burstId);
```

Use `updateCellNotReversible` for preview/temp draws that shouldn't appear in undo history.
Use `updateCellInBurst` with a shared `burstId` (e.g. `uuid()`) for undoable strokes.

## Worked example — "8×8 random Smith tiling, teal on slate"

```tsx
const SMITH = ['–', '—', '˜', '™'];
const rand = seeded(2024);
const pattern = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => SMITH[Math.floor(rand() * 4)])
);

<div className="inline-grid bg-slate-800 p-2 leading-none"
     style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
  {pattern.flat().map((ch, i) => (
    <span key={i} className="tile text-teal-400 text-2xl">{ch}</span>
  ))}
</div>
```
