import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";

// Tile characters from the Patchwork blocks font
const T = {
  // "diagonals" group — Truchet original (1704)
  d0: "›", // id 8250 — diagonal NW→SE orientation 0
  d1: "œ", // id 339  — diagonal NE→SW orientation 1
  d2: "", // id 157  — diagonal SE→NW orientation 2
  d3: "", // id 158  — diagonal SW→NE orientation 3
  // "smith arcs" group — Smith (1987) curved Truchet (smith-tiles.ttf, U+E000–E001)
  c0: "", // S-shape: top-right arc + bottom-left arc
  c1: "", // reverse-S: top-left arc + bottom-right arc
  // "archs" group — half-arch variant
  a0: "\\",    // id 92
  a1: "]",     // id 93
  a2: "Z",     // id 90
  a3: "[",     // id 91
};

// Static patterns for article illustrations
const TRUCHET_SAMPLE = [
  [T.d0, T.d1, T.d0, T.d1, T.d0, T.d1, T.d0, T.d1],
  [T.d1, T.d0, T.d1, T.d0, T.d1, T.d0, T.d1, T.d0],
  [T.d2, T.d3, T.d2, T.d3, T.d2, T.d3, T.d2, T.d3],
  [T.d3, T.d2, T.d3, T.d2, T.d3, T.d2, T.d3, T.d2],
  [T.d0, T.d1, T.d0, T.d1, T.d0, T.d1, T.d0, T.d1],
  [T.d1, T.d0, T.d1, T.d0, T.d1, T.d0, T.d1, T.d0],
];

const SMITH_SAMPLE = [
  [T.c0, T.c1, T.c1, T.c0, T.c0, T.c1, T.c0, T.c1],
  [T.c1, T.c0, T.c0, T.c1, T.c1, T.c0, T.c1, T.c0],
  [T.c0, T.c0, T.c1, T.c0, T.c0, T.c1, T.c0, T.c0],
  [T.c1, T.c0, T.c0, T.c1, T.c0, T.c0, T.c1, T.c1],
  [T.c0, T.c1, T.c0, T.c0, T.c1, T.c0, T.c0, T.c1],
  [T.c1, T.c0, T.c1, T.c0, T.c0, T.c1, T.c0, T.c0],
];

const ARCH_SAMPLE = [
  [T.a0, T.a1, T.a0, T.a1, T.a0, T.a1, T.a0, T.a1],
  [T.a2, T.a3, T.a2, T.a3, T.a2, T.a3, T.a2, T.a3],
  [T.a0, T.a1, T.a0, T.a1, T.a0, T.a1, T.a0, T.a1],
  [T.a2, T.a3, T.a2, T.a3, T.a2, T.a3, T.a2, T.a3],
  [T.a0, T.a1, T.a0, T.a1, T.a0, T.a1, T.a0, T.a1],
  [T.a2, T.a3, T.a2, T.a3, T.a2, T.a3, T.a2, T.a3],
];

// Same rendering technique as Canvas/components/Cell.tsx:
// outer div resets font-size to 1px; inner span uses fontSize = cellPx * (57/40)
// so the glyph fills the cell exactly, clipped by overflow-hidden.
function TileCell({ ch, color, cellPx }: { ch: string; color: string; cellPx: number }) {
  const fontPx = Math.round(cellPx * 57 / 40);
  return (
    <div
      className={`tile ${color} flex items-center justify-center overflow-hidden`}
      style={{ width: cellPx, height: cellPx, fontSize: "1px" }}
    >
      <span style={{ fontSize: fontPx, lineHeight: 1 }}>{ch}</span>
    </div>
  );
}

function TileGrid({
  grid,
  color = "text-teal-400",
  bg = "bg-slate-800",
  cellPx = 32,
}: {
  grid: string[][];
  color?: string;
  bg?: string;
  cellPx?: number;
}) {
  return (
    <div
      className={`inline-grid ${bg} p-1 select-none`}
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, ${cellPx}px)`,
        gridAutoRows: `${cellPx}px`,
      }}
    >
      {grid.map((row, r) =>
        row.map((ch, c) => (
          <TileCell key={`${r}-${c}`} ch={ch} color={color} cellPx={cellPx} />
        ))
      )}
    </div>
  );
}

function TileShowcase({
  tiles,
  color = "text-teal-400",
  bg = "bg-slate-800",
  cellPx = 56,
}: {
  tiles: string[];
  color?: string;
  bg?: string;
  cellPx?: number;
}) {
  return (
    <div className="flex gap-2">
      {tiles.map((ch, i) => (
        <div key={i} className={`${bg} p-2`}>
          <TileCell ch={ch} color={color} cellPx={cellPx} />
        </div>
      ))}
    </div>
  );
}

const content = {
  en: {
    metaTitle: "Truchet Tiling: From 1704 to Infinite Patterns — Patchwork",
    metaDescription:
      "The history and mathematics of Truchet tiling, from Sébastien Truchet's 1704 ceramic tiles to Cyril Stanley Smith's curved simplification, illustrated with Patchwork.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    date: "June 15, 2026",
    readingTime: "6 min read",
    title: "Truchet Tiling: From 1704 to Infinite Patterns",
    lead: "How a Dominican friar's observation about ceramic tiles became one of the most elegant combinatorial systems in decorative mathematics — and how Patchwork lets you explore it.",

    s1h: "A friar in a tile workshop",
    s1: [
      "In 1704, Sébastien Truchet, a French Dominican friar with a remarkable gift for combining mathematics and craftsmanship, visited a factory in the village of Marly. There he encountered square ceramic tiles, each divided diagonally into two contrasting colored triangles. Truchet noticed something delightful: placing just two identical tiles side by side in different orientations could produce an enormous variety of geometric figures.",
      "He catalogued all non-equivalent ways to combine pairs of these tiles, producing 64 combinations. His work, 'Mémoire sur les combinaisons,' was published in 1722 by Dominique Douat, who extended Truchet's observations and systematically explored what happens when the tiles tile the plane.",
    ],

    s2h: "The four original tiles",
    s2: "Truchet's system rests on a single tile with four possible orientations — rotations of 90° each. The diagonal divides the square into a dark triangle and a light triangle. From this single shape, all the complexity emerges:",
    s2caption: "The four orientations of the original Truchet tile (diagonals group in Patchwork)",
    s2pattern: "An alternating pattern of all four orientations creates a geometric rhythm:",
    s2patternCaption: "6×8 pattern using Truchet's diagonal tiles",

    s3h: "Smith's curved simplification (1987)",
    s3: [
      "Nearly three centuries later, historian of materials science Cyril Stanley Smith revisited Truchet tiling in his 1987 article 'The tiling patterns of Sebastien Truchet and the topology of structural hierarchy.' Smith introduced a crucial variant: instead of diagonal lines, each tile carries a quarter-circle arc connecting the midpoints of two adjacent sides.",
      "This small change has a dramatic visual effect. Where the original Truchet tiles produce angular geometric patterns, Smith's curved tiles generate flowing labyrinthine forms — paths that wind continuously across the plane without ever crossing themselves. Mathematically, the two systems are equivalent (both are generated by a single tile in four orientations), but they evoke entirely different aesthetics.",
    ],
    s3caption: "The two orientations of Smith's curved tile (smith arcs group in Patchwork)",
    s3pattern: "The same alternating arrangement with Smith tiles produces maze-like curves:",
    s3patternCaption: "6×8 pattern using Smith's quarter-circle tiles",

    s4h: "The arch variant",
    s4: "Patchwork also includes a half-arch variant — a tile family where each piece carries a semicircular arch along one edge. When placed in alternating orientations, these create cathedral-like arcades or interlocked S-curves, another example of how a small change in a tile's shape opens a new visual vocabulary:",
    s4patternCaption: "6×8 pattern using the arch tile family",

    s5h: "Create your own patterns",
    s5: [
      "One of the remarkable properties of Truchet tiling is that even a random arrangement of tiles (each orientation chosen by coin-flip) produces a visually coherent pattern. There is no 'wrong' placement — every configuration is interesting. This makes it an ideal generative design system: the rules are minimal, but the output space is vast.",
      "Patchwork gives you all of Truchet's tile families plus many more, with full control over color, layering, and composition. Open the app and explore — pick the diagonals, circle quarters, or archs from the tile panel and start placing them on the canvas.",
    ],
    cta: "Open Patchwork and start tiling",

    s6h: "Mathematical properties",
    s6: "Truchet tilings belong to a class of aperiodic-capable tilings — configurations that can fill the plane without repeating in a strict periodic pattern. Unlike a regular grid, a random Truchet tiling has no translational symmetry: you cannot shift the entire pattern by any fixed vector and have it look the same. This makes Truchet tilings useful in cryptography, texture generation, and generative art, where non-repetition is a virtue.",

    footer: "Illustrated with Patchwork tiles rendered in the browser using a custom block font.",
  },

  es: {
    metaTitle: "El mosaico Truchet: de 1704 a los patrones infinitos — Patchwork",
    metaDescription:
      "La historia y la matemática del mosaico Truchet, desde los azulejos de 1704 de Sébastien Truchet hasta la simplificación curva de Cyril Stanley Smith, ilustrado con Patchwork.",
    backToArticles: "← Artículos",
    backToApp: "Abrir Patchwork →",
    date: "15 de junio de 2026",
    readingTime: "6 min de lectura",
    title: "El mosaico Truchet: de 1704 a los patrones infinitos",
    lead: "Cómo la observación de un fraile dominico sobre unos azulejos cerámicos se convirtió en uno de los sistemas combinatorios más elegantes de la matemática decorativa — y cómo Patchwork te permite explorarlo.",

    s1h: "Un fraile en un taller de azulejos",
    s1: [
      "En 1704, Sébastien Truchet, un fraile dominico francés con un don notable para combinar matemáticas y artesanía, visitó una fábrica en el pueblo de Marly. Allí encontró azulejos cuadrados de cerámica, cada uno dividido en diagonal en dos triángulos de colores contrastantes. Truchet notó algo encantador: colocar solo dos azulejos idénticos uno al lado del otro en diferentes orientaciones podía producir una enorme variedad de figuras geométricas.",
      "Catalogó todas las formas no equivalentes de combinar pares de estos azulejos, produciendo 64 combinaciones. Su obra, 'Mémoire sur les combinaisons', fue publicada en 1722 por Dominique Douat, quien extendió las observaciones de Truchet y exploró sistemáticamente qué ocurre cuando los azulejos recubren el plano.",
    ],

    s2h: "Los cuatro mosaicos originales",
    s2: "El sistema de Truchet se basa en un único mosaico con cuatro orientaciones posibles — rotaciones de 90° cada una. La diagonal divide el cuadrado en un triángulo oscuro y uno claro. De esta única forma surge toda la complejidad:",
    s2caption: "Las cuatro orientaciones del mosaico Truchet original (grupo 'diagonals' en Patchwork)",
    s2pattern: "Un patrón alternando las cuatro orientaciones crea un ritmo geométrico:",
    s2patternCaption: "Patrón 6×8 con los mosaicos diagonales de Truchet",

    s3h: "La simplificación curva de Smith (1987)",
    s3: [
      "Casi tres siglos después, el historiador de ciencia de materiales Cyril Stanley Smith revisó el mosaico Truchet en su artículo de 1987 'The tiling patterns of Sebastien Truchet and the topology of structural hierarchy'. Smith introdujo una variante fundamental: en lugar de líneas diagonales, cada mosaico lleva un arco de cuarto de círculo que conecta los puntos medios de dos lados adyacentes.",
      "Este pequeño cambio tiene un efecto visual dramático. Mientras los mosaicos originales de Truchet producen patrones geométricos angulares, los mosaicos curvos de Smith generan formas laberínticas fluidas — caminos que serpentean continuamente por el plano sin cruzarse nunca. Matemáticamente, los dos sistemas son equivalentes (ambos se generan a partir de un único mosaico en cuatro orientaciones), pero evocan estéticas completamente diferentes.",
    ],
    s3caption: "Las dos orientaciones del mosaico curvo de Smith (grupo 'smith arcs' en Patchwork)",
    s3pattern: "La misma disposición alternada con los mosaicos de Smith produce curvas laberínticas:",
    s3patternCaption: "Patrón 6×8 con los mosaicos de cuarto de círculo de Smith",

    s4h: "La variante de arcos",
    s4: "Patchwork también incluye una variante de medio arco — una familia de mosaicos donde cada pieza lleva un arco semicircular a lo largo de un borde. Colocados en orientaciones alternadas, crean arcadas de estilo catedralicio o curvas S entrelazadas, otro ejemplo de cómo un pequeño cambio en la forma de un mosaico abre un nuevo vocabulario visual:",
    s4patternCaption: "Patrón 6×8 con la familia de mosaicos de arco",

    s5h: "Crea tus propios patrones",
    s5: [
      "Una de las propiedades notables del mosaico Truchet es que incluso una disposición aleatoria de mosaicos (con cada orientación elegida al azar) produce un patrón visualmente coherente. No existe una 'mala' colocación: toda configuración es interesante. Esto lo convierte en un sistema de diseño generativo ideal: las reglas son mínimas, pero el espacio de resultados es enorme.",
      "Patchwork te ofrece todas las familias de mosaicos de Truchet y muchas más, con control total sobre el color, las capas y la composición. Abre la aplicación y explora: elige las diagonales, los cuartos de círculo o los arcos del panel de mosaicos y empieza a colocarlos en el lienzo.",
    ],
    cta: "Abrir Patchwork y empezar a crear",

    s6h: "Propiedades matemáticas",
    s6: "Los mosaicos Truchet pertenecen a una clase de pavimentos con capacidad aperiódica — configuraciones que pueden cubrir el plano sin repetirse con un patrón periódico estricto. A diferencia de una cuadrícula regular, un mosaico Truchet aleatorio no tiene simetría traslacional: no puedes desplazar todo el patrón por ningún vector fijo y obtener el mismo aspecto. Esto hace que los mosaicos Truchet sean útiles en criptografía, generación de texturas y arte generativo, donde la no repetición es una virtud.",

    footer: "Ilustrado con mosaicos de Patchwork renderizados en el navegador usando una fuente de bloques personalizada.",
  },

  fr: {
    metaTitle: "Le pavage Truchet : de 1704 aux motifs infinis — Patchwork",
    metaDescription:
      "L'histoire et les mathématiques du pavage Truchet, des carreaux céramiques de 1704 de Sébastien Truchet à la simplification courbe de Cyril Stanley Smith, illustré avec Patchwork.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    date: "15 juin 2026",
    readingTime: "6 min de lecture",
    title: "Le pavage Truchet : de 1704 aux motifs infinis",
    lead: "Comment l'observation d'un frère dominicain sur des carreaux en céramique est devenue l'un des systèmes combinatoires les plus élégants des mathématiques décoratives — et comment Patchwork vous permet de l'explorer.",

    s1h: "Un frère dans un atelier de carreaux",
    s1: [
      "En 1704, Sébastien Truchet, un frère dominicain français doté d'un don remarquable pour combiner mathématiques et artisanat, visita une fabrique dans le village de Marly. Il y découvrit des carreaux carrés en céramique, chacun divisé en diagonale en deux triangles de couleurs contrastantes. Truchet remarqua quelque chose de délicieux : placer seulement deux carreaux identiques côte à côte dans différentes orientations pouvait produire une immense variété de figures géométriques.",
      "Il catalogua toutes les façons non équivalentes de combiner des paires de ces carreaux, produisant 64 combinaisons. Son travail, le 'Mémoire sur les combinaisons', fut publié en 1722 par Dominique Douat, qui étendit les observations de Truchet et explora systématiquement ce qui se passe lorsque les carreaux paveront le plan.",
    ],

    s2h: "Les quatre carreaux originaux",
    s2: "Le système de Truchet repose sur un seul carreau avec quatre orientations possibles — des rotations de 90° chacune. La diagonale divise le carré en un triangle foncé et un triangle clair. De cette seule forme naît toute la complexité :",
    s2caption: "Les quatre orientations du carreau Truchet original (groupe 'diagonals' dans Patchwork)",
    s2pattern: "Un motif alternant les quatre orientations crée un rythme géométrique :",
    s2patternCaption: "Motif 6×8 avec les carreaux diagonaux de Truchet",

    s3h: "La simplification courbe de Smith (1987)",
    s3: [
      "Près de trois siècles plus tard, l'historien des sciences des matériaux Cyril Stanley Smith revisita le pavage Truchet dans son article de 1987 'The tiling patterns of Sebastien Truchet and the topology of structural hierarchy'. Smith introduisit une variante cruciale : au lieu de lignes diagonales, chaque carreau porte un arc de quart de cercle reliant les milieux de deux côtés adjacents.",
      "Ce petit changement a un effet visuel dramatique. Là où les carreaux Truchet originaux produisent des motifs géométriques angulaires, les carreaux courbés de Smith génèrent des formes labyrinthiques fluides — des chemins qui serpentent continuellement sur le plan sans jamais se croiser. Mathématiquement, les deux systèmes sont équivalents (tous deux sont générés par un seul carreau en quatre orientations), mais ils évoquent des esthétiques entièrement différentes.",
    ],
    s3caption: "Les deux orientations du carreau courbé de Smith (groupe 'smith arcs' dans Patchwork)",
    s3pattern: "Le même arrangement alterné avec les carreaux de Smith produit des courbes labyrinthiques :",
    s3patternCaption: "Motif 6×8 avec les carreaux en quart de cercle de Smith",

    s4h: "La variante en arche",
    s4: "Patchwork inclut également une variante en demi-arche — une famille de carreaux où chaque pièce porte une arche semi-circulaire le long d'un bord. Placés en orientations alternées, ils créent des arcades de style cathédrale ou des courbes en S entrelacées, un autre exemple de la façon dont un petit changement dans la forme d'un carreau ouvre un nouveau vocabulaire visuel :",
    s4patternCaption: "Motif 6×8 avec la famille de carreaux en arche",

    s5h: "Créez vos propres motifs",
    s5: [
      "L'une des propriétés remarquables du pavage Truchet est que même un arrangement aléatoire de carreaux (chaque orientation choisie par tirage au sort) produit un motif visuellement cohérent. Il n'y a pas de 'mauvais' placement — chaque configuration est intéressante. Cela en fait un système de design génératif idéal : les règles sont minimales, mais l'espace des résultats est vaste.",
      "Patchwork vous offre toutes les familles de carreaux de Truchet et bien d'autres encore, avec un contrôle total sur la couleur, les calques et la composition. Ouvrez l'application et explorez — choisissez les diagonales, les quarts de cercle ou les arches dans le panneau de carreaux et commencez à les placer sur le canevas.",
    ],
    cta: "Ouvrir Patchwork et commencer à paver",

    s6h: "Propriétés mathématiques",
    s6: "Les pavages Truchet appartiennent à une classe de pavages à capacité apériodique — des configurations qui peuvent couvrir le plan sans se répéter selon un motif périodique strict. Contrairement à une grille régulière, un pavage Truchet aléatoire n'a pas de symétrie de translation : vous ne pouvez pas déplacer tout le motif d'un vecteur fixe quelconque et obtenir le même aspect. Cela rend les pavages Truchet utiles en cryptographie, en génération de textures et en art génératif, où la non-répétition est une vertu.",

    footer: "Illustré avec des carreaux Patchwork rendus dans le navigateur à l'aide d'une police de blocs personnalisée.",
  },
};

export default function TruchetTiling() {
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
            href={`${code === "en" ? "" : `/${code}`}/articles/truchet-tiling`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles/truchet-tiling"
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

          <div className="prose dark:prose-invert max-w-none space-y-10">

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s1h}</h2>
              {c.s1.map((p, i) => (
                <p key={i} className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">{p}</p>
              ))}
            </section>

            {/* Section 2 — Original 4 tiles */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s2h}</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">{c.s2}</p>

              <figure className="my-4">
                <TileShowcase tiles={[T.d0, T.d1, T.d2, T.d3]} />
                <figcaption className="text-xs text-zinc-400 mt-3">{c.s2caption}</figcaption>
              </figure>

              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">{c.s2pattern}</p>

              <figure className="my-4">
                <TileGrid grid={TRUCHET_SAMPLE} />
                <figcaption className="text-xs text-zinc-400 mt-3">{c.s2patternCaption}</figcaption>
              </figure>
            </section>

            {/* Section 3 — Smith tiles */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s3h}</h2>
              {c.s3.map((p, i) => (
                <p key={i} className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">{p}</p>
              ))}

              <figure className="my-4">
                <TileShowcase tiles={[T.c0, T.c1]} />
                <figcaption className="text-xs text-zinc-400 mt-3">{c.s3caption}</figcaption>
              </figure>

              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">{c.s3pattern}</p>

              <figure className="my-4">
                <TileGrid grid={SMITH_SAMPLE} />
                <figcaption className="text-xs text-zinc-400 mt-3">{c.s3patternCaption}</figcaption>
              </figure>
            </section>

            {/* Section 4 — Arch variant */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s4h}</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">{c.s4}</p>
              <figure className="my-4">
                <TileGrid grid={ARCH_SAMPLE} color="text-yellow-400" />
                <figcaption className="text-xs text-zinc-400 mt-3">{c.s4patternCaption}</figcaption>
              </figure>
            </section>

            {/* Section 5 — CTA */}
            <section className="rounded-xl bg-slate-800 p-8 my-10">
              <h2 className="text-2xl font-semibold mb-4 text-white">{c.s5h}</h2>
              {c.s5.map((p, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed mb-4">{p}</p>
              ))}
              <Link
                href="/"
                className="inline-block mt-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-medium rounded-lg transition-colors text-sm"
              >
                {c.cta}
              </Link>
            </section>

            {/* Section 6 — Math properties */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s6h}</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{c.s6}</p>
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
    messages: (await import(`../../../messages/${locale ?? "en"}.json`)).default,
  },
});
