import { memo } from "react";
import type { DouatLetter } from "@/data/douatPatterns";
import { resolveTailwindColor } from "@/lib/tailwindColors";

// Default palette, matching the teal/slate accents used across the articles.
const DEFAULT_FABRIC = "#2dd4bf"; // teal
const DEFAULT_BG = "#334155"; // slate-700

interface DouatPatternSVGProps {
  grid: DouatLetter[][];
  cellPx?: number;
  fabric?: string;
  bg?: string;
  className?: string;
  title?: string;
}

// Points for the colored triangle of a cell whose top-left is (x, y), size s.
// The letter names the corner where the colored right angle sits.
function trianglePoints(letter: DouatLetter, x: number, y: number, s: number) {
  switch (letter) {
    case "A": // bottom-left: TL, BL, BR
      return `${x},${y} ${x},${y + s} ${x + s},${y + s}`;
    case "B": // top-left: TL, TR, BL
      return `${x},${y} ${x + s},${y} ${x},${y + s}`;
    case "C": // top-right: TL, TR, BR
      return `${x},${y} ${x + s},${y} ${x + s},${y + s}`;
    case "D": // bottom-right: TR, BR, BL
      return `${x + s},${y} ${x + s},${y + s} ${x},${y + s}`;
  }
}

function DouatPatternSVG({
  grid,
  cellPx = 14,
  fabric = DEFAULT_FABRIC,
  bg = DEFAULT_BG,
  className,
  title,
}: DouatPatternSVGProps) {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const s = cellPx;
  const width = cols * s;
  const height = rows * s;
  const resolvedFabric = resolveTailwindColor(fabric, DEFAULT_FABRIC);
  const resolvedBg = resolveTailwindColor(bg, DEFAULT_BG);

  if (rows === 0 || cols === 0) return null;

  const polygons: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const letter = grid[r][c];
      polygons.push(
        <polygon
          key={`${r}-${c}`}
          points={trianglePoints(letter, c * s, r * s, s)}
          fill={resolvedFabric}
        />,
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
      {polygons}
    </svg>
  );
}

export default memo(DouatPatternSVG);
