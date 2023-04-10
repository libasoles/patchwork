export type Dimension = { x: number, y: number }

export type Canvas = Tile[]

export type Tile = {
    id: number;
    symbol: string;
    color: string;
    orientation: number;
    clone: (overrides?: Partial<Tile>) => Tile;
    equals: (aTile?: Tile) => boolean;
    isEmpty: () => boolean;
    looksLike: (aTile?: Tile) => boolean;
    paint: (color: string) => Tile;
    rotate: () => Tile;
    resetOrientation: () => Tile;
    reset: () => Tile;
};

export enum Action {
    Draw,
    Paint,
    Move,
    Rotate,
    Delete,
}
