import React from 'react';
import type { Tile as TileType } from "@/types";

type Props = {
    size: number;
    tile: TileType;
    index: number;
    borderless: boolean;
    onMouseDown?: (index: number) => void;
    onMouseEnter?: (index: number) => void;
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
        }} onMouseEnter={() => onMouseEnter && onMouseEnter(index)}
            onMouseDown={() => onMouseDown && onMouseDown(index)}
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
