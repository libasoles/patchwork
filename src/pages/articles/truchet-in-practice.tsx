import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useMemo, useState } from "react";
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

const P5_URL = "https://p5js.org/";
const P5_CDN_URL = "https://cdn.jsdelivr.net/npm/p5@1.11.9/lib/p5.min.js";
const P5_COLLECTION_URL =
  "https://editor.p5js.org/StevesMakerspace/collections/Yqck5LnRD";

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

function p5SketchDocument(code: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html,
      body {
        margin: 0;
        min-height: 100%;
        background: #0f172a;
        color: #e4e4e7;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }

      body {
        display: grid;
        place-items: center;
        padding: 16px;
        box-sizing: border-box;
      }

      main {
        width: min(100%, 600px);
      }

      canvas {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        border-radius: 8px;
      }

      #error {
        display: none;
        white-space: pre-wrap;
        overflow: auto;
        margin: 0;
        padding: 16px;
        border: 1px solid #f87171;
        border-radius: 8px;
        background: #450a0a;
        color: #fecaca;
        font-size: 12px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <main id="sketch"></main>
    <pre id="error"></pre>
    <script>
      function showError(error) {
        var el = document.getElementById("error");
        el.style.display = "block";
        el.textContent = error && (error.stack || error.message) ? (error.stack || error.message) : String(error);
      }

      window.addEventListener("error", function(event) {
        showError(event.error || event.message);
      });
    </script>
    <script src="${P5_CDN_URL}"></script>
    <script>
      try {
        var userCode = ${JSON.stringify(code)};
        var wrappedCode = "with (window) {\\n" + userCode + "\\n" +
          ";[\\\"setup\\\",\\\"draw\\\",\\\"preload\\\",\\\"mousePressed\\\",\\\"mouseDragged\\\",\\\"mouseReleased\\\",\\\"keyPressed\\\",\\\"keyReleased\\\"].forEach(function(name) { try { var fn = eval(name); if (typeof fn === \\\"function\\\") window[name] = fn; } catch (_) {} });\\n" +
          "}";
        new Function(wrappedCode).call(window);
      } catch (error) {
        showError(error);
      }
    </script>
  </body>
</html>`;
}

function P5LiveSketch({
  caption,
  editorLabel,
  previewTitle,
}: {
  caption: string;
  editorLabel: string;
  previewTitle: string;
}) {
  const [code, setCode] = useState(CODE_P5);
  const srcDoc = useMemo(() => p5SketchDocument(code), [code]);

  return (
    <figure className="my-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.9fr)]">
        <div>
          <label
            htmlFor="p5-truchet-code"
            className="mb-2 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
          >
            {editorLabel}
          </label>
          <textarea
            id="p5-truchet-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full resize-y rounded-lg border border-zinc-200 bg-slate-900 p-4 font-mono text-sm leading-relaxed text-zinc-100 shadow-sm outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 dark:border-zinc-700"
          />
        </div>
        <div>
          <div className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {previewTitle}
          </div>
          <iframe
            key={srcDoc}
            title={previewTitle}
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            className="h-[420px] w-full rounded-lg border border-zinc-200 bg-slate-900 shadow-sm dark:border-zinc-700"
          />
        </div>
      </div>
      <figcaption className="text-xs text-zinc-400 mt-3">
        {caption}
      </figcaption>
    </figure>
  );
}

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
    s1IntroPre:
      "Modern generative artists rarely stop at a single grid size. In multiscale Truchet patterns — popularized by ",
    s1IntroLink: "Christopher Carlson",
    s1IntroPost:
      " in his 2018 Bridges paper — each square can be recursively subdivided into smaller sub-squares, and each of those can subdivide again. Tiles exist at every scale, related by powers of one half.",
    s1: [
      "The result feels organic, almost fractal: dense knots of small arcs sit beside large sweeping curves, and because the tiles are coloured by parity, each scale reads as foreground for the scale above it and background for the scale below. A handful of rules produces something that looks hand-composed.",
    ],
    s1cap:
      "Multi-Scale Truchet Patterns by Christopher Carlson. Image source: christophercarlson.com",
    s1Alt:
      "A black and white multiscale Truchet pattern by Christopher Carlson with nested curved domains at multiple square sizes",
    s1GeneratorPre:
      "For a more playful multiscale example with coloured dots and nested arcs, see ",
    s1GeneratorLink: "Roni Kaufman's OpenProcessing generator",
    s1GeneratorPost: ", which is what this script produces:",
    s1GenCap: "Multiscale Truchet generator by Roni Kaufman (OpenProcessing)",
    s1GenAlt:
      "A colourful multiscale Truchet pattern with nested arcs and small coloured dots, generated in OpenProcessing",

    s2h: "From canvas to cloth: Truchet quilting",
    s2: [
      "Because this site is called Patchwork, the textile connection is irresistible — and it is a real one. The half-square-triangle block, a cornerstone of quilting, is simply a Truchet tile in fabric: a square split diagonally into two contrasting triangles. Sew a pile of them, lay them out with the rotations chosen at random, and a unique whole-quilt design emerges every single time.",
      "That is what makes Truchet ideal for quilters. A whole blanket can be built from just two or three basic blocks. There is no 'wrong' placement — every orientation joins cleanly with its neighbours — so a beginner can improvise an heirloom without a master plan. The randomness does the composing.",
    ],
    s2cap:
      "A Truchet quilt: half-square-triangle blocks in two or three 'fabrics', laid out at random",
    s2photoAlt:
      "A knitted Truchet blanket with teal, blue, and charcoal half-square triangle blocks draped over an armchair",
    s2photoCap:
      "The same half-square-triangle logic carried into a tactile blanket: a small set of colours, repeated with random rotations",
    s2crochetDetailAlt:
      "A close-up crochet Truchet blanket made of triangular blocks in teal, cream, gold, and burgundy",
    s2crochetDetailCap:
      "Crochet pushes the same Truchet geometry toward texture: repeated triangular modules, rotated into larger motifs",
    s2crochetBedAlt:
      "A multicolored crochet Truchet blanket spread across a bed",
    s2crochetBedCap:
      "Another crochet interpretation: a full bedspread built from rotated half-square-triangle units",

    s3h: "The 'Hello World' of generative art",
    s3IntroPre:
      "For programmers, Truchet tiling is the canonical first sketch — the 'Hello World' of generative art. The entire idea fits in a double loop: walk a grid, and at each cell flip a coin to decide the tile's rotation. It is a few lines in ",
    s3IntroLink: "p5.js",
    s3IntroPost:
      ", Processing, or Python, and it rewards you immediately with a pattern you would never draw by hand.",
    s3: [
      "The whole trick is the single line if (random() > 0.5) rotate(90°). Everything interesting — the winding paths, the emergent labyrinth — falls out of that one random choice repeated across the grid:",
    ],
    s3cap: "A minimal Smith-arc Truchet generator in p5.js",
    s3EditorLabel: "Editable p5.js sketch",
    s3PreviewTitle: "Live p5.js output",
    s3CollectionPre: "If you want more Truchet sketches, browse this ",
    s3CollectionLink: "p5.js collection of scripts",
    s3CollectionPost: ".",
    s3after:
      "Swap the two arcs for a single diagonal and you get the classic angular labyrinth; raise the grid resolution and the pattern grows denser without a single extra rule.",

    s4h: "Beyond the square: hexagonal Truchet",
    s4: [
      "Nothing requires the tiles to be squares. Hexagonal Truchet tiles place 'gates' at the midpoint of each of the six edges and connect them with arcs. With six edges instead of four there are far more ways to route the connections, so a hexagonal grid produces noticeably more variation than a square one.",
      "The payoff is flow. Where square tiles meet at right angles, hexagons meet at 120°, and the continuous curves bend more gently — the mazes that emerge look more fluid and natural, closer to river networks or marbled paper than to circuit boards.",
    ],
    s4cap:
      "A hexagonal Truchet tiling: edge-midpoint gates joined by arcs, each hexagon randomly rotated",
    s4BrowneIntro:
      "Cameron Browne has explored these duotone hexagonal tilings in depth — two prototiles tiled together yield endlessly varied flowing mazes:",
    s4BrowneCap: "Duotone hexagonal Truchet tiles and tiling by Cameron Browne",
    s4BrowneAlt1:
      "Two blue and cream hexagonal Truchet prototiles and a rectangular tiling assembled from them",
    s4BrowneCap2: "Duotone hexagonal Truchet maze by Cameron Browne",
    s4BrowneAlt2:
      "A dense blue and cream maze pattern made from hexagonal Truchet tiles",

    s5h: "Try it yourself",
    s5: [
      "Patchwork already ships Truchet's diagonal tiles and Smith's paired arcs, alongside many related block families. Drop them on the canvas, pick your colours, and let random placement do the rest — the same principle behind every pattern above.",
      "Want to watch new patterns emerge at the click of a button?",
    ],
    interactiveLink: "Try the interactive tile-combinations generator",
    cta: "Open Patchwork and start tiling",

    footer:
      "Illustrated with credited source imagery and SVG figures generated in the browser from seeded layouts.",
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
    s1IntroPre:
      "Los artistas generativos de hoy rara vez se quedan en un único tamaño de cuadrícula. En los patrones Truchet multiescala — popularizados por ",
    s1IntroLink: "Christopher Carlson",
    s1IntroPost:
      " en su artículo de Bridges de 2018 — cada cuadrado puede subdividirse recursivamente en subcuadrados más pequeños, y cada uno de ellos volver a subdividirse. Los mosaicos existen a todas las escalas, relacionadas por potencias de un medio.",
    s1: [
      "El resultado se siente orgánico, casi fractal: nudos densos de arcos pequeños conviven con grandes curvas amplias, y como los mosaicos se colorean por paridad, cada escala se lee como figura respecto de la escala mayor y como fondo respecto de la menor. Un puñado de reglas produce algo que parece compuesto a mano.",
    ],
    s1cap:
      "Multi-Scale Truchet Patterns, de Christopher Carlson. Fuente de la imagen: christophercarlson.com",
    s1Alt:
      "Un patrón Truchet multiescala en blanco y negro de Christopher Carlson con dominios curvos anidados en varios tamaños de cuadrado",
    s1GeneratorPre:
      "Para un ejemplo multiescala más lúdico, con puntos de color y arcos anidados, mira ",
    s1GeneratorLink: "el generador de OpenProcessing de Roni Kaufman",
    s1GeneratorPost: ", que es lo que produce este script:",
    s1GenCap: "Generador Truchet multiescala de Roni Kaufman (OpenProcessing)",
    s1GenAlt:
      "Un patrón Truchet multiescala colorido con arcos anidados y pequeños puntos de color, generado en OpenProcessing",

    s2h: "Del lienzo a la tela: el quilting Truchet",
    s2: [
      "Como este sitio se llama Patchwork, la conexión textil es irresistible — y es real. El bloque de medio cuadrado-triángulo, piedra angular del quilting, no es más que un mosaico Truchet en tela: un cuadrado dividido en diagonal en dos triángulos contrastantes. Cose un montón, colócalos con las rotaciones elegidas al azar y surge un diseño de manta único cada vez.",
      "Eso es lo que hace a Truchet ideal para el patchwork. Una manta entera puede construirse con solo dos o tres bloques básicos. No existe una colocación 'incorrecta' — toda orientación encaja limpiamente con sus vecinas — así que cualquier principiante puede improvisar una pieza de herencia sin un plan maestro. El azar se encarga de la composición.",
    ],
    s2cap:
      "Una manta Truchet: bloques de medio cuadrado-triángulo en dos o tres 'telas', colocados al azar",
    s2photoAlt:
      "Una manta Truchet tejida con bloques de medio cuadrado-triángulo en verde, azul y gris oscuro sobre un sillón",
    s2photoCap:
      "La misma lógica de medio cuadrado-triángulo llevada a una manta real: pocos colores, repetidos con rotaciones al azar",
    s2crochetDetailAlt:
      "Un primer plano de una manta Truchet al crochet hecha con bloques triangulares en turquesa, crema, mostaza y bordó",
    s2crochetDetailCap:
      "El crochet lleva la misma geometría Truchet hacia la textura: módulos triangulares repetidos y rotados para formar motivos mayores",
    s2crochetBedAlt:
      "Una manta Truchet multicolor al crochet extendida sobre una cama",
    s2crochetBedCap:
      "Otra interpretación en crochet: una colcha completa construida a partir de unidades de medio cuadrado-triángulo rotadas",

    s3h: "El 'Hola Mundo' del arte generativo",
    s3IntroPre:
      "Para quien programa, el mosaico Truchet es el primer boceto canónico — el 'Hola Mundo' del arte generativo. Toda la idea cabe en un doble bucle: recorre una cuadrícula y, en cada celda, lanza una moneda para decidir la rotación del mosaico. Son unas pocas líneas en ",
    s3IntroLink: "p5.js",
    s3IntroPost:
      ", Processing o Python, y te recompensa al instante con un patrón que jamás dibujarías a mano.",
    s3: [
      "Todo el truco es la única línea if (random() > 0.5) rotate(90°). Todo lo interesante — los caminos serpenteantes, el laberinto emergente — surge de esa sola elección aleatoria repetida por toda la cuadrícula:",
    ],
    s3cap: "Un generador Truchet mínimo con arcos de Smith en p5.js",
    s3EditorLabel: "Sketch p5.js editable",
    s3PreviewTitle: "Resultado p5.js en vivo",
    s3CollectionPre: "Si quieres más ejemplos, mira esta ",
    s3CollectionLink: "colección de scripts en p5.js",
    s3CollectionPost: ".",
    s3after:
      "Cambia los dos arcos por una sola diagonal y obtienes el laberinto angular clásico; sube la resolución de la cuadrícula y el patrón se densifica sin una sola regla extra.",

    s4h: "Más allá del cuadrado: el Truchet hexagonal",
    s4: [
      "Nada obliga a que los mosaicos sean cuadrados. Los mosaicos Truchet hexagonales colocan 'puertas' en el punto medio de cada uno de los seis bordes y las conectan con arcos. Con seis bordes en lugar de cuatro hay muchas más formas de enrutar las conexiones, así que una cuadrícula hexagonal produce bastante más variación que una cuadrada.",
      "La recompensa es la fluidez. Donde los mosaicos cuadrados se encuentran en ángulo recto, los hexágonos se encuentran a 120°, y las curvas continuas se doblan con más suavidad — los laberintos que emergen parecen más fluidos y naturales, más cerca de redes de ríos o papel marmolado que de circuitos impresos.",
    ],
    s4cap:
      "Un teselado Truchet hexagonal: puertas en los puntos medios unidas por arcos, con cada hexágono rotado al azar",
    s4BrowneIntro:
      "Cameron Browne ha explorado a fondo estos teselados hexagonales en duotono — dos mosaicos base teselados juntos generan laberintos fluidos infinitamente variados:",
    s4BrowneCap: "Mosaicos y teselado Truchet hexagonal en duotono, de Cameron Browne",
    s4BrowneAlt1:
      "Dos mosaicos base Truchet hexagonales azul y crema y un teselado rectangular formado con ellos",
    s4BrowneCap2: "Laberinto Truchet hexagonal en duotono, de Cameron Browne",
    s4BrowneAlt2:
      "Un denso patrón de laberinto azul y crema hecho con mosaicos Truchet hexagonales",

    s5h: "Pruébalo tú mismo",
    s5: [
      "Patchwork ya incluye los mosaicos diagonales de Truchet y los arcos emparejados de Smith, junto a muchas familias de bloques relacionadas. Colócalos en el lienzo, elige tus colores y deja que la colocación al azar haga el resto — el mismo principio detrás de cada patrón de arriba.",
      "¿Quieres ver surgir patrones nuevos con un clic?",
    ],
    interactiveLink: "Prueba el generador interactivo de combinaciones de mosaicos",
    cta: "Abrir Patchwork y empezar a crear",

    footer:
      "Ilustrado con imágenes de fuente acreditada y figuras SVG generadas en el navegador a partir de disposiciones aleatorias con semilla.",
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
    s1IntroPre:
      "Les artistes génératifs d'aujourd'hui s'arrêtent rarement à une seule taille de grille. Dans les motifs Truchet multi-échelles — popularisés par ",
    s1IntroLink: "Christopher Carlson",
    s1IntroPost:
      " dans son article de Bridges 2018 — chaque carré peut être subdivisé récursivement en sous-carrés plus petits, qui peuvent à leur tour se subdiviser. Les carreaux existent à toutes les échelles, reliées par des puissances d'un demi.",
    s1: [
      "Le résultat semble organique, presque fractal : des nœuds denses de petits arcs côtoient de grandes courbes amples, et comme les carreaux sont colorés par parité, chaque échelle se lit comme figure par rapport à l'échelle supérieure et comme fond par rapport à l'inférieure. Une poignée de règles produit quelque chose qui paraît composé à la main.",
    ],
    s1cap:
      "Multi-Scale Truchet Patterns, de Christopher Carlson. Source de l'image : christophercarlson.com",
    s1Alt:
      "Un motif Truchet multi-échelle noir et blanc de Christopher Carlson avec des domaines courbes imbriqués à plusieurs tailles de carré",
    s1GeneratorPre:
      "Pour un exemple multi-échelle plus ludique, avec points colorés et arcs imbriqués, voir ",
    s1GeneratorLink: "le générateur OpenProcessing de Roni Kaufman",
    s1GeneratorPost: ", c'est ce que produit ce script :",
    s1GenCap: "Générateur Truchet multi-échelle de Roni Kaufman (OpenProcessing)",
    s1GenAlt:
      "Un motif Truchet multi-échelle coloré avec des arcs imbriqués et de petits points colorés, généré dans OpenProcessing",

    s2h: "De la toile au tissu : la courtepointe Truchet",
    s2: [
      "Comme ce site s'appelle Patchwork, le lien textile est irrésistible — et il est réel. Le bloc demi-carré-triangle, pierre angulaire du quilting, n'est qu'un carreau Truchet en tissu : un carré divisé en diagonale en deux triangles contrastés. Cousez-en une pile, disposez-les avec des rotations choisies au hasard, et un motif de courtepointe unique émerge à chaque fois.",
      "C'est ce qui rend Truchet idéal pour la courtepointe. Une couverture entière peut être bâtie à partir de deux ou trois blocs de base seulement. Il n'y a pas de placement 'incorrect' — chaque orientation se raccorde proprement à ses voisines — un débutant peut donc improviser une pièce d'héritage sans plan d'ensemble. Le hasard compose à sa place.",
    ],
    s2cap:
      "Une courtepointe Truchet : des blocs demi-carré-triangle en deux ou trois 'tissus', disposés au hasard",
    s2photoAlt:
      "Une couverture Truchet tricotée avec des blocs demi-carré-triangle vert, bleu et gris foncé sur un fauteuil",
    s2photoCap:
      "La même logique demi-carré-triangle transposée dans une couverture tactile : quelques couleurs, répétées avec des rotations aléatoires",
    s2crochetDetailAlt:
      "Un gros plan d'une couverture Truchet au crochet faite de blocs triangulaires turquoise, crème, or et bordeaux",
    s2crochetDetailCap:
      "Le crochet pousse la même géométrie Truchet vers la texture : des modules triangulaires répétés, tournés pour former des motifs plus vastes",
    s2crochetBedAlt:
      "Une couverture Truchet multicolore au crochet étalée sur un lit",
    s2crochetBedCap:
      "Autre interprétation au crochet : un couvre-lit complet construit à partir d'unités demi-carré-triangle pivotées",

    s3h: "Le 'Hello World' de l'art génératif",
    s3IntroPre:
      "Pour les programmeurs, le pavage Truchet est le premier croquis canonique — le 'Hello World' de l'art génératif. Toute l'idée tient dans une double boucle : parcourir une grille et, à chaque cellule, tirer à pile ou face la rotation du carreau. C'est quelques lignes en ",
    s3IntroLink: "p5.js",
    s3IntroPost:
      ", Processing ou Python, et la récompense est immédiate : un motif que vous ne dessineriez jamais à la main.",
    s3: [
      "Toute l'astuce tient dans la seule ligne if (random() > 0.5) rotate(90°). Tout l'intéressant — les chemins sinueux, le labyrinthe émergent — découle de ce seul choix aléatoire répété sur la grille :",
    ],
    s3cap: "Un générateur Truchet minimal à arcs de Smith en p5.js",
    s3EditorLabel: "Croquis p5.js modifiable",
    s3PreviewTitle: "Résultat p5.js en direct",
    s3CollectionPre: "Si vous voulez plus d'exemples, parcourez cette ",
    s3CollectionLink: "collection de scripts p5.js",
    s3CollectionPost: ".",
    s3after:
      "Remplacez les deux arcs par une seule diagonale et vous obtenez le labyrinthe angulaire classique ; augmentez la résolution de la grille et le motif se densifie sans une seule règle de plus.",

    s4h: "Au-delà du carré : le Truchet hexagonal",
    s4: [
      "Rien n'oblige les carreaux à être carrés. Les carreaux Truchet hexagonaux placent des 'portes' au milieu de chacun des six côtés et les relient par des arcs. Avec six côtés au lieu de quatre, il y a bien plus de façons d'acheminer les connexions, si bien qu'une grille hexagonale produit nettement plus de variation qu'une grille carrée.",
      "Le gain, c'est la fluidité. Là où les carreaux carrés se rencontrent à angle droit, les hexagones se rencontrent à 120°, et les courbes continues s'infléchissent plus doucement — les labyrinthes qui émergent paraissent plus fluides et naturels, plus proches de réseaux fluviaux ou de papier marbré que de circuits imprimés.",
    ],
    s4cap:
      "Un pavage Truchet hexagonal : des portes aux milieux des côtés reliées par des arcs, chaque hexagone tourné au hasard",
    s4BrowneIntro:
      "Cameron Browne a exploré en profondeur ces pavages hexagonaux duotone — deux carreaux de base pavés ensemble produisent des labyrinthes fluides à la variété infinie :",
    s4BrowneCap: "Carreaux et pavage Truchet hexagonal duotone, de Cameron Browne",
    s4BrowneAlt1:
      "Deux carreaux de base Truchet hexagonaux bleu et crème et un pavage rectangulaire assemblé à partir d'eux",
    s4BrowneCap2: "Labyrinthe Truchet hexagonal duotone, de Cameron Browne",
    s4BrowneAlt2:
      "Un motif de labyrinthe dense bleu et crème fait de carreaux Truchet hexagonaux",

    s5h: "Essayez vous-même",
    s5: [
      "Patchwork propose déjà les carreaux diagonaux de Truchet et les arcs appariés de Smith, aux côtés de nombreuses familles de blocs apparentées. Posez-les sur le canevas, choisissez vos couleurs et laissez le placement aléatoire faire le reste — le même principe que derrière chaque motif ci-dessus.",
      "Envie de voir de nouveaux motifs émerger d'un clic ?",
    ],
    interactiveLink: "Essayez le générateur interactif de combinaisons de carreaux",
    cta: "Ouvrir Patchwork et commencer à paver",

    footer:
      "Illustré avec des images de source créditée et des figures SVG générées dans le navigateur à partir de dispositions aléatoires à graine.",
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

            {/* A — Quilting */}
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
              <figure className="my-6">
                <Image
                  src="/articles/truchet-blanket.png"
                  alt={c.s2photoAlt}
                  width={2230}
                  height={1888}
                  sizes="(min-width: 768px) 720px, calc(100vw - 48px)"
                  className="h-auto w-full rounded-lg"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2photoCap}
                </figcaption>
              </figure>
              <figure className="my-6">
                <Image
                  src="/articles/truchet-crochet-detail.jpg"
                  alt={c.s2crochetDetailAlt}
                  width={1600}
                  height={1583}
                  sizes="(min-width: 768px) 720px, calc(100vw - 48px)"
                  className="h-auto w-full rounded-lg"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2crochetDetailCap}
                </figcaption>
              </figure>
              <figure className="my-6">
                <Image
                  src="/articles/truchet-crochet-bedspread.jpg"
                  alt={c.s2crochetBedAlt}
                  width={1600}
                  height={1403}
                  sizes="(min-width: 768px) 720px, calc(100vw - 48px)"
                  className="h-auto w-full rounded-lg"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  {c.s2crochetBedCap}
                </figcaption>
              </figure>
            </section>

            {/* B — Multiscale */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s1h}</h2>
              <p className={paragraph}>
                {c.s1IntroPre}
                <a
                  href="https://christophercarlson.com/"
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {c.s1IntroLink}
                </a>
                {c.s1IntroPost}
              </p>
              {c.s1.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
              <figure className="my-6">
                <Image
                  src="/articles/carlson-multiscale-truchet.png"
                  alt={c.s1Alt}
                  width={419}
                  height={419}
                  sizes="(min-width: 768px) 419px, calc(100vw - 48px)"
                  className="h-auto w-full max-w-[419px] rounded-lg"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  <a
                    href="https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/"
                    className="hover:text-zinc-600 hover:underline dark:hover:text-zinc-300"
                  >
                    {c.s1cap}
                  </a>
                </figcaption>
              </figure>
              <p className={paragraph}>
                {c.s1GeneratorPre}
                <a
                  href="https://openprocessing.org/@ronikaufman/1715681"
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {c.s1GeneratorLink}
                </a>
                {c.s1GeneratorPost}
              </p>
              <figure className="my-6">
                <Image
                  src="/articles/openprocessing-multiscale-truchet.png"
                  alt={c.s1GenAlt}
                  width={980}
                  height={986}
                  sizes="(min-width: 768px) 419px, calc(100vw - 48px)"
                  className="h-auto w-full max-w-[419px] rounded-lg"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  <a
                    href="https://openprocessing.org/@ronikaufman/1715681"
                    className="hover:text-zinc-600 hover:underline dark:hover:text-zinc-300"
                  >
                    {c.s1GenCap}
                  </a>
                </figcaption>
              </figure>
            </section>

            {/* C — Code */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.s3h}</h2>
              <p className={paragraph}>
                {c.s3IntroPre}
                <a
                  href={P5_URL}
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {c.s3IntroLink}
                </a>
                {c.s3IntroPost}
              </p>
              {c.s3.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
              <P5LiveSketch
                caption={c.s3cap}
                editorLabel={c.s3EditorLabel}
                previewTitle={c.s3PreviewTitle}
              />
              <p className={paragraph}>
                {c.s3CollectionPre}
                <a
                  href={P5_COLLECTION_URL}
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {c.s3CollectionLink}
                </a>
                {c.s3CollectionPost}
              </p>
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
              <p className={paragraph}>{c.s4BrowneIntro}</p>
              <figure className="my-6">
                <Image
                  src="/articles/browne-hexagonal-truchet-tiles.png"
                  alt={c.s4BrowneAlt1}
                  width={640}
                  height={227}
                  sizes="(min-width: 768px) 640px, calc(100vw - 48px)"
                  className="h-auto w-full max-w-[640px] rounded-lg"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  <a
                    href="https://cambolbro.com/graphics/duotone/"
                    className="hover:text-zinc-600 hover:underline dark:hover:text-zinc-300"
                  >
                    {c.s4BrowneCap}
                  </a>
                </figcaption>
              </figure>
              <figure className="my-6">
                <Image
                  src="/articles/browne-hexagonal-truchet-maze.png"
                  alt={c.s4BrowneAlt2}
                  width={640}
                  height={370}
                  sizes="(min-width: 768px) 640px, calc(100vw - 48px)"
                  className="h-auto w-full max-w-[640px] rounded-lg"
                />
                <figcaption className="text-xs text-zinc-400 mt-3">
                  <a
                    href="https://cambolbro.com/graphics/duotone/"
                    className="hover:text-zinc-600 hover:underline dark:hover:text-zinc-300"
                  >
                    {c.s4BrowneCap2}
                  </a>
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
