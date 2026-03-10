import ExportButton from "@/components/Tools/ExportButton";
import ToolBar from "@/components/Tools/ToolBar";
import Zoom from "@/components/Tools/Zoom";
import { tilesMap } from "@/config";
import useIsMobile from "@/hooks/isMobile";
import { bgColorAtom } from "@/store";
import { Tile } from "@/types";
import { useAtom } from "jotai";
import { createTile } from "../factory";
import Canvas from "./Canvas/Canvas";
import TilePanels from "./TilesPanel/TilePanels";
import BgColors from "./Tools/BgColors";
import Colors from "./Tools/Colors";
import LayerStack from "./Tools/LayerStack";
import ToggleGrid from "./Tools/ToggleGrid";

const tiles = tilesMap.map((tile) => createTile(tile));

type Props = { tileSet?: Tile[] };

export default function App({ tileSet = tiles }: Props) {
  const { isMobile } = useIsMobile();
  const [bgColor] = useAtom(bgColorAtom);

  return (
    <div className="flex overflow-hidden cursor-default">
      <aside>
        <TilePanels tiles={tileSet} />
      </aside>
      <main
        className={`bg-${bgColor} w-full h-screen overflow-hidden relative flex items-center justify-center padding-100`}
      >
        <ToolBar />
        <Canvas />
        <div className="w-auto fixed top-3 right-[16px] z-10 flex gap-3 h-full justify-start">
          <ToggleGrid />
          <ExportButton />
          <BgColors />
          <Colors />
        </div>
        {!isMobile && <LayerStack />}
        <Zoom />
      </main>
    </div>
  );
}
