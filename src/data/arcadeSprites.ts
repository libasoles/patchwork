// Pixel-art sprites for the arcade-pixel-art article's monochrome gallery,
// drawn in the spirit of classic invader/ghost/saucer silhouettes rather than
// any single copyrighted asset. Each sprite is a symmetric 8x8 grid built by
// mirroring a 4-column half; 0 = empty, 1 = colors[0]. Real 1970s CRT arcade
// monitors were strictly single-color — sometimes literally black and white
// with a tinted plastic film taped over the glass — so every sprite here
// uses exactly one flat color, no separate eye or detail color.

import { mirror, ArcadeSprite, SpriteGrid } from "./spriteGrid";

export type { SpriteGrid, ArcadeSprite };

export const arcadeSprites: ArcadeSprite[] = [
  {
    id: "crab",
    name: { en: "Crab invader", es: "Invasor cangrejo", fr: "Envahisseur crabe" },
    colors: ["green-400"],
    grid: mirror([
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [1, 1, 1, 1],
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
    colors: ["green-400"],
    grid: mirror([
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ]),
  },
  {
    id: "ghost",
    name: { en: "Ghost", es: "Fantasma", fr: "Fantôme" },
    colors: ["green-400"],
    grid: mirror([
      [0, 0, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 1],
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
    colors: ["green-400"],
    grid: mirror([
      [0, 0, 0, 0],
      [0, 0, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: "crabwide",
    name: { en: "Wide crab", es: "Cangrejo ancho", fr: "Crabe large" },
    colors: ["green-400"],
    grid: mirror([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ]),
  },
  {
    id: "bigeyes",
    name: { en: "Big-eyed alien", es: "Alien de ojos grandes", fr: "Alien aux grands yeux" },
    colors: ["green-400"],
    grid: mirror([
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ]),
  },
];
