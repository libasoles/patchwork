import { useAtom } from 'jotai';
import { actionAtom, colorAtom, mouseDownAtom, selectedTileAtom } from '@/store';
import { emptyTile } from '@/config';
import { Action, Canvas } from '@/types';
import { createTile } from "@/factory";

export function useDraw(canvas: Canvas, updateCanvas: (tiles: Canvas) => void) {
    const [activeAction] = useAtom(actionAtom);
    const [selected] = useAtom(selectedTileAtom);

    const [color] = useAtom(colorAtom);
    const [isMouseDown, setMouseDown] = useAtom(mouseDownAtom);

    const currentTile = selected || createTile(emptyTile);

    // TODO: see if this can be optimized with useCallback, so we don't create methods each time?
    const onMouseDown = (index: number) => {
        const newCanvas = [...canvas]
        // TODO: improve this code
        if (activeAction === Action.Draw) {
            const updatedTile = {
                ...newCanvas[index],
                id: currentTile.id,
                symbol: currentTile.symbol,
                color
            };

            const shouldRotate = newCanvas[index].looksLike(updatedTile);

            if (shouldRotate) {
                updatedTile.rotate();
            } else {
                updatedTile.resetOrientation();
            }

            newCanvas[index] = updatedTile;
        } else if (activeAction === Action.Paint) {
            newCanvas[index] = {
                ...newCanvas[index],
                color
            };
        } else if (activeAction === Action.Rotate) {
            newCanvas[index].rotate()
        }

        updateCanvas(newCanvas);
    };

    // TODO: reuse code from MouseDown
    const onMouseEnter = (index: number) => {
        if (!isMouseDown)
            return;

        const newCanvas = [...canvas]

        if (activeAction === Action.Paint) {
            newCanvas[index] = {
                ...newCanvas[index],
                color
            };
        }
        else if (activeAction === Action.Draw) {
            newCanvas[index] = {
                ...newCanvas[index],
                id: currentTile.id,
                symbol: currentTile.symbol,
                color
            };
        } else {
            return
        }

        updateCanvas(newCanvas);
    };

    return { setMouseDown, onMouseDown, onMouseEnter };
}
