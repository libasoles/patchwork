import { useAtom } from 'jotai';
import { actionAtom } from '@/store';
import { Action } from '@/types';

export function useMoveBehavior() {
    const [activeAction] = useAtom(actionAtom);
    const shouldBeDraggable = activeAction === Action.Move;

    return {
        isDraggable: shouldBeDraggable,
    };
}
