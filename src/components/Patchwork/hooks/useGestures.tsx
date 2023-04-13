import { useAtom } from 'jotai';
import { actionAtom, canvasOffsetAtom, useCanvasApi, zoomLevelAtom } from '@/store';
import { useEffect, useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { useCanvasScale } from './useCanvasScale';
import { clamp } from '@/utils';
import { isHotkeyPressed } from 'react-hotkeys-hook';
import useTransformers, { Transformers } from './useTransformers';
import { Action } from '@/types';

export function useGestures() {
    const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);
    const [canvasOffset, setOffset] = useAtom(canvasOffsetAtom);

    const { getCell, updateCell } = useCanvasApi()

    const [activeAction] = useAtom(actionAtom);

    const transformers: Transformers = useTransformers()

    const canvasScale = useCanvasScale()

    const targetRef = useRef<HTMLDivElement>(null);

    const config = { target: targetRef, wheel: { eventOptions: { passive: false } } }

    const moveCanvas = ([dx = 0, dy = 0]) => {
        const canvas = targetRef.current!
        const innerRect = canvas.getBoundingClientRect();
        const outerRect = canvas.parentElement!.getBoundingClientRect();

        const innerRectRight = innerRect.x + innerRect.width;
        const innerRectBottom = innerRect.y + innerRect.height;

        const outerRectRight = outerRect.x + outerRect.width;
        const outerRectBottom = outerRect.y + outerRect.height;

        // TODO: calculate these widths dynamically
        const sidebarWidth = 200
        const colorBarWidth = 60

        const speed = 35

        const topBoundary = innerRect.y * canvasScale
        const leftBoundary = (innerRect.x - sidebarWidth) * canvasScale
        const bottomBoundary = (innerRectRight + colorBarWidth)
        const rightBoundary = innerRectBottom

        const topReached = dy >= 0 && topBoundary > 0
        const rightReached = dy <= 0 && rightBoundary < outerRectBottom
        const bottomReached = dx <= 0 && bottomBoundary < outerRectRight
        const leftReached = dx >= 0 && leftBoundary > 0

        if ([topReached, rightReached, bottomReached, leftReached].some(Boolean))
            return

        return setOffset({
            x: canvasOffset.x + dx * speed,
            y: canvasOffset.y + dy * speed,
        });
    }

    useEffect(() => {
        moveCanvas([0, 0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoomLevel])

    useGesture(
        {
            onWheel: ({ event, offset: [, y], direction: [, dy] }) => {
                event.preventDefault();
                if (dy)
                    setZoomLevel((level) => clamp(level + dy, 1, 50));

            },
            onDrag: ({ direction }) => {
                if (isHotkeyPressed('ctrl')) {
                    moveCanvas(direction)
                    return
                }

                const burstAllowed = [Action.Draw, Action.Paint, Action.Delete].includes(activeAction)
                if (!burstAllowed) return

                const index = getHoveredCell()
                if (!index) return

                const tile = getCell(index)
                let updatedTile = transformers[activeAction](tile)

                updateCell(index, updatedTile);
            },
        },
        config
    );

    return { targetRef, offset: canvasOffset };
}

function getHoveredCell() {
    const coordinates = (event instanceof TouchEvent) ? event.changedTouches[0] : event as MouseEvent | PointerEvent
    const hoveredElement = document
        .elementsFromPoint(coordinates.clientX, coordinates.clientY)
        .find(element => element.tagName === "BUTTON");

    if (!hoveredElement) return

    return Number(hoveredElement.getAttribute('data-index')!)
}