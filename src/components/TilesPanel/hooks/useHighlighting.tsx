import { selectedTileAtom } from '@/store';
import { useAtom } from 'jotai';
import { Tile as TileType } from "@/types";

export function useHighlighting() {
  const [selected, setSelected] = useAtom(selectedTileAtom);

  function onSelect(tile: TileType) {
    setSelected(tile);
  }

  return {
    selected,
    onSelect,
  };
}
