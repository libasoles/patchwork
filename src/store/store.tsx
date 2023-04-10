import { Tile, Canvas, Layer } from "../types"
import { StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { canvasDimension } from '@/config';
import produce, { enableMapSet } from 'immer'
import { emptyCanvas } from "@/factory";
import immer from "immer";

enableMapSet()

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

type Layers = Map<string, Layer>

interface LayerSlice {
    layers: Layers
    selected: string
    layerApi: {
        list: () => Layer[]
        add: (id: string) => void
        update: (layer: Layer) => void
        remove: (id: string) => void
        select: (id: string) => void
        disable: (layer: Layer) => void
        current: () => Layer
    }
}

interface CanvasSlice {
    canvasApi: {
        currentCanvas: () => Canvas
        getCell: (index: number) => Tile
        updateCell: (index: number, tile: Tile) => void
    }
}

type Store = LayerSlice & CanvasSlice

// TODO: remove produce, and use immer middleware
export const createLayerSlice: StateCreator<Store, [], [], LayerSlice> = (set, get) => ({
    layers: new Map([[initialLayer.id, initialLayer]]),
    selected: initialLayer.id,
    layerApi: {
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
        current: () => get().layers.get(get().selected)!,
    }
})

export const createCanvasSlice: StateCreator<Store, [], [], CanvasSlice> = (set, get) => ({
    canvasApi: {
        currentCanvas: () => get().layerApi.current().canvas.cells,
        getCell: (index: number) => get().canvasApi.currentCanvas()[index],
        updateCell: (index: number, tile: Tile) => set(
            produce((state) => {
                const layer = state.layers.get(state.selected);
                layer!.canvas.cells[index] = tile
            })),
    }
})

export const useStore = create<Store>(
    immer(
        devtools(
            (...args) => ({
                // @ts-ignore
                ...createCanvasSlice(...args),
                // @ts-ignore
                ...createLayerSlice(...args),
            }),
            // { name: 'store' }
        )
    )
)

export const useLayersApi = () => useStore(store => ({
    list: store.layerApi.list,
    add: store.layerApi.add,
    update: store.layerApi.update,
    remove: store.layerApi.remove,
    select: store.layerApi.select,
    disable: store.layerApi.disable,
    current: store.layerApi.current,
}))

export const useLayers = () => useStore(store => store.layers)
export const useSelectedLayer = () => useStore(store => store.selected)

export const useCanvasApi = () => useStore(store => ({
    getCurrentCanvas: store.canvasApi.currentCanvas,
    getCell: store.canvasApi.getCell,
    updateCell: store.canvasApi.updateCell,
}))



