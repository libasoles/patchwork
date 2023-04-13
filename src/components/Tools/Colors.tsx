import { SyntheticEvent } from "react";
import { colors } from "@/config";
import { actionAtom, colorAtom, colorBarVisibilityAtom } from "@/store";
import { Action, EventCallback } from "@/types";
import { useAtom } from "jotai";
import { isHotkeyPressed } from "react-hotkeys-hook";
import styles from "@/styles/utils.module.css"

export default function Colors() {
    const [color, setColor] = useAtom(colorAtom)
    const [visible, setVisible] = useAtom(colorBarVisibilityAtom)
    const [action, setActiveAction] = useAtom(actionAtom);

    const onSelect = (e: SyntheticEvent, aColor: string) => {
        e.preventDefault()

        if (isHotkeyPressed('ctrl') && action !== Action.Paint) {
            setActiveAction(Action.Paint)
        }

        setColor(aColor)
    }

    return (
        <div data-testid='color-panel' className='w-9 fixed top-3 right-3 z-10 h-full'>
            <ColorCircle color={color} onSelect={() => { setVisible((visible) => !visible) }} className='mt-[.1rem] mb-3' />
            {
                visible &&
                <>
                    <hr className="border-2 mb-1.5" />
                    <div className="flex flex-col overflow-scroll h-full pr-12">
                        {
                            colors.map(
                                aColor => {
                                    const isSelected = aColor === color
                                    return <ColorCircle
                                        key={aColor}
                                        color={aColor}
                                        isSelected={isSelected}
                                        onSelect={() => { setColor(aColor) }}
                                        onControlClick={(e: SyntheticEvent) => {
                                            e.preventDefault();
                                            onSelect(e, aColor)
                                        }}
                                    />
                                })
                        }
                    </div>
                </>
            }
        </div>
    );
}

type ColorCircleProps = {
    color: string;
    className?: string;
    isSelected?: boolean;
    onSelect: EventCallback;
    onControlClick?: (e: SyntheticEvent) => void;
};

function ColorCircle({ color, isSelected = false, onSelect, onControlClick, className }: ColorCircleProps) {
    return (
        // TODO: there's a thing with the external circle height when the window height is shorter
        <label className={`grid items-center rounded-full w-9 h-9 bg-slate-400 my-1.5 ${className}`}
            style={{
                // @ts-ignore
                containerType: "inline-size",
            }}>
            <input
                type="radio"
                name="color"
                value={color}
                onChange={onSelect}
                onContextMenu={onControlClick}
                className={`${styles.overlap} cursor-pointer`}
                checked={isSelected}
                role="radio"
            />
            <span className={`rounded-full bg-${color} w-8 h-8 ${styles.overlap} pointer-events-none`}></span>
        </label>
    );
}