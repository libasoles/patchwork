import { Action } from '@/types';
import { useAtom } from 'jotai';
import { actionAtom, gridVisibilityAtom, useLayersStore } from '@/store';
import { useZoom } from './hooks/useZoom';
import Layer from './Layer';
import ActiveLayer from './ActiveLayer';

export const cellSize = 40

export default function Canvas() {
    const { list, getCurrentLayer, updateCell } = useLayersStore()
    const layersList = list()

    const [activeAction] = useAtom(actionAtom);

    const canvasScale = useZoom()

    const [isGridVisible] = useAtom(gridVisibilityAtom);

    const cursor = getMouseIcon(activeAction)

    return <div className='bg-gray-700 relative h-full w-full'>
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
                    isGridVisible={isGridVisible}
                />
                : <Layer key={layer.id}
                    canvas={layer.canvas.cells}
                    dimension={layer.canvas.dimension}
                    canvasScale={canvasScale}
                    isGridVisible={isGridVisible}
                    isDisabled={[Action.Paint, Action.Move, Action.Rotate].includes(activeAction)}
                />
        })}
    </div>
}

const icons: { [action: string]: string } = {
    [Action.Draw]: 'cursor-crosshair',
    [Action.Paint]: 'cursor-sw-resize',
    [Action.Move]: 'cursor-grab',
    [Action.Rotate]: 'cursor-sw-resize',
};

type GetMouseIcon = (isCellEmpty: boolean) => string
function getMouseIcon(action: Action): GetMouseIcon {
    return (isCellEmpty: boolean) => {
        if (action === Action.Draw)
            return icons[Action.Draw];

        return isCellEmpty ? 'cursor-not-allowed' : icons[action];
    }
}