// Pixel-art sprites for the arcade-pixel-art article's richer 16-color
// gallery, modeling the mid-1980s-onward jump to 16/32-color arcade and home
// console hardware: bigger sprite sheets and bigger palettes turned
// silhouettes into costumed characters. Each sprite is a symmetric 12x12
// grid (mirroring a 6-column half) and uses a subset of a shared 16-color
// palette across the gallery — a cowboy, a robot, a wizard, a ninja, a small
// hero, and a horned monster, evoking genre archetypes rather than any
// specific licensed character.

import { mirror, ArcadeSprite } from "./spriteGrid";

export const richSprites: ArcadeSprite[] = [
  {
    id: "cowboy",
    name: { en: "Cowboy", es: "Vaquero", fr: "Cow-boy" },
    colors: ["amber-700", "orange-400", "red-600", "gray-300"],
    grid: mirror([
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 2, 2, 2, 2, 0],
      [0, 2, 1, 2, 1, 0],
      [0, 2, 2, 2, 2, 0],
      [3, 3, 3, 3, 3, 3],
      [3, 4, 3, 3, 4, 3],
      [0, 3, 3, 3, 3, 0],
      [0, 0, 4, 4, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 1],
    ]),
  },
  {
    id: "robot",
    name: { en: "Robot", es: "Robot", fr: "Robot" },
    colors: ["gray-600", "gray-300", "red-600", "blue-600"],
    grid: mirror([
      [0, 1, 1, 1, 1, 0],
      [1, 1, 3, 3, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 2, 1, 1, 2, 0],
      [2, 1, 1, 1, 1, 2],
      [1, 1, 4, 4, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [2, 1, 1, 1, 1, 2],
      [0, 1, 1, 1, 1, 0],
      [0, 2, 1, 1, 2, 0],
      [0, 1, 1, 1, 1, 0],
      [2, 2, 0, 0, 2, 2],
    ]),
  },
  {
    id: "wizard",
    name: { en: "Wizard", es: "Mago", fr: "Magicien" },
    colors: ["purple-400", "purple-600", "yellow-400", "gray-300"],
    grid: mirror([
      [0, 0, 2, 2, 0, 0],
      [0, 2, 2, 2, 2, 0],
      [2, 2, 2, 2, 2, 2],
      [0, 4, 4, 4, 4, 0],
      [0, 0, 4, 4, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 3, 3, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [2, 2, 1, 1, 2, 2],
      [2, 2, 2, 2, 2, 2],
      [0, 2, 0, 0, 2, 0],
    ]),
  },
  {
    id: "ninja",
    name: { en: "Ninja", es: "Ninja", fr: "Ninja" },
    colors: ["zinc-900", "red-400", "gray-300", "emerald-700"],
    grid: mirror([
      [0, 1, 1, 1, 1, 0],
      [1, 1, 2, 2, 1, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 4, 1, 1, 4, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 0, 1],
    ]),
  },
  {
    id: "hero",
    name: { en: "Small hero", es: "Pequeño héroe", fr: "Petit héros" },
    colors: ["blue-600", "yellow-400", "red-400", "gray-300"],
    grid: mirror([
      [0, 0, 2, 2, 0, 0],
      [0, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 4, 4, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [3, 1, 1, 1, 1, 3],
      [3, 1, 1, 1, 1, 3],
      [0, 1, 1, 1, 1, 0],
      [0, 2, 1, 1, 2, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 4, 0, 0, 4, 0],
    ]),
  },
  {
    id: "monster",
    name: { en: "Horned monster", es: "Monstruo con cuernos", fr: "Monstre à cornes" },
    colors: ["rose-500", "gray-600", "red-600", "emerald-700"],
    grid: mirror([
      [2, 0, 0, 0, 0, 2],
      [2, 1, 0, 0, 1, 2],
      [1, 1, 1, 1, 1, 1],
      [1, 3, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 4, 4, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [4, 1, 1, 1, 1, 4],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 0, 1],
    ]),
  },
];
