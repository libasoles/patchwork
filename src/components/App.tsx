import Canvas from './Patchwork/Canvas';
import Zoom from '@/components/Tools/Zoom';
import Colors from './Tools/Colors';
import ToolBar from '@/components/Tools/ToolBar';
import TilePanels from './TilesPanel/TilePanels';
import ExportButton from '@/components/Tools/ExportButton';
import { tilesMap } from '@/config';
import { createTile } from '../factory';
import { Tile } from '@/types';
import ToggleGrid from './Tools/ToggleGrid';
import LayerStack from './Tools/LayerStack';

const tiles = tilesMap.map((tile) => createTile(tile));

type Props = { tileSet?: Tile[] }

export default function App({ tileSet = tiles }: Props) {
    return (
        <div className="flex">
            <aside>
                <TilePanels tiles={tileSet} />
            </aside>
            <main className="bg-gray-700 w-full h-screen overflow-scroll relative flex items-center justify-center padding-100">
                <ToolBar />
                <ToggleGrid />
                <ExportButton />
                <Canvas />
                <Colors />
                <LayerStack />
                <Zoom />
            </main>
        </div>
    );
}
