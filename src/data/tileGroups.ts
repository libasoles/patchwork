/**
 * tileGroups.ts
 *
 * Maps Patchwork tile groups to historically significant Truchet tile families.
 *
 * Historic references:
 *   - Truchet 1704: Sébastien Truchet, "Mémoire sur les combinaisons" (1704).
 *     Square tiles divided by a diagonal; 4 orientations of one shape.
 *   - Smith 1987: Cyril Stanley Smith, "The tiling patterns of Sebastien Truchet and
 *     the topology of structural hierarchy" (1987). Quarter-circle arcs connecting
 *     midpoints of adjacent sides; 2 tile shapes × 2 placements = 4 variants.
 *   - Extensions documented in the literature: semi-circle tiles, two-arc (S-curve)
 *     tiles, rectilinear (straight-corner) analogs, and road/maze tile families.
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
  /** Human-readable name */
  name: string;
  /** What the tile glyph looks like and how it tiles */
  description: string;
  /** Primary historic source or family name */
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
 * All known tile families in Patchwork, ordered from most historically
 * significant to most decorative/extended.
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
    id: "smith-1987",
    name: "Smith Arc Tiles (1987)",
    description:
      "Quarter-circle arc connecting the midpoints of two adjacent sides of the " +
      "square. The 4 rotations place the arc in each of the 4 corner positions. " +
      "When tiled randomly these produce the iconic flowing, organic labyrinthine " +
      "curves — the pattern most commonly associated with 'Truchet tiling' today. " +
      "Rediscovered and popularized by Cyril Stanley Smith in 1987.",
    historicReference: "Cyril Stanley Smith, 1987",
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

  {
    id: "semi-circle",
    name: "Semi-circle Tiles",
    description:
      "Half-circle arc anchored at the midpoint of one side, bulging toward the " +
      "center. 4 rotations cover all four sides. Produces wave and scallop patterns " +
      "when tiled. A natural extension of the Truchet arc family.",
    historicReference: "Arc family extension",
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
      "Documented in Truchet literature as a 'two-arc' variant.",
    historicReference: "Two-arc Truchet variant",
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
    name: "Straight Corner (Rectilinear Smith Analog)",
    description:
      "Right-angle (L-shaped) line connecting the midpoints of two adjacent " +
      "sides, passing through the corner of the tile. The rectilinear analog of " +
      "the Smith arc tile — same topological family but with sharp 90° bends " +
      "instead of smooth curves. 4 rotations cover all corners.",
    historicReference: "Rectilinear Truchet variant",
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
      "and vault patterns reminiscent of Islamic geometric art.",
    historicReference: "Arc family extension",
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
      "Quarter-circle arc filling the corner of the tile (the 'negative' " +
      "of the Smith arc — where Smith draws the arc connecting adjacent-side " +
      "midpoints, this tile fills the corner region with a rounded shape). " +
      "4 rotations. The TODO comment in config.tsx calls these out as the " +
      "negatives of Smith tiles.",
    historicReference: "Smith 1987 complement",
    patchworkGroups: ["rounded corners", "little rounded corners"],
    tiles: [
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
      "network and maze patterns. Related to Wang tiles and maze-generation " +
      "algorithms; each tile represents a path segment.",
    historicReference: "Maze / road network family",
    patchworkGroups: ["roadway", "rounded roadways"],
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
    historicReference: "Maze / road network family (curved variant)",
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

/**
 * Quick lookup: given a Patchwork group name, return the matching family (if any).
 */
export function familyByGroup(groupName: string): TileGroupFamily | undefined {
  return truchetFamilies.find((f) => f.patchworkGroups.includes(groupName));
}

/**
 * Quick lookup: given a tile id from tilesMap, return the family it belongs to.
 */
export function familyByTileId(tileId: number): TileGroupFamily | undefined {
  return truchetFamilies.find((f) => f.tiles.some((t) => t.id === tileId));
}
