import { actionAtom, colorBarVisibilityAtom, useLayersStore } from "@/store";
import { Action } from "@/types";
import { useAtom } from "jotai";
import DrawIcon from "@/icons/DrawIcon";
import PaintIcon from "@/icons/PaintIcon";
import HandIcon from "@/icons/HandIcon";
import ActionButton from "./components/ActionButton";
import RotateIcon from "@/icons/RotateIcon";
import TrashIcon from "@/icons/TrashIcon";

const ToolBar = () => {
    const [selectedAction, setSelected] = useAtom(actionAtom);
    const [_, setColorBarVisible] = useAtom(colorBarVisibilityAtom)

    const { list, selected: selectedLayer, disable } = useLayersStore()

    const disableLayers = () => list().filter(layer => layer.id !== selectedLayer).map(layer => disable(layer))

    return (
        <div data-testid='toolbar' className="flex justify-center items-center fixed  top-3 z-10">
            <div className="flex items-center space-x-3 bg-gray-800 rounded-full p-1">
                {/* TODO: maybe generalize actions and map them? They have all the same props */}

                <ActionButton name={Action.Draw} selected={selectedAction} onClick={setSelected}>
                    <DrawIcon />
                </ActionButton>

                <ActionButton name={Action.Paint} selected={selectedAction} onClick={(actionName) => {
                    setSelected(actionName)
                    setColorBarVisible(true)
                }}>
                    <PaintIcon />
                </ActionButton>

                <ActionButton name={Action.Move} selected={selectedAction} onClick={(actionName) => {
                    setSelected(actionName)
                    disableLayers()
                }}>
                    <HandIcon />
                </ActionButton>

                <ActionButton name={Action.Rotate} selected={selectedAction} onClick={(actionName) => {
                    setSelected(actionName)
                    disableLayers()
                }}>
                    <RotateIcon />
                </ActionButton>

                <ActionButton name={Action.Delete} selected={selectedAction} onClick={(actionName) => {
                    setSelected(actionName)
                    disableLayers()
                }}>
                    <TrashIcon />
                </ActionButton>
                <div className="text-slate-300 pr-[1.2em] font-mono">| {Action[selectedAction]}</div>
            </div>
        </div>
    );
};

export default ToolBar
