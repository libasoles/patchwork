// Shared types and helpers for the arcade-pixel-art article's sprite galleries.

export type SpriteGrid = number[][];

// Mirrors a left half grid to build a symmetric sprite: 0 = empty, n = colors[n - 1].
export function mirror(half: SpriteGrid): SpriteGrid {
  return half.map((row) => [...row, ...[...row].reverse()]);
}

export interface ArcadeSprite {
  id: string;
  name: Record<"en" | "es" | "fr", string>;
  colors: string[]; // Tailwind color suffixes, e.g. "violet-500"
  grid: SpriteGrid;
}
