import { emptyTile } from '../../config';
import Cell from './Cell';
import { Tile } from '@/types';
import { createTile } from "@/factory";
import { useAtom } from 'jotai';
import { gridAtom } from '@/store';
import { useEffect } from 'react';
import { useDraw } from './hooks/useDraw';
import { useMoveBehavior } from './hooks/useMoveBehavior';
import { useZoom } from './hooks/useZoom';

const cellSize = 40
export type GridType = Tile[]

type Dimension = { x: number; y: number; }

function emptyGrid(dimension: Dimension): GridType {
    return Array(dimension.x * dimension.y).fill(createTile(emptyTile));
}

type Props = {
    dimension: Dimension;
};

export default function Grid({ dimension }: Props) {
    const [grid, updateGrid] = useAtom(gridAtom);

    useEffect(() => {
        updateGrid(emptyGrid(dimension))
    }, [dimension, updateGrid])

    const gridScale = useZoom()

    const onMove = (from: number, to: number) => {
        grid[to] = grid[from]
        grid[from] = createTile(emptyTile)
        updateGrid([...grid])
    }
    const { isDraggable, onDragStart, onDragEnter, onDrop, onDragOver } = useMoveBehavior(onMove)
    const { setMouseDown, onMouseDown, onMouseEnter } = useDraw(grid, updateGrid)

    return (
        <div
            data-testid='grid'
            className={`grid justify-center gap-0 select-none ${isDraggable ? 'cursor-pointer' : 'cursor-crosshair'}`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${dimension.y}, ${cellSize}px)`,
                transform: `scale(${gridScale})`,
            }}
            onMouseDown={() => { setMouseDown(true) }}
            onMouseUp={() => { setMouseDown(false) }}
        >
            {
                grid.map((tile, index) => {
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

