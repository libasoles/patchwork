import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GridIcon from "@/icons/GridIcon";
import { gridVisibilityAtom } from "@/store";
import { GridMode } from "@/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

const nextMode: Record<GridMode, GridMode> = {
  dots: 'lines',
  lines: 'none',
  none: 'dots',
};

const buttonStyle: Record<GridMode, string> = {
  dots: 'bg-blue-500/50 text-blue-200',
  lines: 'bg-blue-500 text-white',
  none: 'bg-transparent text-slate-300 hover:bg-slate-700 hover:text-slate-100',
};

export default function ToggleGrid() {
  const t = useTranslations("tooltips");
  const [gridMode, setGridMode] = useAtom(gridVisibilityAtom);

  return (
    <div className="pointer-events-auto sm:hidden md:block">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`p-2 w-[2.4em] rounded-full cursor-pointer transition-colors ${buttonStyle[gridMode]}`}
            onClick={() => setGridMode(nextMode[gridMode])}
          >
            <GridIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t(`grid_${gridMode}` as any)}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
