import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import frMessages from "../../../messages/fr.json";

const T = {
  // "diagonals" group — Truchet original (1704)
  d0: "›", // id 8250 — diagonal NW→SE orientation 0
  d1: "œ", // id 339  — diagonal NE→SW orientation 1
  d2: "", // id 157  — diagonal SE→NW orientation 2
  d3: "", // id 158  — diagonal SW→NE orientation 3
  // "smith arcs" group — Smith (1987) curved Truchet
  c0: "\u{E000}", // S-shape: top-right arc + bottom-left arc
  c1: "\u{E001}", // reverse-S: top-left arc + bottom-right arc
  // Smith straight double-band variant
  l0: "\u{E012}", // straight S: top-right band + bottom-left band
  l1: "\u{E013}", // straight reverse-S: top-left band + bottom-right band
  // Smith single-diagonal variant
  s0: "\u{E004}", // slash diagonal
  s1: "\u{E005}", // backslash diagonal
};

// Static patterns for article illustrations
const TRUCHET_REGULAR_SAMPLE = [
  [T.d3, T.d2, T.d0, T.d1, T.d3, T.d2, T.d0, T.d1, T.d3, T.d2],
  [T.d1, T.d0, T.d2, T.d3, T.d1, T.d0, T.d2, T.d3, T.d1, T.d0],
  [T.d0, T.d1, T.d3, T.d2, T.d0, T.d1, T.d3, T.d2, T.d0, T.d1],
  [T.d2, T.d3, T.d1, T.d0, T.d2, T.d3, T.d1, T.d0, T.d2, T.d3],
  [T.d3, T.d2, T.d0, T.d1, T.d3, T.d2, T.d0, T.d1, T.d3, T.d2],
  [T.d1, T.d0, T.d2, T.d3, T.d1, T.d0, T.d2, T.d3, T.d1, T.d0],
  [T.d0, T.d1, T.d3, T.d2, T.d0, T.d1, T.d3, T.d2, T.d0, T.d1],
  [T.d2, T.d3, T.d1, T.d0, T.d2, T.d3, T.d1, T.d0, T.d2, T.d3],
  [T.d3, T.d2, T.d0, T.d1, T.d3, T.d2, T.d0, T.d1, T.d3, T.d2],
  [T.d1, T.d0, T.d2, T.d3, T.d1, T.d0, T.d2, T.d3, T.d1, T.d0],
];

const TRUCHET_DIAMOND_SAMPLE = [
  [T.d0, T.d1, T.d1, T.d0, T.d0, T.d1, T.d1, T.d0, T.d0, T.d1],
  [T.d2, T.d3, T.d3, T.d2, T.d2, T.d3, T.d3, T.d2, T.d2, T.d3],
  [T.d2, T.d3, T.d3, T.d2, T.d2, T.d3, T.d3, T.d2, T.d2, T.d3],
  [T.d0, T.d1, T.d1, T.d0, T.d0, T.d1, T.d1, T.d0, T.d0, T.d1],
  [T.d0, T.d1, T.d1, T.d0, T.d0, T.d1, T.d1, T.d0, T.d0, T.d1],
  [T.d2, T.d3, T.d3, T.d2, T.d2, T.d3, T.d3, T.d2, T.d2, T.d3],
  [T.d2, T.d3, T.d3, T.d2, T.d2, T.d3, T.d3, T.d2, T.d2, T.d3],
  [T.d0, T.d1, T.d1, T.d0, T.d0, T.d1, T.d1, T.d0, T.d0, T.d1],
  [T.d0, T.d1, T.d1, T.d0, T.d0, T.d1, T.d1, T.d0, T.d0, T.d1],
  [T.d2, T.d3, T.d3, T.d2, T.d2, T.d3, T.d3, T.d2, T.d2, T.d3],
];

const TRUCHET_RANDOM_SAMPLE = [
  [T.d0, T.d3, T.d1, T.d0, T.d2, T.d1, T.d3, T.d0, T.d2, T.d1],
  [T.d2, T.d0, T.d3, T.d1, T.d1, T.d2, T.d0, T.d3, T.d0, T.d2],
  [T.d1, T.d2, T.d0, T.d3, T.d0, T.d3, T.d2, T.d1, T.d3, T.d0],
  [T.d3, T.d1, T.d2, T.d0, T.d3, T.d0, T.d1, T.d2, T.d1, T.d3],
  [T.d0, T.d2, T.d3, T.d1, T.d2, T.d1, T.d0, T.d3, T.d2, T.d0],
  [T.d1, T.d0, T.d2, T.d3, T.d0, T.d2, T.d3, T.d1, T.d0, T.d2],
  [T.d2, T.d3, T.d0, T.d1, T.d3, T.d1, T.d2, T.d0, T.d3, T.d1],
  [T.d3, T.d0, T.d1, T.d2, T.d1, T.d3, T.d0, T.d2, T.d1, T.d0],
  [T.d0, T.d1, T.d3, T.d0, T.d2, T.d0, T.d1, T.d3, T.d2, T.d1],
  [T.d2, T.d0, T.d1, T.d3, T.d1, T.d2, T.d0, T.d1, T.d3, T.d0],
];

const SMITH_BITS = [
  [0, 1, 1, 0, 1, 0, 0, 1, 1, 0],
  [1, 0, 1, 1, 0, 0, 1, 0, 1, 0],
  [0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 1, 0, 0, 1, 0, 1, 1, 0, 0],
  [0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 0, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 1, 0, 0, 1, 0, 1],
];

function mapBitsToTiles(bits: number[][], zeroTile: string, oneTile: string) {
  return bits.map((row) => row.map((bit) => (bit === 0 ? zeroTile : oneTile)));
}

const SMITH_ARCS_SAMPLE = mapBitsToTiles(SMITH_BITS, T.c0, T.c1);
const SMITH_LINES_SAMPLE = mapBitsToTiles(SMITH_BITS, T.l0, T.l1);
const SMITH_DIAGONAL_SAMPLE = mapBitsToTiles(SMITH_BITS, T.s0, T.s1);

// Same rendering technique as Canvas/components/Cell.tsx:
// outer div resets font-size to 1px; inner span uses fontSize = cellPx * (57/40)
// so the glyph fills the cell exactly, clipped by overflow-hidden.
function TileCell({
  ch,
  color,
  cellPx,
  fontClass = "tile",
}: {
  ch: string;
  color: string;
  cellPx: number;
  fontClass?: "tile" | "smith-tile";
}) {
  const fontPx = Math.round((cellPx * 57) / 40);
  return (
    <div
      className={`${fontClass} ${color} flex items-center justify-center overflow-hidden`}
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
  fontClass = "tile",
}: {
  grid: string[][];
  color?: string;
  bg?: string;
  cellPx?: number;
  fontClass?: "tile" | "smith-tile";
}) {
  return (
    <div
      className={`inline-grid ${bg} select-none`}
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, ${cellPx}px)`,
        gridAutoRows: `${cellPx}px`,
      }}
    >
      {grid.map((row, r) =>
        row.map((ch, c) => (
          <TileCell
            key={`${r}-${c}`}
            ch={ch}
            color={color}
            cellPx={cellPx}
            fontClass={fontClass}
          />
        )),
      )}
    </div>
  );
}

function TileShowcase({
  tiles,
  color = "text-teal-400",
  bg = "bg-slate-800",
  cellPx = 56,
  fontClass = "tile",
}: {
  tiles: string[];
  color?: string;
  bg?: string;
  cellPx?: number;
  fontClass?: "tile" | "smith-tile";
}) {
  return (
    <div className="flex gap-2">
      {tiles.map((ch, i) => (
        <div key={i} className={bg}>
          <TileCell
            ch={ch}
            color={color}
            cellPx={cellPx}
            fontClass={fontClass}
          />
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
    s2caption:
      "The four orientations of the original Truchet tile (diagonals group in Patchwork)",
    s2pattern:
      "Like the classic examples, the same tile can produce an orderly scheme or a random placement:",
    s2regularPatternCaption:
      "10×10 radial scheme using Truchet's diagonal tiles",
    s2diamondPatternCaption:
      "10×10 diamond scheme using Truchet's diagonal tiles",
    s2randomPatternCaption:
      "10×10 random placement using Truchet's diagonal tiles",

    s3h: "Smith's curved simplification (1987)",
    s3: [
      "Nearly three centuries later, historian of materials science Cyril Stanley Smith revisited Truchet tiling in his 1987 article 'The tiling patterns of Sebastien Truchet and the topology of structural hierarchy.' Smith's curved tile is not the generic one-corner quarter-circle often shown in Truchet examples: it carries two quarter-circle arcs at opposite corners, so all four edge midpoints are connected.",
      "This small change has a dramatic visual effect. Where the original Truchet tiles produce angular geometric patterns, Smith's paired arcs generate flowing labyrinthine forms — paths that wind continuously across the plane without ever crossing themselves. Patchwork uses the two true Smith arc orientations.",
    ],
    s3caption:
      "The two true Smith arc tiles: paired quarter-circles at opposite corners",
    s3pattern:
      "In random placement, the two orientations create continuous maze-like curves. The same placement can be rendered as curved arcs, as Smith's straight double-band variant, or as the single-diagonal labyrinth form:",
    s3arcPatternCaption:
      "10×10 random placement using Smith's paired-arc tiles",
    s3linePatternCaption:
      "The same placement using Smith's thick straight double-band tiles",
    s3diagonalPatternCaption:
      "The same placement using Smith's thin single-diagonal labyrinth tiles",

    s4h: "Why the randomness works",
    s4: "The Smith arc and double-band forms have only two states, but each state connects all four edge midpoints: top to one side and bottom to the other, in opposite pairings. Because every edge midpoint still meets a midpoint in the neighboring square, random choices do not break the drawing. They change the routing of the continuous curves. The single-diagonal version works differently: it leaves separated walls and corridors, producing the classic diagonal Truchet labyrinth.",

    s5h: "Create your own patterns",
    s5: [
      "One of the remarkable properties of Truchet tiling is that even a random arrangement of tiles (each orientation chosen by coin-flip) produces a visually coherent pattern. There is no 'wrong' placement — every configuration is interesting. This makes it an ideal generative design system: the rules are minimal, but the output space is vast.",
      "Patchwork gives you Truchet's diagonal tiles and Smith's paired arc tiles, plus many more related block families, with full control over color, layering, and composition. Open the app and explore: pick the diagonals or the Smith arcs from the tile panel and start placing them on the canvas.",
    ],
    cta: "Open Patchwork and start tiling",

    s6h: "Mathematical properties",
    s6: "Truchet tilings belong to a class of aperiodic-capable tilings — configurations that can fill the plane without repeating in a strict periodic pattern. Unlike a regular grid, a random Truchet tiling has no translational symmetry: you cannot shift the entire pattern by any fixed vector and have it look the same. This makes Truchet tilings useful in cryptography, texture generation, and generative art, where non-repetition is a virtue.",

    footer: "Illustrated with Patchwork tiles.",
  },

  es: {
    metaTitle:
      "El mosaico Truchet: de 1704 a los patrones infinitos — Patchwork",
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
    s2caption:
      "Las cuatro orientaciones del mosaico Truchet original (grupo 'diagonals' en Patchwork)",
    s2pattern:
      "Como en los ejemplos clásicos, el mismo mosaico puede producir un esquema ordenado o una colocación al azar:",
    s2regularPatternCaption:
      "Esquema radial 10×10 con los mosaicos diagonales de Truchet",
    s2diamondPatternCaption:
      "Esquema de diamantes 10×10 con los mosaicos diagonales de Truchet",
    s2randomPatternCaption:
      "Colocación al azar 10×10 con los mosaicos diagonales de Truchet",

    s3h: "La simplificación curva de Smith (1987)",
    s3: [
      "Casi tres siglos después, el historiador de ciencia de materiales Cyril Stanley Smith revisó el mosaico Truchet en su artículo de 1987 'The tiling patterns of Sebastien Truchet and the topology of structural hierarchy'. El mosaico curvo de Smith no es el cuarto de círculo genérico de una sola esquina que suele aparecer en ejemplos de Truchet: lleva dos arcos de cuarto de círculo en esquinas opuestas, de modo que conecta los cuatro puntos medios de los bordes.",
      "Este pequeño cambio tiene un efecto visual dramático. Mientras los mosaicos originales de Truchet producen patrones geométricos angulares, los arcos emparejados de Smith generan formas laberínticas fluidas — caminos que serpentean continuamente por el plano sin cruzarse nunca. Patchwork usa las dos orientaciones verdaderas de los arcos de Smith.",
    ],
    s3caption:
      "Los dos mosaicos verdaderos de Smith: cuartos de círculo emparejados en esquinas opuestas",
    s3pattern:
      "En una colocación aleatoria, las dos orientaciones crean curvas continuas con aspecto de laberinto. La misma colocación puede verse como arcos curvos, como la variante Smith de doble banda recta o como el laberinto de diagonales simples:",
    s3arcPatternCaption:
      "Colocación al azar 10×10 con los arcos Smith emparejados",
    s3linePatternCaption:
      "La misma colocación con los mosaicos Smith gruesos de doble banda recta",
    s3diagonalPatternCaption:
      "La misma colocación con los mosaicos Smith finos de laberinto diagonal simple",

    s4h: "Por qué funciona el azar",
    s4: "Las formas Smith de arco y doble banda tienen solo dos estados, pero cada estado conecta los cuatro puntos medios de los bordes: arriba con un lado y abajo con el otro, en emparejamientos opuestos. Como cada punto medio sigue encontrando un punto medio en el cuadrado vecino, las elecciones aleatorias no rompen el dibujo. Cambian el recorrido de las curvas continuas. La versión de diagonal simple funciona de otra manera: deja muros y pasillos separados, produciendo el laberinto diagonal clásico de Truchet.",

    s5h: "Crea tus propios patrones",
    s5: [
      "Una de las propiedades notables del mosaico Truchet es que incluso una disposición aleatoria de mosaicos (con cada orientación elegida al azar) produce un patrón visualmente coherente. No existe una 'mala' colocación: toda configuración es interesante. Esto lo convierte en un sistema de diseño generativo ideal: las reglas son mínimas, pero el espacio de resultados es enorme.",
      "Patchwork te ofrece los mosaicos diagonales de Truchet y los arcos emparejados de Smith, además de muchas familias de bloques relacionadas, con control total sobre el color, las capas y la composición. Abre la aplicación y explora: elige las diagonales o los arcos Smith del panel de mosaicos y empieza a colocarlos en el lienzo.",
    ],
    cta: "Abrir Patchwork y empezar a crear",

    s6h: "Propiedades matemáticas",
    s6: "Los mosaicos Truchet pertenecen a una clase de pavimentos con capacidad aperiódica — configuraciones que pueden cubrir el plano sin repetirse con un patrón periódico estricto. A diferencia de una cuadrícula regular, un mosaico Truchet aleatorio no tiene simetría traslacional: no puedes desplazar todo el patrón por ningún vector fijo y obtener el mismo aspecto. Esto hace que los mosaicos Truchet sean útiles en criptografía, generación de texturas y arte generativo, donde la no repetición es una virtud.",

    footer: "Ilustrado con mosaicos de Patchwork.",
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
    s2caption:
      "Les quatre orientations du carreau Truchet original (groupe 'diagonals' dans Patchwork)",
    s2pattern:
      "Comme dans les exemples classiques, le même carreau peut produire un schéma ordonné ou un placement aléatoire :",
    s2regularPatternCaption:
      "Schéma radial 10×10 avec les carreaux diagonaux de Truchet",
    s2diamondPatternCaption:
      "Schéma en losanges 10×10 avec les carreaux diagonaux de Truchet",
    s2randomPatternCaption:
      "Placement aléatoire 10×10 avec les carreaux diagonaux de Truchet",

    s3h: "La simplification courbe de Smith (1987)",
    s3: [
      "Près de trois siècles plus tard, l'historien des sciences des matériaux Cyril Stanley Smith revisita le pavage Truchet dans son article de 1987 'The tiling patterns of Sebastien Truchet and the topology of structural hierarchy'. Le carreau courbe de Smith n'est pas le quart de cercle générique à un seul coin que l'on voit souvent dans les exemples Truchet : il porte deux quarts de cercle dans des coins opposés, reliant ainsi les quatre milieux des côtés.",
      "Ce petit changement a un effet visuel dramatique. Là où les carreaux Truchet originaux produisent des motifs géométriques angulaires, les arcs appariés de Smith génèrent des formes labyrinthiques fluides — des chemins qui serpentent continuellement sur le plan sans jamais se croiser. Patchwork utilise les deux vraies orientations des arcs de Smith.",
    ],
    s3caption:
      "Les deux vrais carreaux de Smith : quarts de cercle appariés dans des coins opposés",
    s3pattern:
      "Dans un placement aléatoire, les deux orientations créent des courbes continues d'allure labyrinthique. Le même placement peut être rendu en arcs courbes, avec la variante Smith à double bande droite, ou avec la forme labyrinthique à diagonale simple :",
    s3arcPatternCaption:
      "Placement aléatoire 10×10 avec les arcs Smith appariés",
    s3linePatternCaption:
      "Le même placement avec les carreaux Smith épais à double bande droite",
    s3diagonalPatternCaption:
      "Le même placement avec les carreaux Smith fins du labyrinthe à diagonale simple",

    s4h: "Pourquoi le hasard fonctionne",
    s4: "Les formes Smith en arc et à double bande n'ont que deux états, mais chaque état relie les quatre milieux des côtés : le haut avec un côté et le bas avec l'autre, selon des appariements opposés. Comme chaque milieu rencontre toujours un milieu dans le carré voisin, les choix aléatoires ne cassent pas le dessin. Ils changent le cheminement des courbes continues. La version à diagonale simple fonctionne autrement : elle laisse des murs et des couloirs séparés, produisant le labyrinthe diagonal classique de Truchet.",

    s5h: "Créez vos propres motifs",
    s5: [
      "L'une des propriétés remarquables du pavage Truchet est que même un arrangement aléatoire de carreaux (chaque orientation choisie par tirage au sort) produit un motif visuellement cohérent. Il n'y a pas de 'mauvais' placement — chaque configuration est intéressante. Cela en fait un système de design génératif idéal : les règles sont minimales, mais l'espace des résultats est vaste.",
      "Patchwork vous offre les carreaux diagonaux de Truchet et les arcs appariés de Smith, ainsi que de nombreuses familles de blocs apparentées, avec un contrôle total sur la couleur, les calques et la composition. Ouvrez l'application et explorez : choisissez les diagonales ou les arcs Smith dans le panneau de carreaux et commencez à les placer sur le canevas.",
    ],
    cta: "Ouvrir Patchwork et commencer à paver",

    s6h: "Propriétés mathématiques",
    s6: "Les pavages Truchet appartiennent à une classe de pavages à capacité apériodique — des configurations qui peuvent couvrir le plan sans se répéter selon un motif périodique strict. Contrairement à une grille régulière, un pavage Truchet aléatoire n'a pas de symétrie de translation : vous ne pouvez pas déplacer tout le motif d'un vecteur fixe quelconque et obtenir le même aspect. Cela rend les pavages Truchet utiles en cryptographie, en génération de textures et en art génératif, où la non-répétition est une vertu.",

    footer: "Illustré avec des carreaux Patchwork.",
  },
};

const messagesByLocale = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
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
                <p
                  key={i}
                  className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4"
                >
                  {p}
                </p>
              ))}
            </section>

            {/* Section 2 — Original 4 tiles */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s2h}</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                {c.s2}
              </p>

              <figure className="my-4">
                <TileShowcase tiles={[T.d0, T.d1, T.d2, T.d3]} />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2caption}
                </figcaption>
              </figure>

              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                {c.s2pattern}
              </p>

              <figure className="my-4">
                <TileGrid grid={TRUCHET_REGULAR_SAMPLE} />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2regularPatternCaption}
                </figcaption>
              </figure>

              <figure className="my-4">
                <TileGrid
                  grid={TRUCHET_DIAMOND_SAMPLE}
                  color="text-emerald-400"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2diamondPatternCaption}
                </figcaption>
              </figure>

              <figure className="my-4">
                <TileGrid grid={TRUCHET_RANDOM_SAMPLE} color="text-sky-400" />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2randomPatternCaption}
                </figcaption>
              </figure>
            </section>

            {/* Section 3 — Smith tiles */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s3h}</h2>
              {c.s3.map((p, i) => (
                <p
                  key={i}
                  className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4"
                >
                  {p}
                </p>
              ))}

              <figure className="my-4">
                <TileShowcase tiles={[T.c0, T.c1]} fontClass="smith-tile" />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s3caption}
                </figcaption>
              </figure>

              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                {c.s3pattern}
              </p>

              <figure className="my-4">
                <TileGrid grid={SMITH_ARCS_SAMPLE} fontClass="smith-tile" />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s3arcPatternCaption}
                </figcaption>
              </figure>

              <figure className="my-4">
                <TileGrid
                  grid={SMITH_LINES_SAMPLE}
                  fontClass="smith-tile"
                  color="text-sky-400"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s3linePatternCaption}
                </figcaption>
              </figure>

              <figure className="my-4">
                <TileGrid
                  grid={SMITH_DIAGONAL_SAMPLE}
                  fontClass="smith-tile"
                  color="text-yellow-400"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s3diagonalPatternCaption}
                </figcaption>
              </figure>
            </section>

            {/* Section 4 — Random placement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s4h}</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {c.s4}
              </p>
            </section>

            {/* Section 5 — CTA */}
            <section className="rounded-xl bg-slate-800 p-8 my-10">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {c.s5h}
              </h2>
              {c.s5.map((p, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed mb-4">
                  {p}
                </p>
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
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {c.s6}
              </p>
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
    messages:
      messagesByLocale[(locale ?? "en") as keyof typeof messagesByLocale] ??
      enMessages,
  },
});
