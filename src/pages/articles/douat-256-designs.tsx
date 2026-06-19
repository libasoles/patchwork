import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";
import DouatAlphabetFigure, {
  douatAlphabetLegendCopy,
} from "@/components/DouatAlphabetFigure";
import DouatDesignTable from "@/components/DouatDesignTable";
import { douatTable256 } from "@/data/douatPatterns";

type Lang = "en" | "es" | "fr";

const content: Record<
  Lang,
  {
    metaTitle: string;
    metaDescription: string;
    backToArticles: string;
    backToApp: string;
    footer: string;
    date: string;
    readingTime: string;
    title: string;
    lead: string;
    intro: string[];
    tableCaption: string;
    tableEmpty: string;
    relatedPre: string;
    relatedLink: string;
    relatedPost: string;
    cta: string;
  }
> = {
  en: {
    metaTitle: "Douat's Table of 256 Designs — Patchwork",
    metaDescription:
      "A live recreation of the dictionary of 256 little designs that closes Dominique Douat's 1722 book — each one rendered from its four-letter code.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    footer: "Patchwork — a tile-based drawing toy.",
    date: "June 17, 2026",
    readingTime: "3 min read",
    title: "Douat's Table of 256 Designs",
    lead: "The 1722 Méthode closes with a dense table of 256 distinct little designs. Here it is, recreated — every cell rendered live from Douat's letters.",
    intro: [
      "Take the four tiles A, B, C, D, two by two — top-left, top-right, bottom-left, bottom-right — and you can fill a 2×2 block in 4 × 4 × 4 × 4 = 256 ways. Douat tabulates all of them. Each entry below is one of those 2×2 super-tiles, drawn at double size so its shape reads clearly.",
      "He offers the table as a working dictionary: a way to look up the center and corners of a larger composition, since every big design is, locally, one of these 256 blocks. It is the combinatorial heart of the book — the complete alphabet of two-by-two arrangements from which the engraved plates are spelled.",
      "Below, all 256 are rebuilt from their letter codes. Compare them with the seventy-two full designs in the companion article to see how these small blocks tile up into the book's plates.",
    ],
    tableCaption:
      "Douat's 256 designs, each rendered from its four-letter code (numbering as printed, 1–256).",
    tableEmpty:
      "Designs are being transcribed from the book; check back shortly.",
    relatedPre: "This is a companion to ",
    relatedLink: "Douat: An Alphabet of Tiles",
    relatedPost:
      ", which tells the story and shows the seventy-two full designs.",
    cta: "Open Patchwork →",
  },
  es: {
    metaTitle: "La tabla de 256 diseños de Douat — Patchwork",
    metaDescription:
      "Una recreación en vivo del diccionario de 256 pequeños diseños que cierra el libro de Dominique Douat de 1722 — cada uno renderizado a partir de su código de cuatro letras.",
    backToArticles: "← Artículos",
    backToApp: "Abrir Patchwork →",
    footer: "Patchwork — un juguete de dibujo con mosaicos.",
    date: "17 de junio de 2026",
    readingTime: "3 min de lectura",
    title: "La tabla de 256 diseños de Douat",
    lead: "La Méthode de 1722 termina con una tabla densa de 256 pequeños diseños distintos. Aquí está, recreada — cada celda renderizada en vivo a partir de las letras de Douat.",
    intro: [
      "Toma los cuatro mosaicos A, B, C, D, de dos en dos — arriba izquierda, arriba derecha, abajo izquierda, abajo derecha — y puedes llenar un bloque de 2×2 de 4 × 4 × 4 × 4 = 256 maneras. Douat las tabula todas. Cada entrada de abajo es uno de esos super-mosaicos de 2×2, dibujado al doble de tamaño para que su forma se lea con claridad.",
      "Ofrece la tabla como un diccionario de trabajo: una manera de buscar el centro y las esquinas de una composición mayor, ya que todo diseño grande es, localmente, uno de estos 256 bloques. Es el corazón combinatorio del libro — el alfabeto completo de disposiciones de dos por dos con el que se deletrean las láminas grabadas.",
      "Abajo, los 256 se reconstruyen desde sus códigos de letras. Compáralos con los setenta y dos diseños completos del artículo acompañante para ver cómo estos pequeños bloques se ensamblan en las láminas del libro.",
    ],
    tableCaption:
      "Los 256 diseños de Douat, cada uno renderizado desde su código de cuatro letras (numeración como en el original, 1–256).",
    tableEmpty:
      "Los diseños se están transcribiendo del libro; vuelve en un momento.",
    relatedPre: "Esto acompaña a ",
    relatedLink: "Douat: un alfabeto de mosaicos",
    relatedPost:
      ", que cuenta la historia y muestra los setenta y dos diseños completos.",
    cta: "Abrir Patchwork →",
  },
  fr: {
    metaTitle: "La table des 256 desseins de Douat — Patchwork",
    metaDescription:
      "Une recréation en direct du dictionnaire de 256 petits desseins qui clôt le livre de Dominique Douat de 1722 — chacun rendu à partir de son code de quatre lettres.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    footer: "Patchwork — un jouet de dessin à base de carreaux.",
    date: "17 juin 2026",
    readingTime: "3 min de lecture",
    title: "La table des 256 desseins de Douat",
    lead: "La Méthode de 1722 se termine par une table dense de 256 petits desseins distincts. La voici, recréée — chaque case rendue en direct à partir des lettres de Douat.",
    intro: [
      "Prenez les quatre carreaux A, B, C, D, deux par deux — en haut à gauche, en haut à droite, en bas à gauche, en bas à droite — et vous pouvez remplir un bloc 2×2 de 4 × 4 × 4 × 4 = 256 façons. Douat les tabule toutes. Chaque entrée ci-dessous est l'un de ces super-carreaux 2×2, dessiné au double de la taille pour que sa forme se lise clairement.",
      "Il propose la table comme un dictionnaire de travail : un moyen de retrouver le centre et les coins d'une composition plus grande, puisque tout grand dessein est, localement, l'un de ces 256 blocs. C'est le cœur combinatoire du livre — l'alphabet complet des arrangements deux par deux à partir desquels les planches gravées sont épelées.",
      "Ci-dessous, les 256 sont reconstruits à partir de leurs codes de lettres. Comparez-les aux soixante-douze desseins complets de l'article compagnon pour voir comment ces petits blocs s'assemblent en planches du livre.",
    ],
    tableCaption:
      "Les 256 desseins de Douat, chacun rendu à partir de son code de quatre lettres (numérotation d'origine, 1–256).",
    tableEmpty:
      "Les desseins sont en cours de transcription depuis le livre ; revenez bientôt.",
    relatedPre: "Ceci accompagne ",
    relatedLink: "Douat : un alphabet de carreaux",
    relatedPost:
      ", qui raconte l'histoire et montre les soixante-douze desseins complets.",
    cta: "Ouvrir Patchwork →",
  },
};

export default function DouatTable256Article() {
  const { locale } = useRouter();
  const lang = ((locale ?? "en") as Lang) in content ? (locale as Lang) : "en";
  const c = content[lang];

  const localeLinks = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
  ];

  const paragraph = "text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4";

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
            href={`${code === "en" ? "" : `/${code}`}/articles/douat-256-designs`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles/douat-256-designs"
          lang={lang}
          localeLinks={localeLinks}
        />

        <main className="max-w-3xl mx-auto px-6 py-16">
          <Link
            href="/articles"
            className="mb-10 inline-flex text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {c.backToArticles}
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 font-mono mb-4">
              <time>{c.date}</time>
              <span>·</span>
              <span>{c.readingTime}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
              {c.title}
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-2 border-teal-400 pl-4">
              {c.lead}
            </p>
          </div>

          <section>
            <DouatAlphabetFigure {...douatAlphabetLegendCopy[lang]} />
          </section>

          <div className="prose dark:prose-invert max-w-none space-y-8">
            <section>
              {c.intro.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
            </section>

            <section>
              <figure className="my-6">
                {douatTable256.length > 0 ? (
                  <div className="rounded-xl bg-slate-900 p-4">
                    <DouatDesignTable patterns={douatTable256} cellPx={12} />
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-800 p-8 text-center text-sm text-zinc-400">
                    {c.tableEmpty}
                  </div>
                )}
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.tableCaption}
                </figcaption>
              </figure>
            </section>

            <section className="rounded-xl bg-slate-800 p-8 my-10">
              <p className="text-zinc-300 leading-relaxed mb-5">
                {c.relatedPre}
                <Link
                  href="/articles/douat"
                  className="text-teal-400 hover:underline"
                >
                  {c.relatedLink}
                </Link>
                {c.relatedPost}
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-medium rounded-lg transition-colors text-sm"
              >
                {c.cta}
              </Link>
            </section>
          </div>
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
          <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
            <p className="text-xs text-zinc-400">{c.footer}</p>
            <Link
              href="/"
              className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
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
