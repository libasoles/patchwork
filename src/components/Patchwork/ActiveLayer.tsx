import Cell from './components/Cell';
import { useDraw } from './hooks/useDraw';
import { useMoveBehavior } from './hooks/useMoveBehavior';
import { createTile } from '@/factory';
import { emptyTile } from '@/config';
import { cellSize } from './Canvas';
import { Canvas } from '@/types';
import { LayerProps } from './Layer';

type ActiveLayerProps = LayerProps & {
    cursor: (isCellEmpty: boolean) => string,
    updateCanvas: (canvas: Canvas) => void
}

export default function ActiveLayer({ canvas, dimension, updateCanvas, cursor, canvasScale, isGridVisible }: ActiveLayerProps) {

    const onMove = (from: number, to: number) => {
        canvas[to] = canvas[from];
        canvas[from] = createTile(emptyTile);

        updateCanvas(canvas);
    };

    const { isDraggable, onDragStart, onDragEnter, onDrop, onDragOver } = useMoveBehavior(onMove);
    const { setMouseDown, onMouseDown, onMouseEnter } = useDraw(canvas, updateCanvas);

    return (
        <div
            data-testid='selected-canvas'
            className={`grid justify-center gap-0 select-none h-full w-full absolute top-0 bottom-0 left-0 right-0`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${dimension.y}, ${cellSize}px)`,
                transform: `scale(${canvasScale})`,
            }}
            onMouseDown={() => { setMouseDown(true); }}
            onMouseUp={() => { setMouseDown(false); }}
        >
            {canvas.map((tile, index) => {
                return (
                    <div key={index}
                        className={`${cursor(tile.isEmpty())}`}
                        draggable={isDraggable}
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragEnter={(e) => onDragEnter(e, index)}
                        onDragEnd={(e) => { setMouseDown(false); onDrop(e); }}
                        onDragOver={onDragOver}>
                        <Cell
                            index={index}
                            borderless={!isGridVisible}
                            onMouseDown={onMouseDown}
                            onMouseEnter={onMouseEnter}
                            size={cellSize}
                            tile={tile} />
                    </div>
                );
            })}
        </div>
    );
}
