import { SyntheticEvent, useRef } from 'react';
import { useAtom } from 'jotai';
import { actionAtom } from '@/store';
import { Action } from '@/types';

export function useMoveBehavior(onMove: (from: number, to: number) => void) {
    const [activeAction] = useAtom(actionAtom);
    const shouldBeDraggable = activeAction === Action.Move;

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const onDragStart = (e: SyntheticEvent, position: number) => {
        const event = e as unknown as DragEvent
        if (event.dataTransfer)
            event.dataTransfer.effectAllowed = 'move'; // this instructs browsers to display the move icon instead ofthe copy icon

        dragItem.current = position;
    };

    const onDragEnter = (e: SyntheticEvent, position: number) => {
        dragOverItem.current = position;
    };

    const onDrop = (e: SyntheticEvent) => {
        if (dragItem.current === null || dragOverItem.current === null)
            return;
        onMove(dragItem.current, dragOverItem.current);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const onDragOver = (e: SyntheticEvent) => e.preventDefault();

    return {
        isDraggable: shouldBeDraggable,
        onDragStart,
        onDragEnter,
        onDrop,
        onDragOver
    };
}
