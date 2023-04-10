import { atom } from 'jotai'
import { Action, Dimension, Tile, Canvas, Layer } from "./types"
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { initialZoomLevel, defaultColor, gridIsInitiallyVisible, canvasDimension, emptyTile, defaultSelectedTile } from '@/config';
import { createTile } from "@/factory";
import produce, { enableMapSet } from 'immer'

enableMapSet()

const activeTilesAtom = atom<Tile[]>([])

const selectedTileAtom = atom<Tile>(createTile(defaultSelectedTile))

const zoomLevelAtom = atom(initialZoomLevel)

const gridVisibilityAtom = atom(gridIsInitiallyVisible)

const colorAtom = atom(defaultColor)

const mouseDownAtom = atom(false)

const colorBarVisibilityAtom = atom(true)

const actionAtom = atom(Action.Draw)


function emptyCanvas(dimension: Dimension): Canvas {
    return Array(dimension.x * dimension.y).fill(createTile(emptyTile));
}

type Layers = Map<string, Layer>

interface LayersState {
    layers: Layers
    selected: string
    list: () => Layer[]
    add: (id: string) => void
    update: (layer: Layer) => void
    remove: (id: string) => void
    select: (id: string) => void
    disable: (layer: Layer) => void
    getCurrentLayer: () => Layer
    getCurrentCanvas: () => Canvas
    getCell: (index: number) => Tile
    updateCell: (index: number, tile: Tile) => void
}

const initialLayer = {
    id: "xxx1xxx",
    name: 'Layer',
    visible: true,
    enabled: true,
    canvas: {
        cells: emptyCanvas(canvasDimension),
        dimension: canvasDimension
    }
};

const useLayersStore = create<LayersState>()(
    devtools(
        // persist(
        (set, get) => ({
            layers: new Map([[initialLayer.id, initialLayer]]),
            selected: initialLayer.id,
            list: () => Array.from(get().layers).map(([, layer]) => layer),
            add: (id: string) => set(
                produce((state) => {
                    const newLayer = { ...initialLayer, id }
                    state.layers.set(id, newLayer);
                })),
            update: (layer: Layer) => set(
                produce((state) => {
                    state.layers.set(layer.id, layer);
                })),
            remove: (id: string) => set(
                produce((state) => {
                    state.layers.delete(id);
                })),
            select: (id: string) => set(
                produce((state) => {
                    state.selected = id
                })),
            disable: (layer: Layer) => set(
                produce((state) => {
                    const updatedLayer = { ...layer, enabled: false }
                    state.layers.set(layer.id, updatedLayer);
                })),

            getCurrentLayer: () => get().layers.get(get().selected)!,
            getCurrentCanvas: () => get().getCurrentLayer().canvas.cells,
            getCell: (index: number) => get().getCurrentCanvas()[index],

            updateCell: (index: number, tile: Tile) => set(
                produce((state) => {
                    const layer = state.layers.get(state.selected);
                    layer!.canvas.cells[index] = tile
                })),
        }),
        {
            name: 'layers-storage',
        }
        // )
    )
)

export {
    actionAtom,
    activeTilesAtom,
    colorAtom,
    colorBarVisibilityAtom,
    gridVisibilityAtom,
    mouseDownAtom,
    selectedTileAtom,
    zoomLevelAtom,
    useLayersStore
}
