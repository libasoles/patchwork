import type { DouatPattern } from "@/data/douatPatterns";
import DouatFlipCard from "@/components/DouatFlipCard";

interface DouatDesignTableProps {
  patterns: DouatPattern[];
  cellPx?: number;
  flipHint?: string;
  flipLabel: string;
}

export default function DouatDesignTable({
  patterns,
  cellPx = 11,
  flipHint,
  flipLabel,
}: DouatDesignTableProps) {
  if (patterns.length === 0) return null;

  return (
    <div>
      {flipHint ? (
        <p className="mb-3 text-center text-xs text-zinc-400">{flipHint}</p>
      ) : null}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="flex flex-col items-center gap-1 rounded-md bg-slate-800 p-2"
          >
            <DouatFlipCard
              grid={pattern.grid}
              cellPx={cellPx}
              title={pattern.name}
              flipLabel={flipLabel}
              className="w-full"
            />
            <span className="font-mono text-xs text-zinc-400">{pattern.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
