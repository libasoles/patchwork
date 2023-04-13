import Cell from './Cell';
import { memo } from 'react';
import { Dimension, Canvas } from '@/types';

export type LayerProps = {
    canvas: Canvas,
    dimension: Dimension,
    isGridVisible?: boolean,
    isDisabled?: boolean
}

function Layer({ canvas, dimension, isGridVisible = false, isDisabled = false }: LayerProps) {
    return (
        <div
            data-testid='canvas'
            className={`grid justify-center content-center select-none ${isDisabled && 'opacity-20'} absolute top-0 bottom-0 left-0 right-0 pointer-events-none`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, 40px)`,
                gridTemplateRows: `repeat(${dimension.y}, 40px)`,
            }}
        >
            {
                canvas.map((tile, index) => {
                    return (
                        <div key={index}>
                            <Cell
                                borderless={!isGridVisible}
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