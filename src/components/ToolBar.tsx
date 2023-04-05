import { actionAtom, colorBarVisibilityAtom } from "@/store";
import { Action } from "@/types";
import { useAtom } from "jotai";
import DrawIcon from "../icons/DrawIcon";
import PaintIcon from "../icons/PaintIcon";
import HandIcon from "../icons/HandIcon";
import { ActionButton } from "./ActionButton";

const ToolBar = () => {
    const [selected, setSelected] = useAtom(actionAtom);
    const [_, setColorBarVisible] = useAtom(colorBarVisibilityAtom)

    return (
        <div data-testid='toolbar' className="flex justify-center items-center fixed  top-3 z-10">
            <div className="flex items-center space-x-3 bg-gray-800 rounded-full p-1">
                <ActionButton name={Action.Draw} selected={selected} onClick={setSelected}>
                    <DrawIcon />
                </ActionButton>

                <ActionButton name={Action.Paint} selected={selected} onClick={(actionName) => {
                    setSelected(actionName)
                    setColorBarVisible(true)
                }}>
                    <PaintIcon />
                </ActionButton>

                <ActionButton name={Action.Move} selected={selected} onClick={setSelected}>
                    <HandIcon />
                </ActionButton>

                <div className="text-slate-300 pr-[1.2em] font-mono">| {Action[selected]}</div>
            </div>
        </div>
    );
};

export default ToolBar