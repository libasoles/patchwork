import Grid from '../components/Patchwork/Grid';
import Zoom from '../components/Zoom';
import TileSet from '../components/TileSet/TileSet';
import Colors from '../components/Colors';
import ToolBar from '@/components/ToolBar';
import ActiveTiles from '@/components/TileSet/ActiveTiles';
import TilesPanels from '../components/TileSet/TilesPanels';
import { defaultColor, gridDimension, tilesMap } from '@/config';
import type { Tile } from '../types';

export function createTile({ id, symbol, color = defaultColor, ...rest }: { id: number, symbol: string, color?: string, group?: string }): Tile {
    return {
        id,
        symbol,
        color,
        ...rest,
        equals(anotherTile?: Tile) {
            return this.id === anotherTile?.id
        }
    }
}

export function App() {
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
