import React from 'react';
import type { GridMode, Tile } from "@/types";
import { cellSize } from '../Canvas';

type Props = {
    tile: Tile;
    gridMode: GridMode;
};

function Cell({ tile, gridMode }: Props) {
    return (
        <div className={`relative flex justify-center items-center tile text-${tile.color} overflow-hidden h-full
            border-slate-600 ${gridMode === 'lines' ? 'border-[0.5px]' : ''} hover:border-slate-500`}
            style={{
                transform: `rotate(${90 * tile.orientation}deg)`,
                fontSize: '1px'
            }}
        >
            {gridMode === 'dots' && (
                <div className="absolute top-0 left-0 w-[2px] h-[2px] rounded-full bg-slate-600 pointer-events-none" />
            )}
            <span className={`flex justify-center items-center content-box`}
                style={{
                    fontSize: '57px',
                    // TODO: make this dynamic
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                }}>{tile.symbol}</span>
        </div>
    );
}

export default React.memo(Cell)
