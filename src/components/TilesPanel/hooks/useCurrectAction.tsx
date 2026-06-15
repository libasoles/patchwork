import { actionAtom } from "@/store";
import { Action, Tile } from "@/types";
import { useAtom } from 'jotai';

export function useCurrectAction() {
  const [, setCurrentAction] = useAtom(actionAtom);

  function onSelect(tile: Tile) {
    setCurrentAction(tile.isEmpty() ? Action.Delete : Action.Draw);
  }

  return onSelect;
}
