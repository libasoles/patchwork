---
description: Quick reference for all Patchwork tile families and their historic Truchet roots
---

# Patchwork Tile Families

All families are defined in `src/data/tileGroups.ts` with full TypeScript types. Use `familyByGroup()` or `familyByTileId()` for lookups.

## Canvas model

- 50×50 grid (`canvasDimension` in `src/config.tsx`)
- Flat `Tile[]` array — index = `row * 50 + col`
- Each tile: `{ id, symbol, color, orientation }` — orientation 0–3 (0° / 90° / 180° / 270° CW)
- Empty cell: `symbol: " "`, `id: 32`

## Families (historic order)

| Family id | Patchwork group(s) | Tiles (id) | Notes |
|---|---|---|---|
| `truchet-original` | `diagonals` | 8250 › 339 œ 157 \x9D 158 \x9E | Sébastien Truchet 1704 — diagonal line, 4 rotations |
| `smith-1987` | `circle quarters` | 8211 – 8212 — 732 ˜ 8482 ™ | Cyril Stanley Smith 1987 — quarter-circle arc, 4 rotations |
| `semi-circle` | `semi circles` | 217 Ù 219 Û 218 Ú 220 Ü | Half-circle arc, wave/scallop patterns |
| `two-arc-s-curve` | `two half circles` | 225 á 226 â | S/Z curve, only 2 tiles needed |
| `straight-corner` | `straight corners` | 94 ^ 95 _ 96 ` 97 a | Rectilinear analog of Smith; right-angle L-path |
| `arch` | `archs` | 90 Z 91 [ 92 \ 93 ] | Large arch; Islamic vault patterns |
| `rounded-corner` | `rounded corners`, `little rounded corners` | 207 Ï 208 Ð 209 Ñ 210 Ò | Negative/complement of Smith tiles (fills corner, not arc) |
| `roadway` | `roadway` | 80 P 81 Q 82 R 83 S | Double-line path; maze/road networks |
| `rounded-roadway` | `rounded roadways` | 64 @ 65 A 66 B 67 C | Curved version of roadway |

## Pattern character quick-ref (copy-paste)

```
Truchet original:  ›  œ  [ctrl-9D]  [ctrl-9E]
Smith 1987:        –  —  ˜  ™
Semi-circle:       Ù  Û  Ú  Ü
S-curve:           á  â
Straight corner:   ^  _  `  a
Arch:              Z  [  \  ]
Rounded corner:    Ï  Ð  Ñ  Ò
Roadway:           P  Q  R  S
Rounded roadway:   @  A  B  C
```

## Rendering tiles in JSX/HTML

Use the `.tile` CSS class (applies `font-family: blocks`):

```tsx
<span className="tile text-teal-400 text-2xl">–</span>
```

Grid example (8 cols):
```tsx
<div className="inline-grid bg-slate-800 rounded p-2 leading-none"
     style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
  {cells.map((ch, i) => (
    <span key={i} className="tile text-teal-400 text-2xl">{ch}</span>
  ))}
</div>
```
