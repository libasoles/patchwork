import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DouatPattern } from "@/data/douatPatterns";
import {
  bgColors,
  colors,
  defaultBgColor,
  defaultColor,
} from "@/config";
import { ColorSwatchGroup } from "@/components/ColorSwatchGroup";
import DouatFlipCard from "@/components/DouatFlipCard";

interface DouatCarouselProps {
  patterns: DouatPattern[];
  title?: string;
  cellPx?: number;
  initialPatternId?: number;
  flipHint: string;
  flipLabel: string;
  colorLabels: {
    color: string;
    background: string;
  };
}

export default function DouatCarousel({
  patterns,
  title,
  cellPx = 22,
  initialPatternId,
  flipHint,
  flipLabel,
  colorLabels,
}: DouatCarouselProps) {
  const initialIndex = Math.max(
    0,
    patterns.findIndex((pattern) => pattern.id === initialPatternId),
  );
  const [index, setIndex] = useState(initialIndex);
  const [fabric, setFabric] = useState(defaultColor);
  const [bg, setBg] = useState(defaultBgColor);
  const total = patterns.length;

  if (total === 0) return null;

  const safeIndex = index % total;
  const current = patterns[safeIndex];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="rounded-xl bg-slate-800 p-4 outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60"
    >
      <div className="mb-4 flex flex-wrap items-end justify-center gap-4 rounded-lg bg-slate-900/40 p-3">
        <ColorSwatchGroup
          label={colorLabels.color}
          colors={colors}
          selectedColor={fabric}
          onSelect={setFabric}
          shape="circle"
        />
        <ColorSwatchGroup
          label={colorLabels.background}
          colors={bgColors}
          selectedColor={bg}
          onSelect={setBg}
          shape="square"
        />
      </div>

      {title ? (
        <p className="mb-3 text-center text-sm font-medium text-zinc-300">
          {title}
        </p>
      ) : null}

      <div className="mx-auto flex w-full max-w-2xl items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Previous design"
          onClick={goPrev}
          className="shrink-0 rounded-lg p-2 text-teal-400 transition-colors hover:bg-slate-700 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <DouatFlipCard
            key={current.id}
            grid={current.grid}
            cellPx={cellPx}
            fabric={fabric}
            bg={bg}
            title={current.name}
            flipLabel={flipLabel}
            className="mx-auto w-full max-w-[680px]"
          />
        </div>

        <button
          type="button"
          aria-label="Next design"
          onClick={goNext}
          className="shrink-0 rounded-lg p-2 text-teal-400 transition-colors hover:bg-slate-700 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between px-1 text-xs">
        <span className="font-mono text-zinc-400">
          {safeIndex + 1} / {total}
        </span>
        <span className="truncate text-zinc-300">{current.name}</span>
      </div>

      <p className="mt-2 text-center text-xs text-zinc-400">{flipHint}</p>
    </div>
  );
}
