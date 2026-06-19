import { memo } from "react";
import type { DouatLetter } from "@/data/douatPatterns";
import { resolveTailwindColor } from "@/lib/tailwindColors";

// Matches DouatPatternSVG's defaults so the two faces line up in a flip card.
const DEFAULT_BG = "#334155"; // slate-700
const LETTER_FILL = "#5eead4"; // teal-300, echoing the article's demo grid

interface DouatLetterGridSVGProps {
  grid: DouatLetter[][];
  cellPx?: number;
  bg?: string;
  className?: string;
  title?: string;
}

function DouatLetterGridSVG({
  grid,
  cellPx = 14,
  bg = DEFAULT_BG,
  className,
  title,
}: DouatLetterGridSVGProps) {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const s = cellPx;
  const width = cols * s;
  const height = rows * s;
  const resolvedBg = resolveTailwindColor(bg, DEFAULT_BG);

  if (rows === 0 || cols === 0) return null;

  const letters: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      letters.push(
        <text
          key={`${r}-${c}`}
          x={c * s + s / 2}
          y={r * s + s / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="monospace"
          fontSize={s * 0.6}
          fill={LETTER_FILL}
        >
          {grid[r][c]}
        </text>,
      );
    }
  }

  return (
    <svg
      role="img"
      aria-label={title}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      style={{ display: "block" }}
    >
      {title ? <title>{title}</title> : null}
      <rect x={0} y={0} width={width} height={height} fill={resolvedBg} />
      {letters}
    </svg>
  );
}

export default memo(DouatLetterGridSVG);
