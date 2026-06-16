export const TILE_COMBINATION_ROWS = 15;
export const TILE_COMBINATION_COLS = 30;

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

  return Array.from({ length: rows }, (_, row) =>
    Array.from(
      { length: cols },
      (_, col) => tiles[regularTileIndex(row, col, tiles.length, seed)],
    ),
  );
}

// Period-4 fundamental blocks, each capturing a regular arrangement from the
// Truchet (1704) / Doüat (1722) catalogue: their method builds patterns from
// small repeating blocks combined by translation, mirroring, row-shifting and
// diagonal weaving. Values are 0-3 and taken `% tileCount`, so the schemes also
// work for families with 2 or 3 tiles. Keeping every block period-4 in both
// axes means a regular pattern is always periodic regardless of the seed.
const REGULAR_SCHEMES: number[][][] = [
  // Diagonal weave — Truchet's basic oblique weave (r + c)
  [
    [0, 1, 2, 3],
    [1, 2, 3, 0],
    [2, 3, 0, 1],
    [3, 0, 1, 2],
  ],
  // Anti-diagonal weave (r - c)
  [
    [0, 3, 2, 1],
    [1, 0, 3, 2],
    [2, 1, 0, 3],
    [3, 2, 1, 0],
  ],
  // Vertical bands (c)
  [
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3],
  ],
  // Horizontal bands (r)
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [3, 3, 3, 3],
  ],
  // 2x2 pinwheel — the classic quatrefoil block repeated
  [
    [0, 1, 0, 1],
    [3, 2, 3, 2],
    [0, 1, 0, 1],
    [3, 2, 3, 2],
  ],
  // Mirrored diamonds — a mirror-symmetric block giving concentric quilt motifs
  [
    [0, 1, 1, 0],
    [3, 2, 2, 3],
    [3, 2, 2, 3],
    [0, 1, 1, 0],
  ],
  // Brick offset — successive row pairs shifted by two
  [
    [0, 1, 2, 3],
    [2, 3, 0, 1],
    [0, 1, 2, 3],
    [2, 3, 0, 1],
  ],
  // Double-step diagonal (r + 2c)
  [
    [0, 2, 0, 2],
    [1, 3, 1, 3],
    [2, 0, 2, 0],
    [3, 1, 3, 1],
  ],
  // Original motif
  [
    [3, 2, 0, 1],
    [1, 0, 2, 3],
    [0, 1, 3, 2],
    [2, 3, 1, 0],
  ],
];

export function regularTileIndex(
  row: number,
  col: number,
  tileCount: number,
  seed = "patchwork",
) {
  if (tileCount <= 1) return 0;

  const scheme =
    REGULAR_SCHEMES[stableHash(`${seed}:scheme`) % REGULAR_SCHEMES.length];
  const rowOffset = stableHash(`${seed}:row`) % 4;
  const colOffset = stableHash(`${seed}:col`) % 4;
  const phase = stableHash(`${seed}:phase`) % tileCount;

  const value = scheme[(row + rowOffset) % 4][(col + colOffset) % 4];

  return (value + phase) % tileCount;
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
