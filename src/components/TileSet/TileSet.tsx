import { SyntheticEvent } from 'react';
import Tile from './Tile';
import { useAtom } from 'jotai';
import { selectedTileAtom } from '@/store';
import Panel from './Panel';
import type { Tile as TileType } from "@/types";

export default function TileSet({ tiles }: { tiles: TileType[] }) {
    const [selected, setSelected] = useAtom(selectedTileAtom);

    function onSelect(e: SyntheticEvent) {
        const aTile = tiles.find(tile => tile.symbol === e.target.value)
        setSelected(aTile);
    }

    return (
        <Panel title="All Tiles">
            <div className="flex flex-wrap gap-0.5 overflow-y-scroll justify-center w-[12.5em] text-gray-800">
                {tiles.map(tile => {
                    const isSelected = tile.equals(selected);
                    return <Tile key={tile.id} tile={tile} onSelect={onSelect} isSelected={isSelected} />;
                })}
            </div>
        </Panel>
    );
}
