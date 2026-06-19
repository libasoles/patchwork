import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Dices, Shuffle, Repeat } from "lucide-react";

import { allTileGroupFamilies, type TileGroupFamily } from "@/data/tileGroups";
import { bgColors, colors, defaultBgColor, defaultColor } from "@/config";
import { ColorSwatchGroup } from "@/components/ColorSwatchGroup";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TILE_COMBINATION_COLS,
  TILE_COMBINATION_ROWS,
  type TileCombinationMode,
  generateTileCombinationGrid,
} from "@/lib/tileCombinationPatterns";
import { cn } from "@/lib/utils";

const families = allTileGroupFamilies.filter(
  (family) =>
    family.id !== "font-unmapped-bit-blocks" && family.tiles.length > 0,
);

const defaultFamilyId =
  families.find((family) => family.patchworkGroups.includes("diagonals"))?.id ??
  families[0]?.id;

const modeLabels: Record<
  TileCombinationMode,
  Record<string, { label: string; aria: string }>
> = {
  regular: {
    en: { label: "Regular", aria: "Use regular pattern" },
    es: { label: "Regular", aria: "Usar patron regular" },
    fr: { label: "Regulier", aria: "Utiliser un motif regulier" },
  },
  irregular: {
    en: { label: "Irregular", aria: "Use irregular pattern" },
    es: { label: "Irregular", aria: "Usar patron irregular" },
    fr: { label: "Irregulier", aria: "Utiliser un motif irregulier" },
  },
};

const labels = {
  en: {
    tiles: "Tiles",
    mode: "Mode",
    color: "Tile color",
    background: "Background",
    selectPlaceholder: "Select a tile group",
    patternLabel: "Generated tile pattern",
    dimensions: (columns: number, rows: number) =>
      `${columns} columns x ${rows} rows`,
    randomize: "Randomize",
    randomizeAria: "Generate a new pattern",
  },
  es: {
    tiles: "Grupo de mosaicos",
    mode: "Modo",
    color: "Color del mosaico",
    background: "Fondo",
    selectPlaceholder: "Elegir grupo de mosaicos",
    patternLabel: "Patron de mosaicos generado",
    dimensions: (columns: number, rows: number) =>
      `${columns} columnas x ${rows} filas`,
    randomize: "Randomize",
    randomizeAria: "Generar un nuevo patron",
  },
  fr: {
    tiles: "Carreaux",
    mode: "Mode",
    color: "Couleur du carreau",
    background: "Fond",
    selectPlaceholder: "Choisir un groupe",
    patternLabel: "Motif de carreaux genere",
    dimensions: (columns: number, rows: number) =>
      `${columns} colonnes x ${rows} lignes`,
    randomize: "Randomize",
    randomizeAria: "Generer un nouveau motif",
  },
};

export function TileCombinationWidget({
  lang = "en",
  rows = TILE_COMBINATION_ROWS,
  columns = TILE_COMBINATION_COLS,
}: {
  lang?: string;
  rows?: number;
  columns?: number;
}) {
  const t = labels[lang as keyof typeof labels] ?? labels.en;
  const gridRows = normalizeDimension(rows, TILE_COMBINATION_ROWS);
  const gridColumns = normalizeDimension(columns, TILE_COMBINATION_COLS);
  const [familyId, setFamilyId] = useState(defaultFamilyId);
  const [mode, setMode] = useState<TileCombinationMode>("regular");
  const [patternVersion, setPatternVersion] = useState(0);
  const [tileColor, setTileColor] = useState(defaultColor);
  const [backgroundColor, setBackgroundColor] = useState(defaultBgColor);
  const selectedFamily =
    families.find((family) => family.id === familyId) ?? families[0];
  const patternSeed = `${selectedFamily.id}:${mode}:${patternVersion}`;
  const grid = useMemo(
    () =>
      generateTileCombinationGrid({
        tiles: selectedFamily.tiles,
        mode,
        seed: patternSeed,
        rows: gridRows,
        cols: gridColumns,
      }),
    [gridColumns, gridRows, mode, patternSeed, selectedFamily],
  );

  return (
    <section className="w-full border-y border-zinc-200 py-8 dark:border-zinc-800">
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <div className="min-w-0">
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.tiles}
          </label>
          <Select value={selectedFamily.id} onValueChange={setFamilyId}>
            <SelectTrigger
              aria-label={`${t.tiles}: ${selectedFamily.name}`}
              className="h-auto min-h-14 w-fit max-w-full border-zinc-300 bg-white px-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <span aria-hidden="true">
                <MiniTileStrip family={selectedFamily} fixedSlots />
              </span>
              <span className="sr-only">
                <SelectValue placeholder={t.selectPlaceholder} />
              </span>
            </SelectTrigger>
            <SelectContent className="max-h-[min(28rem,var(--radix-select-content-available-height))] border-zinc-200 bg-white text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
              {families.map((family) => (
                <SelectItem
                  key={family.id}
                  value={family.id}
                  className="py-2.5"
                >
                  <FamilyOption family={family} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.mode}
          </p>
          <div className="flex items-center gap-2">
            <div
              data-slot="tile-combination-mode"
              className="inline-flex rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <ModeButton
                mode="regular"
                selectedMode={mode}
                lang={lang}
                onSelect={setMode}
              />
              <ModeButton
                mode="irregular"
                selectedMode={mode}
                lang={lang}
                onSelect={setMode}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label={t.randomizeAria}
              title={t.randomize}
              onClick={() => setPatternVersion((version) => version + 1)}
              className="h-[40px] w-[40px] border-zinc-300 bg-white p-0 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              <Dices className="size-4" />
            </Button>
          </div>
        </div>

        <ColorSwatchGroup
          label={t.color}
          colors={colors}
          selectedColor={tileColor}
          onSelect={setTileColor}
          shape="circle"
        />

        <ColorSwatchGroup
          label={t.background}
          colors={bgColors}
          selectedColor={backgroundColor}
          onSelect={setBackgroundColor}
          shape="square"
        />
      </div>

      <div className={cn("overflow-x-auto", `bg-${backgroundColor}`)}>
        <div
          role="img"
          aria-label={t.patternLabel}
          className="inline-grid"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(35px, 1fr))`,
            gridAutoRows: "minmax(35px, 1fr)",
            width: "min(100%, 912px)",
            minWidth: Math.min(gridColumns * 35, 728),
            aspectRatio: `${gridColumns} / ${gridRows}`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <TileGlyph
                key={`${rowIndex}-${colIndex}`}
                symbol={tile.symbol}
                sourceFont={selectedFamily.sourceFont}
                color={tileColor}
              />
            )),
          )}
        </div>
      </div>
      <p className="mt-3 font-mono text-xs leading-5 text-zinc-400">
        {t.dimensions(gridColumns, gridRows)}
      </p>
    </section>
  );
}

function normalizeDimension(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;

  return Math.max(1, Math.floor(value));
}

function ModeButton({
  mode,
  selectedMode,
  lang,
  onSelect,
}: {
  mode: TileCombinationMode;
  selectedMode: TileCombinationMode;
  lang: string;
  onSelect: (mode: TileCombinationMode) => void;
}) {
  const Icon = mode === "regular" ? Repeat : Shuffle;
  const text = (modeLabels[mode][lang] ?? modeLabels[mode].en) as {
    label: string;
    aria: string;
  };
  const isSelected = mode === selectedMode;

  return (
    <Button
      type="button"
      variant={isSelected ? "secondary" : "ghost"}
      size="sm"
      aria-pressed={isSelected}
      aria-label={text.aria}
      onClick={() => onSelect(mode)}
      className={cn(
        "h-10 rounded-md px-3 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        isSelected &&
          "bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-100 dark:hover:text-zinc-950",
      )}
    >
      <Icon className="size-4" />
      {text.label}
    </Button>
  );
}

function FamilyOption({ family }: { family: TileGroupFamily }) {
  return (
    <span className="flex min-w-0 items-center gap-3 text-left">
      <MiniTileStrip family={family} />
      <span className="grid min-w-0 justify-items-start text-left">
        <span className="block truncate font-medium">{family.name}</span>
        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
          {family.patchworkGroups.join(", ")}
        </span>
      </span>
    </span>
  );
}

function MiniTileStrip({
  family,
  fixedSlots = false,
}: {
  family: TileGroupFamily;
  fixedSlots?: boolean;
}) {
  const tiles = fixedSlots
    ? Array.from({ length: 4 }, (_, index) => family.tiles[index])
    : family.tiles.slice(0, 4);

  return (
    <span className="flex shrink-0 gap-1">
      {tiles.map((tile, index) => (
        <span
          key={
            tile ? `${tile.id}-${tile.orientation}-${index}` : `empty-${index}`
          }
          className={cn(
            "block h-8 w-8 overflow-hidden rounded bg-slate-900 ring-1 ring-slate-700/80",
            !tile && "invisible",
          )}
        >
          {tile && (
            <TileGlyph symbol={tile.symbol} sourceFont={family.sourceFont} />
          )}
        </span>
      ))}
    </span>
  );
}

function TileGlyph({
  symbol,
  sourceFont = "blocks",
  color = defaultColor,
}: {
  symbol: string;
  sourceFont?: TileGroupFamily["sourceFont"];
  color?: string;
}) {
  const fontClass = sourceFont === "smith-tiles" ? "smith-tile" : "tile";

  return (
    <span
      className={cn(
        "grid h-full w-full place-items-center overflow-hidden",
        `text-${color}`,
      )}
      style={{ containerType: "inline-size" } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className={`${fontClass} grid h-full w-full place-items-center text-[143cqw] leading-[0.7]`}
      >
        {symbol}
      </span>
    </span>
  );
}
