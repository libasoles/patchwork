import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import ArticleHeader from "@/components/ArticleHeader";
import { TileCombinationWidget } from "@/components/TileCombinationWidget";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import frMessages from "../../../messages/fr.json";

const content = {
  en: {
    metaTitle: "Tile Combinations - Patchwork",
    metaDescription:
      "Explore regular and irregular combinations of Patchwork tile groups.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    date: "June 16, 2026",
    readingTime: "2 min read",
    title: "Tile combinations",
    lead: "Choose a Patchwork tile group and compare periodic schemes with deterministic irregular placements.",
    note: "Regular patterns repeat a finite motif across the square grid. Irregular patterns choose each tile with a stable coordinate hash, so the composition stays reproducible while losing translational symmetry.",
    footer:
      "Patterns are generated in the browser from the selectable Patchwork tile groups.",
  },
  es: {
    metaTitle: "Combinaciones de mosaicos - Patchwork",
    metaDescription:
      "Explora combinaciones regulares e irregulares de grupos de mosaicos Patchwork.",
    backToArticles: "← Articulos",
    backToApp: "Abrir Patchwork →",
    date: "16 de junio de 2026",
    readingTime: "2 min de lectura",
    title: "Combinaciones de mosaicos",
    lead: "Elige un grupo de mosaicos de Patchwork y compara esquemas periodicos con colocaciones irregulares deterministicas.",
    note: "Los patrones regulares repiten un motivo finito sobre la grilla cuadrada. Los irregulares eligen cada mosaico con un hash estable de coordenadas, de modo que la composicion es reproducible aunque pierda simetria de traslacion.",
    footer:
      "Los patrones se generan en el navegador desde los grupos seleccionables de Patchwork.",
  },
  fr: {
    metaTitle: "Combinaisons de carreaux - Patchwork",
    metaDescription:
      "Explorez des combinaisons regulieres et irregulieres de groupes de carreaux Patchwork.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    date: "16 juin 2026",
    readingTime: "2 min de lecture",
    title: "Combinaisons de carreaux",
    lead: "Choisissez un groupe de carreaux Patchwork et comparez des schemas periodiques avec des placements irreguliers deterministes.",
    note: "Les motifs reguliers repetent un motif fini sur la grille carree. Les motifs irreguliers choisissent chaque carreau avec un hash stable des coordonnees, ce qui garde la composition reproductible sans symetrie de translation.",
    footer:
      "Les motifs sont generes dans le navigateur a partir des groupes selectionnables Patchwork.",
  },
};

const messagesByLocale = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
};

export default function TileCombinationsArticle() {
  const { locale } = useRouter();
  const lang = (locale ?? "en") as keyof typeof content;
  const c = content[lang] ?? content.en;
  const localeLinks = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
  ];

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
            href={`${code === "en" ? "" : `/${code}`}/articles/tile-combinations`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles/tile-combinations"
          lang={lang}
          localeLinks={localeLinks}
          maxWidthClass="max-w-5xl"
        />

        <main className="mx-auto max-w-5xl px-6 py-16">
          <Link
            href="/articles"
            className="mb-10 inline-flex text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {c.backToArticles}
          </Link>

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

          <TileCombinationWidget lang={lang} />

          <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {c.note}
          </p>
        </main>

        <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-8">
            <p className="text-xs text-zinc-400">{c.footer}</p>
            <Link
              href="/"
              className="shrink-0 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
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
    messages:
      messagesByLocale[(locale ?? "en") as keyof typeof messagesByLocale] ??
      enMessages,
  },
});
