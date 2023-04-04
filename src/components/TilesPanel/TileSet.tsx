import Tile from './Tile';
import Panel from './Panel';
import type { Tile as TileType } from "@/types";
import { useHighlighting } from './useHighlighting';
import TrashIcon from '@/icons/TrashIcon';
import styles from "./Tile.module.css"

type Props = {
    tiles: TileType[],
    isDisabled: boolean
}

export default function TileSet({ tiles, isDisabled }: Props) {
    const { selected, onSelect } = useHighlighting(tiles)

    return (
        <Panel data-testid='all-tiles-panel' title="All Tiles">
            {tiles.map(tile => {
                const isSelected = tile.equals(selected);
                const isEmptyTile = (tile.symbol === " ")

                return <Tile
                    key={tile.id}
                    tile={tile}
                    onSelect={onSelect}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                >{isEmptyTile && <DeleteIcon />}</Tile>;
            })}
        </Panel>
    );
}

const DeleteIcon = () => (
    <div className={`${styles.overlap} flex justify-center items-center`}>
        <TrashIcon className='w-6' />
    </div>
)