import {
  REGULAR_PATTERN_PERIOD,
  TILE_COMBINATION_COLS,
  TILE_COMBINATION_ROWS,
  generateTileCombinationGrid,
} from "./tileCombinationPatterns";

const tiles = [
  { id: 1, symbol: "a" },
  { id: 2, symbol: "b" },
  { id: 3, symbol: "c" },
  { id: 4, symbol: "d" },
];

describe("tileCombinationPatterns", () => {
  it("generates the expected 30x15 regular grid", () => {
    const grid = generateTileCombinationGrid({ tiles, mode: "regular" });

    expect(grid).toHaveLength(TILE_COMBINATION_ROWS);
    expect(grid.every((row) => row.length === TILE_COMBINATION_COLS)).toBe(true);
  });

  it("keeps regular patterns periodic", () => {
    ["periodic", "regular-1", "regular-2", "douat-blocks", "striped"].forEach(
      (seed) => {
        const grid = generateTileCombinationGrid({
          tiles,
          mode: "regular",
          seed,
          rows: REGULAR_PATTERN_PERIOD * 2,
          cols: REGULAR_PATTERN_PERIOD * 2,
        });

        expect(grid[0][0]).toBe(
          grid[REGULAR_PATTERN_PERIOD][REGULAR_PATTERN_PERIOD],
        );
        expect(grid[1][2]).toBe(
          grid[1 + REGULAR_PATTERN_PERIOD][2 + REGULAR_PATTERN_PERIOD],
        );
        expect(grid[7][11]).toBe(
          grid[7 + REGULAR_PATTERN_PERIOD][11 + REGULAR_PATTERN_PERIOD],
        );
      },
    );
  });

  it("can vary regular patterns with a different seed", () => {
    const first = generateTileCombinationGrid({
      tiles,
      mode: "regular",
      seed: "regular-1",
    });
    const second = generateTileCombinationGrid({
      tiles,
      mode: "regular",
      seed: "regular-2",
    });

    expect(second).not.toEqual(first);
  });

  it("can produce richer regular compositions from Douat's dictionary", () => {
    const grid = generateTileCombinationGrid({
      tiles,
      mode: "regular",
      seed: "douat-blocks",
      rows: 12,
      cols: 12,
    });

    expect(new Set(grid.flat().map((tile) => tile.id)).size).toBeGreaterThan(2);
    expect(grid[0]).not.toEqual(grid[1]);
  });

  it("keeps irregular patterns deterministic for the same seed", () => {
    const first = generateTileCombinationGrid({
      tiles,
      mode: "irregular",
      seed: "diagonals",
    });
    const second = generateTileCombinationGrid({
      tiles,
      mode: "irregular",
      seed: "diagonals",
    });

    expect(second).toEqual(first);
  });

  it("only emits tiles from the selected group", () => {
    const allowedIds = new Set(tiles.map((tile) => tile.id));
    const grid = generateTileCombinationGrid({
      tiles,
      mode: "irregular",
      seed: "selected-group",
    });

    expect(
      grid.flat().every((tile) => allowedIds.has(tile.id)),
    ).toBe(true);
  });
});
