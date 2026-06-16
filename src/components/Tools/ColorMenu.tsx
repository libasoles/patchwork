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
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { isHotkeyPressed } from "react-hotkeys-hook";

type ColorMenuProps = {
  isMobile?: boolean;
};

export default function ColorMenu({ isMobile = false }: ColorMenuProps) {
  const t = useTranslations("tooltips");
  const [color, setColor] = useAtom(colorAtom);
  const [bgColor, setBgColor] = useAtom(bgColorAtom);
  const [target, setTarget] = useAtom(colorMenuTargetAtom);
  const [action, setActiveAction] = useAtom(actionAtom);
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const isTile = target === "tile";
  const activeColors = isTile ? colors : bgColors;

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const el = panelRef.current;
    if (!el || !el.parentElement) return;

    if (!isTile) {
      el.style.marginTop = (el.dataset.savedTop ?? "0") + "px";
      return;
    }

    const applyCenter = () => {
      if (!el.parentElement) return;
      const top = Math.max(0, (el.parentElement.clientHeight - el.clientHeight) / 2);
      el.style.marginTop = `${top}px`;
      el.dataset.savedTop = String(top);
    };

    applyCenter();
    const ro = new ResizeObserver(applyCenter);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile, isTile]);
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
      ref={panelRef}
      data-testid="color-panel"
      className={`pointer-events-auto bg-gray-800 border border-slate-700/60 shadow-xl flex flex-col items-center ${
        isMobile ? "max-w-[calc(100vw-2rem)] rounded-2xl p-1.5" : "rounded-3xl p-1.5"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 ${isMobile ? "justify-center" : "flex-col"}`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-testid="tile-target"
              aria-label={t("tileColor")}
              aria-pressed={isTile}
              onClick={() => {
                setTarget("tile");
                if (isMobile) setIsExpanded((value) => !value || !isTile);
              }}
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
              onClick={() => {
                setTarget("bg");
                if (isMobile) setIsExpanded((value) => !value || isTile);
              }}
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
      <div hidden={isMobile && !isExpanded} className="w-full">
        <hr className="border-t-2 border-slate-600 w-full my-2" />
        {isMobile ? (
          <div
            data-testid="selectable-colors"
            className="flex max-h-[min(34vh,12rem)] w-[min(13rem,calc(100vw-2.5rem))] flex-wrap justify-center gap-1.5 overflow-y-auto px-1 pb-1"
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
                  onSelect={() => {
                    setCurrent(aColor);
                    setIsExpanded(false);
                  }}
                  onControlClick={
                    isTile ? (e) => onTileColorContext(e, aColor) : undefined
                  }
                />
              );
            })}
          </div>
        ) : (
          <Scrollbars
            style={{ width: 56 }}
            autoHeight
            autoHeightMax="calc(100vh - 120px)"
            autoHide
            universal
          >
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
        )}
      </div>
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
