import { defaultColor } from '@/config';
import { Tile } from './types';
import produce from 'immer';


type Params = {
    id: number;
    symbol: string;
    color?: string;
    group?: string;
    orientation?: number;
};

export function createTile({ id, symbol, color = defaultColor, orientation, ...rest }: Params): Tile {
    return {
        id,
        symbol,
        color,
        orientation: orientation ?? 0,
        ...rest,
        equals(anotherTile?: Tile) {
            return this.id === anotherTile?.id;
        },
        looksLike(anotherTile?: Tile) {
            const hasSameSymbol = this.symbol === anotherTile?.symbol
            const hasSameColor = this.color === anotherTile?.color

            return hasSameSymbol && hasSameColor;
        },
        rotate() {
            return produce(this, (obj: Tile) => { obj.orientation = (obj.orientation + 1) % 4 })
        },
        resetOrientation() {
            return produce(this, (obj: Tile) => { obj.orientation = 0 })
        }
    };
}
