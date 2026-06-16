import { useAtom } from 'jotai';
import { bgColorAtom, canvasOffsetAtom, gridVisibilityAtom, patternProjectionAtom, useLayersApi, useHistoryApi, zoomLevelAtom } from '@/store';
import Layer from './components/Layer';
import ActiveLayer from './components/ActiveLayer';
import { useCanvasScale } from './hooks/useCanvasScale';
import { canvasDimension } from '@/config';
import { emptyCanvas } from '@/factory';
import { useHotkeys } from 'react-hotkeys-hook';
import { toastOnce } from '@/lib/toastOnce';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { clamp } from '@/utils';
import { projectCanvasToRegion, TileRegion } from '@/lib/patternProjection';

const zoomMin = 1
const zoomMax = 50

export const cellSize = 40

const GridLayer = Layer
const gridCanvas = emptyCanvas(canvasDimension)

export default function Canvas() {
    const t = useTranslations('toasts');
    const { list, current: getCurrentLayer } = useLayersApi()
    const layersList = list()
    const currentLayer = getCurrentLayer()
    const isCurrentLayerHidden = !currentLayer.visible

    const canvasScale = useCanvasScale()

    const [gridMode] = useAtom(gridVisibilityAtom);
    const [projection] = useAtom(patternProjectionAtom);
    const [bgColor] = useAtom(bgColorAtom);
    const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);
    const [offset, setOffset] = useAtom(canvasOffsetAtom);

    // Refs for latest values inside the wheel handler (avoids stale closures)
    const zoomRef = useRef(zoomLevel);
    const offsetRef = useRef(offset);
    zoomRef.current = zoomLevel;
    offsetRef.current = offset;

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            if (e.ctrlKey) {
                // Pinch-to-zoom gesture (or Ctrl+scroll): zoom toward cursor
                // Normalize deltaY: lines mode (~3/notch) → pixels equivalent (~100/notch)
                const delta = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * 15 : e.deltaY;

                const oldZoom = zoomRef.current;
                const newZoom = clamp(oldZoom - delta * 0.05, zoomMin, zoomMax);
                const oldScale = (4 + oldZoom) / 10;
                const newScale = (4 + newZoom) / 10;

                const rect = el.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                const { x: ox, y: oy } = offsetRef.current;

                // Keep the canvas point under the cursor fixed after zoom
                const newOx = mx - rect.width / 2 - (mx - rect.width / 2 - ox) * newScale / oldScale;
                const newOy = my - rect.height / 2 - (my - rect.height / 2 - oy) * newScale / oldScale;

                const newOffset = { x: newOx, y: newOy };
                offsetRef.current = newOffset;
                zoomRef.current = newZoom;

                setZoomLevel(newZoom);
                setOffset(newOffset);
            } else {
                // Two-finger scroll gesture: pan the canvas
                const rect = el.getBoundingClientRect();
                const scale = (4 + zoomRef.current) / 10;
                const overflow = 50; // px past viewport edge allowed
                // Canvas half-size in screen px at current scale
                const halfCanvas = 1000 * scale;

                // Canvas must always cover the viewport: allow only `overflow` px
                // past each edge. When canvas < viewport, keep it within viewport.
                const rangeX = Math.max(halfCanvas - rect.width / 2, 0) + overflow;
                const rangeY = Math.max(halfCanvas - rect.height / 2, 0) + overflow;

                const { x: ox, y: oy } = offsetRef.current;
                const newOffset = {
                    x: clamp(ox - e.deltaX, -rangeX, rangeX),
                    y: clamp(oy - e.deltaY, -rangeY, rangeY),
                };
                offsetRef.current = newOffset;
                setOffset(newOffset);
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [setZoomLevel, setOffset]);

    // Two-finger pinch-to-zoom + pan on touch devices. Single-finger touches
    // are left to the per-cell drawing handlers in usePointerEvents.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let startDist = 0;
        let startZoom = 0;
        let startOffset = { x: 0, y: 0 };
        let startCenter = { x: 0, y: 0 };
        let active = false;

        const centerAndDistance = (t0: Touch, t1: Touch) => {
            const cx = (t0.clientX + t1.clientX) / 2;
            const cy = (t0.clientY + t1.clientY) / 2;
            const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
            return { cx, cy, dist };
        };

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 2) {
                active = false;
                return;
            }
            e.preventDefault();
            const { cx, cy, dist } = centerAndDistance(e.touches[0], e.touches[1]);
            startDist = dist || 1;
            startZoom = zoomRef.current;
            startOffset = offsetRef.current;
            startCenter = { x: cx, y: cy };
            active = true;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!active || e.touches.length !== 2) return;
            e.preventDefault();

            const { cx, cy, dist } = centerAndDistance(e.touches[0], e.touches[1]);
            const oldScale = (4 + startZoom) / 10;
            const ratio = (dist || 1) / startDist;
            const newZoom = clamp((4 + startZoom) * ratio - 4, zoomMin, zoomMax);
            const newScale = (4 + newZoom) / 10;

            const rect = el.getBoundingClientRect();
            // Anchor: where the pinch began on screen, in container-local coords.
            const ax = startCenter.x - rect.left;
            const ay = startCenter.y - rect.top;
            const { x: ox, y: oy } = startOffset;

            // Zoom around the anchor; add centroid drift as pan.
            const panX = cx - startCenter.x;
            const panY = cy - startCenter.y;
            const newOx = ax - rect.width / 2 - (ax - rect.width / 2 - ox) * newScale / oldScale + panX;
            const newOy = ay - rect.height / 2 - (ay - rect.height / 2 - oy) * newScale / oldScale + panY;

            const newOffset = { x: newOx, y: newOy };
            offsetRef.current = newOffset;
            zoomRef.current = newZoom;

            setZoomLevel(newZoom);
            setOffset(newOffset);
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) active = false;
        };

        el.addEventListener('touchstart', onTouchStart, { passive: false });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd);
        el.addEventListener('touchcancel', onTouchEnd);
        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
            el.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [setZoomLevel, setOffset]);

    // const { offset, canvasRef } = useMoveCanvas()

    const { pop } = useHistoryApi()
    useHotkeys('ctrl+z', () => { pop() })

    return <div ref={containerRef} className={`relative bg-${bgColor} h-full w-full overflow-hidden`}>
        <div
            // ref={canvasRef}
            className={`absolute touch-none border`}
            style={{
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${canvasScale})`,
                width: '2000px',
                height: '2000px',
                top: '50%',
                left: '50%',
            }}
        >
            <GridLayer
                canvas={gridCanvas}
                dimension={layersList[0].canvas.dimension}
                gridMode={gridMode}
            />

            {projection.enabled && projection.sourceRegion && layersList.map(layer => {
                if (!layer.visible) return null

                return <Layer key={`projection-${layer.id}`}
                    canvas={projectCanvasToRegion(layer.canvas.cells, layer.canvas.dimension, projection.sourceRegion!)}
                    dimension={layer.canvas.dimension}
                    isDisabled={!layer.enabled}
                />
            })}

            {isCurrentLayerHidden && (
                <div
                    className="absolute top-0 bottom-0 left-0 right-0 z-10"
                    onMouseDown={() => toastOnce('hidden-layer', t('hiddenLayer'))}
                />
            )}

            {layersList.map(layer => {
                if (!layer.visible)
                    return null

                const isSelected = layer.id === getCurrentLayer().id
                return isSelected
                    ? <ActiveLayer key={layer.id}
                        canvas={layer.canvas.cells}
                        dimension={layer.canvas.dimension}
                        isDisabled={!layer.enabled}
                        editableRegion={projection.enabled ? projection.sourceRegion : null}
                    />
                    : <Layer key={layer.id}
                        canvas={layer.canvas.cells}
                        dimension={layer.canvas.dimension}
                        isDisabled={!layer.enabled}
                    />
            })}

            {projection.enabled && projection.sourceRegion && (
                <PatternSourceOutline region={projection.sourceRegion} />
            )}
        </div>
    </div>
}

function PatternSourceOutline({ region }: { region: TileRegion }) {
    const width = (region.maxCol - region.minCol + 1) * cellSize
    const height = (region.maxRow - region.minRow + 1) * cellSize

    return (
        <div
            data-testid="pattern-source-outline"
            className="absolute pointer-events-none z-20 border-2 border-blue-300 shadow-[0_0_0_2px_rgba(59,130,246,0.35)]"
            style={{
                left: region.minCol * cellSize,
                top: region.minRow * cellSize,
                width,
                height,
            }}
        />
    )
}
