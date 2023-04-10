import { actionAtom } from '@/store';
import { useAtom } from 'jotai';
import { Action } from "@/types";

export function useCurrectAction() {
    const [, setCurrentAction] = useAtom(actionAtom);

    function onSelect() {
        setCurrentAction(Action.Draw);
    }

    return onSelect;
}
