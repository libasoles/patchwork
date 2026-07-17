// Pixel-art sprites for the arcade-pixel-art article's "a handful of colors"
// gallery: the jump from strictly monochrome CRTs to early color arcade
// boards (Galaxian-era hardware, 1979), which gave each sprite a small flat
// palette instead of one ink color. Every sprite here uses exactly four
// colors — body, limbs, eyes, and one accent detail.

import { mirror, ArcadeSprite } from "./spriteGrid";

export const fourColorSprites: ArcadeSprite[] = [
  {
    id: "beetle",
    name: { en: "Color beetle", es: "Escarabajo a color", fr: "Scarabée en couleur" },
    colors: ["teal-400", "amber-500", "yellow-400", "lime-400"],
    grid: mirror([
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 3, 3, 1],
      [1, 1, 1, 1],
      [1, 4, 4, 1],
      [1, 1, 1, 1],
      [2, 1, 1, 2],
      [2, 0, 0, 2],
    ]),
  },
  {
    id: "octopod",
    name: { en: "Octopod", es: "Octópodo", fr: "Octopode" },
    colors: ["violet-500", "fuchsia-400", "cyan-400", "rose-400"],
    grid: mirror([
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 3, 3, 1],
      [1, 1, 1, 1],
      [1, 4, 1, 1],
      [2, 1, 1, 2],
      [2, 0, 2, 0],
      [0, 2, 0, 2],
    ]),
  },
  {
    id: "roborunner",
    name: { en: "Robo runner", es: "Robot corredor", fr: "Robot coureur" },
    colors: ["gray-700", "slate-400", "red-400", "cyan-400"],
    grid: mirror([
      [0, 4, 0, 0],
      [0, 1, 1, 0],
      [1, 3, 3, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [2, 1, 1, 2],
      [0, 1, 1, 0],
      [0, 2, 0, 2],
    ]),
  },
  {
    id: "hopper",
    name: { en: "Hopper", es: "Saltador", fr: "Sauteur" },
    colors: ["lime-400", "emerald-400", "yellow-400", "orange-400"],
    grid: mirror([
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 3, 1, 3],
      [1, 1, 1, 1],
      [1, 4, 4, 1],
      [2, 1, 1, 2],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: "batwing",
    name: { en: "Bat-wing imp", es: "Diablillo alado murciélago", fr: "Diablotin chauve-souris" },
    colors: ["purple-600", "violet-500", "rose-400", "fuchsia-400"],
    grid: mirror([
      [0, 0, 1, 1],
      [0, 1, 1, 1],
      [2, 2, 1, 1],
      [2, 1, 1, 3],
      [2, 1, 1, 1],
      [0, 1, 1, 4],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: "starcrab",
    name: { en: "Star crab", es: "Cangrejo estrella", fr: "Crabe étoile" },
    colors: ["orange-400", "amber-500", "sky-600", "teal-400"],
    grid: mirror([
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [1, 1, 1, 3],
      [1, 1, 4, 1],
      [1, 1, 1, 1],
      [0, 2, 2, 0],
      [2, 0, 0, 2],
      [0, 0, 0, 0],
    ]),
  },
];
