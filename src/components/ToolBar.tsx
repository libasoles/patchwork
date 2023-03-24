import { actionAtom } from "@/store";
import { Action } from "@/types";
import { useAtom } from "jotai";
import { ReactElement, useMemo } from "react";
import { DrawIcon } from "../icons/DrawIcon";
import { PaintIcon } from "../icons/PaintIcon";


const ToolBar = () => {
    const [selected, setSelected] = useAtom(actionAtom);

    return (
        <div className="flex justify-center items-center fixed  top-3 z-10">
            <div className="flex items-center space-x-4 bg-gray-800 rounded-full p-1">
                <ActionButton name={Action.Draw} selected={selected} setSelected={setSelected}>
                    <DrawIcon />
                </ActionButton>

                <ActionButton name={Action.Paint} selected={selected} setSelected={setSelected}>
                    <PaintIcon />
                </ActionButton>
            </div>
        </div>
    );
};


type ActionButtonProps = {
    name: Action;
    selected: Action;
    setSelected: (action: Action) => void;
    children: ReactElement
}

function ActionButton({ name, selected, setSelected, children }: ActionButtonProps) {
    const highlight = useMemo(() => {
        return (expected: Action) => selected === expected ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
    }, [selected]);

    return (
        <button
            type="button"
            className={`p-2 rounded-full ${highlight(name)}`}
            onClick={() => setSelected(name)}
            title={Action[name]}
        >
            {children}
        </button>
    )
}


export default ToolBar