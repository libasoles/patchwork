import { useLayersApi } from "@/store";
import { Layer } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { getLayerDefaultName } from "@/lib/i18n";

const createRandomHash = () => Math.random().toString(36).substring(2, 10);

const LayerStack = () => {
  const t = useTranslations("layers");
  const tt = useTranslations("tooltips");
  const { list, current, add, update, remove, select } = useLayersApi();
  const router = useRouter();
  const locale = (router.query.locale as 'en' | 'es') || 'en';
  const layersList = list();
  const defaultLayerId = layersList[0].id;

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
    <div className="flex flex-col items-start justify-start p-4 fixed bottom-1.5 left-[14em] z-10 w-[12em]">
      <div className="space-y-2 w-full ">
        {layersList
          .slice()
          .reverse()
          .map((layer, index) => {
            const number = layersList.length - index;
            const isRemovable = layer.id !== defaultLayerId;

            return (
              <div
                key={layer.id}
                className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer ${
                  current().id === layer.id ? "bg-blue-100" : "bg-slate-400"
                }`}
                onClick={() => handleLayerClick(layer)}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-between space-x-1.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`w-5 h-5 rounded-full border border-gray-500 ${
                            layer.visible ? "bg-green-500" : "bg-red-300"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLayer(layer);
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{layer.visible ? tt("hideLayer") : tt("showLayer")}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`w-5 h-5 rounded-full border border-gray-500 ${
                            layer.enabled ? "bg-slate-800" : "bg-slate-300"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDisableLayer(layer);
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{layer.enabled ? tt("grayOutLayer") : tt("highlightLayer")}</TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-gray-800">
                    {layer.name} {number}
                  </span>
                </div>
                {isRemovable && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="text-slate-700 font-bold px-1 py-0.5 text-base leading-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLayer(layer.id);
                        }}
                      >
                        &times;
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{tt("removeLayer")}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            );
          })}
      </div>
      <button
        className="w-full mt-2 px-4 py-2 text-white bg-blue-500 rounded-md"
        onClick={handleAddLayer}
      >
        {t("addLayer")}
      </button>
    </div>
  );
};

export default LayerStack;
