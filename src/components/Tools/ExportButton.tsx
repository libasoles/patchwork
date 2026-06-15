import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
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
import { canvasDimension } from "@/config";
import DownloadIcon from "@/icons/DownloadIcon";
import { bgColorAtom, useLayersApi } from "@/store";
import { Layer } from "@/types";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

const cellSize = 40;
const PREVIEW_MAX_PX = 240;
// Measured empirically: the blocks font glyphs overflow their 40px cell by at most 3px on top.
// This minimal padding prevents edge clipping without adding visible background margin.
const FONT_OVERFLOW_PX = 3;

const tailwindColors: Record<string, string> = {
  // Background colors
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "slate-700": "#334155",
  "slate-800": "#1e293b",
  "slate-900": "#0f172a",
  "zinc-700": "#3f3f46",
  "zinc-800": "#27272a",
  "zinc-900": "#18181b",
  "neutral-800": "#262626",
  "neutral-900": "#171717",
  "stone-800": "#292524",
  "stone-900": "#1c1917",
  "indigo-950": "#1e1b4b",
  "blue-950": "#172554",
  "violet-950": "#2e1065",
  // Tile colors
  "yellow-400": "#facc15",
  "pink-500": "#ec4899",
  "red-400": "#f87171",
  "orange-400": "#fb923c",
  "rose-600": "#e11d48",
  "indigo-500": "#6366f1",
  "blue-400": "#60a5fa",
  "sky-600": "#0284c7",
  "cyan-600": "#0891b2",
  "teal-400": "#2dd4bf",
  "green-400": "#4ade80",
  "emerald-400": "#34d399",
  "fuchsia-500": "#d946ef",
  "purple-600": "#9333ea",
  "violet-500": "#8b5cf6",
};

function computeBoundingBox(
  layers: Layer[],
  dimension: { x: number; y: number },
) {
  let minCol = dimension.x,
    maxCol = -1;
  let minRow = dimension.y,
    maxRow = -1;

  for (const layer of layers.filter((l) => l.visible)) {
    for (let i = 0; i < layer.canvas.cells.length; i++) {
      if (layer.canvas.cells[i].isEmpty()) continue;
      const col = i % dimension.x;
      const row = Math.floor(i / dimension.x);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
    }
  }

  if (maxCol === -1) {
    return {
      minCol: 0,
      maxCol: dimension.x - 1,
      minRow: 0,
      maxRow: dimension.y - 1,
    };
  }
  return { minCol, maxCol, minRow, maxRow };
}

function renderLayersToCanvas(
  layers: Layer[],
  bgColor: string,
  dimension: { x: number; y: number },
  cropRegion?: {
    minCol: number;
    maxCol: number;
    minRow: number;
    maxRow: number;
    offset: number;
  },
  scale = 1,
): HTMLCanvasElement {
  let startCol = 0,
    endCol = dimension.x - 1;
  let startRow = 0,
    endRow = dimension.y - 1;

  if (cropRegion) {
    startCol = Math.max(0, cropRegion.minCol - cropRegion.offset);
    endCol = Math.min(dimension.x - 1, cropRegion.maxCol + cropRegion.offset);
    startRow = Math.max(0, cropRegion.minRow - cropRegion.offset);
    endRow = Math.min(dimension.y - 1, cropRegion.maxRow + cropRegion.offset);
  }

  const cols = endCol - startCol + 1;
  const rows = endRow - startRow + 1;
  const scaledCellSize = cellSize * scale;
  // The blocks font glyphs overflow their cell by up to FONT_OVERFLOW_PX at scale=1.
  const fontPad = Math.ceil(FONT_OVERFLOW_PX * scale);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cols * scaledCellSize);
  canvas.height = Math.round(rows * scaledCellSize);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = tailwindColors[bgColor] ?? "#374151";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${57 * scale}px blocks`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const layer of layers.filter((l) => l.visible)) {
    for (let i = 0; i < layer.canvas.cells.length; i++) {
      const tile = layer.canvas.cells[i];
      if (tile.isEmpty()) continue;

      const col = i % dimension.x;
      const row = Math.floor(i / dimension.x);

      if (col < startCol || col > endCol || row < startRow || row > endRow)
        continue;

      const localCol = col - startCol;
      const localRow = row - startRow;
      const cx = localCol * scaledCellSize + scaledCellSize / 2;
      const cy = localRow * scaledCellSize + scaledCellSize / 2 + fontPad;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((Math.PI / 2) * tile.orientation);
      ctx.fillStyle = tailwindColors[tile.color] ?? "#ffffff";
      ctx.fillText(tile.symbol, 0, 0);
      ctx.restore();
    }
  }

  return canvas;
}

export default function ExportButton() {
  const t = useTranslations("export");
  const tt = useTranslations("tooltips");
  const { list } = useLayersApi();
  const [bgColor] = useAtom(bgColorAtom);
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(1);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    const layers = list();
    const bbox = computeBoundingBox(layers, canvasDimension);
    document.fonts.load("57px blocks").then(() => {
      const clampedCols = Math.min(
        canvasDimension.x,
        bbox.maxCol - bbox.minCol + 1 + offset * 2,
      );
      const clampedRows = Math.min(
        canvasDimension.y,
        bbox.maxRow - bbox.minRow + 1 + offset * 2,
      );
      const scale = Math.min(
        1,
        PREVIEW_MAX_PX / (Math.max(clampedCols, clampedRows) * cellSize),
      );
      const preview = renderLayersToCanvas(
        layers,
        bgColor,
        canvasDimension,
        { ...bbox, offset },
        scale,
      );
      setPreviewUrl(preview.toDataURL("image/png"));
    });
  }, [open, offset, bgColor]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async () => {
    await document.fonts.load("57px blocks");
    const layers = list();
    const bbox = computeBoundingBox(layers, canvasDimension);
    const canvas = renderLayersToCanvas(layers, bgColor, canvasDimension, {
      ...bbox,
      offset,
    });
    const link = document.createElement("a");
    link.download = "patchwork.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="pointer-events-auto">
      <Tooltip>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="p-2 w-[2.4em] rounded-full cursor-pointer bg-transparent text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
              >
                <DownloadIcon />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("title")}</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="flex items-center justify-center bg-slate-900 rounded-lg p-3 min-h-[120px]">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-w-full max-h-48"
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>{t("offset")}</span>
                <span>{offset}</span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={offset}
                onChange={(e) => setOffset(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDownload}>
                {t("download")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TooltipContent side="bottom">{tt("downloadImage")}</TooltipContent>
      </Tooltip>
    </div>
  );
}
