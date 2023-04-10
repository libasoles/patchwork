import { defaultColor, emptyTile } from '@/config';
import { Canvas, Dimension, Tile } from './types';
import produce from 'immer';


export function emptyCanvas(dimension: Dimension): Canvas {
    return Array(dimension.x * dimension.y).fill(createTile(emptyTile));
}

type CreateTileParams = {
    id: number;
    symbol: string;
    color?: string;
    group?: string;
    orientation?: number;
};
export function createTile({ id, symbol, color = defaultColor, orientation, ...rest }: CreateTileParams): Tile {
    return {
        id,
        symbol,
        color,
        orientation: orientation ?? 0,
        ...rest,
        clone({ ...overrides }) {
            return { ...this, ...overrides }
        },
        reset() {
            return createTile(emptyTile)
        },
        equals(anotherTile?: Tile) {
            return this.id === anotherTile?.id;
        },
        isEmpty() {
            return this.symbol === emptyTile.symbol
        },
        looksLike(anotherTile?: Tile) {
            const hasSameSymbol = this.symbol === anotherTile?.symbol
            const hasSameColor = this.color === anotherTile?.color

            return hasSameSymbol && hasSameColor;
        },
        paint(color: string) {
            return produce(this, (tile: Tile) => { tile.color = color })
        },
        rotate() {
            return produce(this, (tile: Tile) => { tile.orientation = (tile.orientation + 1) % 4 })
        },
        resetOrientation() {
            return produce(this, (tile: Tile) => { tile.orientation = 0 })
        }
    };
}
