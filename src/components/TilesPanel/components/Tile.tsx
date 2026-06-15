import { colorAtom } from "@/store";
import type { EventCallback, Tile as TileType } from "@/types";
import { useAtom } from "jotai";
import { Eraser } from "lucide-react";
import styles from "./Tile.module.css";

type Props = {
  tile: TileType;
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect?: EventCallback;
};

export default function Tile({
  tile,
  isSelected,
  isDisabled = false,
  onSelect,
}: Props) {
  const [color] = useAtom(colorAtom);
  const showEraserIcon = tile.isEmpty() && isSelected;

  return (
    <label
      data-testid="tile"
      className={`grid items-center tile w-12 h-12 ${isDisabled ? "cursor-forbiden" : "cursor-pointer hover:opacity-70"} ${isSelected ? "scale-90" : ""}`}
      style={{
        // @ts-ignore
        containerType: "inline-size",
        transform: `rotate(${90 * tile.orientation}deg)`,
      }}
    >
      <input
        data-testid={`${isSelected ? "selected-radio" : "radio"}`}
        type="radio"
        name="tile"
        value={tile.id}
        onChange={onSelect}
        className={styles.overlap}
        disabled={isDisabled}
        checked={isSelected}
        role="radio"
      />
      <span
        data-testid={`${isSelected ? "selected-symbol" : "symbol"}`}
        className={`${styles.overlap} grid place-items-center bg-slate-700 text-${isSelected ? color : "slate-500"}`}
        style={{
          lineHeight: 0.7,
          fontSize: "143cqw",
        }}
      >
        {showEraserIcon ? <Eraser aria-label="Eraser" size={24} /> : tile.symbol}
      </span>
    </label>
  );
}
