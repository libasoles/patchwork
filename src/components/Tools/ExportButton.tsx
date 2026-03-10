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

function renderLayersToCanvas(
  layers: Layer[],
  bgColor: string,
  dimension: { x: number; y: number },
): HTMLCanvasElement {
  const width = dimension.x * cellSize;
  const height = dimension.y * cellSize;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = tailwindColors[bgColor] ?? "#374151";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `57px blocks`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const layer of layers.filter((l) => l.visible)) {
    for (let i = 0; i < layer.canvas.cells.length; i++) {
      const tile = layer.canvas.cells[i];
      if (tile.isEmpty()) continue;

      const col = i % dimension.x;
      const row = Math.floor(i / dimension.x);
      const cx = col * cellSize + cellSize / 2;
      const cy = row * cellSize + cellSize / 2;

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
  const t = useTranslations("tooltips");
  const { list } = useLayersApi();
  const [bgColor] = useAtom(bgColorAtom);

  const handleExportClick = async () => {
    await document.fonts.load(`57px blocks`);

    const canvas = renderLayersToCanvas(list(), bgColor, canvasDimension);

    const link = document.createElement("a");
    link.download = "patchwork.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-9 pointer-events-auto">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="p-2 w-[2.4em] rounded-full cursor-pointer bg-blue-500 border-slate-500 border-[2px] text-white"
            onClick={handleExportClick}
          >
            <DownloadIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("downloadImage")}</TooltipContent>
      </Tooltip>
    </div>
  );
}
