import Grid from './Patchwork/Grid';
import Zoom from './Zoom';
import TileSet from './TilesPanel/TileSet';
import Colors from './Colors';
import ToolBar from '@/components/ToolBar';
import ActiveTiles from '@/components/TilesPanel/ActiveTiles';
import TilesPanels from './TilesPanel/TilesPanels';
import { gridDimension, tilesMap } from '@/config';
import { createTile } from '../factory';

export default function App() {
    const tiles = tilesMap.map((tile) => createTile(tile));

    return (
        <div className="flex">
            <aside>
                <TilesPanels>
                    <ActiveTiles />
                    <TileSet tiles={tiles} />
                </TilesPanels>
            </aside>
            <main className="bg-gray-700 w-full h-screen overflow-scroll relative flex items-center justify-center padding-100">
                <ToolBar />
                <Colors />
                <Grid dimension={gridDimension} />
                <Zoom />
            </main>
        </div>
    );
}
