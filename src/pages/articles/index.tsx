import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

interface Article {
  slug: string;
  date: string;
  titles: Record<string, string>;
  summaries: Record<string, string>;
  tags: string[];
}

const articles: Article[] = [
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
    backToApp: "← Open Patchwork",
  },
  es: {
    siteTitle: "Patchwork — Artículos",
    heading: "Artículos",
    subtitle: "Patrones, historia y matemáticas detrás de los mosaicos.",
    readMore: "Leer artículo",
    backToApp: "← Abrir Patchwork",
  },
  fr: {
    siteTitle: "Patchwork — Articles",
    heading: "Articles",
    subtitle: "Motifs, histoire et mathématiques derrière les carreaux.",
    readMore: "Lire l'article",
    backToApp: "← Ouvrir Patchwork",
  },
};

export default function ArticlesIndex() {
  const { locale } = useRouter();
  const lang = (locale ?? "en") as string;
  const t = ui[lang] ?? ui.en;

  return (
    <>
      <Head>
        <title>{t.siteTitle}</title>
        <meta name="description" content={t.subtitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {t.backToApp}
            </Link>
            <div className="flex gap-3 text-xs text-zinc-400">
              <Link href="/" locale="en" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">EN</Link>
              <Link href="/" locale="es" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">ES</Link>
              <Link href="/" locale="fr" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">FR</Link>
            </div>
          </div>
        </header>

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
                          {tag}
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
