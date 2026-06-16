import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import ArticleHeader from "@/components/ArticleHeader";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import frMessages from "../../../messages/fr.json";

const content = {
  en: {
    metaTitle: "Layers and Pattern Repeat - Patchwork",
    metaDescription:
      "How Patchwork layers help build a motif, test variants, and repeat a pattern across the canvas.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    date: "June 16, 2026",
    readingTime: "3 min read",
    title: "Layers and pattern repeat",
    lead:
      "Patchwork lets you separate a motif into layers, hide or dim each one, and then scale that single unit into a repeat that fills the canvas.",
    intro: [
      "A repeat pattern gets easier to control when the drawing is split into parts. Instead of treating the motif as a single flat object, layers let you isolate structure, accents, and background so each decision stays editable on its own.",
      "The layers panel gives every layer two controls: an eye to hide it completely, and a sun to dim it so it fades into the background without disappearing. One layer is always the active one, and tools like Move, Rotate, Paint, and Delete only act on that layer — so you can edit the structure without touching the accents stacked above it.",
    ],
    panelCaption:
      "The layers panel: the active layer is highlighted; the sun dims a layer and the eye hides it.",
    section1Title: "1. Build the motif as stacked layers",
    section1Body:
      "The first image shows a single unit in the center of the canvas with the layers panel open. This is the right scale for composition work: the motif is still small enough to reason about, but complete enough to test color balance, rotational symmetry, and how the corners will connect once the drawing repeats. Selecting a layer makes it active, and from that point every edit lands only there.",
    section1Caption:
      "A single motif with three layers, ready to become a repeat.",
    section2Title: "2. Repeat the unit across the grid",
    section2Body:
      "Once the motif works locally, the repeat view reveals whether it also works globally. The second screenshot shows the pattern extended across the canvas: orange connectors lock the grid together, circles create rhythm between modules, and the flower-like center keeps the eye moving diagonally and vertically at the same time.",
    section2Caption:
      "The same motif repeated across the canvas to verify continuity and rhythm.",
    section3Title: "3. Hide and dim layers to read the structure",
    section3Body:
      "Hiding layers is more than a visibility toggle — it is a way to debug the composition. Start by hiding a single accent layer: the repeat keeps most of its character, but you can already judge the spacing and the supporting geometry more clearly. Hide the upper layers entirely and the base drawing stands alone, which is where you check whether the repeat still holds and whether the underlying structure is strong enough by itself. Dimming a layer with the sun toggle does the same thing more gently, pushing it into the background so you can compare it against the layers you want to focus on.",
    section3CaptionA:
      "With one accent layer hidden, the repeat still reads while the structure becomes easier to inspect.",
    section3CaptionB:
      "With the upper layers hidden, the base structure is exposed on its own.",
    closingTitle: "Why this matters",
    closing: [
      "Layers turn pattern design into an iterative process. You can sketch the skeleton on one layer, place secondary forms on another, and reserve a final layer for color accents or corrections without collapsing everything into one irreversible surface.",
      "Pattern repeat then becomes a test, not a leap of faith. If the motif survives repetition and still reads clearly when some layers are hidden or dimmed, the composition is doing real work rather than relying on decoration alone.",
    ],
    cta: "Open Patchwork and build your own repeat",
    footer:
      "Screenshots captured in Patchwork using the layers panel and repeated pattern view.",
  },
  es: {
    metaTitle: "Capas y repetición de trama - Patchwork",
    metaDescription:
      "Cómo usar las capas de Patchwork para construir un motivo, probar variantes y repetir una trama sobre todo el lienzo.",
    backToArticles: "← Artículos",
    backToApp: "Abrir Patchwork →",
    date: "16 de junio de 2026",
    readingTime: "3 min de lectura",
    title: "Capas y repetición de trama",
    lead:
      "Patchwork permite separar un motivo en capas, ocultar o atenuar cada una y escalar esa unidad hasta convertirla en una repetición que ocupa todo el lienzo.",
    intro: [
      "Una trama repetida es más fácil de controlar cuando el dibujo está dividido en partes. En vez de tratar el motivo como un bloque plano, las capas permiten aislar estructura, acentos y fondo para que cada decisión siga siendo editable por separado.",
      "El menú de capas ofrece dos controles por capa: un ojo para ocultarla por completo y un sol para atenuarla, dejándola en segundo plano sin que desaparezca. Siempre hay una capa activa, y herramientas como Mover, Rotar, Pintar y Borrar solo actúan sobre esa capa, así se puede editar la estructura sin tocar los acentos apilados encima.",
    ],
    panelCaption:
      "El menú de capas: la capa activa aparece resaltada; el sol atenúa una capa y el ojo la oculta.",
    section1Title: "1. Construir el motivo como capas apiladas",
    section1Body:
      "La primera imagen muestra una unidad centrada en el lienzo con el panel de capas abierto. Es la escala correcta para componer: el motivo todavía es lo bastante pequeño como para pensarlo completo, pero ya permite probar equilibrio de color, simetría rotacional y la manera en que las esquinas se conectarán cuando la figura se repita. Al seleccionar una capa, esta queda activa y, desde ahí, cada edición se aplica solo en ella.",
    section1Caption:
      "Un motivo único con tres capas, listo para convertirse en repetición.",
    section2Title: "2. Repetir la unidad sobre la grilla",
    section2Body:
      "Cuando el motivo funciona en pequeño, la vista repetida revela si también funciona como sistema. La segunda captura muestra la trama extendida sobre el lienzo: los conectores naranjas traban la grilla, los círculos generan ritmo entre módulos y el centro en forma de flor hace que la mirada circule en diagonal y en vertical al mismo tiempo.",
    section2Caption:
      "El mismo motivo repetido sobre el lienzo para comprobar continuidad y ritmo.",
    section3Title: "3. Ocultar y atenuar capas para leer la estructura",
    section3Body:
      "Ocultar capas no es solo un control de visibilidad: es una forma de depurar la composición. Empezá ocultando una sola capa de acento: la repetición conserva buena parte de su carácter, pero ya se puede juzgar mejor el espaciado y la geometría de apoyo. Ocultá por completo las capas superiores y la base queda sola, que es donde se verifica si la repetición sigue sosteniéndose y si la estructura subyacente tiene fuerza por sí sola. Atenuar una capa con el control de sol hace lo mismo de forma más suave: la empuja al fondo para poder compararla con las capas en las que querés concentrarte.",
    section3CaptionA:
      "Con una capa de acento oculta, la repetición se sigue leyendo y la estructura se vuelve más fácil de inspeccionar.",
    section3CaptionB:
      "Con las capas superiores ocultas, la estructura base queda expuesta por sí sola.",
    closingTitle: "Por qué importa",
    closing: [
      "Las capas convierten el diseño de patrones en un proceso iterativo. Se puede dibujar el esqueleto en una capa, ubicar formas secundarias en otra y reservar una última para acentos de color o correcciones sin colapsar todo en una única superficie irreversible.",
      "La repetición de trama pasa entonces a ser una prueba y no un salto al vacío. Si el motivo sobrevive a la repetición y además se lee con claridad cuando algunas capas están ocultas o atenuadas, la composición está haciendo trabajo real y no depende solo del adorno.",
    ],
    cta: "Abrir Patchwork y crear tu propia trama",
    footer:
      "Capturas tomadas en Patchwork usando el panel de capas y la vista de repetición de trama.",
  },
  fr: {
    metaTitle: "Calques et repetition de motif - Patchwork",
    metaDescription:
      "Comment utiliser les calques de Patchwork pour construire un motif et le repeter sur toute la surface.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    date: "16 juin 2026",
    readingTime: "3 min de lecture",
    title: "Calques et repetition de motif",
    lead:
      "Patchwork permet de separer un motif en calques, de masquer ou d'attenuer chacun, puis d'etendre cette unite jusqu'a une repetition complete.",
    intro: [
      "Un motif repete devient plus facile a controler quand le dessin est divise en couches distinctes. Les calques isolent la structure, les accents et le fond pour garder chaque choix editable separement.",
      "Le panneau des calques offre deux controles par calque : un oeil pour le masquer entierement et un soleil pour l'attenuer afin de le renvoyer a l'arriere-plan sans le faire disparaitre. Un calque est toujours actif, et des outils comme Deplacer, Pivoter, Peindre et Effacer n'agissent que sur ce calque, ce qui permet de modifier la structure sans toucher aux accents empiles au-dessus.",
    ],
    panelCaption:
      "Le panneau des calques : le calque actif est mis en evidence ; le soleil attenue un calque et l'oeil le masque.",
    section1Title: "1. Construire le motif en calques",
    section1Body:
      "La premiere image montre une unite centrale avec le panneau des calques ouvert. C'est la bonne echelle pour verifier l'equilibre des couleurs, la symetrie et les raccords qui apparaitront une fois le motif repete. Selectionner un calque le rend actif, et chaque modification ne s'applique plus qu'a celui-ci.",
    section1Caption:
      "Un motif unique avec trois calques, pret pour la repetition.",
    section2Title: "2. Etendre la repetition",
    section2Body:
      "La deuxieme capture montre le meme motif repete sur toute la grille. Elle permet de controler la continuite, le rythme et la maniere dont les formes relient chaque module au suivant.",
    section2Caption:
      "Le meme motif repete sur la toile pour verifier la continuite.",
    section3Title: "3. Masquer et attenuer des calques pour lire la base",
    section3Body:
      "Masquer des calques n'est pas qu'un controle de visibilite : c'est une facon de deboguer la composition. Commencez par masquer un seul calque d'accent : la repetition garde son caractere, mais l'espacement et la geometrie de soutien deviennent plus lisibles. Masquez entierement les calques superieurs et la base reste seule, la ou l'on verifie si la repetition tient toujours. Attenuer un calque avec le soleil fait la meme chose plus doucement, en le renvoyant a l'arriere-plan.",
    section3CaptionA:
      "Avec un calque d'accent masque, la repetition reste lisible et la structure devient plus facile a inspecter.",
    section3CaptionB:
      "Avec les calques superieurs masques, la structure de base apparait seule.",
    closingTitle: "Pourquoi c'est utile",
    closing: [
      "Les calques rendent le dessin iteratif : une couche pour le squelette, une autre pour les formes secondaires, une derniere pour les accents.",
      "La repetition devient alors un test de solidite. Si le motif tient encore quand certains calques sont masques ou attenues, la composition est bien construite.",
    ],
    cta: "Ouvrir Patchwork et creer votre motif",
    footer:
      "Captures realisees dans Patchwork avec le panneau des calques et la vue repetee.",
  },
};

const messagesByLocale = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
};

const figures = [
  {
    src: "/articles/layers-repeat-single-motif.png",
    width: 3600,
    height: 2092,
    key: "section1Caption",
  },
  {
    src: "/articles/layers-repeat-full-pattern.png",
    width: 3600,
    height: 2082,
    key: "section2Caption",
  },
  {
    src: "/articles/layers-repeat-two-layers.png",
    width: 3600,
    height: 2084,
    key: "section3CaptionA",
  },
  {
    src: "/articles/layers-repeat-hidden-layers.png",
    width: 3600,
    height: 2084,
    key: "section3CaptionB",
  },
] as const;

export default function LayersAndPatternRepeatArticle() {
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
            href={`${code === "en" ? "" : `/${code}`}/articles/layers-and-pattern-repeat`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles/layers-and-pattern-repeat"
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

          <div className="mb-12 max-w-3xl">
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

          <section className="max-w-3xl space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            {c.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <figure className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950/5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                src="/articles/layers-panel.png"
                alt={c.panelCaption}
                width={822}
                height={888}
                className="h-auto w-full"
              />
              <figcaption className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                {c.panelCaption}
              </figcaption>
            </figure>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">{c.section1Title}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              {c.section1Body}
            </p>
            <figure className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950/5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                src={figures[0].src}
                alt={c.section1Caption}
                width={figures[0].width}
                height={figures[0].height}
                className="h-auto w-full"
              />
              <figcaption className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                {c.section1Caption}
              </figcaption>
            </figure>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">{c.section2Title}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              {c.section2Body}
            </p>
            <figure className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950/5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                src={figures[1].src}
                alt={c.section2Caption}
                width={figures[1].width}
                height={figures[1].height}
                className="h-auto w-full"
              />
              <figcaption className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                {c.section2Caption}
              </figcaption>
            </figure>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">{c.section3Title}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              {c.section3Body}
            </p>
            <figure className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950/5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                src={figures[2].src}
                alt={c.section3CaptionA}
                width={figures[2].width}
                height={figures[2].height}
                className="h-auto w-full"
              />
              <figcaption className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                {c.section3CaptionA}
              </figcaption>
            </figure>
            <figure className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950/5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                src={figures[3].src}
                alt={c.section3CaptionB}
                width={figures[3].width}
                height={figures[3].height}
                className="h-auto w-full"
              />
              <figcaption className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                {c.section3CaptionB}
              </figcaption>
            </figure>
          </section>

          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight">{c.closingTitle}</h2>
            <div className="mt-4 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              {c.closing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              href="/"
              className="mt-8 inline-block rounded-lg bg-teal-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-400"
            >
              {c.cta}
            </Link>
          </section>
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
