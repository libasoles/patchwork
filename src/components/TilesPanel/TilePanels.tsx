import { Tile } from "@/types";
import TileSet from './AllTiles';
import ActiveTiles from './ActiveTiles';

type Props = {
    tiles: Tile[]
}

export default function TilePanels({ tiles }: Props) {
    return (
        <div data-testid='tiles-panel h-full'
            className={`h-screen flex flex-col select-none`}>
            <ActiveTiles />
            <TileSet tiles={tiles} />
        </div>
    );
}
