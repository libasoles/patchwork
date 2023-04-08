import { emptyTile } from '../../config';
import Cell from './components/Cell';
import { Action, Tile } from '@/types';
import { createTile } from "@/factory";
import { useAtom } from 'jotai';
import { actionAtom, canvasAtom, gridVisibilityAtom } from '@/store';
import { useEffect } from 'react';
import { useDraw } from './hooks/useDraw';
import { useMoveBehavior } from './hooks/useMoveBehavior';
import { useZoom } from './hooks/useZoom';

const cellSize = 40
export type CanvasType = Tile[]

type Dimension = { x: number; y: number; }

function emptyCanvas(dimension: Dimension): CanvasType {
    return Array(dimension.x * dimension.y).fill(createTile(emptyTile));
}

type Props = {
    dimension: Dimension;
};

export default function Canvas({ dimension }: Props) {
    const [activeAction] = useAtom(actionAtom);
    const [canvas, updateCanvas] = useAtom(canvasAtom);

    useEffect(() => {
        updateCanvas(emptyCanvas(dimension))
    }, [dimension, updateCanvas])

    const canvasScale = useZoom()

    const onMove = (from: number, to: number) => {
        canvas[to] = canvas[from]
        canvas[from] = createTile(emptyTile)
        updateCanvas([...canvas])
    }
    const { isDraggable, onDragStart, onDragEnter, onDrop, onDragOver } = useMoveBehavior(onMove)
    const { setMouseDown, onMouseDown, onMouseEnter } = useDraw(canvas, updateCanvas)

    const [isGridVisible] = useAtom(gridVisibilityAtom);

    return (
        <div
            data-testid='canvas'
            className={`grid justify-center gap-0 select-none ${getMouseIcon(activeAction)}`}
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
                            onDragEnd={onDrop}
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