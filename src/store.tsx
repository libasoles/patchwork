import { atom } from 'jotai'
import { initialZoomLevel, defaultColor, gridIsInitiallyVisible } from "./config"
import { Action, Tile } from "./types"
import { CanvasType } from './components/Patchwork/Canvas'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'


const activeTilesAtom = atom<Tile[]>([])

const selectedTileAtom = atom<Tile | undefined>(undefined)

const zoomLevelAtom = atom(initialZoomLevel)

const gridVisibilityAtom = atom(gridIsInitiallyVisible)

const colorAtom = atom(defaultColor)

const mouseDownAtom = atom(false)

const colorBarVisibilityAtom = atom(true)

const canvasAtom = atom<CanvasType>([])

const actionAtom = atom(Action.Draw)


export type Layer = { id: string; name: string; visible: boolean; canvas: CanvasType }
type Layers = Map<string, Layer>

interface LayersState {
    layers: Layers
    add: (id: string) => void
    update: (layer: Layer) => void
    remove: (id: string) => void
}

const initialLayer = { id: "xxx1xxx", name: 'Layer', visible: true, canvas: [] };

const useLayersStore = create<LayersState>()(
    devtools(
        // persist(
        (set) => ({
            layers: new Map([[initialLayer.id, initialLayer]]),
            add: (id: string) => set((state) => {
                const newLayer = {
                    ...initialLayer,
                    id
                }
                state.layers.set(id, newLayer);
                return { layers: state.layers }
            }),
            update: (layer: Layer) => set((state) => {
                state.layers.set(layer.id, layer);
                return { layers: state.layers }
            }),
            remove: (id: string) => set((state) => {
                state.layers.delete(id);
                return { layers: state.layers }
            }),
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
    canvasAtom,
    colorAtom,
    colorBarVisibilityAtom,
    gridVisibilityAtom,
    mouseDownAtom,
    selectedTileAtom,
    zoomLevelAtom,
    useLayersStore
}
