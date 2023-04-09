import { useAtom } from 'jotai';
import { actionAtom, colorAtom, mouseDownAtom, selectedTileAtom, useLayersStore } from '@/store';
import { emptyTile } from '@/config';
import { Action, Tile } from '@/types';
import { createTile } from "@/factory";
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';

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