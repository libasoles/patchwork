import { selectedTileAtom, colorAtom } from "@/store";
import { Tile, Action } from "@/types";
import { useAtom } from "jotai";
import { useMemo } from "react";

export type Transformers = Record<Action, (tile: Tile) => Tile>

const useTransformers = () => {
    const [selectedTile] = useAtom(selectedTileAtom);

    const [color] = useAtom(colorAtom);

    return useMemo(() => ({
        [Action.Draw]: (tile: Tile) => selectedTile.clone({ orientation: tile.orientation }).paint(color),
        [Action.Paint]: (tile: Tile) => tile.paint(color),
        [Action.Rotate]: (tile: Tile) => tile.rotate(),
        [Action.Move]: (tile: Tile) => tile, // TODO: remove this one? It's handled by grab callback
        [Action.Delete]: (tile: Tile) => tile.reset()
    }), [selectedTile, color])
}

export default useTransformers