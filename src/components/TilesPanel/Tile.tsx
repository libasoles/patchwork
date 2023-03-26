import { defaultColor } from "@/config";
import { colorAtom } from "@/store";
import { useAtom } from "jotai";
import { SyntheticEvent } from "react";
import styles from "./Tile.module.css"
import type { Tile as TileType } from "@/types";

type Props = {
    tile: TileType;
    isSelected: boolean;
    isDisabled: boolean;
    onSelect?: (e: SyntheticEvent) => void;
};

export default function Tile({ tile, isSelected, isDisabled, onSelect }: Props) {
    const [color] = useAtom(colorAtom)

    return (
        <label
            className={`tile w-12 h-12 cursor-pointer grid items-center hover:opacity-70 ${isSelected ? "scale-90" : ""}`}
            style={{
                // TODO: find a workaround
                // @ts-ignore
                containerType: "inline-size",
            }}
        >
            <input
                type="radio"
                name="tile"
                value={tile.symbol}
                onClick={onSelect}
                className={styles.overlap}
                disabled={isDisabled}
            />
            <span className={`${styles.overlap} bg-gray-500 text-${isSelected ? color : defaultColor} ${isSelected ? styles.selected : ""}`}
                style={{
                    lineHeight: .7,
                    fontSize: "143cqw",
                }}>{tile.symbol}</span>
        </label >
    );
}
