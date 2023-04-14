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
import useIsMobile from '@/hooks/isMobile';

const tiles = tilesMap.map((tile) => createTile(tile));

type Props = { tileSet?: Tile[] }

export default function App({ tileSet = tiles }: Props) {
    const { isMobile } = useIsMobile()

    return (
        <div className="flex overflow-hidden">
            <aside>
                <TilePanels tiles={tileSet} />
            </aside>
            <main className="bg-gray-700 w-full h-screen overflow-hidden relative flex items-center justify-center padding-100">
                <ToolBar />
                <ToggleGrid />
                <ExportButton />
                <Canvas />
                <Colors />
                {!isMobile && <LayerStack />}
                <Zoom />
            </main>
        </div>
    );
}
