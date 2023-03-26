import { atom } from 'jotai'
import { initialZoomLevel, defaultColor } from "./config"
import { Action, Tile } from "./types"

const activeTilesAtom = atom<Tile[]>([])

const selectedTileAtom = atom<Tile | undefined>(undefined)

const zoomLevelAtom = atom(initialZoomLevel)

const colorAtom = atom(defaultColor)

const mouseDownAtom = atom(false)

const colorBarVisibilityAtom = atom(true)


// TODO: create action enum
const actionAtom = atom(Action.Draw)

export {
    actionAtom,
    activeTilesAtom,
    colorAtom,
    colorBarVisibilityAtom,
    mouseDownAtom,
    selectedTileAtom,
    zoomLevelAtom,
}
