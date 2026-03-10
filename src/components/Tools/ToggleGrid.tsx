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
    <div className="w-9">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`p-2 w-[2.4em] rounded-full cursor-pointer border-slate-500 border-[2px] ${isVisible ? "bg-blue-500 text-white" : "bg-slate-300 text-gray-800"}`}
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
