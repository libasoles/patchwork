import MovableCell from './MovableCell';
import { usePointerEvents } from '../hooks/usePointerEvents';
import { LayerProps } from './Layer';
import { actionAtom } from '@/store';
import { Action } from '@/types';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { useHotkeys, isHotkeyPressed } from 'react-hotkeys-hook';

export default function ActiveLayer({
    canvas,
    dimension,
    isDisabled = false,
}: LayerProps) {
    const { onMouseDown, onMouseEnter, onContextMenu, onMouseUp } = usePointerEvents();

    const [activeAction] = useAtom(actionAtom)
    let cursor = useMouseIcon(activeAction)

    return (
        <div
            data-testid='selected-canvas'
            className={`grid justify-center content-center select-none ${isDisabled && 'opacity-20'} absolute top-0 bottom-0 left-0 right-0`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, 40px)`,
                gridTemplateRows: `repeat(${dimension.y}, 40px)`,
            }}
        >
            {
                canvas.map((tile, index) => {
                    return (
                        <div
                            key={index}
                            className={`${cursor(tile.isEmpty())}`}
                        >
                            <MovableCell
                                index={index}
                                borderless
                                onMouseDown={onMouseDown}
                                onMouseEnter={onMouseEnter}
                                onMouseUp={onMouseUp}
                                onContextMenu={onContextMenu}
                                tile={tile}
                            />
                        </div>
                    );
                })
            }
        </div>
    )
}

const icons: { [action: string]: string } = {
    [Action.Draw]: 'cursor-draw',
    [Action.Paint]: 'cursor-paint',
    [Action.Move]: 'cursor-move',
    [Action.Rotate]: 'cursor-rotate',
    [Action.Delete]: 'cursor-delete',
};

type UseMouseIcon = (isCellEmpty: boolean) => string
function useMouseIcon(action: Action): UseMouseIcon {
    const [cursor, setCursor] = useState<string | null>(null)

    // TODO: cursor may not update after window blur
    useHotkeys('shift, ctrl, alt', () => {
        if (isHotkeyPressed('shift'))
            setCursor(icons[Action.Move])
        else if (isHotkeyPressed('ctrl'))
            setCursor(icons[Action.Rotate])
        else if (isHotkeyPressed('alt'))
            setCursor(icons[Action.Delete])
        else
            setCursor(null)
    }, {
        keyup: true,
        keydown: true,
    })

    return useCallback((isCellEmpty: boolean) => {
        if (cursor) return cursor

        const isActionWithoutForbidenAreas = [Action.Draw, Action.Delete].includes(action)
        if (isActionWithoutForbidenAreas) return icons[action];

        return isCellEmpty ? 'cursor-forbiden' : icons[action];
    }, [action, cursor])
}
