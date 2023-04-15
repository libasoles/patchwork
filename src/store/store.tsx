import { Tile, Canvas, Layer } from "../types"
import { StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { canvasDimension } from '@/config';
import { enableMapSet } from 'immer'
import { emptyCanvas } from "@/factory";
import { immer } from "zustand/middleware/immer";
import { WritableDraft } from "immer/dist/internal";

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
    readonly layers: Layers
    readonly selected: string
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
        updateCellInBurst: (index: number, tile: Tile, burstId: number, callback?: onUpdateCellCallback) => void
        updateCellNotReversible: (index: number, tile: Tile) => void
        _updateCell: (draft: WritableDraft<Store>, index: number, tile: Tile, layerId?: string) => void // callable from other apis
    },
}

interface CanvasEvent {
    layerId: string
    cellIndex: number
    tile: Tile
    burstId?: number
}

interface HistorySlice {
    readonly history: CanvasEvent[]
    historyApi: {
        _push: (draft: WritableDraft<Store>, event: CanvasEvent) => void // callable from other apis
        pop: () => void
    },
}

type Store = LayerSlice & CanvasSlice & HistorySlice
type Mutators = [["zustand/immer", never], ["zustand/devtools", never]]

// For reference, type is: StateCreator<MyState, Mutators, [], MySlice>
type Slice<T> = StateCreator<Store, Mutators, [], T>

export const createLayerSlice: Slice<LayerSlice> = (set, get) => ({
    layers: new Map([[initialLayer.id, initialLayer]]),
    selected: initialLayer.id,
    layerApi: {
        list: () => Array.from(get().layers).map(([, layer]) => layer),
        add: (id: string) => set(
            (draft) => {
                const newLayer = { ...initialLayer, id }
                draft.layers.set(id, newLayer);
            }),
        update: (layer: Layer) => set(
            (draft) => {
                draft.layers.set(layer.id, layer);
            }),
        remove: (id: string) => set(
            (draft) => {
                draft.layers.delete(id);
            }),
        select: (id: string) => set(
            (draft) => {
                draft.selected = id
            }),
        disable: (layer: Layer) => set(
            (draft) => {
                const updatedLayer = { ...layer, enabled: false }
                draft.layers.set(layer.id, updatedLayer);
            }),
        current: () => get().layers.get(get().selected)!,
    },
})

type onUpdateCellCallback = (draft: WritableDraft<Store>, { layerId, index, tile }: { layerId: string; index: number; tile: Tile; burstId?: number }) => void
const onUpdateCell: onUpdateCellCallback = (draft, { layerId, index, tile, burstId }) => {
    draft.historyApi._push(draft, {
        layerId,
        cellIndex: index,
        tile, // store the previous tile
        burstId
    })
}

export const createCanvasSlice: Slice<CanvasSlice> = (set, get) => ({
    canvasApi: {
        currentCanvas: () => get().layerApi.current().canvas.cells,
        getCell: (index: number) => get().canvasApi.currentCanvas()[index],

        updateCellInBurst: (index: number, tile: Tile, burstId: number, callback = onUpdateCell) => set(
            (draft) => {
                const layer = draft.layers.get(draft.selected)!
                const currentTile = layer!.canvas.cells[index]

                layer!.canvas.cells[index] = tile

                callback && callback(draft, { layerId: layer.id, index, tile: currentTile, burstId })
            }),
        updateCellNotReversible: (index: number, tile: Tile) => {
            set((draft) => draft.canvasApi._updateCell(draft, index, tile))
        },
        _updateCell: (draft: WritableDraft<Store>, index: number, tile: Tile, layerId?: string) => {
            const layer = layerId ? draft.layers.get(layerId) : draft.layers.get(draft.layerApi.current().id);
            layer!.canvas.cells[index] = tile
        }
    }
})

export const createHistorySlice: Slice<HistorySlice> = (set, get) => ({
    history: [],
    historyApi: {
        // Receiving draft on purpose. Otherwise, zustand will only save the draft of the calling function and not the provided one by set()
        _push: (draft: WritableDraft<Store>, event: CanvasEvent) => {
            draft.history.push(event)
        },
        pop: () => set(
            (draft) => {
                let lastEvent = draft.history.pop()
                if (!lastEvent) return

                draft.canvasApi._updateCell(draft, lastEvent.cellIndex, lastEvent.tile, lastEvent.layerId)

                let event: CanvasEvent
                while (event = draft.history[draft.history.length - 1]) {
                    if (lastEvent?.burstId && event.burstId === lastEvent?.burstId) {
                        draft.canvasApi._updateCell(draft, event.cellIndex, event.tile, event.layerId)
                        lastEvent = draft.history.pop()
                    } else {
                        break
                    }
                }
            }),
    }
})

export const useStore = create<Store>()(
    immer(
        devtools(
            (...args) => ({
                ...createLayerSlice(...args),
                ...createCanvasSlice(...args),
                ...createHistorySlice(...args),
            })
        )
    )
)

export const useLayersApi = () => useStore(store => ({ ...store.layerApi }))

export const useLayers = () => useStore(store => store.layers)
export const useSelectedLayer = () => useStore(store => store.selected)

export const useCanvasApi = () => useStore(store => ({ ...store.canvasApi }))

export const useHistoryApi = () => useStore(store => ({ ...store.historyApi }))
