import { Action } from "@/types";
import { ReactElement, ReactNode, useMemo } from "react";
import styles from "./ActionButton.module.css"

export type ActionButtonProps = {
    name: Action;
    selected?: Action;
    onClick: (action: Action) => void;
    icon?: ReactNode;
    shortcut?: string;
    children?: ReactElement
}

export default function ActionButton({ name, selected, icon, onClick, shortcut, children }: ActionButtonProps) {
    const highlight = useMemo(() => {
        return (expected: Action) => selected === expected ? 'bg-blue-500 text-white' : 'bg-white text-gray-800';
    }, [selected]);

    return (
        <div
            data-testid={`${name.toLowerCase()}-icon`}
            className={`p-2 w-[2.5em] rounded-full cursor-pointer ${highlight(name)} grid items-center`}
            onClick={() => onClick(name)}
            title={`${Action[name]} | Shortcut: press ${shortcut}`}
            style={{
                // @ts-ignore
                containerType: "inline-size",
            }}
        >
            <input
                type="radio"
                name="tile"
                value={name}
                onChange={() => onClick(name)}
                className={styles.overlap}
                checked={selected === name}
            />
            <div className={`${styles.overlap} ${highlight(name)}`}>
                {icon ?? children}
            </div>
        </div>
    );
}
