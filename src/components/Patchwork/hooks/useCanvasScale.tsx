import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { zoomLevelAtom } from '@/store';

const minCellSize = 4

export function useCanvasScale() {
    const [zoomLevel] = useAtom(zoomLevelAtom);
    const canvasScale = useMemo(() => (minCellSize + zoomLevel) / 10, [zoomLevel]);

    return canvasScale;
}
