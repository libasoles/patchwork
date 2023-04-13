import { SyntheticEvent } from "react";

export type Dimension = { x: number, y: number }

export type Canvas = Tile[]

export type Layer = {
    id: string;
    name: string;
    visible: boolean;
    enabled: boolean;
    canvas: {
        cells: Canvas,
        dimension: Dimension
    }
}

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
    Draw = 'Draw',
    Paint = 'Paint',
    Move = 'Move',
    Rotate = 'Rotate',
    Delete = 'Delete',
}

export type EventCallback = (e: SyntheticEvent) => void
