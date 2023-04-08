import React, { SyntheticEvent } from 'react';
import Panel from './components/Panel';
import Tile from './components/Tile';
import { useHighlighting } from './hooks/useHighlighting';
import { useActiveTiles } from './hooks/useActiveTiles';
import { useCurrectAction } from './hooks/useCurrectAction';

type Props = {
    isDisabled?: boolean
    onTileSelected?: boolean
}

export default function ActiveTiles({ isDisabled }: Props) {
    const activeTiles = useActiveTiles()
    const sortedList = activeTiles.sort((a, b) => a.id - b.id) // if we don't sort, order is rendom each time

    const onTileSelect = useCurrectAction()
    const { selected, onSelect } = useHighlighting(activeTiles)

    return (
        <Panel data-testid='active-tiles-panel' title="Active Tiles">
            {sortedList.map(tile => {
                const isSelected = tile.equals(selected);
                return <Tile
                    key={tile.id}
                    tile={tile}
                    onSelect={(e: SyntheticEvent) => {
                        onSelect(e)
                        onTileSelect()
                    }}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                />;
            })}
        </Panel>
    );
}
