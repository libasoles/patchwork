import { useAtom } from 'jotai';
import { actionAtom, colorAtom, selectedTileAtom, useLayersStore } from '@/store';
import { Action, Tile } from '@/types';
import { useCallback, useMemo } from 'react';

type Transformers = Record<Action, (tile: Tile) => Tile>
const useTransformers = () => {
    const [selectedTile] = useAtom(selectedTileAtom);

    const [color] = useAtom(colorAtom);

    return useMemo(() => ({
        [Action.Draw]: (tile: Tile) => selectedTile.clone({ orientation: tile.orientation }).paint(color),
        [Action.Paint]: (tile: Tile) => tile.paint(color),
        [Action.Rotate]: (tile: Tile) => tile.rotate(),
        [Action.Move]: (tile: Tile) => tile, // TODO: get rid of this one?
        [Action.Delete]: (tile: Tile) => tile.reset()
    }), [selectedTile, color])
}

export function usePressBehavior(updateCell: (index: number, tile: Tile) => void) {
    const { getCell } = useLayersStore()
    const [activeAction] = useAtom(actionAtom);
    const transformers: Transformers = useTransformers()

    const onMouseDown: OnMouseDown = useCallback((index: number) => {
        const tile = getCell(index)

        let updatedTile = transformers[activeAction](tile)

        const shouldRotate = activeAction === Action.Draw && tile.looksLike(updatedTile)

        if (shouldRotate) {
            updatedTile = updatedTile.rotate();
        }

        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const tile = getCell(index)

        let updatedTile = transformers[activeAction](tile)

        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    return { onMouseDown, onMouseEnter };
}

const leftButton = 1

export type OnMouseDown = (index: number) => void
export type onMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
