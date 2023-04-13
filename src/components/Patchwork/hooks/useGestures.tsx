import { useAtom } from 'jotai';
import { canvasOffsetAtom, zoomLevelAtom } from '@/store';
import { useEffect, useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { useCanvasScale } from './useCanvasScale';
import { clamp } from '@/utils';
import { isHotkeyPressed } from 'react-hotkeys-hook';

export function useGestures() {
    const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);
    const [canvasOffset, setOffset] = useAtom(canvasOffsetAtom);

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

        const speed = 40

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
                if (dy) {
                    setZoomLevel((level) => clamp(level + dy, 1, 50));
                }
            },
            onDrag: ({ direction }) => {
                if (!isHotkeyPressed('ctrl'))
                    return

                moveCanvas(direction)
            },
        },
        config
    );

    return { targetRef, offset: canvasOffset };
}
