import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai'
import { actionAtom, activeTilesAtom, colorAtom, mouseDownAtom, selectedTileAtom, zoomLevelAtom } from '../../store';
import { emptyTile } from '../../config';
import Cell from './Cell';
import { Action, Tile } from '@/types';
import { createTile } from "@/factory";

const cellSize = 40
const minCellSize = 4

type Grid = Tile[]

type Dimension = { x: number; y: number; }

function emptyGrid(dimension: Dimension): Grid {
    return Array(dimension.x * dimension.y).fill(createTile(emptyTile));
}

type Props = {
    dimension: Dimension;
};

function useZoom() {
    const [zoomLevel] = useAtom(zoomLevelAtom)
    const gridScale = useMemo(() => (minCellSize + zoomLevel) / 10, [zoomLevel]);

    return gridScale
}

function useDraw(grid: Grid, updateGrid: (tiles: Grid) => void) {
    const [activeAction] = useAtom(actionAtom);
    const [selected] = useAtom(selectedTileAtom);

    const [color] = useAtom(colorAtom)
    const [isMouseDown, setMouseDown] = useAtom(mouseDownAtom)

    const currentTile = selected || createTile(emptyTile)

    // TODO: see if this can be otimized with useCallback, so we don't create methods each time?
    const onMouseDown = (index: number) => {
        // TODO: improve this code, and implement an enum for actions
        if (activeAction === Action.Draw) {
            grid[index] = {
                ...currentTile,
                color
            };
        } else if (activeAction === Action.Paint) {
            grid[index] = {
                ...grid[index],
                color
            };
        }
        updateGrid([...grid]);
    }

    const onMouseEnter = (index: number) => {
        if (!isMouseDown) return
        onMouseDown(index)
    }

    return { setMouseDown, onMouseDown, onMouseEnter }
}

function useActiveTiles(grid: Grid) {
    // TODO: maybe use zustand so the reducer logic is outside this component 
    const [_, setActiveTiles] = useAtom(activeTilesAtom);

    const filterActiveTiles = useCallback((grid: Grid) => {
        const comparableTiles = grid.map(tile => {
            return JSON.stringify(createTile({
                id: tile.id,
                symbol: tile.symbol
            }))
        })
        const serializedTileSet = new Set(comparableTiles)

        const activeTileSet = Array.from(serializedTileSet, tile => createTile(JSON.parse(tile)))
        setActiveTiles(activeTileSet)
    }, [setActiveTiles])

    useEffect(() => {
        filterActiveTiles(grid)
    }, [grid, filterActiveTiles])
}

export default function Grid({ dimension }: Props) {
    const [grid, updateGrid] = useState(emptyGrid(dimension));

    const { setMouseDown, onMouseDown, onMouseEnter } = useDraw(grid, updateGrid)

    const gridScale = useZoom()

    useActiveTiles(grid)

    return (
        <div className="grid justify-center gap-0"
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
                            tile={tile} />
                    );
                })
            }
        </div>
    );
}

