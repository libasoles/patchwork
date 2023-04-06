import { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { activeTilesAtom, canvasAtom } from '@/store';
import { createTile } from "@/factory";
import { CanvasType } from '../../Patchwork/Canvas';

export function useActiveTiles() {
    const [canvas] = useAtom(canvasAtom);

    const [activeTiles, setActiveTiles] = useAtom(activeTilesAtom);

    const filterActiveTiles = useCallback((canvas: CanvasType) => {
        const comparableTiles = canvas.map(tile => {
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
        filterActiveTiles(canvas);
    }, [canvas, filterActiveTiles]);

    return activeTiles
}
