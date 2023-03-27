import { useAtom } from 'jotai';
import { actionAtom, colorAtom, mouseDownAtom, selectedTileAtom } from '../../store';
import { emptyTile } from '../../config';
import { Action } from '@/types';
import { createTile } from "@/factory";
import { GridType } from './Grid';

export function useDraw(grid: GridType, updateGrid: (tiles: GridType) => void) {
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
                ...grid[index],
                id: currentTile.id,
                symbol: currentTile.symbol,
                color
            };

            const shouldRotate = grid[index].looksLike(updatedTile);

            if (shouldRotate) {
                updatedTile.rotate();
            } else {
                updatedTile.resetOrientation();
            }

            grid[index] = updatedTile;
        } else if (activeAction === Action.Paint) {
            grid[index] = {
                ...grid[index],
                color
            };
        }
        updateGrid([...grid]);
    };

    // TODO: reuse code from MouseDown
    const onMouseEnter = (index: number) => {
        if (!isMouseDown)
            return;
        if (activeAction !== Action.Draw)
            return;

        grid[index] = {
            ...grid[index],
            id: currentTile.id,
            symbol: currentTile.symbol,
            color
        };

        updateGrid([...grid]);
    };

    return { setMouseDown, onMouseDown, onMouseEnter };
}
