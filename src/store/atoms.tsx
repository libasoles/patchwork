import {
  defaultBgColor,
  defaultColor,
  defaultSelectedTile,
  defaultGridMode,
  initialZoomLevel,
} from "@/config";
import { createTile } from "@/factory";
import { atom } from "jotai";
import { Action, ColorTarget, GridMode, Tile } from "../types";

const activeTilesAtom = atom<Tile[]>([]);

const selectedTileAtom = atom<Tile>(createTile(defaultSelectedTile));

const getInitialZoom = () => initialZoomLevel;

const zoomLevelAtom = atom(getInitialZoom());

const canvasOffsetAtom = atom({ x: 0, y: 0 });

const gridVisibilityAtom = atom<GridMode>(defaultGridMode as GridMode);

const colorAtom = atom(defaultColor);

const bgColorAtom = atom(defaultBgColor);

const mouseDownAtom = atom(false);

const colorMenuTargetAtom = atom<ColorTarget>("tile");

const actionAtom = atom(Action.Draw);

export {
  actionAtom,
  activeTilesAtom,
  bgColorAtom,
  canvasOffsetAtom,
  colorAtom,
  colorMenuTargetAtom,
  gridVisibilityAtom,
  mouseDownAtom,
  selectedTileAtom,
  zoomLevelAtom,
};
