import Cell from './components/Cell';
import { Action, Dimension, Canvas as CanvasType } from '@/types';
import { useAtom } from 'jotai';
import { actionAtom, gridVisibilityAtom, useLayersStore } from '@/store';
import { useDraw } from './hooks/useDraw';
import { useMoveBehavior } from './hooks/useMoveBehavior';
import { useZoom } from './hooks/useZoom';
import { createTile } from '@/factory';
import { emptyTile } from '@/config';

const cellSize = 40

export default function Canvas() {
    const { layers, selected, updateCanvas } = useLayersStore()
    const layersList = Array.from(layers).map(([, layer]) => layer)

    const [activeAction] = useAtom(actionAtom);

    const canvasScale = useZoom()

    const [isGridVisible] = useAtom(gridVisibilityAtom);

    const cursor = getMouseIcon(activeAction)

    return <div className='bg-gray-700 relative h-full w-full'>
        {layersList.map(layer => layer.id === selected.id
            ? <ActiveLayer key={layer.id}
                layerId={layer.id}
                canvas={layer.canvas.cells}
                dimension={layer.canvas.dimension}
                cursor={cursor}
                updateCanvas={updateCanvas}
                canvasScale={canvasScale}
                isGridVisible={isGridVisible}
            />
            : <Layer key={layer.id}
                layerId={layer.id}
                canvas={layer.canvas.cells}
                dimension={layer.canvas.dimension}
                cursor={cursor}
                canvasScale={canvasScale}
                isGridVisible={isGridVisible} />)}
    </div>
}

type LayerProps = { layerId: string, canvas: CanvasType, dimension: Dimension, cursor: string, canvasScale: number, isGridVisible: boolean }

function Layer({ canvas, dimension, cursor, canvasScale, isGridVisible }: LayerProps) {
    return (
        <div
            data-testid='canvas'
            className={`grid justify-center gap-0 select-none ${cursor}} absolute top-0 bottom-0 left-0 right-0`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${dimension.y}, ${cellSize}px)`,
                transform: `scale(${canvasScale})`,
            }}
        >
            {
                canvas.map((tile, index) => {
                    return (
                        <div key={index}>
                            <Cell
                                key={index}
                                index={index}
                                borderless={!isGridVisible}
                                size={cellSize}
                                tile={tile}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
}

type ActiveLayerProps = LayerProps & { updateCanvas: (canvas: CanvasType) => void }

function ActiveLayer({ layerId, canvas, dimension, updateCanvas, cursor, canvasScale, isGridVisible }: ActiveLayerProps) {

    const onMove = (from: number, to: number) => {
        canvas[to] = canvas[from]
        canvas[from] = createTile(emptyTile)

        updateCanvas(canvas)
    }

    const { isDraggable, onDragStart, onDragEnter, onDrop, onDragOver } = useMoveBehavior(onMove)
    const { setMouseDown, onMouseDown, onMouseEnter } = useDraw(canvas, updateCanvas)

    // 'bg-red-400'
    return (
        <div
            data-testid='canvas'
            className={`grid justify-center gap-0 select-none ${cursor}  h-full w-full absolute top-0 bottom-0 left-0 right-0`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${dimension.y}, ${cellSize}px)`,
                transform: `scale(${canvasScale})`,
            }}
            onMouseDown={() => { setMouseDown(true) }}
            onMouseUp={() => { setMouseDown(false) }}
        >
            {
                canvas.map((tile, index) => {
                    return (
                        <div key={index}
                            draggable={isDraggable}
                            onDragStart={(e) => onDragStart(e, index)}
                            onDragEnter={(e) => onDragEnter(e, index)}
                            onDragEnd={(e) => { setMouseDown(false); onDrop(e) }}
                            onDragOver={onDragOver}>
                            <Cell
                                key={index}
                                index={index}
                                borderless={!isGridVisible}
                                onMouseDown={onMouseDown}
                                onMouseEnter={onMouseEnter}
                                size={cellSize}
                                tile={tile}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
}

function getMouseIcon(action: Action): string {
    switch (action) {
        case Action.Move:
            return 'cursor-grab';
        case Action.Rotate:
            return 'cursor-sw-resize';
        default:
            return 'cursor-crosshair';
    }
}