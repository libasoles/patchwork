import React from 'react';
import type { Tile as TileType } from "@/types";

type Props = {
    size: number;
    tile: TileType;
    index: number;
    onMouseDown: (index: number) => void;
    onMouseEnter: (index: number) => void;
};

function Cell({ size, tile, index, onMouseDown, onMouseEnter }: Props) {
    return (
        <button className={`cursor-[inherit] bg-gray-700 border-slate-600 border-[.5px]`} style={{
            width: size + "px",
            height: size + "px",
            transform: `rotate(${90 * tile.orientation}deg)`,
            // TODO: find a workaround
            // @ts-ignore
            containerType: "inline-size"
        }} onMouseEnter={() => onMouseEnter(index)}
            onMouseDown={() => onMouseDown(index)}
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
