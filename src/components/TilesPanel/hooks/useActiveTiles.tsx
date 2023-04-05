import { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { activeTilesAtom, gridAtom } from '@/store';
import { createTile } from "@/factory";
import { GridType } from '../../Patchwork/Grid';

export function useActiveTiles() {
    const [grid] = useAtom(gridAtom);

    const [activeTiles, setActiveTiles] = useAtom(activeTilesAtom);

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

    return activeTiles
}
