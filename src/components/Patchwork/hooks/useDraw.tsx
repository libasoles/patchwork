import { useAtom } from 'jotai';
import { actionAtom, colorAtom, mouseDownAtom, selectedTileAtom, useLayersStore } from '@/store';
import { emptyTile } from '@/config';
import { Action, Tile } from '@/types';
import { createTile } from "@/factory";
import { useCallback, useMemo } from 'react';

type Transformers = Record<Action, (tile: Tile) => Tile>
const useTransformers = () => {
    const [selectedTile] = useAtom(selectedTileAtom);

    const [color] = useAtom(colorAtom);
    const currentTile = selectedTile || createTile(emptyTile); // TODO: maybe select a default tile on page load

    return useMemo(() => ({
        [Action.Draw]: (tile: Tile) => currentTile.clone({ orientation: tile.orientation }).paint(color),
        [Action.Paint]: (tile: Tile) => tile.paint(color),
        [Action.Rotate]: (tile: Tile) => tile.rotate(),
        [Action.Move]: (tile: Tile) => tile // TODO: get rid of this one?
    }), [currentTile, color])
}

export function useDraw(updateCell: (index: number, tile: Tile) => void) {
    const { getCell } = useLayersStore()
    const [activeAction] = useAtom(actionAtom);
    const [isMouseDown, setMouseDown] = useAtom(mouseDownAtom);
    const transformers: Transformers = useTransformers()

    const onMouseDown = useCallback((index: number) => {
        const tile = getCell(index)

        let updatedTile = transformers[activeAction](tile)

        const shouldRotate = activeAction === Action.Draw && tile.looksLike(updatedTile)

        if (shouldRotate) {
            updatedTile = updatedTile.rotate();
        }

        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseEnter = useCallback((index: number) => {
        // TODO: all canvas is rerendering because of this single dependency in isMouseDown
        if (!isMouseDown) return;
        const tile = getCell(index)

        let updatedTile = transformers[activeAction](tile)

        updateCell(index, updatedTile);
    }, [activeAction, transformers, isMouseDown, getCell, updateCell]);

    return { setMouseDown, onMouseDown, onMouseEnter };
}
