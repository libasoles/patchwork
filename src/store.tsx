import { atom } from 'jotai'
import { initialZoomLevel, defaultColor, gridIsInitiallyVisible } from "./config"
import { Action, Tile } from "./types"
import { CanvasType } from './components/Patchwork/Canvas'

const activeTilesAtom = atom<Tile[]>([])

const selectedTileAtom = atom<Tile | undefined>(undefined)

const zoomLevelAtom = atom(initialZoomLevel)

const gridVisibilityAtom = atom(gridIsInitiallyVisible)

const colorAtom = atom(defaultColor)

const mouseDownAtom = atom(false)

const colorBarVisibilityAtom = atom(true)

const canvasAtom = atom<CanvasType>([])


// TODO: create action enum
const actionAtom = atom(Action.Draw)

export {
    actionAtom,
    activeTilesAtom,
    canvasAtom,
    colorAtom,
    colorBarVisibilityAtom,
    gridVisibilityAtom,
    mouseDownAtom,
    selectedTileAtom,
    zoomLevelAtom,
}
