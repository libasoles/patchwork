export const tailwindColors: Record<string, string> = {
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "slate-700": "#334155",
  "slate-800": "#1e293b",
  "slate-900": "#0f172a",
  "zinc-700": "#3f3f46",
  "zinc-800": "#27272a",
  "zinc-900": "#18181b",
  "neutral-800": "#262626",
  "neutral-900": "#171717",
  "stone-800": "#292524",
  "stone-900": "#1c1917",
  "indigo-950": "#1e1b4b",
  "blue-950": "#172554",
  "violet-950": "#2e1065",
  "yellow-400": "#facc15",
  "pink-500": "#ec4899",
  "red-400": "#f87171",
  "orange-400": "#fb923c",
  "rose-600": "#e11d48",
  "indigo-500": "#6366f1",
  "blue-400": "#60a5fa",
  "sky-600": "#0284c7",
  "cyan-600": "#0891b2",
  "teal-400": "#2dd4bf",
  "green-400": "#4ade80",
  "emerald-400": "#34d399",
  "fuchsia-500": "#d946ef",
  "purple-600": "#9333ea",
  "violet-500": "#8b5cf6",
};

export function resolveTailwindColor(
  color: string | undefined,
  fallback: string,
) {
  if (!color) return fallback;

  return tailwindColors[color] ?? color;
}
