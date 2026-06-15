import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import type { CSSProperties } from "react";
import { allTileGroupFamilies, type TileGroupFamily } from "@/data/tileGroups";

const articleFamilies = allTileGroupFamilies.filter(
  (family) => family.id !== "font-unmapped-bit-blocks",
);

const sourceLabels: Record<
  NonNullable<TileGroupFamily["source"]>,
  Record<string, string>
> = {
  historic: {
    en: "Historic source",
    es: "Fuente historica",
    fr: "Source historique",
  },
  "patchwork-family": {
    en: "Patchwork family",
    es: "Familia Patchwork",
    fr: "Famille Patchwork",
  },
  "font-catalog": {
    en: "Font catalog",
    es: "Catalogo de fuente",
    fr: "Catalogue de police",
  },
};

const content = {
  en: {
    metaTitle: "Patchwork Tile Groups - Patchwork",
    metaDescription:
      "A complete visual catalog of Patchwork tile groups, excluding unmapped font glyphs.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    date: "June 15, 2026",
    readingTime: "8 min read",
    title: "Patchwork tile groups",
    lead: "A visual catalog of every selectable Patchwork tile group: historic Truchet and Smith families, curated Patchwork connector families, and the remaining grouped glyphs from the bundled fonts.",
    statsFamilies: "families",
    statsTiles: "tiles",
    statsGroups: "Patchwork groups",
    patchworkGroups: "Patchwork groups",
    sourcesTitle: "Source notes",
    sources: [
      "Sébastien Truchet's 1704 memoir describes the original diagonally divided square tile.",
      "Cyril Stanley Smith's 1987 Leonardo article popularized quarter-circle arc Truchet tiles.",
      "Other groups here are described as Patchwork or font-catalog families unless a specific historical attribution is known.",
    ],
    footer:
      "Unmapped BIT BLOCKS font codepoints are intentionally excluded from this article.",
  },
  es: {
    metaTitle: "Grupos de tiles de Patchwork - Patchwork",
    metaDescription:
      "Catalogo visual completo de los grupos de tiles de Patchwork, sin los glifos no mapeados de la fuente.",
    backToArticles: "← Articulos",
    backToApp: "Abrir Patchwork →",
    date: "15 de junio de 2026",
    readingTime: "8 min de lectura",
    title: "Grupos de tiles de Patchwork",
    lead: "Un catalogo visual de todos los grupos seleccionables de Patchwork: familias historicas Truchet y Smith, familias conectoras curadas de Patchwork y el resto de glifos agrupados de las fuentes incluidas.",
    statsFamilies: "familias",
    statsTiles: "tiles",
    statsGroups: "grupos Patchwork",
    patchworkGroups: "Grupos Patchwork",
    sourcesTitle: "Notas de fuente",
    sources: [
      "La memoria de 1704 de Sébastien Truchet describe el tile cuadrado original dividido por una diagonal.",
      "El articulo de Cyril Stanley Smith publicado en Leonardo en 1987 popularizo los tiles Truchet con arcos de cuarto de circulo.",
      "Los demas grupos se describen como familias Patchwork o catalogos de fuente salvo que exista una atribucion historica especifica.",
    ],
    footer:
      "Los codepoints no mapeados de BIT BLOCKS quedan excluidos intencionalmente de este articulo.",
  },
  fr: {
    metaTitle: "Groupes de carreaux Patchwork - Patchwork",
    metaDescription:
      "Catalogue visuel complet des groupes de carreaux Patchwork, sans les glyphes non mappes de la police.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    date: "15 juin 2026",
    readingTime: "8 min de lecture",
    title: "Groupes de carreaux Patchwork",
    lead: "Un catalogue visuel de tous les groupes selectionnables de Patchwork : familles historiques Truchet et Smith, familles de connecteurs Patchwork et autres glyphes groupes des polices incluses.",
    statsFamilies: "familles",
    statsTiles: "carreaux",
    statsGroups: "groupes Patchwork",
    patchworkGroups: "Groupes Patchwork",
    sourcesTitle: "Notes de source",
    sources: [
      "Le memoire de 1704 de Sébastien Truchet decrit le carreau carre original divise par une diagonale.",
      "L'article de Cyril Stanley Smith publie dans Leonardo en 1987 a popularise les carreaux Truchet a arcs de quart de cercle.",
      "Les autres groupes sont decrits comme familles Patchwork ou catalogues de police sauf attribution historique specifique connue.",
    ],
    footer:
      "Les codepoints BIT BLOCKS non mappes sont volontairement exclus de cet article.",
  },
};

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
      className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-900 p-0 text-teal-300"
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

function sourceLabel(family: TileGroupFamily, lang: string) {
  const labels = sourceLabels[family.source ?? "historic"];
  return labels[lang] ?? labels.en;
}

function GroupSection({
  family,
  index,
  lang,
}: {
  family: TileGroupFamily;
  index: number;
  lang: string;
}) {
  return (
    <section
      id={family.id}
      className="border-t border-zinc-200 py-10 first:border-t-0 dark:border-zinc-800"
    >
      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        <div>
          <p className="mb-2 font-mono text-xs text-zinc-400">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="mb-3 inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {sourceLabel(family, lang)}
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
            {family.name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {family.historicReference}
          </p>
        </div>

        <div className="min-w-0">
          <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {family.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {family.patchworkGroups.map((group) => (
              <span
                key={group}
                className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
              >
                {group}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {family.tiles.map((tile) => (
              <TilePreview
                key={`${family.id}-${tile.id}-${tile.orientation}`}
                symbol={tile.symbol}
                sourceFont={family.sourceFont}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TileGroupsArticle() {
  const { locale } = useRouter();
  const lang = (locale ?? "en") as keyof typeof content;
  const c = content[lang] ?? content.en;
  const localeLinks = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
  ];
  const tileTotal = articleFamilies.reduce(
    (total, family) => total + family.tiles.length,
    0,
  );
  const patchworkGroupTotal = new Set(
    articleFamilies.flatMap((family) => family.patchworkGroups),
  ).size;

  return (
    <>
      <Head>
        <title>{c.metaTitle}</title>
        <meta name="description" content={c.metaDescription} />
        <link rel="icon" href="/favicon.ico" />
        {localeLinks.map(({ code }) => (
          <link
            key={code}
            rel="alternate"
            hrefLang={code}
            href={`${code === "en" ? "" : `/${code}`}/articles/tile-groups`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <Link
              href="/articles"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {c.backToArticles}
            </Link>
            <div className="flex gap-3 text-xs text-zinc-400">
              {localeLinks.map(({ code, label }) => (
                <Link
                  key={code}
                  href="/articles/tile-groups"
                  locale={code}
                  className={`transition-colors ${
                    lang === code
                      ? "font-semibold text-teal-500"
                      : "hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 max-w-3xl">
            <div className="mb-4 flex items-center gap-4 font-mono text-xs text-zinc-400 dark:text-zinc-500">
              <time>{c.date}</time>
              <span>·</span>
              <span>{c.readingTime}</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {c.title}
            </h1>
            <p className="mt-6 border-l-2 border-teal-400 pl-4 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
              {c.lead}
            </p>
          </div>

          <div className="mb-10 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-2xl font-semibold">{articleFamilies.length}</p>
              <p className="mt-1 text-zinc-500">{c.statsFamilies}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-2xl font-semibold">{tileTotal}</p>
              <p className="mt-1 text-zinc-500">{c.statsTiles}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-2xl font-semibold">{patchworkGroupTotal}</p>
              <p className="mt-1 text-zinc-500">{c.statsGroups}</p>
            </div>
          </div>

          <nav
            aria-label="Tile group index"
            className="mb-8 flex gap-2 overflow-x-auto pb-2"
          >
            {articleFamilies.map((family) => (
              <a
                key={family.id}
                href={`#${family.id}`}
                className="shrink-0 rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                {family.name}
              </a>
            ))}
          </nav>

          <div>
            {articleFamilies.map((family, index) => (
              <GroupSection
                key={family.id}
                family={family}
                index={index}
                lang={lang}
              />
            ))}
          </div>

          <section className="mt-12 rounded-lg bg-slate-900 p-6 text-white">
            <h2 className="text-xl font-semibold">{c.sourcesTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              {c.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
            <p className="text-xs text-zinc-400">{c.footer}</p>
            <Link
              href="/"
              className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              {c.backToApp}
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    locale: locale ?? "en",
    messages: (await import(`../../../messages/${locale ?? "en"}.json`))
      .default,
  },
});
