import { useAtom } from 'jotai';
import { actionAtom, useCanvasApi, zoomLevelAtom } from '@/store';
import { useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { clamp } from '@/utils';
import { isHotkeyPressed } from 'react-hotkeys-hook';
import useTransformers, { Transformers } from './useTransformers';
import { Action } from '@/types';
import { emptyTile } from '@/config';
import { createTile } from '@/factory';
import { useSpring, animated } from '@react-spring/web'
import { useCanvasScale } from './useCanvasScale';

export function useGestures() {
    const [, setZoomLevel] = useAtom(zoomLevelAtom);

    const { getCell, updateCell } = useCanvasApi()

    const [activeAction] = useAtom(actionAtom);

    const canvasScale = useCanvasScale()

    const transformers: Transformers = useTransformers()

    const config = { wheel: { eventOptions: { passive: false } } }

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const { currentCanvas } = useCanvasApi()

    const bind = useGesture(
        {
            onWheel: ({ event, offset: [, y], direction: [, dy] }) => {
                event.preventDefault();
                if (dy)
                    setZoomLevel((level) => clamp(level + dy, 1, 50));

            },
            onDragStart: ({ event }) => {
                const { index } = getHoveredElement(event)

                if (!index) return

                dragItem.current = index
            },
            onDrag: ({ event, down, movement: [mx, my] }) => {
                // TODO: onDrag shouldn't be called on click at all
                if (isHotkeyPressed('shift') || isHotkeyPressed('ctrl')) return

                const { element, index, coordinates } = getHoveredElement(event)
                if (!index) return

                if (activeAction === Action.Move) {
                    dragOverItem.current = index
                    api.start({ x: down ? mx / canvasScale : 0, y: down ? my / canvasScale : 0, immediate: down })

                    return
                }

                const burstAllowed = [Action.Draw, Action.Paint, Action.Delete].includes(activeAction)
                if (!burstAllowed) return

                const tile = getCell(index)
                let updatedTile = transformers[activeAction](tile)

                updateCell(index, updatedTile);
            },
            onDragEnd: () => {
                if (activeAction !== Action.Move) return

                if (dragItem.current === null || dragOverItem.current === null)
                    return;

                const origin = dragItem.current
                const target = dragOverItem.current

                updateCell(target, currentCanvas()[origin]);
                updateCell(origin, createTile(emptyTile));

                dragItem.current = null;
                dragOverItem.current = null;
            }
        },
        config
    );

    return { bind, animated, position: { x, y } };
}

function getHoveredElement(event: MouseEvent | TouchEvent | KeyboardEvent) {
    const coordinates = (event instanceof TouchEvent) ? event.changedTouches[0] : event as MouseEvent | PointerEvent
    const hoveredElement = document
        .elementsFromPoint(coordinates.clientX, coordinates.clientY)
        .find(element => element.tagName === "BUTTON");

    if (!hoveredElement) return {}

    return {
        coordinates,
        element: hoveredElement as HTMLButtonElement,
        index: Number(hoveredElement.getAttribute('data-index')!)
    }
}