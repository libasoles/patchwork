import { atom } from 'jotai'
import { Action, Dimension, Tile, Canvas } from "./types"
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { initialZoomLevel, defaultColor, gridIsInitiallyVisible, canvasDimension, emptyTile } from '@/config';
import { createTile } from "@/factory";
import produce, { enableMapSet } from 'immer'

enableMapSet()

const activeTilesAtom = atom<Tile[]>([])

const selectedTileAtom = atom<Tile | undefined>(undefined)

const zoomLevelAtom = atom(initialZoomLevel)

const gridVisibilityAtom = atom(gridIsInitiallyVisible)

const colorAtom = atom(defaultColor)

const mouseDownAtom = atom(false)

const colorBarVisibilityAtom = atom(true)

const actionAtom = atom(Action.Draw)


function emptyCanvas(dimension: Dimension): Canvas {
    return Array(dimension.x * dimension.y).fill(createTile(emptyTile));
}

export type Layer = {
    id: string;
    name: string;
    visible: boolean;
    canvas: {
        cells: Canvas,
        dimension: Dimension
    }
}

type Layers = Map<string, Layer>

interface LayersState {
    layers: Layers
    selected: Layer
    list: () => Layer[]
    add: (id: string) => void
    update: (layer: Layer) => void
    remove: (id: string) => void
    select: (id: string) => void
    getCurrentCanvas: () => Canvas
    getCell: (index: number) => Tile
    updateCell: (index: number, tile: Tile) => void
}

const initialLayer = {
    id: "xxx1xxx",
    name: 'Layer',
    visible: true,
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
            selected: initialLayer, // TODO: thing with this is it's not a reference to current layer object
            list: () => Array.from(get().layers).map(([, layer]) => layer),
            add: (id: string) => set(
                produce((state) => {
                    const newLayer = {
                        ...initialLayer, // TODO: check if this returns an empty canvas
                        id
                    }
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
                    const layer = state.layers.get(id);
                    state.selected = layer
                })),
            getCurrentCanvas: () => get().layers.get(get().selected.id)!.canvas.cells,
            getCell: (index: number) => get().getCurrentCanvas()[index],
            updateCell: (index: number, tile: Tile) => set(
                produce((state) => {
                    const layer = state.layers.get(state.selected.id);
                    layer!.canvas.cells[index] = tile
                    state.selected.canvas[index] = tile
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
