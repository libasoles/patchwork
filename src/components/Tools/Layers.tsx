import React, { useState } from 'react';

type Layer = { id: number; name: string; visible: boolean; }

const DrawingLayers = () => {
    const [layers, setLayers] = useState([
        { id: 1, name: 'Layer', visible: true },
    ]);

    const [selectedLayer, setSelectedLayer] = useState(layers[0]);

    const handleLayerClick = (layer: Layer) => {
        setSelectedLayer(layer);
    };

    const handleToggleLayer = (layer: Layer) => {
        const layerIndex = layers.findIndex((l) => l.id === layer.id);
        const newLayers = [...layers];
        newLayers[layerIndex] = { ...layer, visible: !layer.visible };
        setLayers(newLayers);
    };

    const handleAddLayer = () => {
        const newLayer = { id: layers.length + 1, name: `Layer`, visible: true };
        setLayers([...layers, newLayer]);
        setSelectedLayer(newLayer);
    };

    const handleRemoveLayer = (layerId: number) => {
        const newLayers = layers.filter(layer => layer.id !== layerId);
        setLayers(newLayers);
        if (selectedLayer.id === layerId) {
            setSelectedLayer(newLayers[newLayers.length - 1]);
        }
    };

    return (
        <div className="flex flex-col items-start justify-start p-4 fixed bottom-1.5 left-[14em] z-10 w-[12em]">
            <div className="space-y-2 w-full ">
                {layers.map((layer, index) => (
                    <div
                        key={layer.id}
                        className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${selectedLayer.id === layer.id ? 'bg-blue-100' : 'bg-slate-400'}`}
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
                            <span>{layer.name} {index}</span>
                        </div>
                        <button
                            className="text-slate-700 font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLayer(layer.id);
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <button className="w-full mt-2 px-4 py-1 text-white bg-blue-500 rounded-md" onClick={handleAddLayer}>
                Add Layer
            </button>
        </div>
    );
};

export default DrawingLayers;