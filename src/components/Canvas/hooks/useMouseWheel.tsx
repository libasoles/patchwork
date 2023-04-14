import { useAtom } from 'jotai';
import { zoomLevelAtom } from '@/store';
import { useWheel } from '@use-gesture/react';
import { clamp } from '@/utils';

export function useMouseWheel() {
    const [, setZoomLevel] = useAtom(zoomLevelAtom);

    const config = { eventOptions: { passive: false } }

    const bind = useWheel(
        ({ event, offset: [, y], direction: [, dy] }) => {
            event.preventDefault();
            if (dy)
                setZoomLevel((level) => clamp(level + dy, 1, 50));

        },
        config
    );

    return { bind };
}
