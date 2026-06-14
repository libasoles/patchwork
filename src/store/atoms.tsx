import {
  defaultBgColor,
  defaultColor,
  defaultSelectedTile,
  defaultGridMode,
  initialZoomLevel,
} from "@/config";
import { createTile } from "@/factory";
import { atom } from "jotai";
import { Action, GridMode, Tile } from "../types";

const activeTilesAtom = atom<Tile[]>([]);

const selectedTileAtom = atom<Tile>(createTile(defaultSelectedTile));

const getInitialZoom = () => initialZoomLevel;

const zoomLevelAtom = atom(getInitialZoom());

const canvasOffsetAtom = atom({ x: 0, y: 0 });

const gridVisibilityAtom = atom<GridMode>(defaultGridMode as GridMode);

const colorAtom = atom(defaultColor);

const bgColorAtom = atom(defaultBgColor);

const mouseDownAtom = atom(false);

const colorBarVisibilityAtom = atom(true);

const bgColorBarVisibilityAtom = atom(false);

const actionAtom = atom(Action.Draw);

export {
  actionAtom,
  activeTilesAtom,
  bgColorAtom,
  bgColorBarVisibilityAtom,
  canvasOffsetAtom,
  colorAtom,
  colorBarVisibilityAtom,
  gridVisibilityAtom,
  mouseDownAtom,
  selectedTileAtom,
  zoomLevelAtom,
};
