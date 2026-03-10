import {
  defaultColor,
  defaultSelectedTile,
  gridIsInitiallyVisible,
  initialZoomLevel,
} from "@/config";
import { createTile } from "@/factory";
import { atom } from "jotai";
import { Action, Tile } from "../types";

const activeTilesAtom = atom<Tile[]>([]);

const selectedTileAtom = atom<Tile>(createTile(defaultSelectedTile));

const zoomLevelAtom = atom(initialZoomLevel);

const canvasOffsetAtom = atom({ x: 0, y: 0 });

const gridVisibilityAtom = atom(gridIsInitiallyVisible);

const colorAtom = atom(defaultColor);

const mouseDownAtom = atom(false);

const colorBarVisibilityAtom = atom(true);

const actionAtom = atom(Action.Draw);

export {
  actionAtom,
  activeTilesAtom,
  canvasOffsetAtom,
  colorAtom,
  colorBarVisibilityAtom,
  gridVisibilityAtom,
  mouseDownAtom,
  selectedTileAtom,
  zoomLevelAtom,
};
