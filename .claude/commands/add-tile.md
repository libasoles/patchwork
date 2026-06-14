---
description: Add a new tile glyph to Patchwork
argument-hint: "unicode symbol and group name (e.g. '▲ arrows')"
---

Add a new tile glyph ($ARGUMENTS) to Patchwork:

1. Open `src/config.tsx` and find `tilesMap`
2. Add an entry: `{ id: '<unique-id>', symbol: '<unicode-char>', group: '<group-name>', orientation?: 0|1|2|3 }`
   - `id`: short kebab-case string, unique across all tiles
   - `symbol`: the unicode character
   - `group`: must match an existing group name in `tilesMap`, or create a new group
   - `orientation`: only needed if the tile has a default non-zero orientation
3. Verify the new tile appears in the `/blocks` route (`npm run dev` then visit http://localhost:3000/blocks)
4. The tile is automatically available in the palette — no other files need to change

Note: Colors are separate from tiles. If the tile needs a specific color class, ensure it's in the Tailwind safelist in `tailwind.config.js`.
