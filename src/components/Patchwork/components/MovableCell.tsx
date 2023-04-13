import React from 'react';
import type { Tile } from "@/types";
import { OnMouseDown } from '../hooks/usePressBehavior';
import { useGestures } from '../hooks/useGestures';
import { useMoveBehavior } from '../hooks/useMoveBehavior';
import Cell from './Cell';

type MovableCellProps = {
    tile: Tile;
    index: number;
    borderless: boolean;
    onMouseDown?: OnMouseDown;
    onContextMenu?: OnMouseDown;
};

// TODO: all canvas is being rerendered when a single cell is moved, or painted
function MovableCell({ tile, index, borderless, onMouseDown, onContextMenu }: MovableCellProps) {
    const { bind, animated, position } = useGestures()
    const { isDraggable } = useMoveBehavior();

    return (
        <animated.button
            className={`touch-none cursor-[inherit] w-full h-full origin-center`}
            style={{
                transform: `rotate(${90 * tile.orientation}deg)`,
                // @ts-ignore
                containerType: "inline-size",
                ...position
            }}
            onMouseDown={(e) => onMouseDown && onMouseDown(e, index)}
            onContextMenu={(e) => onContextMenu && onContextMenu(e, index)}
            draggable={isDraggable}
            data-index={index}
            {...bind}
        >
            <Cell tile={tile} borderless={borderless} />
        </animated.button>
    )
}

export default React.memo(MovableCell)


