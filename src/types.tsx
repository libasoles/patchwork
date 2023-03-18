
export type Tile = {
    id: number;
    symbol: string;
    color: string;
    equals: (aTile?: Tile) => boolean;
};

export enum Action {
    Draw,
    Paint
}