import { emptyTile } from "@/config";
import { createTile } from "@/factory";
import { activeTilesAtom, useLayers } from "@/store";
import { Canvas } from "@/types";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

export function useActiveTiles() {
  const layers = useLayers();
  const combinedCanvas = useMemo(
    () =>
      Array.from(layers).reduce(
        (all, [, layer]) => all.concat(layer.canvas.cells),
        [] as Canvas,
      ),
    [layers],
  );

  const [activeTiles, setActiveTiles] = useAtom(activeTilesAtom);

  const filterActiveTiles = useCallback(
    (canvas: Canvas) => {
      const comparableTiles = canvas
        .filter((tile) => tile.symbol !== emptyTile.symbol)
        .map((tile) => {
          return JSON.stringify(
            createTile({
              id: tile.id,
              symbol: tile.symbol,
            }),
          );
        });
      const serializedTileSet = new Set(comparableTiles);

      const activeTileSet = Array.from(serializedTileSet, (tile) =>
        createTile(JSON.parse(tile)),
      );
      setActiveTiles(activeTileSet);
    },
    [setActiveTiles],
  );

  useEffect(() => {
    // TODO: this is triggering every time while a burst updates the canvas
    filterActiveTiles(combinedCanvas);
  }, [combinedCanvas, filterActiveTiles]);

  return activeTiles;
}
