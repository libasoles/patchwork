import React, { SyntheticEvent } from 'react';
import type { Tile as TileType } from "@/types";

type Props = {
    size: number;
    tile: TileType;
    index: number;
    moveBehavior: {
        isDraggable: boolean,
        onDragStart: (e: SyntheticEvent, index: number) => void,
        onDragEnter: (e: SyntheticEvent, index: number) => void,
        onDrop: (e: SyntheticEvent) => void,
        onDragOver: (e: SyntheticEvent) => void
    },
    onMouseDown: (index: number) => void;
    onMouseEnter: (index: number) => void;
};

function Cell({ size, tile, index, moveBehavior, onMouseDown, onMouseEnter }: Props) {
    const { isDraggable, onDragStart, onDragEnter, onDrop, onDragOver } = moveBehavior

    return (
        <button className={`bg-gray-700 border-slate-600 border-[.5px]`} style={{
            width: size + "px",
            height: size + "px",
            transform: `rotate(${90 * tile.orientation}deg)`,
            // TODO: find a workaround
            // @ts-ignore
            containerType: "inline-size"
        }} onMouseEnter={() => onMouseEnter(index)}
            onMouseDown={() => { onMouseDown(index) }}
            draggable={isDraggable}
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragEnd={onDrop}
            onDragOver={onDragOver}
        >
            <div
                className={`tile w-full h-full grid items-center text-${tile.color}`}
            >
                <span className="w-full h-full" style={{
                    lineHeight: .7,
                    fontSize: "143cqw"
                }}>{tile.symbol}</span>
            </div>
        </button>
    );
}

export default React.memo(Cell)
