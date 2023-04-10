import { useAtom } from 'jotai';
import { zoomLevelAtom } from '@/store';
import { useRef } from 'react';
import { useGesture } from '@use-gesture/react';

export function useZoomOnWheel() {
    const [, setZoomLevel] = useAtom(zoomLevelAtom);
    const target = useRef<HTMLDivElement>(null);

    useGesture(
        {
            onWheel: ({ event, offset: [, y], direction: [, dy] }) => {
                event.preventDefault();
                if (dy) {
                    setZoomLevel((level) => clamp(level + dy, 1, 50));
                }
            },
        },
        { target, wheel: { eventOptions: { passive: false } } }
    );

    return target;
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}