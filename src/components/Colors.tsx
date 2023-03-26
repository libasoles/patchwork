import { colors } from "@/config";
import { colorAtom, colorBarVisibilityAtom } from "@/store";
import { useAtom } from "jotai";
import { SyntheticEvent, useState } from "react";

export default function Colors() {
    const [color, setColor] = useAtom(colorAtom)
    const [visible, setVisible] = useAtom(colorBarVisibilityAtom)

    return (
        <div className='w-9 fixed top-3 right-3 z-10 h-full'>
            <ColorCircle color={color} onSelect={() => { setVisible((visible) => !visible) }} />
            {
                visible &&
                <>
                    <hr className="border-2 mb-1.5" />
                    <div className="flex flex-col overflow-scroll h-full pr-12">
                        {
                            colors.map(aColor => <ColorCircle key={aColor} color={aColor} onSelect={(e) => { setColor(aColor) }} />)
                        }
                    </div>
                </>
            }

        </div>
    );
}

type ColorCircleProps = {
    color: string;
    onSelect: (e: SyntheticEvent) => void;
};

function ColorCircle({ color, onSelect }: ColorCircleProps) {
    return (
        // TODO: there's a thing with the external circle height when the window height is shorter
        <div className='rounded-full flex w-9 h-9 justify-center items-center bg-slate-400 my-1.5'>
            <button
                className={`rounded-full bg-${color} w-8 h-8 cursor-pointer`}
                onClick={onSelect}
            ></button>
        </div>
    );
}