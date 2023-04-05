import Grid from './Patchwork/Grid';
import Zoom from '@/components/Tools/Zoom';
import Colors from './Tools/Colors';
import ToolBar from '@/components/Tools/ToolBar';
import TilePanels from './TilesPanel/TilePanels';
import ExportButton from '@/components/Tools/ExportButton';
import { gridDimension, tilesMap } from '@/config';
import { createTile } from '../factory';
import { Tile } from '@/types';
import ToggleGrid from './Tools/ToggleGrid';

const tiles = tilesMap.map((tile) => createTile(tile));

type Dimension = { x: number, y: number }
type Props = { tileSet?: Tile[], dimension?: Dimension }

export default function App({ tileSet = tiles, dimension = gridDimension }: Props) {
    return (
        <div className="flex">
            <aside>
                <TilePanels tiles={tileSet} />
            </aside>
            <main className="bg-gray-700 w-full h-screen overflow-scroll relative flex items-center justify-center padding-100">
                <ToolBar />
                <ExportButton />
                <Colors />
                <Grid dimension={dimension} />
                <Zoom />
                <ToggleGrid />
            </main>
        </div>
    );
}
