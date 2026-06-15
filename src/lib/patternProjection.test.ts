import { canvasDimension } from "@/config";
import { createTile, emptyCanvas } from "@/factory";
import {
  computeVisibleTilesBoundingBox,
  projectCanvasToRegion,
} from "./patternProjection";
import { Layer } from "@/types";

const dimension = { x: 4, y: 4 };
const tileA = createTile({ id: 1, symbol: "a", color: "teal-400" });
const tileB = createTile({ id: 2, symbol: "b", color: "pink-500" });
const tileC = createTile({ id: 3, symbol: "c", color: "yellow-400" });

describe("patternProjection", () => {
  it("projects a 1x1 region across the whole canvas", () => {
    const canvas = emptyCanvas(dimension);
    canvas[5] = tileA;

    const projected = projectCanvasToRegion(canvas, dimension, {
      minCol: 1,
      maxCol: 1,
      minRow: 1,
      maxRow: 1,
    });

    expect(projected.every((tile) => tile === tileA)).toBe(true);
  });

  it("projects a 2x2 region by row and column modulo", () => {
    const canvas = emptyCanvas(dimension);
    canvas[5] = tileA;
    canvas[6] = tileB;
    canvas[9] = tileC;

    const projected = projectCanvasToRegion(canvas, dimension, {
      minCol: 1,
      maxCol: 2,
      minRow: 1,
      maxRow: 2,
    });

    expect(projected.map((tile) => tile.symbol)).toEqual([
      " ",
      "c",
      " ",
      "c",
      "b",
      "a",
      "b",
      "a",
      " ",
      "c",
      " ",
      "c",
      "b",
      "a",
      "b",
      "a",
    ]);
  });

  it("preserves empty cells inside the projected region", () => {
    const canvas = emptyCanvas(dimension);
    canvas[0] = tileA;

    const projected = projectCanvasToRegion(canvas, dimension, {
      minCol: 0,
      maxCol: 1,
      minRow: 0,
      maxRow: 0,
    });

    expect(projected.map((tile) => tile.symbol)).toEqual([
      "a",
      " ",
      "a",
      " ",
      "a",
      " ",
      "a",
      " ",
      "a",
      " ",
      "a",
      " ",
      "a",
      " ",
      "a",
      " ",
    ]);
  });

  it("ignores invisible layers when detecting the source region", () => {
    const visible = createLayer(true);
    const hidden = createLayer(false);
    visible.canvas.cells[0] = tileA;
    hidden.canvas.cells[canvasDimension.x * 10 + 10] = tileB;

    expect(
      computeVisibleTilesBoundingBox([visible, hidden], canvasDimension),
    ).toEqual({
      minCol: 0,
      maxCol: 0,
      minRow: 0,
      maxRow: 0,
    });
  });
});

function createLayer(visible: boolean): Layer {
  return {
    id: visible ? "visible" : "hidden",
    name: "",
    visible,
    enabled: true,
    canvas: {
      cells: emptyCanvas(canvasDimension),
      dimension: canvasDimension,
    },
  };
}
