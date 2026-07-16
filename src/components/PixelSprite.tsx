import type { SpriteGrid } from "@/data/spriteGrid";

interface PixelSpriteProps {
  grid: SpriteGrid;
  colors: string[];
  cellPx?: number;
  title?: string;
}

// Renders a pixel-art sprite as a grid of solid square tiles: every non-zero
// cell is a fully filled square (no glyph, no rounded corners) in
// colors[value - 1] — the degenerate case of a Patchwork tile where the
// whole cell is one flat color.
export default function PixelSprite({
  grid,
  colors,
  cellPx = 10,
  title,
}: PixelSpriteProps) {
  const cols = grid[0]?.length ?? 0;

  return (
    <div
      role="img"
      aria-label={title}
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
        gridAutoRows: `${cellPx}px`,
      }}
    >
      {grid.flatMap((row, r) =>
        row.map((value, c) => (
          <div
            key={`${r}-${c}`}
            className={value ? `tile bg-${colors[value - 1]}` : ""}
          />
        )),
      )}
    </div>
  );
}
