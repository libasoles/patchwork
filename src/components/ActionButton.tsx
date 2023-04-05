import { Action } from "@/types";
import { ReactElement, useMemo } from "react";

export type ActionButtonProps = {
    name: Action;
    selected?: Action;
    onClick: (action: Action) => void;
    children: ReactElement
}

export function ActionButton({ name, selected, onClick, children }: ActionButtonProps) {
    const highlight = useMemo(() => {
        return (expected: Action) => selected === expected ? 'bg-blue-500 text-white' : 'bg-white text-gray-800';
    }, [selected]);

    return (
        <button
            type="button"
            className={`p-2 w-[2.5em] rounded-full cursor-pointer ${highlight(name)}`}
            onClick={() => onClick(name)}
            title={Action[name]}
        >
            {children}
        </button>
    );
}
