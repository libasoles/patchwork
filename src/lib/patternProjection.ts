import { emptyCanvas } from "@/factory";
import { Canvas, Dimension, Layer } from "@/types";

export type TileRegion = {
  minCol: number;
  maxCol: number;
  minRow: number;
  maxRow: number;
};

export function isIndexInRegion(
  index: number,
  dimension: Dimension,
  region: TileRegion,
) {
  const col = index % dimension.x;
  const row = Math.floor(index / dimension.x);

  return (
    col >= region.minCol &&
    col <= region.maxCol &&
    row >= region.minRow &&
    row <= region.maxRow
  );
}

export function computeVisibleTilesBoundingBox(
  layers: Layer[],
  dimension: Dimension,
): TileRegion | null {
  let minCol = dimension.x;
  let maxCol = -1;
  let minRow = dimension.y;
  let maxRow = -1;

  for (const layer of layers.filter((l) => l.visible)) {
    for (let i = 0; i < layer.canvas.cells.length; i++) {
      if (layer.canvas.cells[i].isEmpty()) continue;

      const col = i % dimension.x;
      const row = Math.floor(i / dimension.x);

      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
    }
  }

  if (maxCol === -1) return null;

  return { minCol, maxCol, minRow, maxRow };
}

export function projectCanvasToRegion(
  canvas: Canvas,
  dimension: Dimension,
  region: TileRegion,
): Canvas {
  const projected = emptyCanvas(dimension);
  const cols = region.maxCol - region.minCol + 1;
  const rows = region.maxRow - region.minRow + 1;

  for (let index = 0; index < projected.length; index++) {
    const col = index % dimension.x;
    const row = Math.floor(index / dimension.x);
    const sourceCol = region.minCol + mod(col - region.minCol, cols);
    const sourceRow = region.minRow + mod(row - region.minRow, rows);
    const sourceIndex = sourceRow * dimension.x + sourceCol;

    projected[index] = canvas[sourceIndex];
  }

  return projected;
}

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}
