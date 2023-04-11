import { Tile } from "@/types";
import TileSet from './AllTiles';
import ActiveTiles from './ActiveTiles';
import useIsMobile from "@/hooks/isMobile";

type Props = {
    tiles: Tile[]
}

export default function TilePanels({ tiles }: Props) {
    const { isMobile } = useIsMobile()

    return (
        <div data-testid='tiles-panel h-full'
            className={`h-screen flex flex-col select-none`}>
            {!isMobile && <ActiveTiles />}
            <TileSet tiles={tiles} />
        </div>
    );
}
