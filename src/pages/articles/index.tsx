import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";

interface Article {
  slug: string;
  date: string;
  titles: Record<string, string>;
  summaries: Record<string, string>;
  tags: string[];
}

const articles: Article[] = [
  {
    slug: "douat",
    date: "2026-06-17",
    titles: {
      en: "Douat: An Alphabet of Tiles",
      es: "Douat: un alfabeto de mosaicos",
      fr: "Douat : un alphabet de carreaux",
    },
    summaries: {
      en: "In 1722 a Carmelite friar turned Truchet's single diagonal tile into four letters — A, B, C, D — that write an infinity of patterns. All 72 of his designs, rendered live from their letters.",
      es: "En 1722 un fraile carmelita convirtió el mosaico diagonal de Truchet en cuatro letras — A, B, C, D — que escriben una infinidad de patrones. Sus 72 diseños, renderizados en vivo a partir de sus letras.",
      fr: "En 1722, un frère carme transforma le carreau diagonal de Truchet en quatre lettres — A, B, C, D — qui écrivent une infinité de motifs. Ses 72 desseins, rendus en direct à partir de leurs lettres.",
    },
    tags: ["history", "combinatorics", "patterns"],
  },
  {
    slug: "douat-256-designs",
    date: "2026-06-17",
    titles: {
      en: "Douat's Table of 256 Designs",
      es: "La tabla de 256 diseños de Douat",
      fr: "La table des 256 desseins de Douat",
    },
    summaries: {
      en: "A live recreation of the dictionary of 256 little designs that closes Douat's 1722 book — every one rebuilt from its four-letter code.",
      es: "Una recreación en vivo del diccionario de 256 pequeños diseños que cierra el libro de Douat de 1722 — cada uno reconstruido desde su código de cuatro letras.",
      fr: "Une recréation en direct du dictionnaire de 256 petits desseins qui clôt le livre de Douat de 1722 — chacun reconstruit à partir de son code de quatre lettres.",
    },
    tags: ["combinatorics", "reference", "patterns"],
  },
  {
    slug: "layers-and-pattern-repeat",
    date: "2026-06-16",
    titles: {
      en: "Layers and Pattern Repeat",
      es: "Capas y repeticion de trama",
      fr: "Calques et repetition de motif",
    },
    summaries: {
      en: "A visual walkthrough of building a motif in layers, repeating it across the grid, and hiding layers to inspect the composition.",
      es: "Un recorrido visual para construir un motivo en capas, repetirlo sobre la grilla y ocultar capas para inspeccionar la composicion.",
      fr: "Un parcours visuel pour construire un motif en calques, le repeter sur la grille et verifier la composition.",
    },
    tags: ["layers", "patterns", "workflow"],
  },
  {
    slug: "truchet-in-practice",
    date: "2026-06-16",
    titles: {
      en: "Truchet in Practice: Multiscale, Quilts, and Code",
      es: "Truchet en la práctica: multiescala, mantas y código",
      fr: "Truchet en pratique : multi-échelle, courtepointes et code",
    },
    summaries: {
      en: "Beyond the classic square: recursive multiscale patterns, Truchet quilting, the 'Hello World' of generative art in p5.js, and fluid hexagonal mazes.",
      es: "Más allá del cuadrado clásico: patrones multiescala recursivos, quilting Truchet, el 'Hola Mundo' del arte generativo en p5.js y laberintos hexagonales fluidos.",
      fr: "Au-delà du carré classique : motifs multi-échelles récursifs, courtepointes Truchet, le 'Hello World' de l'art génératif en p5.js et labyrinthes hexagonaux fluides.",
    },
    tags: ["tiles", "generative", "patterns"],
  },
  {
    slug: "tile-combinations",
    date: "2026-06-16",
    titles: {
      en: "Tile Combinations",
      es: "Combinaciones de mosaicos",
      fr: "Combinaisons de carreaux",
    },
    summaries: {
      en: "An interactive generator for regular and irregular combinations of every selectable Patchwork tile group.",
      es: "Un generador interactivo de combinaciones regulares e irregulares para cada grupo seleccionable de mosaicos Patchwork.",
      fr: "Un generateur interactif de combinaisons regulieres et irregulieres pour chaque groupe de carreaux Patchwork selectionnable.",
    },
    tags: ["tiles", "generator", "patterns"],
  },
  {
    slug: "tile-groups",
    date: "2026-06-15",
    titles: {
      en: "Patchwork Tile Groups",
      es: "Grupos de mosaicos de Patchwork",
      fr: "Groupes de carreaux Patchwork",
    },
    summaries: {
      en: "A visual catalog of every selectable Patchwork tile group, with source notes, font previews, IDs, and orientations. Unmapped font glyphs are excluded.",
      es: "Catalogo visual de todos los grupos seleccionables de Patchwork, con notas de fuente, previews, IDs y orientaciones. Excluye los glifos no mapeados.",
      fr: "Catalogue visuel de tous les groupes selectionnables de Patchwork, avec notes de source, apercus, IDs et orientations. Les glyphes non mappes sont exclus.",
    },
    tags: ["tiles", "catalog", "reference"],
  },
  {
    slug: "truchet-tiling",
    date: "2026-06-15",
    titles: {
      en: "Truchet Tiling: From 1704 to Infinite Patterns",
      es: "El mosaico Truchet: de 1704 a los patrones infinitos",
      fr: "Le pavage Truchet : de 1704 aux motifs infinis",
    },
    summaries: {
      en: "How a French Dominican friar's observation about ceramic tiles became one of the most elegant systems for generating infinite geometric patterns — and how we recreated it with Patchwork.",
      es: "Cómo la observación de un fraile dominico francés sobre azulejos cerámicos se convirtió en uno de los sistemas más elegantes para generar patrones geométricos infinitos, y cómo lo recreamos con Patchwork.",
      fr: "Comment l'observation d'un frère dominicain français sur des carreaux en céramique est devenue l'un des systèmes les plus élégants pour générer des motifs géométriques infinis — et comment nous l'avons recréé avec Patchwork.",
    },
    tags: ["math", "history", "patterns"],
  },
];

const ui: Record<string, Record<string, string>> = {
  en: {
    siteTitle: "Patchwork — Articles",
    heading: "Articles",
    subtitle: "Patterns, history, and mathematics behind the tiles.",
    readMore: "Read article",
  },
  es: {
    siteTitle: "Patchwork — Artículos",
    heading: "Artículos",
    subtitle: "Patrones, historia y matemáticas detrás de los mosaicos.",
    readMore: "Leer artículo",
  },
  fr: {
    siteTitle: "Patchwork — Articles",
    heading: "Articles",
    subtitle: "Motifs, histoire et mathématiques derrière les carreaux.",
    readMore: "Lire l'article",
  },
};

const tagLabels: Record<string, Record<string, string>> = {
  layers: {
    es: "capas",
    fr: "calques",
  },
  tiles: {
    es: "mosaicos",
    fr: "carreaux",
  },
  workflow: {
    es: "flujo",
    fr: "flux",
  },
};

export default function ArticlesIndex() {
  const { locale } = useRouter();
  const lang = (locale ?? "en") as string;
  const t = ui[lang] ?? ui.en;
  const localeLinks = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
  ];

  return (
    <>
      <Head>
        <title>{t.siteTitle}</title>
        <meta name="description" content={t.subtitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles"
          lang={lang}
          localeLinks={localeLinks}
        />

        <main className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-3">{t.heading}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-14 text-lg">{t.subtitle}</p>

          <ul className="space-y-12">
            {articles.map((article) => (
              <li key={article.slug}>
                <article>
                  <time
                    dateTime={article.date}
                    className="text-xs text-zinc-400 dark:text-zinc-500 font-mono"
                  >
                    {article.date}
                  </time>
                  <h2 className="text-2xl font-semibold mt-1 mb-3 leading-snug">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      {article.titles[lang] ?? article.titles.en}
                    </Link>
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    {article.summaries[lang] ?? article.summaries.en}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      {t.readMore} →
                    </Link>
                    <div className="flex gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        >
                          {tagLabels[tag]?.[lang] ?? tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    locale: locale ?? "en",
    messages: (await import(`../../../messages/${locale ?? "en"}.json`)).default,
  },
});
