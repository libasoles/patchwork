import { useAtom } from 'jotai';
import { canvasOffsetAtom, zoomLevelAtom } from '@/store';
import { useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { useCanvasScale } from './useCanvasScale';

export function useZoomOnWheel() {
    const [, setZoomLevel] = useAtom(zoomLevelAtom);
    const [canvasOffset, setOffset] = useAtom(canvasOffsetAtom);

    const canvasScale = useCanvasScale()

    const targetRef = useRef<HTMLDivElement>(null);

    const config = { target: targetRef, wheel: { eventOptions: { passive: false } } }

    useGesture(
        {
            onWheel: ({ event, offset: [, y], direction: [, dy] }) => {
                event.preventDefault();
                if (dy) {
                    setZoomLevel((level) => clamp(level + dy, 1, 50));
                }
            },
            onDrag: ({ direction: [dx, dy] }) => {
                if (dy > 0 && canvasOffset.y * canvasScale > 0) return;
                if (dy < 0 && canvasOffset.y * canvasScale < 0) return;
                if (dx > 0 && canvasOffset.x * canvasScale > 0) return;
                if (dx < 0 && canvasOffset.x * canvasScale < 0) return;

                const factor = 30
                setOffset({
                    x: canvasOffset.x + dx * factor,
                    y: canvasOffset.y + dy * factor,
                });
            },
        },
        config
    );

    return { targetRef, offset: canvasOffset };
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}