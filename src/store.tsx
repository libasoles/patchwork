import { atom } from 'jotai'
import { initialZoomLevel, defaultColor, gridIsInitiallyVisible } from "./config"
import { Action, Tile } from "./types"
import { GridType } from './components/Patchwork/Grid'

const activeTilesAtom = atom<Tile[]>([])

const selectedTileAtom = atom<Tile | undefined>(undefined)

const zoomLevelAtom = atom(initialZoomLevel)

const gridVisibilityAtom = atom(gridIsInitiallyVisible)

const colorAtom = atom(defaultColor)

const mouseDownAtom = atom(false)

const colorBarVisibilityAtom = atom(true)

const gridAtom = atom<GridType>([])


// TODO: create action enum
const actionAtom = atom(Action.Draw)

export {
    actionAtom,
    activeTilesAtom,
    colorAtom,
    colorBarVisibilityAtom,
    gridAtom,
    gridVisibilityAtom,
    mouseDownAtom,
    selectedTileAtom,
    zoomLevelAtom,
}
