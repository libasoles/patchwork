import { activeTilesAtom, selectedTileAtom } from '@/store';
import { useAtom } from 'jotai';
import React, { SyntheticEvent } from 'react';
import Panel from './Panel';
import Tile from './Tile';

// TODO: abstract common code from TileSet component
export default function ActiveTiles() {
    const [activeTiles] = useAtom(activeTilesAtom);
    const sortedList = activeTiles.sort((a, b) => a.id - b.id)

    const [selected, setSelected] = useAtom(selectedTileAtom);

    function onSelect(e: SyntheticEvent) {
        // TODO: find a workaround
        // @ts-ignore
        const aTile = activeTiles.find(tile => tile.symbol === e.target.value)
        setSelected(aTile);
    }

    // TODO: mouse events, highlight, correct adjustable height
    return (
        <Panel title="Active Tiles" className='max-h-40'>
            <div className="flex flex-wrap gap-0.5 overflow-y-scroll w-[12.5em] text-gray-800 bg-slate-300">
                {sortedList.map(tile => {
                    const isSelected = tile.equals(selected);
                    return <Tile key={tile.id} tile={tile} onSelect={onSelect} isSelected={isSelected} />;
                })}
            </div>
        </Panel>
    );
}
