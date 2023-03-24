import { defaultColor } from '@/config';
import { Tile } from './types';


export function createTile({ id, symbol, color = defaultColor, ...rest }: { id: number; symbol: string; color?: string; group?: string; }): Tile {
    return {
        id,
        symbol,
        color,
        ...rest,
        equals(anotherTile?: Tile) {
            return this.id === anotherTile?.id;
        }
    };
}
