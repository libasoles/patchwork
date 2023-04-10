import { selectedTileAtom } from '@/store';
import { useAtom } from 'jotai';
import { SyntheticEvent } from 'react';
import { Tile as TileType } from "@/types";

export function useHighlighting(tiles: TileType[]) {
    const [selected, setSelected] = useAtom(selectedTileAtom);

    function onSelect(e: SyntheticEvent) {
        const tile = tiles.find(tile => tile.id === Number((e.target as HTMLButtonElement).value))!;
        setSelected(tile);
    }

    return {
        selected,
        onSelect
    };
}
