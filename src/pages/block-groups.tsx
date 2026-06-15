import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import type { CSSProperties } from "react";
import { allTileGroupFamilies, type TileGroupFamily } from "@/data/tileGroups";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    locale: locale ?? "en",
    messages: (await import(`../../messages/${locale ?? "en"}.json`)).default,
  },
});

function TilePreview({
  symbol,
  sourceFont = "blocks",
}: {
  symbol: string;
  sourceFont?: TileGroupFamily["sourceFont"];
}) {
  const fontClass = sourceFont === "smith-tiles" ? "smith-tile" : "tile";

  return (
    <div
      className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-0 text-emerald-300 shadow-sm"
      style={{ containerType: "inline-size" } as CSSProperties}
    >
      <span
        className={`${fontClass} grid h-full w-full place-items-center text-[143cqw] leading-[0.7]`}
        aria-hidden="true"
      >
        {symbol}
      </span>
    </div>
  );
}

function GroupCard({ family, index }: { family: TileGroupFamily; index: number }) {
  const tileCount = family.tiles.length;
  const sourceLabel =
    family.source === "font-catalog" ? "Font catalog" : "Historic family";
  const sourceFontLabel =
    family.sourceFont === "smith-tiles" ? "smith-tiles.ttf" : "BIT BLOCKS TTF BRK.ttf";

  return (
    <article
      id={family.id}
      className="grid gap-6 border-t border-zinc-200 py-8 first:border-t-0 md:grid-cols-[minmax(220px,320px),1fr]"
    >
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-700">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mb-3 inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
          {sourceLabel}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-950">{family.name}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {family.historicReference}
        </p>
        <p className="mt-2 text-xs font-medium text-zinc-500">
          Source font: {sourceFontLabel}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {family.patchworkGroups.map((group) => (
            <span
              key={group}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
            >
              {group}
            </span>
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <p className="max-w-3xl text-base leading-7 text-zinc-700">
          {family.description}
        </p>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="grid grid-cols-[96px,1fr] border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 md:grid-cols-[96px,88px,120px,1fr]">
            <span>Tile</span>
            <span className="hidden md:block">ID</span>
            <span className="hidden md:block">Orientation</span>
            <span>Description</span>
          </div>

          <div>
            {family.tiles.map((tile) => (
              <div
                key={`${family.id}-${tile.id}-${tile.orientation}`}
                className="grid grid-cols-[96px,1fr] items-center gap-4 border-b border-zinc-100 px-4 py-4 last:border-b-0 md:grid-cols-[96px,88px,120px,1fr]"
              >
                <TilePreview
                  symbol={tile.symbol}
                  sourceFont={family.sourceFont}
                />
                <div className="space-y-1 md:hidden">
                  <p className="text-sm font-semibold text-zinc-950">
                    ID {tile.id} · orientation {tile.orientation}
                  </p>
                  <p className="text-sm leading-6 text-zinc-600">
                    {tile.description}
                  </p>
                </div>
                <p className="hidden text-sm font-medium text-zinc-900 md:block">
                  {tile.id}
                </p>
                <p className="hidden text-sm text-zinc-600 md:block">
                  {tile.orientation}
                </p>
                <p className="hidden text-sm leading-6 text-zinc-600 md:block">
                  {tile.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          {tileCount} {tileCount === 1 ? "tile" : "tiles"} in this family.
        </p>
      </div>
    </article>
  );
}

export default function BlockGroups() {
  const tileTotal = allTileGroupFamilies.reduce(
    (total, family) => total + family.tiles.length,
    0
  );
  const historicTotal = allTileGroupFamilies.filter(
    (family) => family.source !== "font-catalog"
  ).length;
  const fontCatalogTotal = allTileGroupFamilies.length - historicTotal;

  return (
    <>
      <Head>
        <title>Block Groups - Patchwork</title>
        <meta
          name="description"
          content="Patchwork block groups mapped to Truchet tile families and font catalogs, with glyph previews, ids, source fonts, orientations, and historical references."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main className="min-h-screen bg-stone-50 text-zinc-950">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <Link
                  href="/"
                  className="text-sm font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950"
                >
                  Patchwork
                </Link>
                <h1 className="mt-6 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
                  Block groups
                </h1>
                <p className="mt-4 text-lg leading-8 text-zinc-600">
                  A readable view of the tile family data in{" "}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-800">
                    src/data/tileGroups.ts
                  </code>
                  , including historical Truchet families plus the remaining
                  groups cataloged from the BIT BLOCKS font through Patchwork&apos;s
                  tile config.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 bg-stone-50 px-4 py-3">
                  <p className="text-2xl font-semibold text-zinc-950">
                    {allTileGroupFamilies.length}
                  </p>
                  <p className="mt-1 text-zinc-500">families</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-stone-50 px-4 py-3">
                  <p className="text-2xl font-semibold text-zinc-950">
                    {tileTotal}
                  </p>
                  <p className="mt-1 text-zinc-500">tiles</p>
                </div>
                <div className="col-span-2 rounded-lg border border-zinc-200 bg-stone-50 px-4 py-3 sm:col-span-1">
                  <p className="text-2xl font-semibold text-zinc-950">
                    {new Set(allTileGroupFamilies.flatMap((f) => f.patchworkGroups)).size}
                  </p>
                  <p className="mt-1 text-zinc-500">groups</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-zinc-500">
              Coverage: {historicTotal} historic families and {fontCatalogTotal} BIT
              BLOCKS catalog groups.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <nav
            aria-label="Block group index"
            className="mb-8 flex gap-2 overflow-x-auto pb-2"
          >
            {allTileGroupFamilies.map((family) => (
              <a
                key={family.id}
                href={`#${family.id}`}
                className="shrink-0 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-zinc-500 hover:text-zinc-950"
              >
                {family.name}
              </a>
            ))}
          </nav>

          <div className="rounded-xl border border-zinc-200 bg-white px-5 sm:px-8">
            {allTileGroupFamilies.map((family, index) => (
              <GroupCard key={family.id} family={family} index={index} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
