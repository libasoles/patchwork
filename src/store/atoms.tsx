import { atom } from 'jotai'
import { Action, Tile } from "../types"
import { initialZoomLevel, defaultColor, gridIsInitiallyVisible, canvasDimension, emptyTile, defaultSelectedTile } from '@/config';
import { createTile } from "@/factory";

const activeTilesAtom = atom<Tile[]>([])

const selectedTileAtom = atom<Tile>(createTile(defaultSelectedTile))

const zoomLevelAtom = atom(initialZoomLevel)

const gridVisibilityAtom = atom(gridIsInitiallyVisible)

const colorAtom = atom(defaultColor)

const mouseDownAtom = atom(false)

const colorBarVisibilityAtom = atom(true)

const actionAtom = atom(Action.Draw)

export {
    actionAtom,
    activeTilesAtom,
    colorAtom,
    colorBarVisibilityAtom,
    gridVisibilityAtom,
    mouseDownAtom,
    selectedTileAtom,
    zoomLevelAtom,
}
