import DouatPatternSVG from "@/components/DouatPatternSVG";
import { type DouatLetter } from "@/data/douatPatterns";

const LETTERS: DouatLetter[] = ["A", "B", "C", "D"];

export type DouatAlphabetLegendCopy = {
  caption: string;
  labels: Record<DouatLetter, string>;
};

export const douatAlphabetLegendCopy: Record<
  "en" | "es" | "fr",
  DouatAlphabetLegendCopy
> = {
  en: {
    caption:
      "The four orientations of the tile and the letter Douat assigns to each.",
    labels: {
      A: "A — bottom-left",
      B: "B — top-left",
      C: "C — top-right",
      D: "D — bottom-right",
    },
  },
  es: {
    caption:
      "Las cuatro orientaciones del mosaico y la letra que Douat asigna a cada una.",
    labels: {
      A: "A — abajo izquierda",
      B: "B — arriba izquierda",
      C: "C — arriba derecha",
      D: "D — abajo derecha",
    },
  },
  fr: {
    caption:
      "Les quatre orientations du carreau et la lettre que Douat attribue à chacune.",
    labels: {
      A: "A — bas gauche",
      B: "B — haut gauche",
      C: "C — haut droite",
      D: "D — bas droite",
    },
  },
};

function OrientationLegend({
  labels,
}: {
  labels: Record<DouatLetter, string>;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {LETTERS.map((letter) => (
        <div
          key={letter}
          className="flex flex-col items-center gap-2 rounded-lg bg-slate-800 p-4"
        >
          <DouatPatternSVG
            grid={[[letter]]}
            cellPx={64}
            title={`Tile ${letter}`}
            className="w-16 rounded-sm"
          />
          <span className="text-center text-xs text-zinc-300">
            {labels[letter]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DouatAlphabetFigure({
  caption,
  labels,
}: DouatAlphabetLegendCopy) {
  return (
    <figure className="my-6">
      <OrientationLegend labels={labels} />
      <figcaption className="text-xs text-zinc-400 mt-3">{caption}</figcaption>
    </figure>
  );
}
