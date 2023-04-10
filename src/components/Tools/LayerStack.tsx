import React from 'react';
import { Layer, useLayersStore } from '@/store';

const LayerStack = () => {
    const { list, getCurrentLayer, add, update, remove, select } = useLayersStore()
    const layersList = list()
    const defaultLayerId = layersList[0].id

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
        const newLayerId = Math.random().toString(36).substring(2, 10);
        add(newLayerId);
        select(newLayerId);
    };

    const handleRemoveLayer = (layerId: string) => {
        if (getCurrentLayer().id === layerId) {
            const layerIndex = layersList.findIndex((l) => l.id === layerId);
            const newSelectedLayer = layersList[layerIndex - 1]
            select(newSelectedLayer.id);
        }

        remove(layerId);
    };

    return (
        <div className="flex flex-col items-start justify-start p-4 fixed bottom-1.5 left-[14em] z-10 w-[12em]">
            <div className="space-y-2 w-full ">
                {layersList.slice().reverse().map((layer, index) => {
                    const number = layersList.length - index
                    const isRemovable = layer.id !== defaultLayerId

                    return (
                        <div
                            key={layer.id}
                            className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${getCurrentLayer().id === layer.id ? 'bg-blue-100' : 'bg-slate-400'}`}
                            onClick={() => handleLayerClick(layer)}
                        >
                            <div className='flex items-center space-x-2'>
                                <div className='flex items-center justify-between space-x-1'>
                                    <div
                                        title={layer.visible ? 'Hide' : 'Show'}
                                        className={`w-4 h-4 rounded-full border border-gray-500 ${layer.visible ? 'bg-green-500' : 'bg-red-300'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleLayer(layer);
                                        }}
                                    ></div>
                                    <div
                                        title={layer.enabled ? 'Gray out' : 'Highlight'}
                                        className={`w-4 h-4 rounded-full border border-gray-500 ${layer.enabled ? 'bg-slate-800' : 'bg-slate-300'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDisableLayer(layer);
                                        }}
                                    ></div>
                                </div>
                                <span>{layer.name} {number}</span>
                            </div>
                            {isRemovable && <button
                                className="text-slate-700 font-bold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveLayer(layer.id);
                                }}
                            >
                                &times;
                            </button>}
                        </div>
                    )
                })}
            </div>
            <button className="w-full mt-2 px-4 py-1 text-white bg-blue-500 rounded-md" onClick={handleAddLayer}>
                Add Layer
            </button>
        </div>
    );
};

export default LayerStack;