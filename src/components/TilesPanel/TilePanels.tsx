import { actionAtom } from "@/store";
import { Action, Tile } from "@/types";
import { useAtom } from "jotai";
import TileSet from './TileSet';
import ActiveTiles from './ActiveTiles';

type Props = {
    tiles: Tile[]
}

export default function TilePanels({ tiles }: Props) {
    const [action] = useAtom(actionAtom);

    const shouldDisablePanel = action !== Action.Draw

    return (
        <div data-testid='tiles-panel'
            className={`h-screen flex flex-col ${shouldDisablePanel ? "opacity-50" : ""} select-none`}>
            <ActiveTiles isDisabled={shouldDisablePanel} />
            <TileSet tiles={tiles} isDisabled={shouldDisablePanel} />
        </div>
    );
}