import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colors } from "@/config";
import { actionAtom, colorAtom, colorBarVisibilityAtom } from "@/store";
import styles from "@/styles/utils.module.css";
import { Action, EventCallback } from "@/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { SyntheticEvent } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { isHotkeyPressed } from "react-hotkeys-hook";

export default function Colors() {
  const t = useTranslations("tooltips");
  const [color, setColor] = useAtom(colorAtom);
  const [visible, setVisible] = useAtom(colorBarVisibilityAtom);
  const [action, setActiveAction] = useAtom(actionAtom);

  const onSelect = (e: SyntheticEvent, aColor: string) => {
    e.preventDefault();

    if (isHotkeyPressed("ctrl") && action !== Action.Paint) {
      setActiveAction(Action.Paint);
    }

    setColor(aColor);
  };

  return (
    <div
      data-testid="color-panel"
      className={`w-9 pointer-events-auto ${visible ? "h-full" : ""}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ColorCircle
              data-testid="selected-color"
              color={color}
              onSelect={() => setVisible((visible) => !visible)}
              className="mt-[.1rem] mb-3"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("tileColor")}</TooltipContent>
      </Tooltip>
      {visible && (
        <>
          <hr className="border-t border-slate-700/60 mb-1.5" />
          <Scrollbars style={{ width: 200, height: "100%" }} autoHide universal>
            <div
              data-testid="selectable-colors"
              className="flex flex-col overflow-hidden h-auto pr-12"
            >
              {colors.map((aColor) => {
                const isSelected = aColor === color;
                return (
                  <ColorCircle
                    key={aColor}
                    color={aColor}
                    isSelected={isSelected}
                    onSelect={() => {
                      setColor(aColor);
                    }}
                    onControlClick={(e: SyntheticEvent) => {
                      e.preventDefault();
                      onSelect(e, aColor);
                    }}
                  />
                );
              })}
            </div>
          </Scrollbars>
        </>
      )}
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

function ColorCircle({
  color,
  isSelected = false,
  onSelect,
  onControlClick,
  className,
  ...rest
}: ColorCircleProps) {
  return (
    // TODO: there's a thing with the external circle height when the window height is shorter
    <label
      data-testid="color-container"
      {...rest}
      className={`grid items-center rounded-full w-[38px] h-[38px_!important] border-2 border-slate-700/60 bg-gray-800 my-1.5 overflow-hidden shadow-md ${className}`}
      style={{
        // @ts-ignore
        containerType: "inline-size",
      }}
    >
      <input
        data-testid="radio"
        type="radio"
        name="color"
        value={color}
        onChange={onSelect}
        onContextMenu={onControlClick}
        className={`${styles.overlap} cursor-pointer`}
        checked={isSelected}
        role="radio"
      />
      <span
        data-testid="color-circle"
        className={`rounded-full bg-${color} w-[38px] h-[38px_!important] ${styles.overlap} pointer-events-none`}
      ></span>
    </label>
  );
}
