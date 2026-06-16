import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import frMessages from "../../../messages/fr.json";

// Accent hues already used across Patchwork articles (Tailwind teal/emerald/sky/yellow).
// Kept as hex here because SVG fills/strokes cannot use Tailwind text classes.
const ACCENT = {
  teal: "#2dd4bf",
  emerald: "#34d399",
  sky: "#38bdf8",
  yellow: "#facc15",
};
const SLATE_700 = "#334155";

// Small deterministic PRNG (mulberry32) so server and client render identical
// markup — same spirit as the static *_SAMPLE arrays in truchet-tiling.tsx.
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function FigureFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block rounded-lg bg-slate-800 p-3 select-none">
      {children}
    </div>
  );
}

// ── A. Multiscale Truchet ─────────────────────────────────────────────
// A square recursively subdivided into quadrants; each leaf carries a
// Smith-style two-arc Truchet tile. Arc colour tracks the subdivision
// depth, so the different scales read as foreground/background layers.
function leafArcs(
  x: number,
  y: number,
  s: number,
  orient: number,
  color: string,
  key: string,
) {
  const r = s / 2;
  const sw = Math.max(1.5, s * 0.16);
  const d =
    orient === 0
      ? [
          `M ${x + r} ${y} A ${r} ${r} 0 0 0 ${x} ${y + r}`,
          `M ${x + s} ${y + r} A ${r} ${r} 0 0 0 ${x + r} ${y + s}`,
        ]
      : [
          `M ${x + r} ${y} A ${r} ${r} 0 0 0 ${x + s} ${y + r}`,
          `M ${x} ${y + r} A ${r} ${r} 0 0 0 ${x + r} ${y + s}`,
        ];
  return d.map((path, i) => (
    <path
      key={`${key}-${i}`}
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
    />
  ));
}

function MultiscaleTruchet({ seed = 7, size = 360 }: { seed?: number; size?: number }) {
  const rand = mulberry32(seed);
  const depthColors = [ACCENT.teal, ACCENT.emerald, ACCENT.sky, ACCENT.yellow];
  const nodes: React.ReactNode[] = [];

  const build = (x: number, y: number, s: number, depth: number) => {
    // Always split the first level; deeper levels split with decreasing odds.
    const split = depth < 1 || (depth < 3 && rand() < 0.62 - depth * 0.12);
    if (split) {
      const h = s / 2;
      build(x, y, h, depth + 1);
      build(x + h, y, h, depth + 1);
      build(x, y + h, h, depth + 1);
      build(x + h, y + h, h, depth + 1);
    } else {
      const orient = rand() > 0.5 ? 1 : 0;
      const color = depthColors[Math.min(depth, depthColors.length - 1)];
      nodes.push(...leafArcs(x, y, s, orient, color, `${x}-${y}-${s}`));
    }
  };

  build(0, 0, size, 0);

  return (
    <FigureFrame>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {nodes}
      </svg>
    </FigureFrame>
  );
}

// ── B. Truchet quilting ───────────────────────────────────────────────
// A grid of half-square-triangle blocks: each cell is a background square
// with one corner triangle in an accent "fabric", randomly oriented.
function SquareTruchetQuilt({
  seed = 11,
  cols = 12,
  rows = 10,
  cell = 30,
}: {
  seed?: number;
  cols?: number;
  rows?: number;
  cell?: number;
}) {
  const rand = mulberry32(seed);
  const fabrics = [ACCENT.teal, ACCENT.emerald, ACCENT.sky];
  const w = cols * cell;
  const h = rows * cell;
  const cells: React.ReactNode[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell;
      const y = r * cell;
      const orient = Math.floor(rand() * 4);
      const fabric = fabrics[Math.floor(rand() * fabrics.length)];
      const corners: Record<number, string> = {
        0: `${x},${y} ${x + cell},${y} ${x},${y + cell}`,
        1: `${x},${y} ${x + cell},${y} ${x + cell},${y + cell}`,
        2: `${x + cell},${y} ${x + cell},${y + cell} ${x},${y + cell}`,
        3: `${x},${y} ${x + cell},${y + cell} ${x},${y + cell}`,
      };
      cells.push(
        <polygon key={`${r}-${c}`} points={corners[orient]} fill={fabric} />,
      );
    }
  }

  return (
    <FigureFrame>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x={0} y={0} width={w} height={h} fill={SLATE_700} />
        {cells}
      </svg>
    </FigureFrame>
  );
}

// ── D. Hexagonal Truchet ──────────────────────────────────────────────
// Flat-top hexagons whose six edge-midpoint "gates" are joined by arcs.
// Two rotation states route the gates differently, producing fluid mazes.
function hexGeometry(cx: number, cy: number, R: number) {
  const vertices: [number, number][] = [];
  const mids: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const av = (Math.PI / 180) * (60 * i);
    vertices.push([cx + R * Math.cos(av), cy + R * Math.sin(av)]);
    const am = (Math.PI / 180) * (30 + 60 * i);
    const apothem = R * Math.cos(Math.PI / 6);
    mids.push([cx + apothem * Math.cos(am), cy + apothem * Math.sin(am)]);
  }
  return { vertices, mids };
}

function HexTruchet({
  seed = 5,
  R = 34,
  width = 384,
  height = 312,
}: {
  seed?: number;
  R?: number;
  width?: number;
  height?: number;
}) {
  const rand = mulberry32(seed);
  const dx = 1.5 * R;
  const dy = Math.sqrt(3) * R;
  const arcs: React.ReactNode[] = [];

  for (let col = 0; col * dx < width + R; col++) {
    for (let row = 0; row * dy < height + R; row++) {
      const cx = col * dx + R * 0.5;
      const cy = row * dy + (col % 2 ? dy / 2 : 0) + R * 0.5;
      const { vertices, mids } = hexGeometry(cx, cy, R);
      const state = rand() > 0.5 ? 1 : 0;
      // Pair adjacent edges; the shared vertex is the arc's control point.
      const pairs =
        state === 0
          ? [
              [0, 1],
              [2, 3],
              [4, 5],
            ]
          : [
              [1, 2],
              [3, 4],
              [5, 0],
            ];
      pairs.forEach(([a, b], i) => {
        const [mx, my] = mids[a];
        const [nx, ny] = mids[b];
        const [vx, vy] = vertices[b]; // vertex shared by edges a and b
        arcs.push(
          <path
            key={`${col}-${row}-${i}`}
            d={`M ${mx} ${my} Q ${vx} ${vy} ${nx} ${ny}`}
            fill="none"
            stroke={ACCENT.teal}
            strokeWidth={3}
            strokeLinecap="round"
          />,
        );
      });
    }
  }

  return (
    <FigureFrame>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block" }}
      >
        {arcs}
      </svg>
    </FigureFrame>
  );
}

// p5.js example shown verbatim in every locale (only the surrounding prose
// is translated). Demonstrates the core "if random > 0.5, rotate" logic.
const CODE_P5 = `function setup() {
  createCanvas(600, 600);
  noLoop();
  const t = 40; // tile size

  for (let y = 0; y < height; y += t) {
    for (let x = 0; x < width; x += t) {
      push();
      translate(x + t / 2, y + t / 2);

      // The whole trick: flip a coin, maybe rotate 90 degrees
      if (random() > 0.5) rotate(HALF_PI);

      // Two quarter-circle arcs at opposite corners
      noFill();
      stroke(45, 212, 191);
      strokeWeight(t / 6);
      arc(-t / 2, -t / 2, t, t, 0, HALF_PI);
      arc( t / 2,  t / 2, t, t, PI, PI + HALF_PI);
      pop();
    }
  }
}`;

const content = {
  en: {
    metaTitle: "Truchet in Practice: Multiscale, Quilts, and Code — Patchwork",
    metaDescription:
      "Beyond the classic square: multiscale Truchet patterns, Truchet quilting, the 'Hello World' of generative art in p5.js, and fluid hexagonal Truchet mazes — illustrated with Patchwork.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    date: "June 16, 2026",
    readingTime: "7 min read",
    title: "Truchet in Practice: Multiscale, Quilts, and Code",
    lead: "The classic square tile is only the beginning. Here are four directions the Truchet idea takes once it leaves the textbook — recursive multiscale patterns, fabric quilts, a few lines of generative code, and hexagonal mazes.",

    introPre: "This is the practical sequel to ",
    introLink: "our history of Truchet tiling",
    introPost:
      ". If you want the story of the 1704 friar and Cyril Stanley Smith's curved tiles first, start there — here we pick up where simple rules start producing surprisingly rich results.",

    s1h: "Multiscale Truchet: patterns within patterns",
    s1: [
      "Modern generative artists rarely stop at a single grid size. In multiscale Truchet patterns — popularized by Christopher Carlson in his 2018 Bridges paper — each square can be recursively subdivided into smaller sub-squares, and each of those can subdivide again. Tiles exist at every scale, related by powers of one half.",
      "The result feels organic, almost fractal: dense knots of small arcs sit beside large sweeping curves, and because the tiles are coloured by parity, each scale reads as foreground for the scale above it and background for the scale below. A handful of rules produces something that looks hand-composed.",
    ],
    s1cap:
      "A multiscale Truchet pattern: each square may subdivide into four, with arc colour tracking the subdivision depth",

    s2h: "From canvas to cloth: Truchet quilting",
    s2: [
      "Because this site is called Patchwork, the textile connection is irresistible — and it is a real one. The half-square-triangle block, a cornerstone of quilting, is simply a Truchet tile in fabric: a square split diagonally into two contrasting triangles. Sew a pile of them, lay them out with the rotations chosen at random, and a unique whole-quilt design emerges every single time.",
      "That is what makes Truchet ideal for quilters. A whole blanket can be built from just two or three basic blocks. There is no 'wrong' placement — every orientation joins cleanly with its neighbours — so a beginner can improvise an heirloom without a master plan. The randomness does the composing.",
    ],
    s2cap:
      "A Truchet quilt: half-square-triangle blocks in two or three 'fabrics', laid out at random",

    s3h: "The 'Hello World' of generative art",
    s3: [
      "For programmers, Truchet tiling is the canonical first sketch — the 'Hello World' of generative art. The entire idea fits in a double loop: walk a grid, and at each cell flip a coin to decide the tile's rotation. It is a few lines in p5.js, Processing, or Python, and it rewards you immediately with a pattern you would never draw by hand.",
      "The whole trick is the single line if (random() > 0.5) rotate(90°). Everything interesting — the winding paths, the emergent labyrinth — falls out of that one random choice repeated across the grid:",
    ],
    s3cap: "A minimal Smith-arc Truchet generator in p5.js",
    s3after:
      "Swap the two arcs for a single diagonal and you get the classic angular labyrinth; raise the grid resolution and the pattern grows denser without a single extra rule.",

    s4h: "Beyond the square: hexagonal Truchet",
    s4: [
      "Nothing requires the tiles to be squares. Hexagonal Truchet tiles place 'gates' at the midpoint of each of the six edges and connect them with arcs. With six edges instead of four there are far more ways to route the connections, so a hexagonal grid produces noticeably more variation than a square one.",
      "The payoff is flow. Where square tiles meet at right angles, hexagons meet at 120°, and the continuous curves bend more gently — the mazes that emerge look more fluid and natural, closer to river networks or marbled paper than to circuit boards.",
    ],
    s4cap:
      "A hexagonal Truchet tiling: edge-midpoint gates joined by arcs, each hexagon randomly rotated",

    s5h: "Try it yourself",
    s5: [
      "Patchwork already ships Truchet's diagonal tiles and Smith's paired arcs, alongside many related block families. Drop them on the canvas, pick your colours, and let random placement do the rest — the same principle behind every pattern above.",
      "Want to watch new patterns emerge at the click of a button?",
    ],
    interactiveLink: "Try the interactive tile-combinations generator",
    cta: "Open Patchwork and start tiling",

    footer:
      "Illustrated with SVG figures generated in the browser from a seeded random layout.",
  },

  es: {
    metaTitle:
      "Truchet en la práctica: multiescala, mantas y código — Patchwork",
    metaDescription:
      "Más allá del cuadrado clásico: patrones Truchet multiescala, quilting Truchet, el 'Hola Mundo' del arte generativo en p5.js y laberintos hexagonales fluidos — ilustrado con Patchwork.",
    backToArticles: "← Artículos",
    backToApp: "Abrir Patchwork →",
    date: "16 de junio de 2026",
    readingTime: "7 min de lectura",
    title: "Truchet en la práctica: multiescala, mantas y código",
    lead: "El mosaico cuadrado clásico es solo el comienzo. Aquí van cuatro direcciones que toma la idea de Truchet cuando sale del libro de texto — patrones multiescala recursivos, mantas de tela, unas pocas líneas de código generativo y laberintos hexagonales.",

    introPre: "Esta es la secuela práctica de ",
    introLink: "nuestra historia del mosaico Truchet",
    introPost:
      ". Si prefieres primero la historia del fraile de 1704 y los mosaicos curvos de Cyril Stanley Smith, empieza por ahí — aquí retomamos donde las reglas simples empiezan a producir resultados sorprendentemente ricos.",

    s1h: "Truchet multiescala: patrones dentro de patrones",
    s1: [
      "Los artistas generativos de hoy rara vez se quedan en un único tamaño de cuadrícula. En los patrones Truchet multiescala — popularizados por Christopher Carlson en su artículo de Bridges de 2018 — cada cuadrado puede subdividirse recursivamente en subcuadrados más pequeños, y cada uno de ellos volver a subdividirse. Los mosaicos existen a todas las escalas, relacionadas por potencias de un medio.",
      "El resultado se siente orgánico, casi fractal: nudos densos de arcos pequeños conviven con grandes curvas amplias, y como los mosaicos se colorean por paridad, cada escala se lee como figura respecto de la escala mayor y como fondo respecto de la menor. Un puñado de reglas produce algo que parece compuesto a mano.",
    ],
    s1cap:
      "Un patrón Truchet multiescala: cada cuadrado puede subdividirse en cuatro, con el color del arco según la profundidad de subdivisión",

    s2h: "Del lienzo a la tela: el quilting Truchet",
    s2: [
      "Como este sitio se llama Patchwork, la conexión textil es irresistible — y es real. El bloque de medio cuadrado-triángulo, piedra angular del quilting, no es más que un mosaico Truchet en tela: un cuadrado dividido en diagonal en dos triángulos contrastantes. Cose un montón, colócalos con las rotaciones elegidas al azar y surge un diseño de manta único cada vez.",
      "Eso es lo que hace a Truchet ideal para el patchwork. Una manta entera puede construirse con solo dos o tres bloques básicos. No existe una colocación 'incorrecta' — toda orientación encaja limpiamente con sus vecinas — así que cualquier principiante puede improvisar una pieza de herencia sin un plan maestro. El azar se encarga de la composición.",
    ],
    s2cap:
      "Una manta Truchet: bloques de medio cuadrado-triángulo en dos o tres 'telas', colocados al azar",

    s3h: "El 'Hola Mundo' del arte generativo",
    s3: [
      "Para quien programa, el mosaico Truchet es el primer boceto canónico — el 'Hola Mundo' del arte generativo. Toda la idea cabe en un doble bucle: recorre una cuadrícula y, en cada celda, lanza una moneda para decidir la rotación del mosaico. Son unas pocas líneas en p5.js, Processing o Python, y te recompensa al instante con un patrón que jamás dibujarías a mano.",
      "Todo el truco es la única línea if (random() > 0.5) rotate(90°). Todo lo interesante — los caminos serpenteantes, el laberinto emergente — surge de esa sola elección aleatoria repetida por toda la cuadrícula:",
    ],
    s3cap: "Un generador Truchet mínimo con arcos de Smith en p5.js",
    s3after:
      "Cambia los dos arcos por una sola diagonal y obtienes el laberinto angular clásico; sube la resolución de la cuadrícula y el patrón se densifica sin una sola regla extra.",

    s4h: "Más allá del cuadrado: el Truchet hexagonal",
    s4: [
      "Nada obliga a que los mosaicos sean cuadrados. Los mosaicos Truchet hexagonales colocan 'puertas' en el punto medio de cada uno de los seis bordes y las conectan con arcos. Con seis bordes en lugar de cuatro hay muchas más formas de enrutar las conexiones, así que una cuadrícula hexagonal produce bastante más variación que una cuadrada.",
      "La recompensa es la fluidez. Donde los mosaicos cuadrados se encuentran en ángulo recto, los hexágonos se encuentran a 120°, y las curvas continuas se doblan con más suavidad — los laberintos que emergen parecen más fluidos y naturales, más cerca de redes de ríos o papel marmolado que de circuitos impresos.",
    ],
    s4cap:
      "Un teselado Truchet hexagonal: puertas en los puntos medios unidas por arcos, con cada hexágono rotado al azar",

    s5h: "Pruébalo tú mismo",
    s5: [
      "Patchwork ya incluye los mosaicos diagonales de Truchet y los arcos emparejados de Smith, junto a muchas familias de bloques relacionadas. Colócalos en el lienzo, elige tus colores y deja que la colocación al azar haga el resto — el mismo principio detrás de cada patrón de arriba.",
      "¿Quieres ver surgir patrones nuevos con un clic?",
    ],
    interactiveLink: "Prueba el generador interactivo de combinaciones de mosaicos",
    cta: "Abrir Patchwork y empezar a crear",

    footer:
      "Ilustrado con figuras SVG generadas en el navegador a partir de una disposición aleatoria con semilla.",
  },

  fr: {
    metaTitle:
      "Truchet en pratique : multi-échelle, courtepointes et code — Patchwork",
    metaDescription:
      "Au-delà du carré classique : motifs Truchet multi-échelles, courtepointes Truchet, le 'Hello World' de l'art génératif en p5.js et labyrinthes hexagonaux fluides — illustré avec Patchwork.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    date: "16 juin 2026",
    readingTime: "7 min de lecture",
    title: "Truchet en pratique : multi-échelle, courtepointes et code",
    lead: "Le carreau carré classique n'est qu'un début. Voici quatre directions que prend l'idée de Truchet une fois sortie du manuel — motifs multi-échelles récursifs, courtepointes en tissu, quelques lignes de code génératif et labyrinthes hexagonaux.",

    introPre: "Ceci est la suite pratique de ",
    introLink: "notre histoire du pavage Truchet",
    introPost:
      ". Si vous préférez d'abord l'histoire du frère de 1704 et des carreaux courbes de Cyril Stanley Smith, commencez par là — ici nous reprenons là où des règles simples se mettent à produire des résultats étonnamment riches.",

    s1h: "Truchet multi-échelle : des motifs dans les motifs",
    s1: [
      "Les artistes génératifs d'aujourd'hui s'arrêtent rarement à une seule taille de grille. Dans les motifs Truchet multi-échelles — popularisés par Christopher Carlson dans son article de Bridges 2018 — chaque carré peut être subdivisé récursivement en sous-carrés plus petits, qui peuvent à leur tour se subdiviser. Les carreaux existent à toutes les échelles, reliées par des puissances d'un demi.",
      "Le résultat semble organique, presque fractal : des nœuds denses de petits arcs côtoient de grandes courbes amples, et comme les carreaux sont colorés par parité, chaque échelle se lit comme figure par rapport à l'échelle supérieure et comme fond par rapport à l'inférieure. Une poignée de règles produit quelque chose qui paraît composé à la main.",
    ],
    s1cap:
      "Un motif Truchet multi-échelle : chaque carré peut se subdiviser en quatre, la couleur de l'arc suivant la profondeur de subdivision",

    s2h: "De la toile au tissu : la courtepointe Truchet",
    s2: [
      "Comme ce site s'appelle Patchwork, le lien textile est irrésistible — et il est réel. Le bloc demi-carré-triangle, pierre angulaire du quilting, n'est qu'un carreau Truchet en tissu : un carré divisé en diagonale en deux triangles contrastés. Cousez-en une pile, disposez-les avec des rotations choisies au hasard, et un motif de courtepointe unique émerge à chaque fois.",
      "C'est ce qui rend Truchet idéal pour la courtepointe. Une couverture entière peut être bâtie à partir de deux ou trois blocs de base seulement. Il n'y a pas de placement 'incorrect' — chaque orientation se raccorde proprement à ses voisines — un débutant peut donc improviser une pièce d'héritage sans plan d'ensemble. Le hasard compose à sa place.",
    ],
    s2cap:
      "Une courtepointe Truchet : des blocs demi-carré-triangle en deux ou trois 'tissus', disposés au hasard",

    s3h: "Le 'Hello World' de l'art génératif",
    s3: [
      "Pour les programmeurs, le pavage Truchet est le premier croquis canonique — le 'Hello World' de l'art génératif. Toute l'idée tient dans une double boucle : parcourir une grille et, à chaque cellule, tirer à pile ou face la rotation du carreau. C'est quelques lignes en p5.js, Processing ou Python, et la récompense est immédiate : un motif que vous ne dessineriez jamais à la main.",
      "Toute l'astuce tient dans la seule ligne if (random() > 0.5) rotate(90°). Tout l'intéressant — les chemins sinueux, le labyrinthe émergent — découle de ce seul choix aléatoire répété sur la grille :",
    ],
    s3cap: "Un générateur Truchet minimal à arcs de Smith en p5.js",
    s3after:
      "Remplacez les deux arcs par une seule diagonale et vous obtenez le labyrinthe angulaire classique ; augmentez la résolution de la grille et le motif se densifie sans une seule règle de plus.",

    s4h: "Au-delà du carré : le Truchet hexagonal",
    s4: [
      "Rien n'oblige les carreaux à être carrés. Les carreaux Truchet hexagonaux placent des 'portes' au milieu de chacun des six côtés et les relient par des arcs. Avec six côtés au lieu de quatre, il y a bien plus de façons d'acheminer les connexions, si bien qu'une grille hexagonale produit nettement plus de variation qu'une grille carrée.",
      "Le gain, c'est la fluidité. Là où les carreaux carrés se rencontrent à angle droit, les hexagones se rencontrent à 120°, et les courbes continues s'infléchissent plus doucement — les labyrinthes qui émergent paraissent plus fluides et naturels, plus proches de réseaux fluviaux ou de papier marbré que de circuits imprimés.",
    ],
    s4cap:
      "Un pavage Truchet hexagonal : des portes aux milieux des côtés reliées par des arcs, chaque hexagone tourné au hasard",

    s5h: "Essayez vous-même",
    s5: [
      "Patchwork propose déjà les carreaux diagonaux de Truchet et les arcs appariés de Smith, aux côtés de nombreuses familles de blocs apparentées. Posez-les sur le canevas, choisissez vos couleurs et laissez le placement aléatoire faire le reste — le même principe que derrière chaque motif ci-dessus.",
      "Envie de voir de nouveaux motifs émerger d'un clic ?",
    ],
    interactiveLink: "Essayez le générateur interactif de combinaisons de carreaux",
    cta: "Ouvrir Patchwork et commencer à paver",

    footer:
      "Illustré avec des figures SVG générées dans le navigateur à partir d'une disposition aléatoire à graine.",
  },
};

const messagesByLocale = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
};

export default function TruchetInPractice() {
  const { locale } = useRouter();
  const lang = (locale ?? "en") as keyof typeof content;
  const c = content[lang] ?? content.en;

  const localeLinks = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
  ];

  const paragraph =
    "text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4";

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
            href={`${code === "en" ? "" : `/${code}`}/articles/truchet-in-practice`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles/truchet-in-practice"
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
            {/* Intro / link back to history article */}
            <section>
              <p className={paragraph}>
                {c.introPre}
                <Link
                  href="/articles/truchet-tiling"
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {c.introLink}
                </Link>
                {c.introPost}
              </p>
            </section>

            {/* A — Multiscale */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s1h}</h2>
              {c.s1.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
              <figure className="my-4">
                <MultiscaleTruchet />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s1cap}
                </figcaption>
              </figure>
            </section>

            {/* B — Quilting */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s2h}</h2>
              {c.s2.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
              <figure className="my-4">
                <SquareTruchetQuilt />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2cap}
                </figcaption>
              </figure>
            </section>

            {/* C — Code */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s3h}</h2>
              {c.s3.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
              <figure className="my-4">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-5 text-sm leading-relaxed text-zinc-100">
                  <code className="font-mono">{CODE_P5}</code>
                </pre>
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s3cap}
                </figcaption>
              </figure>
              <p className={paragraph}>{c.s3after}</p>
            </section>

            {/* D — Hexagonal */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s4h}</h2>
              {c.s4.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
              <figure className="my-4">
                <HexTruchet />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s4cap}
                </figcaption>
              </figure>
            </section>

            {/* CTA */}
            <section className="rounded-xl bg-slate-800 p-8 my-10">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {c.s5h}
              </h2>
              {c.s5.map((p, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed mb-4">
                  {p}
                </p>
              ))}
              <p className="mb-5">
                <Link
                  href="/articles/tile-combinations"
                  className="text-teal-400 hover:underline"
                >
                  {c.interactiveLink} →
                </Link>
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
    messages:
      messagesByLocale[(locale ?? "en") as keyof typeof messagesByLocale] ??
      enMessages,
  },
});
