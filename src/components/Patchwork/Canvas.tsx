import { Action } from '@/types';
import { useAtom } from 'jotai';
import { actionAtom, gridVisibilityAtom, useStore } from '@/store';
import Layer from './components/Layer';
import ActiveLayer from './components/ActiveLayer';
import { useCanvasScale } from './hooks/useCanvasScale';
import { useZoomOnWheel } from './hooks/useZoomOnWheel';
import { emptyTile } from '@/config';
import { createTile } from '@/factory';

export const cellSize = 40

const GridLayer = Layer
const emptyCell = createTile(emptyTile)

export default function Canvas() {
    const { list, getCurrentLayer, updateCell } = useStore(((state) => state))
    const layersList = list()

    const [activeAction] = useAtom(actionAtom);

    const canvasScale = useCanvasScale()

    const [isGridVisible] = useAtom(gridVisibilityAtom);

    const cursor = getMouseIcon(activeAction)

    const zoomableRef = useZoomOnWheel()

    return <div className='bg-gray-700 h-full w-full' ref={zoomableRef}>
        <GridLayer
            canvas={layersList[0].canvas.cells.map(_ => emptyCell)}
            dimension={layersList[0].canvas.dimension}
            canvasScale={canvasScale}
            isGridVisible={isGridVisible}
        />

        {layersList.map(layer => {
            if (!layer.visible)
                return null

            const isSelected = layer.id === getCurrentLayer().id
            return isSelected
                ? <ActiveLayer key={layer.id}
                    canvas={layer.canvas.cells}
                    dimension={layer.canvas.dimension}
                    cursor={cursor}
                    updateCell={updateCell}
                    canvasScale={canvasScale}
                    isDisabled={!layer.enabled}
                />
                : <Layer key={layer.id}
                    canvas={layer.canvas.cells}
                    dimension={layer.canvas.dimension}
                    canvasScale={canvasScale}
                    isDisabled={!layer.enabled}
                />
        })}
    </div>
}

const icons: { [action: string]: string } = {
    [Action.Draw]: 'cursor-crosshair',
    [Action.Paint]: 'cursor-sw-resize',
    [Action.Move]: 'cursor-grab',
    [Action.Rotate]: 'cursor-sw-resize',
    [Action.Delete]: 'cursor-crosshair',
};

type GetMouseIcon = (isCellEmpty: boolean) => string
function getMouseIcon(action: Action): GetMouseIcon {
    return (isCellEmpty: boolean) => {
        if ([Action.Draw, Action.Delete].includes(action))
            return icons[action];

        return isCellEmpty ? 'cursor-not-allowed' : icons[action];
    }
}
