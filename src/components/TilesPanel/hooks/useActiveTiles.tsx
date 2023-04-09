import { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { activeTilesAtom, useLayersStore } from '@/store';
import { createTile } from "@/factory";
import { Canvas } from '@/types';

export function useActiveTiles() {
    const { getCurrentCanvas } = useLayersStore()
    // TODO: Get active tiles from every layer
    const canvas = getCurrentCanvas()

    const [activeTiles, setActiveTiles] = useAtom(activeTilesAtom);

    const filterActiveTiles = useCallback((canvas: Canvas) => {
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
