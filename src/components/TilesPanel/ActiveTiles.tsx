import { activeTilesAtom } from '@/store';
import { useAtom } from 'jotai';
import React from 'react';
import Panel from './Panel';
import Tile from './Tile';
import { useHighlighting } from './useHighlighting';

export default function ActiveTiles() {
    const [activeTiles] = useAtom(activeTilesAtom);
    const sortedList = activeTiles.sort((a, b) => a.id - b.id)

    const { selected, onSelect } = useHighlighting(activeTiles)

    return (
        <Panel title="Active Tiles" className='max-h-40'>
            {sortedList.map(tile => {
                const isSelected = tile.equals(selected);
                return <Tile key={tile.id} tile={tile} onSelect={onSelect} isSelected={isSelected} />;
            })}
        </Panel>
    );
}