import { useAtom } from 'jotai';
import { actionAtom, colorAtom, mouseDownAtom, selectedTileAtom } from '@/store';
import { emptyTile } from '@/config';
import { Action } from '@/types';
import { createTile } from "@/factory";
import { CanvasType } from '../Canvas';

export function useDraw(canvas: CanvasType, updateCanvas: (tiles: CanvasType) => void) {
    const [activeAction] = useAtom(actionAtom);
    const [selected] = useAtom(selectedTileAtom);

    const [color] = useAtom(colorAtom);
    const [isMouseDown, setMouseDown] = useAtom(mouseDownAtom);

    const currentTile = selected || createTile(emptyTile);

    // TODO: see if this can be optimized with useCallback, so we don't create methods each time?
    const onMouseDown = (index: number) => {
        // TODO: improve this code
        if (activeAction === Action.Draw) {
            const updatedTile = {
                ...canvas[index],
                id: currentTile.id,
                symbol: currentTile.symbol,
                color
            };

            const shouldRotate = canvas[index].looksLike(updatedTile);

            if (shouldRotate) {
                updatedTile.rotate();
            } else {
                updatedTile.resetOrientation();
            }

            canvas[index] = updatedTile;
        } else if (activeAction === Action.Paint) {
            canvas[index] = {
                ...canvas[index],
                color
            };
        } else if (activeAction === Action.Rotate) {
            canvas[index].rotate()
        }
        updateCanvas([...canvas]);
    };

    // TODO: reuse code from MouseDown
    const onMouseEnter = (index: number) => {
        if (!isMouseDown)
            return;

        if (activeAction === Action.Paint) {
            canvas[index] = {
                ...canvas[index],
                color
            };
        }
        else if (activeAction === Action.Draw) {
            canvas[index] = {
                ...canvas[index],
                id: currentTile.id,
                symbol: currentTile.symbol,
                color
            };
        } else {
            return
        }

        updateCanvas([...canvas]);
    };

    return { setMouseDown, onMouseDown, onMouseEnter };
}
