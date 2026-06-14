import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GridIcon from "@/icons/GridIcon";
import { gridVisibilityAtom } from "@/store";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

export default function ToggleGrid() {
  const t = useTranslations("tooltips");
  const [isVisible, setVisible] = useAtom(gridVisibilityAtom);

  return (
    <div className="pointer-events-auto sm:hidden md:block">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`p-2 w-[2.4em] rounded-full cursor-pointer transition-colors ${isVisible ? "bg-blue-500 text-white" : "bg-transparent text-slate-300 hover:bg-slate-700 hover:text-slate-100"}`}
            onClick={() => setVisible((isVisible) => !isVisible)}
          >
            <GridIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isVisible ? t("hideGrid") : t("showGrid")}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
