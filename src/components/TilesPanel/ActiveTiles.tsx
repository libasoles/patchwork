import { useTranslations } from "next-intl";
import Panel from "./components/Panel";
import Tile from "./components/Tile";
import { useActiveTiles } from "./hooks/useActiveTiles";
import { useCurrectAction } from "./hooks/useCurrectAction";
import { useHighlighting } from "./hooks/useHighlighting";

type Props = {
  isDisabled?: boolean;
  onTileSelected?: boolean;
};

export default function ActiveTiles({ isDisabled }: Props) {
  const t = useTranslations("panels");
  const activeTiles = useActiveTiles();
  const sortedList = activeTiles.sort((a, b) => a.id - b.id); // if we don't sort, order is rendom each time

  const onTileSelect = useCurrectAction();
  const { selected, onSelect } = useHighlighting();

  return (
    // TODO: adjust height to grow incrementally
    <Panel
      data-testid="active-tiles-panel"
      title={t("usedTiles")}
      className="h-auto grow max-h-[20%]"
      collapsible={true}
      defaultOpen={false}
    >
      {sortedList.map((tile) => {
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
