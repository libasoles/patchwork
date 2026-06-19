import { useState } from "react";
import type { DouatLetter } from "@/data/douatPatterns";
import DouatPatternSVG from "@/components/DouatPatternSVG";
import DouatLetterGridSVG from "@/components/DouatLetterGridSVG";

interface DouatFlipCardProps {
  grid: DouatLetter[][];
  cellPx?: number;
  fabric?: string;
  bg?: string;
  title?: string;
  flipLabel: string;
  className?: string;
}

// A clickable card that flips between the rendered pattern (front) and the grid
// of A/B/C/D letters that spells it (back). Both faces share DouatPatternSVG's
// viewBox math, so they line up exactly during the 3D flip.
export default function DouatFlipCard({
  grid,
  cellPx,
  fabric,
  bg,
  title,
  flipLabel,
  className,
}: DouatFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={["[perspective:1000px]", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={flipLabel}
        onClick={() => setFlipped((f) => !f)}
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
        className="relative block w-full cursor-pointer rounded-md outline-none transition-transform duration-500 [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-teal-400/60"
      >
        <div className="[backface-visibility:hidden]">
          <DouatPatternSVG
            grid={grid}
            cellPx={cellPx}
            fabric={fabric}
            bg={bg}
            title={title}
            className="w-full rounded-md"
          />
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <DouatLetterGridSVG
            grid={grid}
            cellPx={cellPx}
            bg={bg}
            title={title}
            className="w-full rounded-md"
          />
        </div>
      </button>
    </div>
  );
}
