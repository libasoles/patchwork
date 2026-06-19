import { douatPlates, douatTable256, type DouatLetter } from "@/data/douatPatterns";

export const TILE_COMBINATION_ROWS = 15;
export const TILE_COMBINATION_COLS = 30;
export const REGULAR_PATTERN_PERIOD = 24;

export type TileCombinationMode = "regular" | "irregular";

export interface TileCombinationTile {
  id: number;
  symbol: string;
}

export type TileCombinationGrid<TTile extends TileCombinationTile> = TTile[][];

export function generateTileCombinationGrid<TTile extends TileCombinationTile>({
  tiles,
  mode,
  seed = "patchwork",
  rows = TILE_COMBINATION_ROWS,
  cols = TILE_COMBINATION_COLS,
}: {
  tiles: TTile[];
  mode: TileCombinationMode;
  seed?: string;
  rows?: number;
  cols?: number;
}): TileCombinationGrid<TTile> {
  if (tiles.length === 0) {
    return [];
  }

  if (mode === "irregular") {
    // Place tiles independently and uniformly at random. The PRNG is seeded
    // from the seed string so the layout stays reproducible (the grid is built
    // during render and the page is statically generated, so a bare
    // Math.random would cause an SSR/client hydration mismatch). Bumping the
    // seed via "Randomize" reshuffles the whole grid.
    const random = mulberry32(stableHash(seed));

    return Array.from({ length: rows }, () =>
      Array.from(
        { length: cols },
        () => tiles[Math.floor(random() * tiles.length)],
      ),
    );
  }

  const orderedTiles = [...tiles].sort((left, right) => left.id - right.id);

  return Array.from({ length: rows }, (_, row) =>
    Array.from(
      { length: cols },
      (_, col) => orderedTiles[regularTileIndex(row, col, orderedTiles.length, seed)],
    ),
  );
}

export function regularTileIndex(
  row: number,
  col: number,
  tileCount: number,
  seed = "patchwork",
) {
  if (tileCount <= 1) return 0;

  return LETTER_TO_INDEX[regularDouatLetter(row, col, seed)] % tileCount;
}

type DouatTransform = "identity" | "rotate" | "horizontal" | "vertical";

const LETTER_TO_INDEX: Record<DouatLetter, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

// Douat builds every design by laying out a single diagonal-split tile (in one
// of four orientations A-D) and repeating it. Each transform below is a rigid
// motion of that tile, mapping one orientation to another. They let us reuse a
// single transcribed design as up to four distinct — but equally regular —
// patterns, the same way Douat repeats a tile under his four operations.
//   A = bottom-left  B = top-left  C = top-right  D = bottom-right
const DOUAT_TRANSFORMS: Record<DouatTransform, Record<DouatLetter, DouatLetter>> = {
  identity: { A: "A", B: "B", C: "C", D: "D" },
  rotate: { A: "B", B: "C", C: "D", D: "A" }, // quarter turn
  horizontal: { A: "D", B: "C", C: "B", D: "A" }, // mirror across vertical axis
  vertical: { A: "B", B: "A", C: "D", D: "C" }, // mirror across horizontal axis
};

// The full Douat catalogue: 72 plate "Desseins" plus the 256 four-tile
// "Designs". Each entry is already a complete, seamless regular pattern (a
// fundamental block repeated by translation/symmetry), so tiling any of them by
// translation keeps the result regular. This is the dictionary the regular mode
// draws from. Every design's dimensions (4, 12 or 24) divide REGULAR_PATTERN_PERIOD.
const REGULAR_DESIGNS = [...douatPlates, ...douatTable256];

function regularDouatLetter(row: number, col: number, seed: string): DouatLetter {
  const design =
    REGULAR_DESIGNS[stableHash(`${seed}:design`) % REGULAR_DESIGNS.length];

  // Translate (one of Douat's repetition operations) and apply a rigid tile
  // transform. Both preserve regularity and periodicity, and give each seed a
  // distinct-but-faithful rendering of the chosen design.
  const rowOffset = stableHash(`${seed}:row`) % design.rows;
  const colOffset = stableHash(`${seed}:col`) % design.cols;
  const transform = pickTransform(`${seed}:transform`);

  const letter =
    design.grid[(row + rowOffset) % design.rows][(col + colOffset) % design.cols];

  return applyTransform(letter, transform);
}

function pickTransform(seed: string): DouatTransform {
  const transforms: DouatTransform[] = [
    "identity",
    "rotate",
    "horizontal",
    "vertical",
  ];

  return transforms[stableHash(seed) % transforms.length];
}

function applyTransform(letter: DouatLetter, transform: DouatTransform) {
  return DOUAT_TRANSFORMS[transform][letter];
}

// Small, fast seeded PRNG (mulberry32). Returns a function yielding uniform
// floats in [0, 1).
function mulberry32(seed: number) {
  let state = seed >>> 0;

  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stableHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
