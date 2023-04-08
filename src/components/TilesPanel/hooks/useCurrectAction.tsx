import { actionAtom, selectedTileAtom } from '@/store';
import { useAtom } from 'jotai';
import { Action, Tile as TileType } from "@/types";

export function useCurrectAction() {
    const [, setCurrentAction] = useAtom(actionAtom);

    function onSelect() {
        setCurrentAction(Action.Draw);
    }

    return onSelect;
}
