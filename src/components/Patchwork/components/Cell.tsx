import React from 'react';
import type { Tile } from "@/types";
import { OnMouseDown, onMouseEnter } from '../hooks/usePressBehavior';

type Props = {
    size: number;
    tile: Tile;
    index: number;
    borderless: boolean;
    onMouseDown?: OnMouseDown;
    onMouseEnter?: onMouseEnter;
};

function Cell({ size, tile, index, borderless, onMouseDown, onMouseEnter }: Props) {
    return (
        <button className={`cursor-[inherit]  border-slate-600 ${borderless ? '' : 'border-[.5px]'} hover:border-slate-500 `} style={{
            width: size + "px",
            height: size + "px",
            transform: `rotate(${90 * tile.orientation}deg)`,
            // TODO: find a workaround
            // @ts-ignore
            containerType: "inline-size"
        }}
            onMouseDown={() => onMouseDown && onMouseDown(index)}
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e, index)}
        >
            <div className={`tile w-full h-full grid items-center text-${tile.color}`}>
                <span className="w-full h-full" style={{
                    lineHeight: .7,
                    fontSize: "143cqw"
                }}>{tile.symbol}</span>
            </div>
        </button>
    );
}

export default React.memo(Cell)
