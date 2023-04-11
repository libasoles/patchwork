import { defaultColor } from "@/config";
import { colorAtom } from "@/store";
import { useAtom } from "jotai";
import type { EventCallback, Tile as TileType } from "@/types";
import styles from "./Tile.module.css"

type Props = {
    tile: TileType;
    isSelected: boolean;
    isDisabled?: boolean;
    onSelect?: EventCallback;
};

export default function Tile({ tile, isSelected, isDisabled = false, onSelect }: Props) {
    const [color] = useAtom(colorAtom)

    return (
        <label
            data-testid="tile"
            className={`grid items-center tile w-12 h-12 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-70'} ${isSelected ? "scale-90" : ""}`}
            style={{
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
                role="radio"
            />
            <span className={`${styles.overlap} bg-gray-500 text-${isSelected ? color : defaultColor} ${isSelected ? styles.selected : ""}`}
                style={{
                    lineHeight: .7,
                    fontSize: "143cqw",
                }}>{tile.symbol}</span>
        </label >
    );
}
