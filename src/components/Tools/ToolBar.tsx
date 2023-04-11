import { actionAtom, colorBarVisibilityAtom, useLayersApi, useSelectedLayer } from "@/store";
import { Action } from "@/types";
import { useAtom } from "jotai";
import DrawIcon from "@/icons/DrawIcon";
import PaintIcon from "@/icons/PaintIcon";
import HandIcon from "@/icons/HandIcon";
import ActionButton from "./components/ActionButton";
import RotateIcon from "@/icons/RotateIcon";
import TrashIcon from "@/icons/TrashIcon";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback } from "react";

const ToolBar = () => {
    const [, setColorBarVisible] = useAtom(colorBarVisibilityAtom)
    const [selectedAction, setSelected] = useAtom(actionAtom);

    useHotkeys('1', () => setSelected(Action.Draw))
    useHotkeys('2', () => setSelected(Action.Paint))
    useHotkeys('3', () => setSelected(Action.Move))
    useHotkeys('4', () => setSelected(Action.Rotate))
    useHotkeys('5', () => setSelected(Action.Delete))

    const { list, disable } = useLayersApi()
    const selectedLayer = useSelectedLayer()

    const disableLayers = useCallback(
        () => list().filter(layer => layer.id !== selectedLayer).map(layer => disable(layer))
        , [list, selectedLayer, disable])

    const selectActionAndDisplayColors = useCallback((action: Action) => {
        setSelected(action)
        setColorBarVisible(true)
    }, [setSelected, setColorBarVisible])

    const selectActionAndDisableLayers = useCallback((action: Action) => {
        setSelected(action)
        disableLayers()
    }, [setSelected, disableLayers])

    const actions = [
        { name: Action.Draw, icon: <DrawIcon />, onClick: setSelected, shortcut: '1' },
        { name: Action.Paint, icon: <PaintIcon />, onClick: selectActionAndDisplayColors, shortcut: '2' },
        { name: Action.Move, icon: <HandIcon />, onClick: selectActionAndDisableLayers, shortcut: '3' },
        { name: Action.Rotate, icon: <RotateIcon />, onClick: selectActionAndDisableLayers, shortcut: '4' },
        { name: Action.Delete, icon: <TrashIcon />, onClick: selectActionAndDisableLayers, shortcut: '5' }
    ]

    return (
        <div data-testid='toolbar' className="toolbar flex justify-center items-center fixed top-3 z-10">
            <div className="flex items-center space-x-3 bg-gray-800 rounded-full p-1">

                {actions.map((action) => <ActionButton key={action.name} selected={selectedAction} {...action} />)}

                <div data-testid='tool-name' className="text-slate-300 pr-[1.2em] font-mono">| {Action[selectedAction]}</div>
            </div>
        </div>
    );
};

export default ToolBar
