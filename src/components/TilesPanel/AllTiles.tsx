import useIsMobile from "@/hooks/isMobile";
import type { Tile as TileType } from "@/types";
import { useTranslations } from "next-intl";
import Panel from "./components/Panel";
import Tile from "./components/Tile";
import { useCurrectAction } from "./hooks/useCurrectAction";
import { useHighlighting } from "./hooks/useHighlighting";

type Props = {
  tiles: TileType[];
  isDisabled?: boolean;
};

export default function TileSet({ tiles, isDisabled }: Props) {
  const t = useTranslations("panels");
  const onTileSelect = useCurrectAction();
  const { selected, onSelect } = useHighlighting();
  const { isMobile } = useIsMobile();

  return (
    <Panel
      data-testid="all-tiles-panel"
      title={!isMobile ? t("allTiles") : ""}
      className="h-auto grow"
    >
      {tiles.map((tile) => {
        const isSelected = tile.equals(selected);

        return (
          <Tile
            key={tile.id}
            tile={tile}
            onSelect={() => {
              onSelect(tile);
              onTileSelect(tile);
            }}
            isSelected={isSelected}
            isDisabled={isDisabled}
          />
        );
      })}
    </Panel>
  );
}
