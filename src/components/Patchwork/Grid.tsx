import { useState } from 'react';
import { emptyTile } from '../../config';
import Cell from './Cell';
import { Tile } from '@/types';
import { createTile } from "@/factory";
import { useMoveBehavior } from './useMoveBehavior';
import { useActiveTiles } from './useActiveTiles';
import { useDraw } from './useDraw';
import { useZoom } from './useZoom';

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
    const [grid, updateGrid] = useState(emptyGrid(dimension));
    const { setMouseDown, onMouseDown, onMouseEnter } = useDraw(grid, updateGrid)
    const gridScale = useZoom()

    const onMove = (from: number, to: number) => {
        grid[to] = grid[from]
        grid[from] = createTile(emptyTile)
        updateGrid([...grid])
    }
    const moveBehavior = useMoveBehavior(onMove)
    useActiveTiles(grid)

    return (
        <div
            data-testid='grid'
            className="grid justify-center gap-0 select-none"
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
                        <Cell
                            key={index}
                            index={index}
                            onMouseDown={onMouseDown}
                            onMouseEnter={onMouseEnter}
                            size={cellSize}
                            tile={tile}
                            moveBehavior={moveBehavior}
                        />
                    );
                })
            }
        </div>
    );
}

