import type { DouatPattern } from "@/data/douatPatterns";
import DouatPatternSVG from "@/components/DouatPatternSVG";

interface DouatDesignTableProps {
  patterns: DouatPattern[];
  cellPx?: number;
}

export default function DouatDesignTable({
  patterns,
  cellPx = 11,
}: DouatDesignTableProps) {
  if (patterns.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {patterns.map((pattern) => (
        <div
          key={pattern.id}
          className="flex flex-col items-center gap-1 rounded-md bg-slate-800 p-2"
        >
          <DouatPatternSVG
            grid={pattern.grid}
            cellPx={cellPx}
            title={pattern.name}
            className="w-full rounded-sm"
          />
          <span className="font-mono text-xs text-zinc-400">{pattern.id}</span>
        </div>
      ))}
    </div>
  );
}
