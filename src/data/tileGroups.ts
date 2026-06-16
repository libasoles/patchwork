import { emptyTile, tilesMap } from "@/config";

/**
 * tileGroups.ts
 *
 * Maps Patchwork tile groups to historically documented families, curated
 * Patchwork pattern families, and glyph groups derived from the bundled fonts.
 *
 * Historic references:
 *   - Truchet 1704: Sébastien Truchet, "Mémoire sur les combinaisons" (1704).
 *     Square tiles divided by a diagonal; 4 orientations of one shape.
 *   - Quarter-circle arc variant: the curved form of Truchet tiling — a single
 *     quarter-circle arc connecting the midpoints of two adjacent sides, in 4
 *     rotations. This is the iconic modern "Truchet tiling" look. It is a generic
 *     curved variant and is NOT attributed to a specific designer here.
 *   - Smith 1987: Cyril Stanley Smith, "The tiling patterns of Sebastien Truchet and
 *     the topology of structural hierarchy" (1987), describes a tile bearing TWO
 *     quarter-circles at opposite corners — see smithTilesFontFamily / the "smith
 *     arcs" font group, not the single-arc "circle quarters" family below.
 *
 * Other grouped Patchwork tiles are described visually and by local source font;
 * they should not be presented as designs by Truchet or Smith unless their
 * specific historic source is known.
 *
 * Canvas model reminder:
 *   - The canvas is 50×50 cells (canvasDimension from config.tsx).
 *   - Cells are stored in a flat array; index = row * 50 + col.
 *   - Each cell is a Tile { id, symbol, color, orientation (0–3) }.
 *   - orientation 0 = base (0°), 1 = 90° CW, 2 = 180°, 3 = 270° CW.
 */

export interface TileGroupFamily {
  /** kebab-case identifier */
  id: string;
  /** Whether this group is historically documented, curated, or cataloged from a font */
  source?: "historic" | "patchwork-family" | "font-catalog";
  /** CSS font family key used for rendering this group's glyph previews */
  sourceFont?: "blocks" | "smith-tiles";
  /** Human-readable name */
  name: string;
  /** What the tile glyph looks like and how it tiles */
  description: string;
  /** Primary source note or family name */
  historicReference: string;
  /** The Patchwork config group name(s) that belong to this family */
  patchworkGroups: string[];
  tiles: Array<{
    /** Numeric id from tilesMap in config.tsx */
    id: number;
    /** Unicode character rendered by the custom font */
    symbol: string;
    /**
     * Canonical orientation index within this family:
     * 0 = base, 1 = 90° CW, 2 = 180°, 3 = 270° CW
     */
    orientation: number;
    /** Human description of what this rotation looks like */
    description: string;
  }>;
}

/**
 * Historically sourced families in Patchwork.
 */
export const truchetFamilies: TileGroupFamily[] = [
  {
    id: "truchet-original",
    name: "Truchet Original (1704)",
    description:
      "Square tile divided by a diagonal line into two triangles, colored in " +
      "contrasting values. The single tile shape placed in 4 rotations produces " +
      "diagonal stripes, chevrons, or labyrinthine stripe patterns when tiled " +
      "randomly. This is the foundational Truchet tile described by Sébastien " +
      "Truchet in his 1704 paper.",
    historicReference: "Sébastien Truchet, 1704",
    patchworkGroups: ["diagonals"],
    tiles: [
      {
        id: 8250,
        symbol: "›",
        orientation: 0,
        description: "Diagonal from top-left to bottom-right (\\)",
      },
      {
        id: 339,
        symbol: "œ",
        orientation: 1,
        description: "Diagonal from top-right to bottom-left (/), 90° rotation",
      },
      {
        id: 157,
        symbol: "\x9d",
        orientation: 2,
        description: "Diagonal from bottom-right to top-left, 180° rotation",
      },
      {
        id: 158,
        symbol: "\x9e",
        orientation: 3,
        description: "Diagonal from bottom-left to top-right, 270° rotation",
      },
    ],
  },

  {
    id: "quarter-circle-arc",
    name: "Quarter-circle Arc Tiles",
    description:
      "Quarter-circle arc connecting the midpoints of two adjacent sides of the " +
      "square. The 4 rotations place the arc in each of the 4 corner positions. " +
      "When tiled randomly these produce the iconic flowing, organic labyrinthine " +
      "curves — the curved form most commonly associated with 'Truchet tiling' " +
      "today. This is a generic curved Truchet variant, not the work of a specific " +
      "named designer.",
    historicReference: "Curved Truchet variant",
    patchworkGroups: ["circle quarters"],
    tiles: [
      {
        id: 8211,
        symbol: "–",
        orientation: 0,
        description: "Quarter-circle arc in the top-left corner",
      },
      {
        id: 8212,
        symbol: "—",
        orientation: 1,
        description: "Quarter-circle arc in the top-right corner (90° CW)",
      },
      {
        id: 732,
        symbol: "˜",
        orientation: 2,
        description: "Quarter-circle arc in the bottom-right corner (180°)",
      },
      {
        id: 8482,
        symbol: "™",
        orientation: 3,
        description: "Quarter-circle arc in the bottom-left corner (270° CW)",
      },
    ],
  },
];

/**
 * Curated Patchwork families with hand-written descriptions. These groups are
 * useful relatives of Truchet-style modular tiling, but are not attributed to a
 * specific historical designer unless noted in the description.
 */
export const patchworkPatternFamilies: TileGroupFamily[] = [
  {
    id: "semi-circle",
    name: "Semi-circle Tiles",
    description:
      "Half-circle arc anchored at the midpoint of one side, bulging toward the " +
      "center. 4 rotations cover all four sides. Produces wave and scallop patterns " +
      "when tiled. Patchwork treats this as a modular arc family, not as a documented " +
      "tile designed by Truchet or Smith.",
    historicReference: "Patchwork modular arc family",
    patchworkGroups: ["semi circles"],
    tiles: [
      {
        id: 217,
        symbol: "Ù",
        orientation: 0,
        description: "Semi-circle opening downward (arc at top)",
      },
      {
        id: 219,
        symbol: "Û",
        orientation: 1,
        description: "Semi-circle opening left (arc at right), 90° CW",
      },
      {
        id: 218,
        symbol: "Ú",
        orientation: 2,
        description: "Semi-circle opening upward (arc at bottom), 180°",
      },
      {
        id: 220,
        symbol: "Ü",
        orientation: 3,
        description: "Semi-circle opening right (arc at left), 270° CW",
      },
    ],
  },

  {
    id: "two-arc-s-curve",
    name: "Two-arc S-curve Tiles",
    description:
      "Two half-circle arcs on opposite sides of the tile, creating S-shapes " +
      "and Z-shapes. Only 2 distinct tiles needed (horizontal and vertical " +
      "orientations). When mixed, produces flowing S-curve meander patterns. " +
      "This is cataloged as a Patchwork arc connector family rather than a direct " +
      "Truchet or Smith source tile.",
    historicReference: "Patchwork modular arc family",
    patchworkGroups: ["two half circles"],
    tiles: [
      {
        id: 225,
        symbol: "á",
        orientation: 0,
        description: "Two semi-circles on top and bottom sides (S-shape, horizontal)",
      },
      {
        id: 226,
        symbol: "â",
        orientation: 1,
        description: "Two semi-circles on left and right sides (Z-shape, vertical)",
      },
    ],
  },

  {
    id: "straight-corner",
    name: "Straight Corner Tiles",
    description:
      "Right-angle (L-shaped) line connecting the midpoints of two adjacent " +
      "sides, passing through the corner of the tile. It behaves like a rectilinear " +
      "connector with sharp 90° bends and 4 rotations, but Patchwork does not " +
      "attribute this glyph group to Smith.",
    historicReference: "Patchwork rectilinear connector family",
    patchworkGroups: ["straight corners"],
    tiles: [
      {
        id: 94,
        symbol: "^",
        orientation: 0,
        description: "Right-angle corner at top-left",
      },
      {
        id: 95,
        symbol: "_",
        orientation: 1,
        description: "Right-angle corner at top-right, 90° CW",
      },
      {
        id: 96,
        symbol: "`",
        orientation: 2,
        description: "Right-angle corner at bottom-right, 180°",
      },
      {
        id: 97,
        symbol: "a",
        orientation: 3,
        description: "Right-angle corner at bottom-left, 270° CW",
      },
    ],
  },

  {
    id: "arch",
    name: "Arch Tiles",
    description:
      "Large arc spanning the full width of one side of the tile, creating a " +
      "tall arch shape. 4 rotations. When combined, produces interlocking arch " +
      "and vault patterns.",
    historicReference: "Patchwork modular arc family",
    patchworkGroups: ["archs"],
    tiles: [
      {
        id: 90,
        symbol: "Z",
        orientation: 0,
        description: "Arch opening downward",
      },
      {
        id: 91,
        symbol: "[",
        orientation: 1,
        description: "Arch opening left, 90° CW",
      },
      {
        id: 92,
        symbol: "\\",
        orientation: 2,
        description: "Arch opening upward, 180°",
      },
      {
        id: 93,
        symbol: "]",
        orientation: 3,
        description: "Arch opening right, 270° CW",
      },
    ],
  },

  {
    id: "rounded-corner",
    name: "Rounded Corner Tiles",
    description:
      "Rounded corner fills in small and large variants. Their rotations place " +
      "the filled corner in each quadrant, making them useful as complements to " +
      "arc and corner patterns. They are Patchwork font glyphs, not documented " +
      "Smith tiles.",
    historicReference: "Patchwork rounded corner family",
    patchworkGroups: ["rounded corners", "little rounded corners"],
    tiles: [
      {
        id: 106,
        symbol: "j",
        orientation: 0,
        description: "Small rounded fill at top-left corner",
      },
      {
        id: 107,
        symbol: "k",
        orientation: 1,
        description: "Small rounded fill at top-right corner, 90° CW",
      },
      {
        id: 108,
        symbol: "l",
        orientation: 2,
        description: "Small rounded fill at bottom-right corner, 180°",
      },
      {
        id: 109,
        symbol: "m",
        orientation: 3,
        description: "Small rounded fill at bottom-left corner, 270° CW",
      },
      {
        id: 207,
        symbol: "Ï",
        orientation: 0,
        description: "Rounded fill at top-left corner",
      },
      {
        id: 208,
        symbol: "Ð",
        orientation: 1,
        description: "Rounded fill at top-right corner, 90° CW",
      },
      {
        id: 209,
        symbol: "Ñ",
        orientation: 2,
        description: "Rounded fill at bottom-right corner, 180°",
      },
      {
        id: 210,
        symbol: "Ò",
        orientation: 3,
        description: "Rounded fill at bottom-left corner, 270° CW",
      },
    ],
  },

  {
    id: "roadway",
    name: "Roadway / Maze Tiles",
    description:
      "Parallel double-line paths through the tile: either straight through " +
      "(horizontal or vertical) or turning at a corner. Creates connected road " +
      "network and maze patterns; each tile represents a local path segment.",
    historicReference: "Patchwork path connector family",
    patchworkGroups: ["roadway"],
    tiles: [
      {
        id: 80,
        symbol: "P",
        orientation: 0,
        description: "Straight road, horizontal",
      },
      {
        id: 81,
        symbol: "Q",
        orientation: 1,
        description: "Road corner at top-right, 90° CW",
      },
      {
        id: 82,
        symbol: "R",
        orientation: 2,
        description: "Road corner at bottom-right, 180°",
      },
      {
        id: 83,
        symbol: "S",
        orientation: 3,
        description: "Road corner at bottom-left / straight vertical, 270° CW",
      },
    ],
  },

  {
    id: "rounded-roadway",
    name: "Rounded Roadway Tiles",
    description:
      "Curved version of the roadway tiles: parallel double-line paths with " +
      "smooth curved corners instead of sharp bends. Same topological family " +
      "as roadway tiles, producing organic-looking connected networks.",
    historicReference: "Patchwork path connector family",
    patchworkGroups: ["rounded roadways"],
    tiles: [
      {
        id: 64,
        symbol: "@",
        orientation: 0,
        description: "Curved road, horizontal pass-through",
      },
      {
        id: 65,
        symbol: "A",
        orientation: 1,
        description: "Curved road corner top-right, 90° CW",
      },
      {
        id: 66,
        symbol: "B",
        orientation: 2,
        description: "Curved road corner bottom-right, 180°",
      },
      {
        id: 67,
        symbol: "C",
        orientation: 3,
        description: "Curved road corner bottom-left, 270° CW",
      },
    ],
  },
];

const catalogGroupMetadata: Record<string, Pick<TileGroupFamily, "name" | "description" | "historicReference">> = {
  eraser: {
    name: "Eraser / Empty Tile",
    description:
      "Blank BIT BLOCKS tile used by Patchwork to clear cells on the canvas.",
    historicReference: "Patchwork canvas utility",
  },
  "hole figures": {
    name: "Hole Figures",
    description:
      "Decorative filled figures with interior cutouts, useful for dense ornament and stamped motifs.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "dots in diagonal": {
    name: "Dots in Diagonal",
    description:
      "Paired dot tiles aligned to opposite diagonals, extending the diagonal Truchet vocabulary with point marks.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "mirrored piramid": {
    name: "Mirrored Pyramid",
    description:
      "Two mirrored triangular pyramid glyphs for alternating directional fills.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "diagonal corners": {
    name: "Diagonal Corners",
    description:
      "Corner-weighted diagonal tiles that bridge angular Truchet diagonals and filled corner motifs.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  arrows: {
    name: "Arrows",
    description:
      "Directional arrow-like blocks for creating flow, pointers, and repeated compass patterns.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "ungrouped font glyphs": {
    name: "Ungrouped Font Glyphs",
    description:
      "BIT BLOCKS glyphs available in Patchwork that do not yet have a named semantic group in config.tsx.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "squared C": {
    name: "Squared C Tiles",
    description:
      "Squared C-shaped blocks in four rotations, suitable for stepped enclosures and squared ring fragments.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "base lines": {
    name: "Base Lines",
    description:
      "Straight line segments along tile edges, useful for constructing rectilinear paths and borders.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "squared quarters": {
    name: "Squared Quarters",
    description:
      "Filled square-quarter tiles that act as rectilinear complements to rounded corner fills.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "half rings": {
    name: "Half Rings",
    description:
      "Half-ring arc segments that can be combined into circular bands and chain-like patterns.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  cheese: {
    name: "Cheese Tiles",
    description:
      "Perforated wedge-like blocks with circular cutouts, designed for playful texture and repeated ornament.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "double corner dots": {
    name: "Double Corner Dots",
    description:
      "Corner dot-pair tiles in four rotations for dotted paths, counters, and modular accents.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  miscellaneous: {
    name: "Miscellaneous Blocks",
    description:
      "Assorted BIT BLOCKS glyphs that work as standalone marks or decorative connectors.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "T bridges": {
    name: "T Bridges",
    description:
      "T-junction bridge tiles for building branching rectilinear networks.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  horseshoes: {
    name: "Horseshoes",
    description:
      "U-shaped connector tiles in four orientations, useful for looped and nested patterns.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "archs with dot": {
    name: "Arches with Dot",
    description:
      "Arch tiles with a central dot accent, combining vault-like curves with point markers.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "contrast corner curves": {
    name: "Contrast Corner Curves",
    description:
      "Corner curve tiles with contrasting filled regions for bold curved-corner compositions.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  punctuation: {
    name: "Punctuation Blocks",
    description:
      "Punctuation codepoint glyphs from BIT BLOCKS that render as abstract block marks in Patchwork.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  numbers: {
    name: "Number Blocks",
    description:
      "Numeric codepoint glyphs from BIT BLOCKS used as geometric block shapes rather than text.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "holed circles": {
    name: "Holed Circles",
    description:
      "Circular blocks with interior holes for ring motifs and repeated circular accents.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "tetris arrow (diagonal)": {
    name: "Tetris Arrow Diagonals",
    description:
      "Angular tetromino-like arrow tiles that point along diagonal directions.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  Ks: {
    name: "K Tiles",
    description:
      "K-shaped branching glyphs in four rotations for angular joins and broken-grid rhythm.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "bold pointers": {
    name: "Bold Pointers",
    description:
      "Large pointer shapes that create strong directional movement across the grid.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  letters: {
    name: "Letter Blocks",
    description:
      "Letter codepoint glyphs from BIT BLOCKS that behave as abstract modular block shapes.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  piramids: {
    name: "Pyramids",
    description:
      "Triangular pyramid blocks for directional fills, stepped peaks, and repeated zigzags.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  clouds: {
    name: "Clouds",
    description:
      "Soft rounded cloud-like blocks in four variants for organic decorative texture.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  confeti: {
    name: "Confetti",
    description:
      "Scattered small-mark glyphs for noisy texture, stippling, and celebratory fills.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  x: {
    name: "X Blocks",
    description:
      "Crossing and X-like blocks in multiple codepoints for intersections and high-contrast accents.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
  "bold lines": {
    name: "Bold Lines",
    description:
      "Heavy line glyphs for strong dividers, bars, and dense rectilinear pattern work.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  },
};

// Groups owned by the hand-authored supplementary-font family (smithTilesFontFamily,
// declared below). Listed here so they are excluded from the auto font catalog and
// therefore not duplicated on /block-groups and /articles/tile-groups.
export const supplementaryFontGroups = [
  "smith arcs",
  "diagonal lines",
  "single diagonal",
];

const documentedPatchworkGroups = new Set(
  [...truchetFamilies, ...patchworkPatternFamilies]
    .flatMap((family) => family.patchworkGroups)
    .concat(supplementaryFontGroups)
);

function slugifyGroupName(groupName: string): string {
  return groupName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function describeSymbol(symbol: string, id: number): string {
  if (symbol === " ") return "space";
  if (id < 32 || id === 127) return `control code ${id}`;
  return symbol;
}

export const fontCatalogFamilies: TileGroupFamily[] = Object.entries(
  [emptyTile, ...tilesMap].reduce<Record<string, typeof tilesMap>>((groups, tile) => {
    const groupName = tile.group ?? "ungrouped font glyphs";

    if (documentedPatchworkGroups.has(groupName)) {
      return groups;
    }

    groups[groupName] ??= [];
    groups[groupName].push(tile);
    return groups;
  }, {})
).map(([groupName, tiles]) => {
  const metadata = catalogGroupMetadata[groupName] ?? {
    name: groupName,
    description:
      "BIT BLOCKS glyph group available in Patchwork and cataloged from config.tsx.",
    historicReference: "Patchwork BIT BLOCKS catalog",
  };

  return {
    id: `font-${slugifyGroupName(groupName)}`,
    source: "font-catalog",
    ...metadata,
    patchworkGroups: [groupName],
    tiles: tiles.map((tile, index) => ({
      id: tile.id,
      symbol: tile.symbol,
      orientation: tile.orientation ?? index,
      description: `${metadata.name} glyph ${describeSymbol(tile.symbol, tile.id)} from BIT BLOCKS codepoint ${tile.id}.`,
    })),
  };
});

// Derived from public/BIT BLOCKS TTF BRK.ttf cmap. These codepoints exist in the
// font but are not currently exposed through Patchwork's selectable tilesMap.
export const bitBlocksUnmappedCodepoints = [
  60, 61, 62, 63, 88, 89, 102, 103, 104, 105, 114, 115, 116, 117, 131, 132, 133,
  134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
  150, 151, 152, 153, 154, 155, 156, 173, 199, 200, 201, 202, 213, 214, 215, 216,
  227, 228, 229, 230, 231, 232, 233, 239, 245, 246, 247, 248, 249, 250, 251, 252,
  253, 254, 255, 338,
  352, 376, 710, 8216, 8217, 8218, 8220, 8221, 8226, 8240, 8249, 8729, 57344,
  57345,
];

export const unmappedFontFamily: TileGroupFamily = {
  id: "font-unmapped-bit-blocks",
  source: "font-catalog",
  name: "Unmapped BIT BLOCKS Font Glyphs",
  description:
    "Glyphs present in the BIT BLOCKS font cmap that are not currently exposed in Patchwork's tilesMap. They are cataloged here so the block-groups page reflects the full font traversal.",
  historicReference: "BIT BLOCKS TTF cmap, not assigned in Patchwork config",
  patchworkGroups: ["BIT BLOCKS unmapped glyphs"],
  tiles: bitBlocksUnmappedCodepoints.map((codePoint, index) => ({
    id: codePoint,
    symbol: String.fromCodePoint(codePoint),
    orientation: index,
    description: `Unmapped BIT BLOCKS glyph ${describeSymbol(
      String.fromCodePoint(codePoint),
      codePoint
    )} from font codepoint ${codePoint}.`,
  })),
};

export const smithTilesFontFamily: TileGroupFamily = {
  id: "smith-tiles-font",
  source: "font-catalog",
  sourceFont: "smith-tiles",
  name: "Smith Tiles Font",
  description:
    "Supplementary Patchwork font with twelve Smith (1987) Truchet tiles at U+E000–U+E015, in three " +
    "styles — quarter-circle arcs, straight double-band lines, and single corner-to-corner diagonals — " +
    "each provided in two stroke weights. The arc and double-band tiles carry TWO connectors covering " +
    "all four edge midpoints, so any adjacent pair always connects, producing the labyrinthine closed " +
    "regions Smith described; the single-diagonal tiles are the classic two-orientation diagonal Truchet " +
    "tile (the paper's Figure 3). U+E000–E005 are the thin weight (the original ~50-unit band); " +
    "U+E010–E015 are the thick weight, a 175-unit stroke matching the BIT BLOCKS glyphs for visual " +
    "cohesion. Glyph metrics match BIT BLOCKS so these tiles align with the existing grid.",
  historicReference: "Cyril Stanley Smith Truchet tile family, supplementary Patchwork font",
  patchworkGroups: supplementaryFontGroups,
  tiles: [
    {
      id: 0xe000,
      symbol: String.fromCodePoint(0xe000),
      orientation: 0,
      description: "Thin S-shape: arc at top-right corner + arc at bottom-left corner.",
    },
    {
      id: 0xe001,
      symbol: String.fromCodePoint(0xe001),
      orientation: 1,
      description: "Thin reverse-S: arc at top-left corner + arc at bottom-right corner.",
    },
    {
      id: 0xe010,
      symbol: String.fromCodePoint(0xe010),
      orientation: 0,
      description: "Thick S-shape: arc at top-right corner + arc at bottom-left corner.",
    },
    {
      id: 0xe011,
      symbol: String.fromCodePoint(0xe011),
      orientation: 1,
      description: "Thick reverse-S: arc at top-left corner + arc at bottom-right corner.",
    },
    {
      id: 0xe002,
      symbol: String.fromCodePoint(0xe002),
      orientation: 0,
      description:
        "Thin straight S: diagonal band top↔right + diagonal band bottom↔left (double-line variant).",
    },
    {
      id: 0xe003,
      symbol: String.fromCodePoint(0xe003),
      orientation: 1,
      description:
        "Thin straight reverse-S: diagonal band top↔left + diagonal band bottom↔right (double-line variant).",
    },
    {
      id: 0xe012,
      symbol: String.fromCodePoint(0xe012),
      orientation: 0,
      description:
        "Thick straight S: diagonal band top↔right + diagonal band bottom↔left (double-line variant).",
    },
    {
      id: 0xe013,
      symbol: String.fromCodePoint(0xe013),
      orientation: 1,
      description:
        "Thick straight reverse-S: diagonal band top↔left + diagonal band bottom↔right (double-line variant).",
    },
    {
      id: 0xe004,
      symbol: String.fromCodePoint(0xe004),
      orientation: 0,
      description: "Thin single diagonal '/': bottom-left ↔ top-right corner-to-corner line.",
    },
    {
      id: 0xe005,
      symbol: String.fromCodePoint(0xe005),
      orientation: 1,
      description: "Thin single diagonal '\\': top-left ↔ bottom-right corner-to-corner line.",
    },
    {
      id: 0xe014,
      symbol: String.fromCodePoint(0xe014),
      orientation: 0,
      description: "Thick single diagonal '/': bottom-left ↔ top-right corner-to-corner line.",
    },
    {
      id: 0xe015,
      symbol: String.fromCodePoint(0xe015),
      orientation: 1,
      description: "Thick single diagonal '\\': top-left ↔ bottom-right corner-to-corner line.",
    },
  ],
};

export const allTileGroupFamilies: TileGroupFamily[] = [
  ...truchetFamilies.map((family) => ({
    ...family,
    source: "historic" as const,
    sourceFont: "blocks" as const,
  })),
  ...patchworkPatternFamilies.map((family) => ({
    ...family,
    source: "patchwork-family" as const,
    sourceFont: "blocks" as const,
  })),
  ...fontCatalogFamilies,
  unmappedFontFamily,
  smithTilesFontFamily,
];

/**
 * Quick lookup: given a Patchwork group name, return the matching family (if any).
 */
export function familyByGroup(groupName: string): TileGroupFamily | undefined {
  return allTileGroupFamilies.find((f) => f.patchworkGroups.includes(groupName));
}

/**
 * Quick lookup: given a tile id from tilesMap, return the family it belongs to.
 */
export function familyByTileId(tileId: number): TileGroupFamily | undefined {
  return allTileGroupFamilies.find((f) => f.tiles.some((t) => t.id === tileId));
}
