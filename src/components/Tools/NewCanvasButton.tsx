import { canvasDimension, initialZoomLevel } from "@/config";
import { emptyCanvas } from "@/factory";
import { canvasOffsetAtom, zoomLevelAtom } from "@/store";
import { useStore } from "@/store/store";
import { useSetAtom } from "jotai";
// useStore is used as a static object (useStore.setState) for the reset
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

function NewIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      viewBox="0 0 24 24"
      height="100%"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export default function NewCanvasButton() {
  const t = useTranslations("newCanvas");
  const tt = useTranslations("tooltips");
  const setZoom = useSetAtom(zoomLevelAtom);
  const setOffset = useSetAtom(canvasOffsetAtom);

  const handleConfirm = () => {
    useStore.setState((draft) => {
      const initialLayerId = "xxx1xxx";
      draft.layers = new Map([
        [
          initialLayerId,
          {
            id: initialLayerId,
            name: "Layer",
            visible: true,
            enabled: true,
            canvas: {
              cells: emptyCanvas(canvasDimension),
              dimension: canvasDimension,
            },
          },
        ],
      ]);
      draft.selected = initialLayerId;
      draft.history = [];
    });

    setZoom(initialZoomLevel);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="w-9">
      <Tooltip>
        <AlertDialog>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="p-2 w-[2.4em] rounded-full cursor-pointer bg-blue-500 border-slate-500 border-[2px] text-white"
              >
                <NewIcon />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{t("confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
        <TooltipContent side="bottom">{tt("newCanvas")}</TooltipContent>
      </Tooltip>
    </div>
  );
}
