import React from 'react';
import type { Tile } from "@/types";
import { OnContextMenu, OnMouseDown, OnMouseUp, onMouseEnter } from '../hooks/usePointerEvents';
import Cell from './Cell';
import { useAtom } from 'jotai';
import { actionAtom } from '@/store';
import { Action } from '@/types';

type MovableCellProps = {
    tile: Tile;
    index: number;
    borderless: boolean;
    onMouseDown?: OnMouseDown;
    onMouseUp?: OnMouseUp;
    onMouseEnter?: onMouseEnter;
    onContextMenu?: OnContextMenu;
};

function MovableCell({ tile, index, borderless, onMouseDown, onMouseUp, onMouseEnter, onContextMenu }: MovableCellProps) {
    const [activeAction] = useAtom(actionAtom);
    const isDraggable = activeAction === Action.Move;

    return (
        <button
            className={`touch-none cursor-[inherit] w-full h-full origin-center`}
            style={{
                transform: `rotate(${90 * tile.orientation}deg)`,
                // @ts-ignore
                containerType: "inline-size",
            }}
            onMouseDown={(e) => onMouseDown && onMouseDown(e, index)}
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e, index)}
            onMouseUp={(e) => onMouseUp && onMouseUp(e, index)}
            onContextMenu={(e) => onContextMenu && onContextMenu(e, index)}
            draggable={isDraggable}
            data-index={index}
        >
            <Cell tile={tile} borderless={borderless} />
        </button>
    )
}

export default React.memo(MovableCell)


