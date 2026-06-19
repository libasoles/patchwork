import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DouatPattern } from "@/data/douatPatterns";
import DouatPatternSVG from "@/components/DouatPatternSVG";

interface DouatCarouselProps {
  patterns: DouatPattern[];
  title?: string;
  cellPx?: number;
}

export default function DouatCarousel({
  patterns,
  title,
  cellPx = 22,
}: DouatCarouselProps) {
  const [index, setIndex] = useState(0);
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
          <DouatPatternSVG
            key={current.id}
            grid={current.grid}
            cellPx={cellPx}
            title={current.name}
            className="mx-auto w-full max-w-[420px] rounded-md"
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
    </div>
  );
}
