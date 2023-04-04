import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { zoomLevelAtom } from '../../store';

const minCellSize = 4

export function useZoom() {
    const [zoomLevel] = useAtom(zoomLevelAtom);
    const gridScale = useMemo(() => (minCellSize + zoomLevel) / 10, [zoomLevel]);

    return gridScale;
}