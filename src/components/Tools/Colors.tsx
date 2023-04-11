import { colors } from "@/config";
import { colorAtom, colorBarVisibilityAtom } from "@/store";
import { EventCallback } from "@/types";
import { useAtom } from "jotai";
import styles from "@/styles/utils.module.css"

export default function Colors() {
    const [color, setColor] = useAtom(colorAtom)
    const [visible, setVisible] = useAtom(colorBarVisibilityAtom)

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
                                        onSelect={(e) => { setColor(aColor) }} />
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
};

function ColorCircle({ color, isSelected = false, onSelect, className }: ColorCircleProps) {
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
                className={styles.overlap}
                checked={isSelected}
                role="radio"
            />
            <span className={`rounded-full bg-${color} w-8 h-8 cursor-pointer ${styles.overlap}`}></span>
        </label>
    );
}