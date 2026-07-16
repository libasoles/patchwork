// Pixel-art sprites for the arcade-pixel-art article, drawn in the spirit of
// classic invader/ghost/saucer silhouettes rather than any single copyrighted
// asset. Each sprite is a symmetric 8x8 grid built by mirroring a 4-column
// half; 0 = empty, n = colors[n - 1] (real arcade sprites used a few flat
// colors per monster, not just one — body plus eyes/details).

export type SpriteGrid = number[][];

function mirror(half: number[][]): SpriteGrid {
  return half.map((row) => [...row, ...[...row].reverse()]);
}

export interface ArcadeSprite {
  id: string;
  name: Record<"en" | "es" | "fr", string>;
  colors: string[]; // Tailwind color suffixes, e.g. "violet-500"; index 0 = body, 1 = eyes/details
  grid: SpriteGrid;
}

export const arcadeSprites: ArcadeSprite[] = [
  {
    id: "crab",
    name: { en: "Crab invader", es: "Invasor cangrejo", fr: "Envahisseur crabe" },
    colors: ["violet-500", "pink-500"],
    grid: mirror([
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [1, 1, 1, 2],
      [1, 1, 0, 1],
      [1, 1, 1, 1],
      [0, 0, 1, 1],
      [0, 1, 0, 0],
      [1, 0, 0, 1],
    ]),
  },
  {
    id: "jelly",
    name: { en: "Dome jelly", es: "Medusa cúpula", fr: "Méduse en dôme" },
    colors: ["yellow-400", "red-400"],
    grid: mirror([
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 2],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ]),
  },
  {
    id: "ghost",
    name: { en: "Ghost", es: "Fantasma", fr: "Fantôme" },
    colors: ["sky-600", "blue-400"],
    grid: mirror([
      [0, 0, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 2],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
    ]),
  },
  {
    id: "saucer",
    name: { en: "Flying saucer", es: "Platillo volador", fr: "Soucoupe volante" },
    colors: ["orange-400", "teal-400"],
    grid: mirror([
      [0, 0, 0, 0],
      [0, 0, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 2],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: "crabwide",
    name: { en: "Wide crab", es: "Cangrejo ancho", fr: "Crabe large" },
    colors: ["teal-400", "fuchsia-500"],
    grid: mirror([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 1],
      [1, 1, 1, 2],
      [1, 1, 1, 1],
      [0, 1, 1, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ]),
  },
  {
    id: "bigeyes",
    name: { en: "Big-eyed alien", es: "Alien de ojos grandes", fr: "Alien aux grands yeux" },
    colors: ["emerald-400", "purple-600"],
    grid: mirror([
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 1, 1],
      [1, 1, 1, 2],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ]),
  },
];
