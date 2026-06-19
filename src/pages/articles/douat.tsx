import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";
import DouatAlphabetFigure, {
  douatAlphabetLegendCopy,
} from "@/components/DouatAlphabetFigure";
import DouatCarousel from "@/components/DouatCarousel";
import DouatPatternSVG from "@/components/DouatPatternSVG";
import { douatPlates, type DouatLetter } from "@/data/douatPatterns";

// A tiny, well-known design from the book's final table (#1) used to show how
// a grid of letters becomes a picture. Independent of the transcribed data.
const DEMO_GRID: DouatLetter[][] = [
  ["D", "D", "A", "A"],
  ["D", "D", "A", "A"],
  ["C", "C", "B", "B"],
  ["C", "C", "B", "B"],
];

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
    hHistory: string;
    pHistory: string[];
    hTile: string;
    pTile: string[];
    hAlphabet: string;
    pAlphabet: string[];
    demoIntro: string;
    demoCaption: string;
    hOpposites: string;
    pOpposites: string[];
    hCarousel: string;
    pCarousel: string[];
    carouselTitle: string;
    carouselEmpty: string;
    flipHint: string;
    flipLabel: string;
    colorLabel: string;
    backgroundLabel: string;
    hMore: string;
    pMorePre: string;
    pMoreLink: string;
    pMorePost: string;
    relatedPre: string;
    relatedLink: string;
    relatedPost: string;
    cta: string;
  }
> = {
  en: {
    metaTitle: "Douat: An Alphabet of Tiles — Patchwork",
    metaDescription:
      "How the Carmelite friar Dominique Douat turned Sébastien Truchet's single diagonal tile into a four-letter alphabet (A, B, C, D) that writes an infinity of patterns — with all 72 of his designs rendered live from their letters.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    footer: "Patchwork — a tile-based drawing toy.",
    date: "June 17, 2026",
    readingTime: "8 min read",
    title: "Douat: An Alphabet of Tiles",
    lead: "In 1722 a Carmelite friar wrote a 256-page book proving that a single square tile, split by a diagonal into two colors, can be turned into letters — and that with just four letters you can write an infinity of patterns.",
    hHistory: "From Truchet to Douat",
    pHistory: [
      "The story begins with Sébastien Truchet, a Dominican friar, royal engineer, and member of the Académie Royale des Sciences. Around 1704, while inventorying ceramic tiles, he noticed that a square tile divided diagonally into a dark and a light half is far richer than it looks: rotate it and it becomes four different tiles, and laid edge to edge those tiles produce an astonishing variety of patterns. He wrote up the observation in a short mémoire for the Academy.",
      "Truchet never expanded the idea into a book. That was done by Dominique Douat, a Carmelite of the Province of Toulouse, who took Truchet's mémoire as a starting point and pushed it as far as it would go. His 1722 Méthode pour faire une infinité de desseins différens is, in effect, the first full combinatorial treatise on what we now call Truchet tiles — complete with 72 engraved designs, tables of permutations, and a recipe for building any pattern from scratch.",
      "The book carries approbations from the leading mathematicians of the day — Fontenelle and Varignon among them — and is dedicated to a president of the Montpellier Academy. Two friars, a single diagonal line, and the whole machinery of 18th-century combinatorics: that is the unlikely origin of a system that generative artists still reach for today.",
    ],
    hTile: "One tile, four orientations",
    pTile: [
      "Everything is built from a single square tile, mi-parti — split in half by a diagonal — one half colored, one half white. Because a square has four corners, the colored right-angle can point to any of them. Douat gives each of these four orientations a letter, named by the corner where the colored angle sits:",
      "That is the entire alphabet. A is the colored corner at bottom-left, B at top-left, C at top-right, D at bottom-right. Once you can tell A, B, C and D apart, you can read — and write — every design in the book without ever looking at a drawing.",
    ],
    hAlphabet: "An alphabet of patterns",
    pAlphabet: [
      "Douat's insight is that the letters are a notation. Take the four tiles four at a time, allowing repeats, and you get 4 × 4 × 4 × 4 = 256 little two-by-two arrangements — his fourth table. Repeat and combine those, row after row, and the count explodes: he patiently works out the number of designs you can make taking the 256 two, three, four… at a time, and the totals run to dozens of digits.",
      "He loved that disproportion between tiny means and limitless results, and reached for analogies: mathematics grows from a single point, arithmetic from nine digits, music from seven notes, and the twenty-four letters of the alphabet spell more words than there are moments since the creation of the world. Four tiles, he argues, are no different — they spell an infinity of designs.",
      'And because the patterns are written in letters, you don\'t need the engravings at all. Knowing only A, B, C and D, you can lay out cardboard tiles and reproduce any design — "sans étude", without study, as he puts it.',
    ],
    demoIntro:
      "Read the grid of letters on the left; build the tiles it names; and you get the picture on the right. This is design 1 of his final table:",
    demoCaption: "Letters in, pattern out — the whole idea in one small grid.",
    hOpposites: "Opposites: diagonal, horizontal, perpendicular",
    pOpposites: [
      "The letters also make the symmetries easy to compute. Douat notes that A and C (and B and D) are diagonal opposites — they swap black for white. A and D (and B and C) are horizontal opposites — left for right. A and B (and C and D) are perpendicular opposites — top for bottom.",
      "So from any one design you instantly get three more, just by swapping letters. A whole page of his book is given over to these oppositions, turning one pattern into four with no drawing required.",
    ],
    hCarousel: "The 72 designs, written in letters",
    pCarousel: [
      "Below are Douat's seventy-two engraved designs — but not the engravings. Each one has been transcribed from his letter grids and rendered live, in your browser, from nothing but A, B, C and D. Use the arrows (or the keyboard) to leaf through them, exactly as a reader in 1722 could have built them tile by tile.",
    ],
    carouselTitle: "Douat's Desseins — rendered from their letters",
    carouselEmpty:
      "Designs are being transcribed from the book; check back shortly.",
    flipHint: "Click the design to flip it and read its letters.",
    flipLabel: "Flip the design to see its letters",
    colorLabel: "Tile color",
    backgroundLabel: "Background",
    hMore: "The table of 256",
    pMorePre:
      "The book ends with a dense table of 256 distinct little designs, meant as a dictionary of centers and corners for building bigger ones. We've recreated it as a companion piece — ",
    pMoreLink: "Douat's table of 256 designs",
    pMorePost: ".",
    relatedPre: "For the longer history of the tile itself, see ",
    relatedLink: "Truchet Tiling: From 1704 to Infinite Patterns",
    relatedPost: ".",
    cta: "Open Patchwork →",
  },
  es: {
    metaTitle: "Douat: un alfabeto de mosaicos — Patchwork",
    metaDescription:
      "Cómo el fraile carmelita Dominique Douat convirtió el mosaico diagonal de Sébastien Truchet en un alfabeto de cuatro letras (A, B, C, D) capaz de generar una infinidad de patrones, con sus 72 diseños recreados en vivo a partir de esas letras.",
    backToArticles: "← Artículos",
    backToApp: "Abrir Patchwork →",
    footer: "Patchwork — una aplicación para dibujar con mosaicos.",
    date: "17 de junio de 2026",
    readingTime: "8 min de lectura",
    title: "Douat: un alfabeto de mosaicos",
    lead: "En 1722 un fraile carmelita escribió un libro de 256 páginas para demostrar que un único mosaico cuadrado, dividido por una diagonal en dos colores, puede convertirse en letras, y que con apenas cuatro letras se puede componer una infinidad de patrones.",
    hHistory: "De Truchet a Douat",
    pHistory: [
      "La historia empieza con Sébastien Truchet, fraile dominico, ingeniero real y miembro de la Académie Royale des Sciences. Hacia 1704, mientras inventariaba azulejos cerámicos, notó que un mosaico cuadrado dividido en diagonal en una mitad oscura y otra clara es mucho más rico de lo que parece: al girarlo se convierte en cuatro mosaicos distintos, y colocados borde con borde producen una variedad asombrosa de patrones. Dejó la observación en una breve memoria para la Academia.",
      "Truchet nunca llevó la idea a un libro. Lo hizo Dominique Douat, carmelita de la Provincia de Toulouse, que tomó la memoria de Truchet como punto de partida y la empujó hasta el límite. Su Méthode pour faire une infinité de desseins différens, de 1722, es en realidad el primer tratado combinatorio completo sobre lo que hoy llamamos mosaicos de Truchet — con 72 diseños grabados, tablas de permutaciones y una receta para construir cualquier patrón desde cero.",
      "El libro lleva las aprobaciones de los matemáticos más destacados de la época — Fontenelle y Varignon entre ellos — y está dedicado a un presidente de la Academia de Montpellier. Dos frailes, una sola línea diagonal y toda la maquinaria de la combinatoria del siglo XVIII: ese es el origen improbable de un sistema al que los artistas generativos siguen recurriendo hoy.",
    ],
    hTile: "Un mosaico, cuatro orientaciones",
    pTile: [
      "Todo se construye a partir de un único mosaico cuadrado, mi-parti — partido por la mitad mediante una diagonal — una mitad de color, la otra blanca. Como el cuadrado tiene cuatro esquinas, el ángulo coloreado puede apuntar a cualquiera de ellas. Douat asigna a cada una de esas cuatro orientaciones una letra, según la esquina donde se sitúa el ángulo de color:",
      "Ese es todo el alfabeto. A es el ángulo de color abajo a la izquierda, B arriba a la izquierda, C arriba a la derecha, D abajo a la derecha. Una vez que distingues A, B, C y D, puedes leer — y escribir — cada diseño del libro sin mirar jamás un dibujo.",
    ],
    hAlphabet: "Un alfabeto de patrones",
    pAlphabet: [
      "La idea de Douat es que las letras funcionan como una notación. Toma los cuatro mosaicos de cuatro en cuatro, permitiendo repeticiones, y aparecen 4 × 4 × 4 × 4 = 256 pequeñas disposiciones de dos por dos: su cuarta tabla. Si repites y combinas esas piezas fila tras fila, la cuenta se dispara: calcula con paciencia cuántos diseños pueden formarse tomando esas 256 disposiciones de dos en dos, de tres en tres, de cuatro en cuatro… y los totales llegan a decenas de cifras.",
      "Le fascinaba esa desproporción entre medios mínimos y resultados casi sin límite, y la explicaba con analogías: la matemática crece desde un único punto, la aritmética desde nueve cifras, la música desde siete notas, y las veinticuatro letras del alfabeto alcanzan para deletrear más palabras que instantes ha habido desde la creación del mundo. Cuatro mosaicos, sostiene, no son una excepción: también permiten escribir una infinidad de diseños.",
      "Y como los patrones están escritos con letras, ni siquiera hacen falta los grabados. Con solo conocer A, B, C y D puedes disponer mosaicos de cartón y reproducir cualquier diseño, «sans étude», sin estudio, como dice él mismo.",
    ],
    demoIntro:
      "Lee la grilla de letras de la izquierda, arma los mosaicos que nombra y aparece la imagen de la derecha. Este es el diseño 1 de su tabla final:",
    demoCaption:
      "Entran letras, sale un patrón — toda la idea en una grilla pequeña.",
    hOpposites: "Opuestos: diagonal, horizontal, perpendicular",
    pOpposites: [
      "Las letras también vuelven fáciles de calcular las simetrías. Douat observa que A y C (y B y D) son opuestos en diagonal — intercambian negro por blanco. A y D (y B y C) son opuestos horizontales — izquierda por derecha. A y B (y C y D) son opuestos perpendiculares — arriba por abajo.",
      "Así, de cualquier diseño obtienes al instante otros tres, con solo intercambiar letras. Una página entera de su libro se dedica a estas oposiciones, convirtiendo un patrón en cuatro sin dibujar nada.",
    ],
    hCarousel: "Los 72 diseños, escritos en letras",
    pCarousel: [
      "Abajo están los setenta y dos diseños grabados de Douat, aunque no verás aquí los grabados originales. Cada uno fue transcrito de sus grillas de letras y se reconstruye en vivo, en tu navegador, a partir de nada más que A, B, C y D. Usa las flechas, o el teclado, para hojearlos como podría haberlo hecho un lector de 1722, mosaico a mosaico.",
    ],
    carouselTitle: "Los Desseins de Douat — reconstruidos a partir de sus letras",
    carouselEmpty:
      "Los diseños se están transcribiendo del libro; vuelve en un momento.",
    flipHint: "Haz clic en el diseño para girarlo y leer sus letras.",
    flipLabel: "Girar el diseño para ver sus letras",
    colorLabel: "Color del mosaico",
    backgroundLabel: "Fondo",
    hMore: "La tabla de los 256",
    pMorePre:
      "El libro termina con una tabla densa de 256 pequeños diseños distintos, pensada como un diccionario de centros y esquinas para construir composiciones mayores. La recreamos en una pieza aparte: ",
    pMoreLink: "la tabla de 256 diseños de Douat",
    pMorePost: ".",
    relatedPre: "Si quieres la historia más amplia del mosaico en sí, empieza por ",
    relatedLink: "El mosaico Truchet: de 1704 a los patrones infinitos",
    relatedPost: ".",
    cta: "Abrir Patchwork →",
  },
  fr: {
    metaTitle: "Douat : un alphabet de carreaux — Patchwork",
    metaDescription:
      "Comment le frère carme Dominique Douat a transformé le carreau diagonal de Sébastien Truchet en un alphabet de quatre lettres (A, B, C, D) qui écrit une infinité de motifs — avec ses 72 desseins rendus en direct à partir de leurs lettres.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    footer: "Patchwork — un jouet de dessin à base de carreaux.",
    date: "17 juin 2026",
    readingTime: "8 min de lecture",
    title: "Douat : un alphabet de carreaux",
    lead: "En 1722, un frère carme écrivit un livre de 256 pages pour prouver qu'un seul carreau carré, mi-parti par une diagonale en deux couleurs, peut être transformé en lettres — et qu'avec quatre lettres seulement on peut écrire une infinité de motifs.",
    hHistory: "De Truchet à Douat",
    pHistory: [
      "L'histoire commence avec Sébastien Truchet, frère dominicain, ingénieur du roi et membre de l'Académie Royale des Sciences. Vers 1704, en faisant l'inventaire de carreaux de faïence, il remarqua qu'un carreau carré partagé en diagonale en une moitié sombre et une moitié claire est bien plus riche qu'il n'y paraît : qu'on le tourne et il devient quatre carreaux différents, et posés bord à bord ils produisent une étonnante variété de motifs. Il consigna l'observation dans un court mémoire pour l'Académie.",
      "Truchet ne développa jamais l'idée en un livre. Ce fut l'œuvre de Dominique Douat, carme de la Province de Toulouse, qui prit le mémoire de Truchet comme point de départ et le poussa aussi loin que possible. Sa Méthode pour faire une infinité de desseins différens, de 1722, est en fait le premier traité combinatoire complet sur ce que nous appelons aujourd'hui les carreaux de Truchet — avec 72 desseins gravés, des tables de permutations et une recette pour construire n'importe quel motif de zéro.",
      "Le livre porte les approbations des plus grands mathématiciens de l'époque — Fontenelle et Varignon parmi eux — et est dédié à un président de l'Académie de Montpellier. Deux frères, une seule ligne diagonale et toute la machinerie de la combinatoire du XVIIIe siècle : telle est l'origine improbable d'un système auquel les artistes génératifs ont encore recours aujourd'hui.",
    ],
    hTile: "Un carreau, quatre orientations",
    pTile: [
      "Tout se construit à partir d'un seul carreau carré, mi-parti — partagé en deux par une diagonale — une moitié colorée, l'autre blanche. Comme un carré a quatre coins, l'angle coloré peut pointer vers n'importe lequel d'entre eux. Douat donne à chacune de ces quatre orientations une lettre, nommée d'après le coin où se trouve l'angle coloré :",
      "Voilà tout l'alphabet. A, c'est l'angle coloré en bas à gauche, B en haut à gauche, C en haut à droite, D en bas à droite. Une fois que l'on distingue A, B, C et D, on peut lire — et écrire — chaque dessein du livre sans jamais regarder un dessin.",
    ],
    hAlphabet: "Un alphabet de motifs",
    pAlphabet: [
      "L'intuition de Douat, c'est que les lettres sont une notation. Prenez les quatre carreaux quatre à quatre, répétitions permises, et vous obtenez 4 × 4 × 4 × 4 = 256 petits arrangements de deux sur deux — sa quatrième table. Répétez et combinez ceux-là, rangée après rangée, et le compte explose : il calcule patiemment le nombre de desseins réalisables en prenant les 256 deux à deux, trois à trois, quatre à quatre… et les totaux atteignent des dizaines de chiffres.",
      "Il aimait cette disproportion entre des moyens minuscules et des résultats sans limite, et recourait à des analogies : les mathématiques naissent d'un seul point, l'arithmétique de neuf chiffres, la musique de sept notes, et les vingt-quatre lettres de l'alphabet épellent plus de mots qu'il n'y a eu d'instants depuis la création du monde. Quatre carreaux, soutient-il, ne sont pas différents — ils épellent une infinité de desseins.",
      "Et comme les motifs sont écrits en lettres, les gravures deviennent inutiles. En ne connaissant que A, B, C et D, on peut disposer des carreaux de carton et reproduire n'importe quel dessein — « sans étude », comme il le dit.",
    ],
    demoIntro:
      "Lisez la grille de lettres à gauche ; construisez les carreaux qu'elle nomme ; et vous obtenez l'image à droite. Voici le dessein 1 de sa table finale :",
    demoCaption:
      "Des lettres en entrée, un motif en sortie — toute l'idée dans une petite grille.",
    hOpposites: "Opposés : diagonal, horizontal, perpendiculaire",
    pOpposites: [
      "Les lettres rendent aussi les symétries faciles à calculer. Douat note que A et C (et B et D) sont opposés en diagonale — ils échangent le noir et le blanc. A et D (et B et C) sont opposés horizontalement — la gauche pour la droite. A et B (et C et D) sont opposés perpendiculairement — le haut pour le bas.",
      "Ainsi, de n'importe quel dessein on obtient aussitôt trois autres, rien qu'en échangeant des lettres. Une page entière de son livre est consacrée à ces oppositions, transformant un motif en quatre sans rien dessiner.",
    ],
    hCarousel: "Les 72 desseins, écrits en lettres",
    pCarousel: [
      "Voici les soixante-douze desseins gravés de Douat — mais pas les gravures. Chacun a été transcrit de ses grilles de lettres et rendu en direct, dans votre navigateur, à partir de rien d'autre que A, B, C et D. Utilisez les flèches (ou le clavier) pour les feuilleter, exactement comme un lecteur de 1722 aurait pu les construire carreau par carreau.",
    ],
    carouselTitle: "Les Desseins de Douat — rendus à partir de leurs lettres",
    carouselEmpty:
      "Les desseins sont en cours de transcription depuis le livre ; revenez bientôt.",
    flipHint: "Cliquez sur le dessein pour le retourner et lire ses lettres.",
    flipLabel: "Retourner le dessein pour voir ses lettres",
    colorLabel: "Couleur du carreau",
    backgroundLabel: "Fond",
    hMore: "La table des 256",
    pMorePre:
      "Le livre se termine par une table dense de 256 petits desseins distincts, conçue comme un dictionnaire de centres et de coins pour en bâtir de plus grands. Nous l'avons recréée en pièce d'accompagnement — ",
    pMoreLink: "la table des 256 desseins de Douat",
    pMorePost: ".",
    relatedPre: "Pour l'histoire plus longue du carreau lui-même, voir ",
    relatedLink: "Le pavage Truchet : de 1704 aux motifs infinis",
    relatedPost: ".",
    cta: "Ouvrir Patchwork →",
  },
};

export default function DouatArticle() {
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
            href={`${code === "en" ? "" : `/${code}`}/articles/douat`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles/douat"
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
            {/* History */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hHistory}</h2>
              {c.pHistory.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
            </section>

            {/* The tile + legend */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hTile}</h2>
              <p className={paragraph}>{c.pTile[0]}</p>
              <DouatAlphabetFigure {...douatAlphabetLegendCopy[lang]} />
              <p className={paragraph}>{c.pTile[1]}</p>
            </section>

            {/* Alphabet / combinatorics */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hAlphabet}</h2>
              {c.pAlphabet.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}

              <p className={paragraph}>{c.demoIntro}</p>
              <figure className="my-6">
                <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl bg-slate-800 p-6">
                  <pre className="text-sm leading-relaxed text-teal-300 font-mono">
                    {DEMO_GRID.map((row) => row.join(" ")).join("\n")}
                  </pre>
                  <span className="text-2xl text-zinc-500" aria-hidden>
                    →
                  </span>
                  <DouatPatternSVG
                    grid={DEMO_GRID}
                    cellPx={40}
                    title="Design 1"
                    className="w-40 rounded-md"
                  />
                </div>
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.demoCaption}
                </figcaption>
              </figure>
            </section>

            {/* Opposites */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hOpposites}</h2>
              {c.pOpposites.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
            </section>

            {/* Carousel */}
            <section>
              <h2
                id="the-72-designs-written-in-letters"
                className="text-2xl font-semibold mb-4 scroll-mt-24"
              >
                {c.hCarousel}
              </h2>
              {c.pCarousel.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
              <figure className="my-6">
                {douatPlates.length > 0 ? (
                  <DouatCarousel
                    patterns={douatPlates}
                    title={c.carouselTitle}
                    cellPx={24}
                    initialPatternId={38}
                    flipHint={c.flipHint}
                    flipLabel={c.flipLabel}
                    colorLabels={{
                      color: c.colorLabel,
                      background: c.backgroundLabel,
                    }}
                  />
                ) : (
                  <div className="rounded-xl bg-slate-800 p-8 text-center text-sm text-zinc-400">
                    {c.carouselEmpty}
                  </div>
                )}
              </figure>
            </section>

            {/* More: table of 256 + related */}
            <section className="rounded-xl bg-slate-800 p-8 my-10">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {c.hMore}
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                {c.pMorePre}
                <Link
                  href="/articles/douat-256-designs"
                  className="text-teal-400 hover:underline"
                >
                  {c.pMoreLink}
                </Link>
                {c.pMorePost}
              </p>
              <p className="text-zinc-300 leading-relaxed mb-5">
                {c.relatedPre}
                <Link
                  href="/articles/truchet-tiling"
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
