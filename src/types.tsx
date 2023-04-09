export type Dimension = { x: number, y: number }

export type Canvas = Tile[]

export type Tile = {
    id: number;
    symbol: string;
    color: string;
    orientation: number;
    equals: (aTile?: Tile) => boolean;
    looksLike: (aTile?: Tile) => boolean;
    rotate: () => void;
    resetOrientation: () => void;
};

export enum Action {
    Draw,
    Paint,
    Move,
    Rotate,
}