import React from 'react';
import type { Tile } from "@/types";
import { cellSize } from '../Canvas';

type Props = {
    tile: Tile;
    borderless: boolean;
};

function Cell({ tile, borderless }: Props) {
    return (
        <>
            <div className={`flex justify-center items-center tile text-${tile.color} overflow-hidden h-full
                border-slate-600 ${borderless ? '' : 'border-[0.5px]'} hover:border-slate-500`}
                style={{ fontSize: '1px' }}
            >
                <span className={`flex justify-center items-center content-box`}
                    style={{
                        fontSize: '57px',
                        // TODO: make this dynamic
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                    }}>{tile.symbol}</span>
            </div>
        </>
    );
}

export default React.memo(Cell)
