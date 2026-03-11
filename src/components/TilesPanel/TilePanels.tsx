import useIsMobile from "@/hooks/isMobile";
import { Tile } from "@/types";
import ActiveTiles from "./ActiveTiles";
import TileSet from "./AllTiles";
import Logo from "./Logo";

type Props = {
  tiles: Tile[];
};

export default function TilePanels({ tiles }: Props) {
  const { isMobile } = useIsMobile();

  return (
    <div
      data-testid="tiles-panel h-full"
      className={`h-screen flex flex-col select-none ${isMobile ? 'w-28' : ''}`}
    >
      <Logo />
      {!isMobile && <ActiveTiles />}
      <TileSet tiles={tiles} />
    </div>
  );
}
