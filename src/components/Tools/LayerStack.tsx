import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLayerDefaultName } from "@/lib/i18n";
import { useLayersApi } from "@/store";
import { Layer } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Sun,
  SunDim,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";

const createRandomHash = () => Math.random().toString(36).substring(2, 10);

const LayerStack = () => {
  const t = useTranslations("layers");
  const tt = useTranslations("tooltips");
  const { list, current, add, update, remove, select } = useLayersApi();
  const router = useRouter();
  const locale = (router.locale as "en" | "es") || "en";
  const layersList = list();
  const defaultLayerId = layersList[0].id;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLayerClick = (layer: Layer) => {
    select(layer.id);
  };

  const handleToggleLayer = (layer: Layer) => {
    update({ ...layer, visible: !layer.visible });
  };

  const handleDisableLayer = (layer: Layer) => {
    update({ ...layer, enabled: !layer.enabled });
  };

  const handleAddLayer = () => {
    const newLayerId = createRandomHash();
    const layerName = getLayerDefaultName(locale);
    add(newLayerId, layerName);
    select(newLayerId);
  };

  const handleRemoveLayer = (layerId: string) => {
    if (current().id === layerId) {
      const layerIndex = layersList.findIndex((l) => l.id === layerId);
      const newSelectedLayer = layersList[layerIndex - 1];
      select(newSelectedLayer.id);
    }

    remove(layerId);
  };

  return (
    <div className="fixed bottom-3 left-[14em] z-10 w-[16em]">
      <div className={`rounded-2xl bg-gray-800 border border-slate-700/60 shadow-xl backdrop-blur ${isExpanded ? "p-4" : "px-4 py-2"}`}>
        <button
          className={`flex items-center justify-between w-full ${isExpanded ? "mb-3" : ""}`}
          onClick={() => setIsExpanded((v) => !v)}
        >
          <h2 className="text-slate-300 text-base font-bold tracking-tight">
            {t("title")}
          </h2>
          {isExpanded ? (
            <ChevronDown size={18} className="text-slate-400" />
          ) : (
            <ChevronUp size={18} className="text-slate-400" />
          )}
        </button>

        {isExpanded && <div className="space-y-2">
          {layersList
            .slice()
            .reverse()
            .map((layer, index) => {
              const number = layersList.length - index;
              const isRemovable = layer.id !== defaultLayerId;
              const isSelected = current().id === layer.id;

              return (
                <div
                  key={layer.id}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
                    isSelected
                      ? "bg-slate-800/80 border-slate-600"
                      : "bg-slate-900/40 border-transparent hover:bg-slate-800/50"
                  }`}
                  onClick={() => handleLayerClick(layer)}
                >
                  <Layers
                    size={18}
                    className={
                      isSelected ? "text-blue-300" : "text-slate-400"
                    }
                  />
                  <span
                    className={`flex-1 truncate text-sm ${
                      isSelected ? "text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {layer.name} {number}
                  </span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="p-1 rounded text-slate-400 hover:text-slate-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDisableLayer(layer);
                        }}
                      >
                        {layer.enabled ? (
                          <Sun size={16} />
                        ) : (
                          <SunDim size={16} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {layer.enabled
                        ? tt("grayOutLayer")
                        : tt("highlightLayer")}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="p-1 rounded text-slate-400 hover:text-slate-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLayer(layer);
                        }}
                      >
                        {layer.visible ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {layer.visible ? tt("hideLayer") : tt("showLayer")}
                    </TooltipContent>
                  </Tooltip>

                  {isRemovable ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-1 rounded text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLayer(layer.id);
                          }}
                        >
                          <X size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{tt("removeLayer")}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <span aria-hidden className="p-1 invisible">
                      <X size={16} />
                    </span>
                  )}
                </div>
              );
            })}
        </div>}

        {isExpanded && (
          <button
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-600 text-slate-300 hover:text-slate-100 hover:border-slate-400 hover:bg-slate-800/40 transition-colors"
            onClick={handleAddLayer}
          >
            <Plus size={16} />
            <span className="text-sm">{t("addLayer")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LayerStack;
