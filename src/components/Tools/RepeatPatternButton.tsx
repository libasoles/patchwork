import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { canvasDimension } from "@/config";
import { computeVisibleTilesBoundingBox } from "@/lib/patternProjection";
import { toastOnce } from "@/lib/toastOnce";
import { patternProjectionAtom, useLayersApi } from "@/store";
import { useAtom } from "jotai";
import { Grid2x2 } from "lucide-react";
import { useTranslations } from "next-intl";

const ICON_SIZE = 22;

export default function RepeatPatternButton() {
  const t = useTranslations("tooltips");
  const tt = useTranslations("toasts");
  const { list } = useLayersApi();
  const [projection, setProjection] = useAtom(patternProjectionAtom);

  const toggleProjection = () => {
    if (projection.enabled) {
      setProjection({ enabled: false, sourceRegion: null });
      return;
    }

    const sourceRegion = computeVisibleTilesBoundingBox(list(), canvasDimension);
    if (!sourceRegion) {
      toastOnce("repeat-pattern-empty", tt("repeatPatternEmpty"));
      return;
    }

    setProjection({ enabled: true, sourceRegion });
  };

  return (
    <div className="pointer-events-auto">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-testid="repeat-pattern-button"
            className={`grid place-items-center p-0 w-[2.4em] h-[2.4em] rounded-full cursor-pointer transition-colors ${
              projection.enabled
                ? "bg-blue-500/50 text-blue-200"
                : "bg-transparent text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            }`}
            onClick={toggleProjection}
          >
            <Grid2x2 size={ICON_SIZE} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("repeatPattern")}</TooltipContent>
      </Tooltip>
    </div>
  );
}
