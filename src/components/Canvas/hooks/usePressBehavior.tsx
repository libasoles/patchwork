import { useAtom } from 'jotai';
import { actionAtom, useCanvasApi } from '@/store';
import { Action } from '@/types';
import { useCallback, useRef } from 'react';
import { isHotkeyPressed } from 'react-hotkeys-hook'
import useTransformers, { Transformers } from './useTransformers';
import { emptyTile } from '@/config';
import { createTile } from '@/factory';

const leftButton = 1

export function usePressBehavior() {
    const { getCell, updateCell } = useCanvasApi()
    const [activeAction] = useAtom(actionAtom);
    const transformers: Transformers = useTransformers()

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const { currentCanvas } = useCanvasApi()

    const onMouseDown: OnMouseDown = useCallback((event, index: number) => {
        event.preventDefault()

        const tile = getCell(index)

        const shouldRotate = activeAction === Action.Draw && isHotkeyPressed('ctrl')
        if (shouldRotate) {
            const updatedTile = tile.rotate();
            updateCell(index, updatedTile);
            return
        }

        const shouldDelete = isHotkeyPressed('shift')
        if (shouldDelete) {
            let updatedTile = transformers[Action.Delete](tile)
            updateCell(index, updatedTile);
            return
        }

        dragItem.current = index

        const updatedTile = transformers[activeAction](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        if (isHotkeyPressed('shift') || isHotkeyPressed('ctrl')) return

        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        if (activeAction === Action.Move) {
            dragOverItem.current = index

            const e = event as unknown as DragEvent
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move'; // this instructs browsers to display the move icon instead ofthe copy icon
            }

            return
        }

        const burstAllowed = [Action.Draw, Action.Paint, Action.Delete].includes(activeAction)
        if (!burstAllowed) return

        const tile = getCell(index)
        let updatedTile = transformers[activeAction](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseUp: OnMouseUp = useCallback(() => {
        if (activeAction !== Action.Move)
            return

        if (dragItem.current === null || dragOverItem.current === null)
            return;

        const origin = dragItem.current
        const target = dragOverItem.current

        updateCell(target, currentCanvas()[origin]);
        updateCell(origin, createTile(emptyTile));

        dragItem.current = null;
        dragOverItem.current = null;
    }, [activeAction, updateCell, currentCanvas]);

    const onContextMenu: OnContextMenu = useCallback((event) => {
        event.preventDefault()
        // TODO: move canvas?
    }, [])

    return { onMouseDown, onMouseEnter, onContextMenu, onMouseUp };
}

export type onMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
export type OnMouseDown = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
export type OnMouseUp = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
export type OnContextMenu = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
