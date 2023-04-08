import Tile from './components/Tile';
import Panel from './components/Panel';
import type { Tile as TileType } from "@/types";
import { useHighlighting } from './hooks/useHighlighting';
import TrashIcon from '@/icons/TrashIcon';
import styles from "./components/Tile.module.css"
import { SyntheticEvent } from 'react';
import { useCurrectAction } from './hooks/useCurrectAction';

type Props = {
    tiles: TileType[],
    isDisabled?: boolean
}

export default function TileSet({ tiles, isDisabled }: Props) {
    const onTileSelect = useCurrectAction()
    const { selected, onSelect } = useHighlighting(tiles)

    return (
        <Panel data-testid='all-tiles-panel' title="All Tiles" className='overflow-y-hidden'>
            {tiles.map(tile => {
                const isSelected = tile.equals(selected);
                const isEmptyTile = (tile.symbol === " ")

                return <Tile
                    key={tile.id}
                    tile={tile}
                    onSelect={(e: SyntheticEvent) => {
                        onSelect(e)
                        onTileSelect()
                    }}
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