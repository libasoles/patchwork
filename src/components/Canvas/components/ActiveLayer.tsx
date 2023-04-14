import MovableCell from './MovableCell';
import { usePressBehavior } from '../hooks/usePressBehavior';
import { LayerProps } from './Layer';

type ActiveLayerProps = LayerProps & {
    cursor: (isCellEmpty: boolean) => string,
}

export default function ActiveLayer({
    canvas,
    dimension,
    cursor,
    isDisabled = false,
}: ActiveLayerProps) {
    const { onMouseDown, onContextMenu } = usePressBehavior();

    return (
        <div
            data-testid='selected-canvas'
            className={`grid justify-center content-center select-none ${isDisabled && 'opacity-20'} absolute top-0 bottom-0 left-0 right-0`}
            style={{
                gridTemplateColumns: `repeat(${dimension.x}, 40px)`,
                gridTemplateRows: `repeat(${dimension.y}, 40px)`,
            }}
        >
            {
                canvas.map((tile, index) => {
                    return (
                        <div
                            key={index}
                            className={`${cursor(tile.isEmpty())}`}
                        >
                            <MovableCell
                                index={index}
                                borderless
                                onMouseDown={onMouseDown}
                                onContextMenu={onContextMenu}
                                tile={tile}
                            />
                        </div>
                    );
                })
            }
        </div>
    )
}
