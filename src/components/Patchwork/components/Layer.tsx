import Cell from './Cell';
import { cellSize } from '../Canvas';
import { memo } from 'react';
import { Dimension, Canvas } from '@/types';

export type LayerProps = {
    canvas: Canvas,
    dimension: Dimension,
    canvasScale: number,
    isGridVisible?: boolean,
    isDisabled?: boolean
}

function Layer({ canvas, dimension, canvasScale, isGridVisible = false, isDisabled = false }: LayerProps) {
    return (
        <div
            data-testid='canvas'
            className={`grid justify-center content-center gap-0 select-none ${isDisabled && 'opacity-20'} absolute top-0 bottom-0 left-0 right-0 pointer-events-none`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${dimension.y}, ${cellSize}px)`,
                transform: `scale(${canvasScale})`,
            }}
        >
            {
                canvas.map((tile, index) => {
                    return (
                        <div key={index}>
                            <Cell
                                index={index}
                                borderless={!isGridVisible}
                                size={cellSize}
                                tile={tile}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
}

export default memo(Layer)