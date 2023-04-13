import { useAtom } from 'jotai';
import { actionAtom, useCanvasApi } from '@/store';
import { Action } from '@/types';
import { useCallback } from 'react';
import { isHotkeyPressed } from 'react-hotkeys-hook'
import useTransformers, { Transformers } from './useTransformers';

export function usePressBehavior() {
    const { getCell, updateCell } = useCanvasApi()
    const [activeAction] = useAtom(actionAtom);
    const transformers: Transformers = useTransformers()

    const onMouseDown: OnMouseDown = useCallback((event, index: number) => {
        event.preventDefault()

        if (isHotkeyPressed('ctrl'))
            return

        const tile = getCell(index)

        let updatedTile = transformers[activeAction](tile)

        const shouldRotate = activeAction === Action.Draw && tile.looksLike(updatedTile)

        if (shouldRotate) {
            updatedTile = updatedTile.rotate();
        }

        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onContextMenu: OnContextMenu = useCallback((event) => {
        event.preventDefault()
        // TODO: move canvas?
    }, [])

    return { onMouseDown, onContextMenu };
}

export type OnMouseDown = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
export type OnContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => void
