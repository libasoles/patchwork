import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { bgColors, colors } from "@/config";
import {
  actionAtom,
  bgColorAtom,
  colorAtom,
  colorMenuTargetAtom,
} from "@/store";
import styles from "@/styles/utils.module.css";
import { Action, ColorTarget, EventCallback } from "@/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { SyntheticEvent } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { isHotkeyPressed } from "react-hotkeys-hook";

export default function ColorMenu() {
  const t = useTranslations("tooltips");
  const [color, setColor] = useAtom(colorAtom);
  const [bgColor, setBgColor] = useAtom(bgColorAtom);
  const [target, setTarget] = useAtom(colorMenuTargetAtom);
  const [action, setActiveAction] = useAtom(actionAtom);

  const isTile = target === "tile";
  const activeColors = isTile ? colors : bgColors;
  const currentColor = isTile ? color : bgColor;
  const setCurrent = isTile ? setColor : setBgColor;

  const onTileColorContext = (e: SyntheticEvent, aColor: string) => {
    e.preventDefault();
    if (isHotkeyPressed("ctrl") && action !== Action.Paint) {
      setActiveAction(Action.Paint);
    }
    setColor(aColor);
  };

  return (
    <div
      data-testid="color-panel"
      className="pointer-events-auto bg-gray-800 border border-slate-700/60 rounded-3xl p-1.5 shadow-xl self-start flex flex-col items-center h-full"
    >
      <div className="flex flex-col items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-testid="tile-target"
              aria-label={t("tileColor")}
              aria-pressed={isTile}
              onClick={() => setTarget("tile")}
              className={`grid items-center rounded-full w-[38px] h-[38px] overflow-hidden border-2 shadow-md transition-colors ${
                isTile ? "border-white" : "border-slate-700/60 hover:border-slate-500"
              }`}
            >
              <span
                data-testid="selected-color"
                className={`rounded-full bg-${color} w-full h-full`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">{t("tileColor")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-testid="bg-target"
              aria-label={t("bgColor")}
              aria-pressed={!isTile}
              onClick={() => setTarget("bg")}
              className={`grid items-center rounded-lg w-[38px] h-[38px] overflow-hidden border-2 shadow-md transition-colors ${
                !isTile ? "border-white" : "border-slate-700/60 hover:border-slate-500"
              }`}
            >
              <span
                data-testid="selected-bg-color"
                className={`rounded-[4px] bg-${bgColor} w-full h-full`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">{t("bgColor")}</TooltipContent>
        </Tooltip>
      </div>
      <hr className="border-t border-slate-700/60 w-full my-1.5" />
      <Scrollbars style={{ width: 56, height: "100%" }} autoHide universal>
        <div
          data-testid="selectable-colors"
          className="flex flex-col items-center gap-1.5"
        >
          {activeColors.map((aColor) => {
            const isSelected = aColor === currentColor;
            return (
              <Swatch
                key={aColor}
                color={aColor}
                shape={isTile ? "circle" : "square"}
                target={target}
                isSelected={isSelected}
                onSelect={() => setCurrent(aColor)}
                onControlClick={
                  isTile ? (e) => onTileColorContext(e, aColor) : undefined
                }
              />
            );
          })}
        </div>
      </Scrollbars>
    </div>
  );
}

type SwatchProps = {
  color: string;
  shape: "circle" | "square";
  target: ColorTarget;
  isSelected: boolean;
  onSelect: EventCallback;
  onControlClick?: (e: SyntheticEvent) => void;
};

function Swatch({
  color,
  shape,
  target,
  isSelected,
  onSelect,
  onControlClick,
}: SwatchProps) {
  const outer = shape === "circle" ? "rounded-full" : "rounded-lg";
  const inner = shape === "circle" ? "rounded-full" : "rounded-[4px]";
  return (
    <label
      data-testid="color-container"
      className={`grid items-center ${outer} w-[38px] h-[38px] border-2 ${
        isSelected ? "border-white" : "border-slate-700/60"
      } bg-gray-800 overflow-hidden shadow-md cursor-pointer`}
      style={{
        // @ts-ignore
        containerType: "inline-size",
      }}
    >
      <input
        data-testid="radio"
        type="radio"
        name={`color-${target}`}
        value={color}
        onChange={onSelect}
        onContextMenu={onControlClick}
        className={`${styles.overlap} cursor-pointer`}
        checked={isSelected}
        role="radio"
      />
      <span
        data-testid="color-circle"
        className={`${inner} bg-${color} w-[38px] h-[38px_!important] ${styles.overlap} pointer-events-none`}
      />
    </label>
  );
}
