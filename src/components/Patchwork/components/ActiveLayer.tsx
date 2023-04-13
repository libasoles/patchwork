import Cell from './Cell';
import { usePressBehavior } from '../hooks/usePressBehavior';
import { useMoveBehavior } from '../hooks/useMoveBehavior';
import { createTile } from '@/factory';
import { emptyTile } from '@/config';
import { cellSize } from '../Canvas';
import { LayerProps } from './Layer';
import { useCanvasApi } from '@/store';

type ActiveLayerProps = LayerProps & {
    cursor: (isCellEmpty: boolean) => string,
}

export default function ActiveLayer({
    canvas,
    dimension,
    cursor,
    isDisabled = false
}: ActiveLayerProps) {
    const { updateCell } = useCanvasApi()

    const onMove = (origin: number, target: number) => {
        updateCell(target, canvas[origin]);
        updateCell(origin, createTile(emptyTile));
    };

    const { isDraggable, onDragStart, onDragEnter, onDrop, onDragOver } = useMoveBehavior(onMove);
    const { onMouseDown, onContextMenu } = usePressBehavior();

    return (
        <div
            data-testid='selected-canvas'
            className={`grid justify-center content-center select-none ${isDisabled && 'opacity-20'} absolute top-0 bottom-0 left-0 right-0`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, 40px)`,
                gridTemplateRows: `repeat(${dimension.y}, 40px)`,
            }}
        >
            {
                canvas.map((tile, index) => {
                    return (
                        <div
                            key={index}
                            className={`${cursor(tile.isEmpty())}`}
                            draggable={isDraggable}
                            onDragStart={(e) => onDragStart(e, index)}
                            onDragEnter={(e) => onDragEnter(e, index)}
                            onDragEnd={onDrop}
                            onDragOver={onDragOver}>
                            <Cell
                                index={index}
                                borderless
                                onMouseDown={onMouseDown}
                                onContextMenu={onContextMenu}
                                size={cellSize}
                                tile={tile} />
                        </div>
                    );
                })
            }
        </div>
    )
}
