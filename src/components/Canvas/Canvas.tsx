import { useAtom } from 'jotai';
import { bgColorAtom, canvasOffsetAtom, gridVisibilityAtom, useLayersApi, useHistoryApi, zoomLevelAtom } from '@/store';
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
                    />
                    : <Layer key={layer.id}
                        canvas={layer.canvas.cells}
                        dimension={layer.canvas.dimension}
                        isDisabled={!layer.enabled}
                    />
            })}
        </div>
    </div>
}
