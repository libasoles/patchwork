import { bgColors } from "@/config";
import { bgColorAtom, bgColorBarVisibilityAtom } from "@/store";
import styles from "@/styles/utils.module.css";
import { useAtom } from "jotai";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function BgColors() {
  const [bgColor, setBgColor] = useAtom(bgColorAtom);
  const [visible, setVisible] = useAtom(bgColorBarVisibilityAtom);

  return (
    <div className="w-9 h-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`relative grid items-center rounded-full w-[38px] h-[38px_!important] border-2 border-slate-400 bg-slate-400 my-1 mt-[.1rem] mb-3 overflow-hidden cursor-pointer`}
            onClick={() => setVisible((v) => !v)}
          >
            <span
              className={`rounded-full bg-${bgColor} w-[38px] h-[38px_!important] ${styles.overlap}`}
            ></span>
            <span className="absolute inset-0 flex items-center justify-center text-white text-[14px] font-bold pointer-events-none z-10 drop-shadow">
              BG
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">Color de fondo</TooltipContent>
      </Tooltip>
      {visible && (
        <>
          <hr className="border-2 mb-1.5" />
          <Scrollbars style={{ width: 200, height: "100%" }} autoHide universal>
            <div className="flex flex-col overflow-hidden h-auto pr-12">
              {bgColors.map((aColor) => {
                const isSelected = aColor === bgColor;
                return (
                  <label
                    key={aColor}
                    className={`grid items-center rounded-full w-[38px] h-[38px_!important] border-2 border-slate-400 bg-slate-400 my-1.5 overflow-hidden`}
                    style={
                      { containerType: "inline-size" } as React.CSSProperties
                    }
                  >
                    <input
                      type="radio"
                      name="bg-color"
                      value={aColor}
                      onChange={() => setBgColor(aColor)}
                      className={`${styles.overlap} cursor-pointer`}
                      checked={isSelected}
                      role="radio"
                    />
                    <span
                      className={`rounded-full bg-${aColor} w-[38px] h-[38px_!important] ${styles.overlap} pointer-events-none`}
                    ></span>
                  </label>
                );
              })}
            </div>
          </Scrollbars>
        </>
      )}
    </div>
  );
}
