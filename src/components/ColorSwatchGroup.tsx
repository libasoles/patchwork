import { cn } from "@/lib/utils";

export function ColorSwatchGroup({
  label,
  colors,
  selectedColor,
  onSelect,
  shape,
}: {
  label: string;
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
  shape: "circle" | "square";
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const selected = color === selectedColor;
          const radius = shape === "circle" ? "rounded-full" : "rounded-md";

          return (
            <button
              key={color}
              type="button"
              aria-label={`${label}: ${color}`}
              aria-pressed={selected}
              onClick={() => onSelect(color)}
              className={cn(
                "grid h-8 w-8 place-items-center border-2 bg-zinc-950/5 p-1 transition hover:scale-[1.03] dark:bg-zinc-950",
                radius,
                selected
                  ? "border-zinc-950 dark:border-zinc-50"
                  : "border-zinc-300 dark:border-zinc-700",
              )}
            >
              <span
                className={cn("block h-full w-full", radius, `bg-${color}`)}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
