import { useCallback, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { activeTilesAtom, useStore } from '@/store';
import { createTile } from "@/factory";
import { Canvas } from '@/types';

export function useActiveTiles() {
    const layers = useStore(((state) => state.layers))
    const combinedCanvas = useMemo(() => Array.from(layers).reduce((all, [, layer]) => all.concat(layer.canvas.cells), [] as Canvas), [layers])

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
        filterActiveTiles(combinedCanvas);
    }, [combinedCanvas, filterActiveTiles]);

    return activeTiles
}
