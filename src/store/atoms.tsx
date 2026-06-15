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
import { TileRegion } from "@/lib/patternProjection";

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

const patternProjectionAtom = atom<{
  enabled: boolean;
  sourceRegion: TileRegion | null;
}>({
  enabled: false,
  sourceRegion: null,
});

export {
  actionAtom,
  activeTilesAtom,
  bgColorAtom,
  canvasOffsetAtom,
  colorAtom,
  colorMenuTargetAtom,
  gridVisibilityAtom,
  mouseDownAtom,
  patternProjectionAtom,
  selectedTileAtom,
  zoomLevelAtom,
};
