import { defaultColor } from "@/config";
import { colorAtom } from "@/store";
import { useAtom } from "jotai";
import { ReactNode, SyntheticEvent } from "react";
import styles from "./Tile.module.css"
import type { Tile as TileType } from "@/types";

type Props = {
    tile: TileType;
    isSelected: boolean;
    isDisabled?: boolean;
    onSelect?: (e: SyntheticEvent) => void;
    children?: ReactNode
};

export default function Tile({ tile, isSelected, isDisabled = false, onSelect, children }: Props) {
    const [color] = useAtom(colorAtom)

    return (
        <label
            data-testid="tile"
            className={`tile w-12 h-12 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-70'} grid items-center ${isSelected ? "scale-90" : ""}`}
            style={{
                // TODO: find a workaround
                // @ts-ignore
                containerType: "inline-size",
                transform: `rotate(${90 * tile.orientation}deg)`,
            }}
        >
            <input
                type="radio"
                name="tile"
                value={tile.id}
                onChange={onSelect}
                className={styles.overlap}
                disabled={isDisabled}
                checked={isSelected}
            />
            <span className={`${styles.overlap} bg-gray-500 text-${isSelected ? color : defaultColor} ${isSelected ? styles.selected : ""}`}
                style={{
                    lineHeight: .7,
                    fontSize: "143cqw",
                }}>{tile.symbol}</span>

            {children}
        </label >
    );
}
