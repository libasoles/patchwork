export const TILE_COMBINATION_ROWS = 12;
export const TILE_COMBINATION_COLS = 26;

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

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const index =
        mode === "regular"
          ? regularTileIndex(row, col, tiles.length, seed)
          : irregularTileIndex(row, col, tiles.length, seed);

      return tiles[index];
    }),
  );
}

export function regularTileIndex(
  row: number,
  col: number,
  tileCount: number,
  seed = "patchwork",
) {
  if (tileCount <= 1) return 0;

  const phase = stableHash(`${seed}:phase`) % tileCount;

  if (tileCount === 2) {
    const rowOffset = stableHash(`${seed}:row`) % 4;
    const colOffset = stableHash(`${seed}:col`) % 4;

    return (
      (Math.floor((row + rowOffset) / 2) +
        Math.floor((col + colOffset) / 2) +
        phase) %
      tileCount
    );
  }

  if (tileCount >= 4) {
    const rowOffset = stableHash(`${seed}:row`) % 4;
    const colOffset = stableHash(`${seed}:col`) % 4;
    const motif = [
      [3, 2, 0, 1],
      [1, 0, 2, 3],
      [0, 1, 3, 2],
      [2, 3, 1, 0],
    ];

    return (
      (motif[(row + rowOffset) % 4][(col + colOffset) % 4] + phase) % tileCount
    );
  }

  return (row + col * 2 + phase) % tileCount;
}

export function irregularTileIndex(
  row: number,
  col: number,
  tileCount: number,
  seed: string,
) {
  if (tileCount <= 1) return 0;

  return stableHash(`${seed}:${row}:${col}`) % tileCount;
}

function stableHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
