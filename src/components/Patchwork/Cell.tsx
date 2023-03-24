import React from 'react';
import type { Tile as TileType } from "@/types";

type Props = {
    size: number;
    tile: TileType;
    index: number;
    onMouseDown: (index: number) => void;
    onMouseEnter: (index: number) => void;
};

// TODO: abstract common code from Tile
function Cell({ size, tile, index, onMouseDown, onMouseEnter }: Props) {
    return (
        <button className={`bg-gray-700 border-slate-600 border-[.5px]`} style={{
            width: size + "px",
            height: size + "px",
            // TODO: find a workaround
            // @ts-ignore
            containerType: "inline-size"
        }} onMouseEnter={() => onMouseEnter(index)} onMouseDown={() => { onMouseDown(index) }}>
            <label className={`tile w-full h-full grid items-center text-${tile.color}`}>
                <span className="overlap w-full h-full" style={{
                    lineHeight: .7,
                    fontSize: "143cqw"
                }}>{tile.symbol}</span>
            </label>
        </button>
    );
}

export default React.memo(Cell)
