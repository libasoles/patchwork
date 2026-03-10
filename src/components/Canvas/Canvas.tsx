import { useAtom, useSetAtom } from 'jotai';
import { bgColorAtom, gridVisibilityAtom, useLayersApi, useHistoryApi, zoomLevelAtom } from '@/store';
import Layer from './components/Layer';
import ActiveLayer from './components/ActiveLayer';
import { useCanvasScale } from './hooks/useCanvasScale';
import { canvasDimension } from '@/config';
import { emptyCanvas } from '@/factory';
import { useHotkeys } from 'react-hotkeys-hook';
import { toastOnce } from '@/lib/toastOnce';
import { useEffect, useRef } from 'react';
import { clamp } from '@/utils';

const zoomMin = 1
const zoomMax = 50

export const cellSize = 40

const GridLayer = Layer
const gridCanvas = emptyCanvas(canvasDimension)

export default function Canvas() {
    const { list, current: getCurrentLayer } = useLayersApi()
    const layersList = list()
    const currentLayer = getCurrentLayer()
    const isCurrentLayerHidden = !currentLayer.visible

    const canvasScale = useCanvasScale()

    const [isGridVisible] = useAtom(gridVisibilityAtom);
    const [bgColor] = useAtom(bgColorAtom);
    const setZoomLevel = useSetAtom(zoomLevelAtom);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            // Normalize deltaY: lines mode (~3/notch) → pixels equivalent (~100/notch)
            const delta = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * 15 : e.deltaY;
            setZoomLevel(v => clamp(v - delta * 0.05, zoomMin, zoomMax));
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [setZoomLevel]);

    // const { offset, canvasRef } = useMoveCanvas()

    const { pop } = useHistoryApi()
    useHotkeys('ctrl+z', () => { pop() })

    return <div ref={containerRef} className={`relative bg-${bgColor} h-full w-full overflow-hidden`}>
        <div
            // ref={canvasRef}
            className={`absolute touch-none border`}
            style={{
                transform: `translate(-50%, -50%) scale(${canvasScale})`,
                width: '2000px',
                height: '2000px',
                top: '50%',
                left: '50%',
            }}
        >
            <GridLayer
                canvas={gridCanvas}
                dimension={layersList[0].canvas.dimension}
                isGridVisible={isGridVisible}
            />

            {isCurrentLayerHidden && (
                <div
                    className="absolute top-0 bottom-0 left-0 right-0 z-10"
                    onMouseDown={() => toastOnce('hidden-layer', 'El layer está oculto. Hazlo visible para poder dibujar')}
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
