import { Action } from "@/types";
import { ReactElement, ReactNode } from "react";
import styles from "./ActionButton.module.css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export type ActionButtonProps = {
  name: Action;
  selected?: Action;
  onClick: (action: Action) => void;
  icon?: ReactNode;
  shortcut?: string;
  children?: ReactElement;
};

export default function ActionButton({
  name,
  selected,
  icon,
  onClick,
  shortcut,
  children,
}: ActionButtonProps) {
  const t = useTranslations("toolbar");
  const isSelected = selected === name;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          data-testid={`${name.toLowerCase()}-icon`}
          className={`grid items-center justify-items-center w-9 h-9 rounded-full cursor-pointer transition-colors ${
            isSelected
              ? "bg-blue-500 text-white"
              : "text-slate-300 hover:text-slate-100 hover:bg-slate-700/60"
          }`}
          onClick={() => onClick(name)}
        >
          <input
            type="radio"
            name="tile"
            value={name}
            onChange={() => onClick(name)}
            className={`${styles.overlap} opacity-0 cursor-pointer`}
            checked={isSelected}
          />
          <div className={`${styles.overlap} grid place-items-center`}>
            {icon ?? children}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {t(name)}{" "}
        <kbd className="ml-1 rounded bg-white/25 px-1.5 py-0.5 font-mono text-sm">
          {shortcut}
        </kbd>
      </TooltipContent>
    </Tooltip>
  );
}
