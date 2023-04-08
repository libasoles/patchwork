import React, { useState } from 'react';
import { Layer, useLayersStore } from '@/store';

const DrawingLayers = () => {
    const { layers, add, update, remove } = useLayersStore((state) => state)
    const layersList = Array.from(layers).map(([, layer]) => layer)
    const defaultLayerId = layersList[0].id

    const [selectedLayerId, setSelectedLayerId] = useState(defaultLayerId); // TODO: remove the magic number

    const handleLayerClick = (layer: Layer) => {
        setSelectedLayerId(layer.id);
    };

    const handleToggleLayer = (layer: Layer) => {
        update({ ...layer, visible: !layer.visible });
    };

    const handleAddLayer = () => {
        const newLayerId = Math.random().toString(36).substr(2, 10);
        add(newLayerId);
        setSelectedLayerId(newLayerId);
    };

    const handleRemoveLayer = (layerId: string) => {
        remove(layerId);
        if (selectedLayerId === layerId) {
            const layerIndex = layersList.findIndex((l) => l.id === layerId);
            const newSelectedLayer = layersList[layerIndex - 1]
            setSelectedLayerId(newSelectedLayer.id);
        }
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
                            className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${selectedLayerId === layer.id ? 'bg-blue-100' : 'bg-slate-400'}`}
                            onClick={() => handleLayerClick(layer)}
                        >
                            <div className='flex items-center space-x-2'>
                                <div
                                    className={`w-4 h-4 rounded-full ${layer.visible ? 'bg-green-500' : 'bg-red-300'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleLayer(layer);
                                    }}
                                ></div>
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

export default DrawingLayers;