---
description: Add a new tile glyph to Patchwork
argument-hint: "unicode symbol and group name (e.g. '▲ arrows')"
---

Add a new tile glyph ($ARGUMENTS) to Patchwork:

1. Open `src/config.tsx` and find `tilesMap`
2. Add an entry: `{ id: <codepoint>, symbol: '<unicode-char>', group: '<group-name>', orientation?: 0|1|2|3 }`
   - `id`: the glyph's numeric codepoint (e.g. `8211` or `0xE000`), unique across all tiles
   - `symbol`: the unicode character
   - `group`: must match an existing group name in `tilesMap`, or create a new group
   - `orientation`: only needed if the tile has a default non-zero orientation
3. Keep the catalog pages in sync by updating `src/data/tileGroups.ts` (these drive
   both `/block-groups` and `/articles/tile-groups`):
   - **Group already has a hand-written family** (it appears in `truchetFamilies` or
     `patchworkPatternFamilies`, or its name is in `supplementaryFontGroups`): add the
     tile to that family's `tiles` array (`{ id, symbol, orientation, description }`),
     otherwise the catalog renders the family without your tile.
   - **Brand-new group**: it is auto-cataloged into a generic "Font catalog" family.
     To give it a proper name + description instead of the default, add an entry to
     `catalogGroupMetadata` keyed by the group name. Nothing else is required.
   - Do **not** add a tile to a `supplementaryFontGroups` group unless it is a real
     `smith-tiles.ttf` PUA glyph (U+E000–U+E003).
4. Verify the tile renders correctly:
   - `/blocks` — glyph lookup (`npm run dev`, then http://localhost:3000/blocks)
   - the palette sidebar — the tile is selectable in its group
   - `/block-groups` and `/articles/tile-groups` — the tile shows under the right
     family exactly once (no duplicate generic group)

Note: Colors are separate from tiles. If the tile needs a specific color class, ensure it's in the Tailwind safelist in `tailwind.config.js`.
