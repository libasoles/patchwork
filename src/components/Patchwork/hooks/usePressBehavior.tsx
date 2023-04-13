import { useAtom } from 'jotai';
import { actionAtom, colorAtom, selectedTileAtom, useCanvasApi } from '@/store';
import { Action, Tile } from '@/types';
import { useCallback, useMemo } from 'react';
import { isHotkeyPressed } from 'react-hotkeys-hook'

type Transformers = Record<Action, (tile: Tile) => Tile>
const useTransformers = () => {
    const [selectedTile] = useAtom(selectedTileAtom);

    const [color] = useAtom(colorAtom);

    return useMemo(() => ({
        [Action.Draw]: (tile: Tile) => selectedTile.clone({ orientation: tile.orientation }).paint(color),
        [Action.Paint]: (tile: Tile) => tile.paint(color),
        [Action.Rotate]: (tile: Tile) => tile.rotate(),
        [Action.Move]: (tile: Tile) => tile, // TODO: get rid of this one?
        [Action.Delete]: (tile: Tile) => tile.reset()
    }), [selectedTile, color])
}

export function usePressBehavior(updateCell: (index: number, tile: Tile) => void) {
    const { getCell } = useCanvasApi()
    const [activeAction] = useAtom(actionAtom);
    const transformers: Transformers = useTransformers()

    const onMouseDown: OnMouseDown = useCallback((event, index: number) => {
        event.preventDefault()

        if (isHotkeyPressed('ctrl'))
            return

        const tile = getCell(index)

        let updatedTile = transformers[activeAction](tile)

        const shouldRotate = activeAction === Action.Draw && tile.looksLike(updatedTile)

        if (shouldRotate) {
            updatedTile = updatedTile.rotate();
        }

        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onMouseEnter: onMouseEnter = useCallback((event, index) => {
        if (isHotkeyPressed('ctrl'))
            return

        const isLeftButtonDown = event.buttons === leftButton
        if (!isLeftButtonDown)
            return;

        const tile = getCell(index)

        let updatedTile = transformers[activeAction](tile)

        updateCell(index, updatedTile);
    }, [activeAction, transformers, getCell, updateCell]);

    const onContextMenu: OnContextMenu = useCallback((event) => {
        event.preventDefault()
        console.log("context menu")
    }, [])

    return { onMouseDown, onMouseEnter, onContextMenu };
}

const leftButton = 1

export type OnMouseDown = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
export type onMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, index: number) => void
export type OnContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => void
