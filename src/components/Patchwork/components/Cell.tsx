import React from 'react';
import type { Tile } from "@/types";
import { OnMouseDown } from '../hooks/usePressBehavior';

type Props = {
    size: number;
    tile: Tile;
    index: number;
    borderless: boolean;
    onMouseDown?: OnMouseDown;
    onContextMenu?: OnMouseDown;
};

function Cell({ size, tile, index, borderless, onMouseDown, onContextMenu }: Props) {
    return (
        <button className={`cursor-[inherit] w-full h-full origin-center`} style={{
            transform: `rotate(${90 * tile.orientation}deg)`,
            // @ts-ignore
            containerType: "inline-size",
        }}
            onMouseDown={(e) => onMouseDown && onMouseDown(e, index)}
            onContextMenu={(e) => onContextMenu && onContextMenu(e, index)}
            data-index={index}
        >
            <div className={`flex justify-center items-center tile text-${tile.color} overflow-hidden
             border-slate-600 ${borderless ? '' : 'border-[0.5px]'} hover:border-slate-500
            `}
                style={{
                    height: '100%',
                    fontSize: '1px'
                }}
            >
                <span className={`flex justify-center items-center content-box
                    `}
                    style={{
                        fontSize: '57px',
                        width: '40px',
                        height: '40px',
                    }}>{tile.symbol}</span>
            </div>
        </button>
    );
}

export default React.memo(Cell)
