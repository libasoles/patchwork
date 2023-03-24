import { actionAtom } from "@/store";
import { Action } from "@/types";
import { useAtom } from "jotai";
import { ReactElement, useMemo } from "react";


const ToolBar = () => {
    const [selected, setSelected] = useAtom(actionAtom);

    return (
        <div className="flex justify-center items-center fixed  top-3 z-10">
            <div className="flex items-center space-x-4 bg-gray-800 rounded-full p-1">
                <ActionButton name={Action.Draw} selected={selected} setSelected={setSelected}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke=""><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"></path></svg>
                </ActionButton>

                <ActionButton name={Action.Paint} selected={selected} setSelected={setSelected}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke=""><defs></defs><path d="M840 192h-56v-72c0-13.3-10.7-24-24-24H168c-13.3 0-24 10.7-24 24v272c0 13.3 10.7 24 24 24h592c13.3 0 24-10.7 24-24V256h32v200H465c-22.1 0-40 17.9-40 40v136h-44c-4.4 0-8 3.6-8 8v228c0 1.1 0.2 2.2 0.6 3.1-0.4 1.6-0.6 3.2-0.6 4.9 0 46.4 37.6 84 84 84s84-37.6 84-84c0-1.7-0.2-3.3-0.6-4.9 0.4-1 0.6-2 0.6-3.1V640c0-4.4-3.6-8-8-8h-44V520h351c22.1 0 40-17.9 40-40V232c0-22.1-17.9-40-40-40z"></path></svg>
                </ActionButton>
            </div>
        </div>
    );
};


type Props = {
    name: Action;
    selected: Action;
    setSelected: (action: Action) => void;
    children: ReactElement
}

function ActionButton({ name, selected, setSelected, children }: Props) {
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