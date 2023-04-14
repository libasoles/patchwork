import { useAtom } from 'jotai';
import { actionAtom, useCanvasApi } from '@/store';
import { Action, Tile } from '@/types';
import { useCallback, useRef } from 'react';
import { isHotkeyPressed } from 'react-hotkeys-hook'
import useTransformers, { Transformers } from './useTransformers';
import { emptyTile } from '@/config';
import { createTile } from '@/factory';

const leftButton = 1

let moveOrigin: { index: number; cell: Tile; } | null = null
let rollbackCell: { index: number; cell: Tile; } | null = null

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

            if (dragOverItem.current === null)
                return;

            const target = dragOverItem.current
            const targetCell = currentCanvas()[target]

            if (moveOrigin === null) {
                const origin = dragItem.current!

                const originCell = currentCanvas()[origin]
                moveOrigin = { index: origin, cell: originCell }
                rollbackCell = { index, cell: targetCell }

                updateCell(target, originCell);
                updateCell(origin, createTile(emptyTile));

                return
            } else {
                updateCell(rollbackCell!.index, rollbackCell!.cell);

                rollbackCell = { index, cell: targetCell }

                updateCell(target, moveOrigin.cell);
            }

            return
        }

        const burstAllowed = [Action.Draw, Action.Paint, Action.Delete].includes(activeAction)
        if (!burstAllowed) return

        const tile = getCell(index)
        let updatedTile = transformers[activeAction](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell, currentCanvas]);

    const onMouseUp: OnMouseUp = useCallback(() => {
        if (activeAction !== Action.Move)
            return

        dragItem.current = null;
        dragOverItem.current = null;
        rollbackCell = null;
        moveOrigin = null;
    }, [activeAction]);

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
