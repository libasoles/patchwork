import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { activeTilesAtom } from '../../store';
import { createTile } from "@/factory";
import { GridType } from './Grid';

export function useActiveTiles(grid: GridType) {
    // TODO: maybe use zustand so the reducer logic is outside this component 
    const [_, setActiveTiles] = useAtom(activeTilesAtom);

    const filterActiveTiles = useCallback((grid: GridType) => {
        const comparableTiles = grid.map(tile => {
            return JSON.stringify(createTile({
                id: tile.id,
                symbol: tile.symbol
            }));
        });
        const serializedTileSet = new Set(comparableTiles);

        const activeTileSet = Array.from(serializedTileSet, tile => createTile(JSON.parse(tile)));
        setActiveTiles(activeTileSet);
    }, [setActiveTiles]);

    useEffect(() => {
        filterActiveTiles(grid);
    }, [grid, filterActiveTiles]);
}
