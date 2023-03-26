import Tile from './Tile';
import Panel from './Panel';
import type { Tile as TileType } from "@/types";
import { useHighlighting } from './useHighlighting';

type Props = {
    tiles: TileType[],
    isDisabled: boolean
}

export default function TileSet({ tiles, isDisabled }: Props) {
    const { selected, onSelect } = useHighlighting(tiles)

    return (
        <Panel title="All Tiles">
            {tiles.map(tile => {
                const isSelected = tile.equals(selected);
                return <Tile
                    key={tile.id}
                    tile={tile}
                    onSelect={onSelect}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                />;
            })}
        </Panel>
    );
}
