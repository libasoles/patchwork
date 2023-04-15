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

const useDrawAndPaintBehavoirs = () => {
    const { getCell, updateCell } = useCanvasApi()
    const transformers: Transformers = useTransformers()
    const [activeAction] = useAtom(actionAtom);

    const onMouseDown: OnMouseDown = useCallback((event, index: number) => {
        if (![Action.Draw, Action.Paint].includes(activeAction))
            return

        const tile = getCell(index)

        const updatedTile = transformers[activeAction](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        // if (isHotkeyPressed('shift') || isHotkeyPressed('ctrl')) return
        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const burstAllowed = [Action.Draw, Action.Paint].includes(activeAction)
        if (!burstAllowed) return

        const tile = getCell(index)
        let updatedTile = transformers[activeAction](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onContextMenu: OnContextMenu = useCallback((event) => {
        event.preventDefault()
        // TODO: move canvas?
    }, [])

    return { onMouseDown, onMouseEnter, onContextMenu }
}

const useMoveBehavior = () => {
    const { updateCell } = useCanvasApi()
    const [activeAction] = useAtom(actionAtom);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const { currentCanvas } = useCanvasApi()

    const onMouseDown: OnMouseDown = useCallback((event, index: number) => {
        event.preventDefault()

        // const isRightButtonDown = event.buttons === leftButton
        if (activeAction !== Action.Move)
            return

        dragItem.current = index
    }, [activeAction]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        if (isHotkeyPressed('shift') || isHotkeyPressed('ctrl')) return

        if (activeAction !== Action.Move || dragItem.current === null)
            return

        dragOverItem.current = index

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
    }, [activeAction, updateCell, currentCanvas]);

    const onMouseUp: OnMouseUp = useCallback(() => {
        if (activeAction !== Action.Move)
            return

        dragItem.current = null;
        dragOverItem.current = null;
        rollbackCell = null;
        moveOrigin = null;
    }, [activeAction]);

    return { onMouseDown, onMouseEnter, onMouseUp };
}

const useRotateBehavior = () => {
    const { getCell, updateCell } = useCanvasApi()
    const transformers: Transformers = useTransformers()
    const [activeAction] = useAtom(actionAtom);

    const onMouseDown: OnMouseDown = useCallback((_, index: number) => {
        const shouldRotate = activeAction === Action.Rotate || isHotkeyPressed('ctrl')
        if (!shouldRotate)
            return

        const tile = getCell(index)
        const updatedTile = transformers[Action.Rotate](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        const shouldRotate = activeAction === Action.Rotate || isHotkeyPressed('ctrl')
        if (!shouldRotate)
            return

        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const tile = getCell(index)
        let updatedTile = transformers[Action.Rotate](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    return { onMouseDown, onMouseEnter }
}

const useDeleteBehavior = () => {
    const { getCell, updateCell } = useCanvasApi()
    const transformers: Transformers = useTransformers()
    const [activeAction] = useAtom(actionAtom);

    const onMouseDown: OnMouseDown = useCallback((_, index: number) => {
        const shouldDelete = activeAction === Action.Delete || isHotkeyPressed('shift')
        if (!shouldDelete)
            return

        const tile = getCell(index)

        if (tile.isEmpty())
            return

        const updatedTile = transformers[Action.Delete](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        const shouldDelete = activeAction === Action.Delete || isHotkeyPressed('shift')
        if (!shouldDelete)
            return

        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const tile = getCell(index)

        if (tile.isEmpty())
            return

        let updatedTile = transformers[Action.Delete](tile)
        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    return { onMouseDown, onMouseEnter }
}

export function usePointerEvents() {
    const drawBehavior = useDrawAndPaintBehavoirs()
    const moveBehavior = useMoveBehavior()
    const rotateBehavior = useRotateBehavior()
    const deleteBehavior = useDeleteBehavior()

    return {
        onMouseDown: (...args) => {
            drawBehavior.onMouseDown(...args);
            rotateBehavior.onMouseDown(...args);
            deleteBehavior.onMouseDown(...args);
            moveBehavior.onMouseDown(...args);
        },
        onMouseEnter: (...args) => {
            drawBehavior.onMouseEnter(...args);
            moveBehavior.onMouseEnter(...args);
            rotateBehavior.onMouseEnter(...args);
            deleteBehavior.onMouseEnter(...args);
        },
        onMouseUp: (...args) => {
            moveBehavior.onMouseUp(...args);
        },
        onContextMenu: (...args) => {
            drawBehavior.onContextMenu(...args);
        }
    } as {
        onMouseDown: Callback,
        onMouseEnter: Callback,
        onMouseUp: Callback,
        onContextMenu: Callback,
    }
}

type Callback = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void

export type onMouseEnter = Callback
export type OnMouseDown = Callback
export type OnMouseUp = Callback
export type OnContextMenu = Callback