// More pixel-art sprites for the arcade-pixel-art article's "color" section:
// each uses three colors (body, limbs/spikes, eyes) instead of two, showing
// how a third flat color turns a silhouette into a readable character.

import { ArcadeSprite } from "./arcadeSprites";

function mirror(half: number[][]): number[][] {
  return half.map((row) => [...row, ...[...row].reverse()]);
}

export const colorSprites: ArcadeSprite[] = [
  {
    id: "twohorn",
    name: { en: "Two-horned alien", es: "Alien de dos cuernos", fr: "Alien à deux cornes" },
    colors: ["violet-500", "orange-400", "yellow-400"],
    grid: mirror([
      [0, 2, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 3],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
    ]),
  },
  {
    id: "fangmonster",
    name: { en: "Fanged monster", es: "Monstruo con colmillos", fr: "Monstre à crocs" },
    colors: ["emerald-400", "gray-800", "red-400"],
    grid: mirror([
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 3],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 2, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 1, 0],
    ]),
  },
  {
    id: "cycloperobot",
    name: { en: "Cyclops robot", es: "Robot cíclope", fr: "Robot cyclope" },
    colors: ["blue-400", "cyan-600", "rose-600"],
    grid: mirror([
      [0, 0, 2, 0],
      [0, 2, 2, 2],
      [1, 1, 1, 3],
      [1, 1, 1, 3],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ]),
  },
  {
    id: "antennabug",
    name: { en: "Antenna bug", es: "Bicho con antenas", fr: "Insecte à antennes" },
    colors: ["teal-400", "indigo-500", "yellow-400"],
    grid: mirror([
      [0, 0, 0, 2],
      [0, 0, 1, 2],
      [0, 1, 1, 1],
      [1, 1, 1, 3],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
    ]),
  },
  {
    id: "crownalien",
    name: { en: "Crowned alien", es: "Alien con corona", fr: "Alien couronné" },
    colors: ["violet-500", "fuchsia-500", "sky-600"],
    grid: mirror([
      [0, 2, 0, 2],
      [0, 1, 1, 1],
      [1, 1, 1, 3],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ]),
  },
  {
    id: "wingedimp",
    name: { en: "Winged imp", es: "Diablillo alado", fr: "Diablotin ailé" },
    colors: ["orange-400", "purple-600", "pink-500"],
    grid: mirror([
      [0, 0, 1, 0],
      [2, 1, 1, 0],
      [2, 1, 1, 1],
      [1, 1, 1, 3],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ]),
  },
  {
    id: "tripleeye",
    name: { en: "Triple-eyed blob", es: "Gota de tres ojos", fr: "Blob à trois yeux" },
    colors: ["yellow-400", "red-400", "teal-400"],
    grid: mirror([
      [0, 0, 1, 0],
      [0, 1, 1, 1],
      [1, 1, 1, 2],
      [1, 1, 1, 1],
      [1, 3, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
    ]),
  },
  {
    id: "spikeball",
    name: { en: "Spiky ball", es: "Bola con púas", fr: "Boule à pointes" },
    colors: ["red-400", "gray-800", "orange-400"],
    grid: mirror([
      [2, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 1, 3],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [2, 0, 0, 1],
    ]),
  },
];
