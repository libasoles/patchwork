import { useAtom } from 'jotai';
import { actionAtom, useCanvasApi } from '@/store';
import { Action, Tile } from '@/types';
import { useCallback, useRef } from 'react';
import { isHotkeyPressed } from 'react-hotkeys-hook'
import useTransformers, { Transformers } from './useTransformers';
import { canvasDimension, emptyTile } from '@/config';
import { createTile } from '@/factory';
import { toastOnce } from '@/lib/toastOnce';
import { useTranslations } from 'next-intl';
import { isIndexInRegion, TileRegion } from '@/lib/patternProjection';

const leftButton = 1

let moveOrigin: { index: number; cell: Tile; } | null = null
let rollbackCell: { index: number; cell: Tile; } | null = null

// TODO: see if keeping separated hooks with duplicated code is better that a sigle hook with mixed code
const useDrawAndPaintBehavoirs = () => {
    const t = useTranslations('toasts');
    const { getCell, updateCellInBurst } = useCanvasApi()
    const transformers: Transformers = useTransformers()
    const [activeAction] = useAtom(actionAtom);

    const origin = useRef<number | null>(null);

    const onMouseDown: OnMouseDown = useCallback((event, index: number) => {
        if (isHotkeyPressed('ctrl') || isHotkeyPressed('shift') || isHotkeyPressed('alt')) return

        if (![Action.Draw, Action.Paint].includes(activeAction))
            return

        const tile = getCell(index)

        if (activeAction === Action.Paint && tile.isEmpty()) {
            toastOnce('paint-empty', t('paintEmpty'))
            return
        }

        const updatedTile = transformers[activeAction](tile)
        updateCellInBurst(index, updatedTile, index);

        origin.current = index
    }, [activeAction, transformers, getCell, updateCellInBurst, t]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        if (isHotkeyPressed('ctrl') || isHotkeyPressed('shift') || isHotkeyPressed('alt')) return

        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const burstAllowed = [Action.Draw, Action.Paint].includes(activeAction)
        if (!burstAllowed) return

        const tile = getCell(index)
        let updatedTile = transformers[activeAction](tile)
        updateCellInBurst(index, updatedTile, origin.current!);
    }, [activeAction, transformers, getCell, updateCellInBurst]);

    const onContextMenu: OnContextMenu = useCallback((event) => {
        event.preventDefault()
        // TODO: move canvas?
    }, [])

    return { onMouseDown, onMouseEnter, onContextMenu }
}

const useMoveBehavior = () => {
    const t = useTranslations('toasts');
    const { updateCellInBurst, updateCellNotReversible, getCell } = useCanvasApi()
    const [activeAction] = useAtom(actionAtom);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const { currentCanvas } = useCanvasApi()

    const cleanUp = useCallback(() => {
        dragItem.current = null;
        dragOverItem.current = null;
        rollbackCell = null;
        moveOrigin = null;
    }, [])

    const onMouseDown: OnMouseDown = useCallback((event, index: number) => {
        event.preventDefault()

        const shouldMove = activeAction === Action.Move || isHotkeyPressed('shift')
        if (!shouldMove)
            return

        const tile = getCell(index)
        if (tile.isEmpty()) {
            toastOnce('move-empty', t('moveEmpty'))
            return
        }

        dragItem.current = index
    }, [activeAction, getCell, t]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        if (isHotkeyPressed('alt') || isHotkeyPressed('ctrl')) return

        const shouldMove = (activeAction === Action.Move || isHotkeyPressed('shift')) && dragItem.current !== null
        if (!shouldMove)
            return

        dragOverItem.current = index

        const target = dragOverItem.current
        const targetCell = currentCanvas()[target]

        if (moveOrigin === null) {
            const origin = dragItem.current!

            const originCell = currentCanvas()[origin]
            moveOrigin = { index: origin, cell: originCell }
            rollbackCell = { index, cell: targetCell }

            updateCellNotReversible(target, originCell);
            updateCellInBurst(origin, createTile(emptyTile), origin);

            return
        } else {
            updateCellNotReversible(rollbackCell!.index, rollbackCell!.cell);

            rollbackCell = { index, cell: targetCell }

            updateCellNotReversible(target, moveOrigin.cell);
        }
    }, [activeAction, updateCellInBurst, updateCellNotReversible, currentCanvas]);

    const onMouseUp: OnMouseUp = useCallback(() => {
        const shouldMove = activeAction === Action.Move || isHotkeyPressed('shift')
        if (!shouldMove || !moveOrigin!!) {
            cleanUp()
            return
        }

        const origin = moveOrigin!.cell
        const target = dragOverItem.current!
        updateCellNotReversible(target, createTile(emptyTile));
        updateCellInBurst(target, origin, moveOrigin!.index);

        cleanUp()
    }, [activeAction, updateCellNotReversible, updateCellInBurst, cleanUp]);

    return { onMouseDown, onMouseEnter, onMouseUp };
}

const useRotateBehavior = () => {
    const t = useTranslations('toasts');
    const { getCell, updateCellInBurst } = useCanvasApi()
    const transformers: Transformers = useTransformers()
    const [activeAction] = useAtom(actionAtom);

    const origin = useRef<number | null>(null);

    const onMouseDown: OnMouseDown = useCallback((_, index: number) => {
        const shouldRotate = activeAction === Action.Rotate || isHotkeyPressed('ctrl')
        if (!shouldRotate)
            return

        const tile = getCell(index)

        if (tile.isEmpty()) {
            toastOnce('rotate-empty', t('rotateEmpty'))
            return
        }

        const updatedTile = transformers[Action.Rotate](tile)
        updateCellInBurst(index, updatedTile, index);

        origin.current = index
    }, [activeAction, transformers, getCell, updateCellInBurst, t]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        const shouldRotate = activeAction === Action.Rotate || isHotkeyPressed('ctrl')
        if (!shouldRotate)
            return

        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const tile = getCell(index)
        let updatedTile = transformers[Action.Rotate](tile)
        updateCellInBurst(index, updatedTile, origin.current!);
    }, [activeAction, transformers, getCell, updateCellInBurst]);

    return { onMouseDown, onMouseEnter }
}

const useDeleteBehavior = () => {
    const { getCell, updateCellInBurst } = useCanvasApi()
    const transformers: Transformers = useTransformers()
    const [activeAction] = useAtom(actionAtom);

    const origin = useRef<number | null>(null);

    const onMouseDown: OnMouseDown = useCallback((_, index: number) => {
        const shouldDelete = activeAction === Action.Delete || isHotkeyPressed('alt')
        if (!shouldDelete)
            return

        const tile = getCell(index)

        if (tile.isEmpty())
            return

        const updatedTile = transformers[Action.Delete](tile)
        updateCellInBurst(index, updatedTile, index);
        origin.current = index
    }, [activeAction, transformers, getCell, updateCellInBurst]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        const shouldDelete = activeAction === Action.Delete || isHotkeyPressed('alt')
        if (!shouldDelete)
            return

        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const tile = getCell(index)

        if (tile.isEmpty())
            return

        let updatedTile = transformers[Action.Delete](tile)
        updateCellInBurst(index, updatedTile, origin.current!);
    }, [activeAction, transformers, getCell, updateCellInBurst]);

    return { onMouseDown, onMouseEnter }
}

export function usePointerEvents(editableRegion: TileRegion | null = null) {
    const t = useTranslations('toasts');
    const drawBehavior = useDrawAndPaintBehavoirs()
    const moveBehavior = useMoveBehavior()
    const rotateBehavior = useRotateBehavior()
    const deleteBehavior = useDeleteBehavior()

    const canEdit = (index: number) => !editableRegion || isIndexInRegion(index, canvasDimension, editableRegion)

    const onMouseDown: Callback = (...args) => {
        const [, index] = args
        if (!canEdit(index)) {
            toastOnce('repeat-pattern-original-only', t('repeatPatternOriginalOnly'))
            return
        }

        drawBehavior.onMouseDown(...args);
        rotateBehavior.onMouseDown(...args);
        deleteBehavior.onMouseDown(...args);
        moveBehavior.onMouseDown(...args);
    }

    const onMouseEnter: Callback = (...args) => {
        const [, index] = args
        if (!canEdit(index)) return

        drawBehavior.onMouseEnter(...args);
        rotateBehavior.onMouseEnter(...args);
        deleteBehavior.onMouseEnter(...args);
        moveBehavior.onMouseEnter(...args);
    }

    const onMouseUp: Callback = (...args) => {
        moveBehavior.onMouseUp(...args);
    }

    const onContextMenu: Callback = (...args) => {
        drawBehavior.onContextMenu(...args);
    }

    // Touch devices don't fire mouseenter while dragging a finger (the touch is
    // captured by the element where it started). So we resolve the cell under the
    // finger on every touchmove via elementFromPoint and drive the same handlers.
    const lastTouchIndex = useRef<number | null>(null)

    const onTouchStart: TouchCallback = (event) => {
        if (event.touches.length !== 1) return // let multi-touch (pinch/pan) through
        const index = indexUnderTouch(event.touches[0])
        if (index === null) return
        lastTouchIndex.current = index
        onMouseDown(touchAsMouse, index)
    }

    const onTouchMove: TouchCallback = (event) => {
        if (event.touches.length !== 1) return
        const index = indexUnderTouch(event.touches[0])
        if (index === null || index === lastTouchIndex.current) return
        lastTouchIndex.current = index
        onMouseEnter(touchAsMouse, index)
    }

    const onTouchEnd: TouchCallback = () => {
        if (lastTouchIndex.current !== null) onMouseUp(touchAsMouse, lastTouchIndex.current)
        lastTouchIndex.current = null
    }

    return {
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        onContextMenu,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    } as Api
}

// Resolve the cell index under a touch point via its `data-index` attribute.
function indexUnderTouch(touch: React.Touch): number | null {
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    const cell = target?.closest<HTMLElement>('[data-index]')
    if (!cell) return null
    const index = Number(cell.dataset.index)
    return Number.isNaN(index) ? null : index
}

// The cell handlers only read `event.buttons` (to detect a held drag) and
// `event.preventDefault`; touch drags are always "pressed", so we fake both.
const touchAsMouse = { buttons: leftButton, preventDefault() {} } as unknown as React.MouseEvent<HTMLButtonElement>

type Api = {
    onMouseDown: Callback,
    onMouseEnter: Callback,
    onMouseUp: Callback,
    onContextMenu: Callback,
    onTouchStart: TouchCallback,
    onTouchMove: TouchCallback,
    onTouchEnd: TouchCallback,
}

type Callback = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
type TouchCallback = (e: React.TouchEvent<HTMLElement>) => void

export type onMouseEnter = Callback
export type OnMouseDown = Callback
export type OnMouseUp = Callback
export type OnContextMenu = Callback
