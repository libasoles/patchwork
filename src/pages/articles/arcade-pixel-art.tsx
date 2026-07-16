import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";
import PixelSprite from "@/components/PixelSprite";
import { arcadeSprites, ArcadeSprite } from "@/data/arcadeSprites";
import { colorSprites } from "@/data/arcadeSpritesColor";
import { canvasDimension, tilesMap } from "@/config";
import { createTile } from "@/factory";
import { emptyCanvas } from "@/factory";
import { useStore } from "@/store/store";

const pixelTile = tilesMap[0]; // "š" — the tile glyph with the highest ink coverage, closest to a filled square

function drawSpriteOnCanvas(sprite: ArcadeSprite) {
  const size = sprite.grid.length;
  const offset = Math.floor((canvasDimension.x - size) / 2);

  useStore.setState((draft) => {
    const layer = draft.layers.get(draft.selected);
    if (!layer) return;

    layer.canvas.cells = emptyCanvas(canvasDimension);

    sprite.grid.forEach((row, r) => {
      row.forEach((value, c) => {
        if (!value) return;
        const index = (offset + r) * canvasDimension.x + (offset + c);
        layer.canvas.cells[index] = createTile({
          ...pixelTile,
          color: sprite.colors[value - 1],
        });
      });
    });
  });
}

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
    galleryCaption: string;
    galleryHint: string;
    editLabel: string;
    hColor: string;
    pColor: string[];
    galleryCaption2: string;
    hTry: string;
    pTry: string[];
    cta: string;
  }
> = {
  en: {
    metaTitle: "Pixelating Arcade Games — Patchwork",
    metaDescription:
      "How 1970s arcade hardware forced games into a grid of colored squares — and how that same grid, one filled square tile per pixel, reproduces classic invader and ghost sprites in Patchwork.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    footer: "Patchwork — a tile-based drawing toy.",
    date: "July 14, 2026",
    readingTime: "4 min read",
    title: "Pixelating Arcade Games",
    lead: "Long before 'pixel art' was a style choice, it was a hardware constraint: arcade cabinets drew their monsters on a coarse grid of square cells, one solid color each. That grid is exactly what a tile canvas already is.",
    hHistory: "Low resolution, high imagination",
    pHistory: [
      "Machines like Space Invaders (1978) rendered sprites on bitmap displays with only a few thousand addressable cells. There was no room for gradients or anti-aliasing — a monster had to read as a monster in an 8×8 or 11×8 block of squares, each one either on or off, each 'on' cell a single flat color.",
      "That constraint produced a whole visual language: symmetric silhouettes (mirror the left half to get the right), thick recognizable outlines, and a handful of colors per sprite. Decades later, the same look is instantly legible as 'retro arcade' — not despite the pixelation, but because of it.",
    ],
    hTile: "A tile is a pixel",
    pTile: [
      "A filled square tile, with no shape drawn on it, is just a pixel. So a grid of tiles is a bitmap — exactly what an arcade sprite sheet is.",
      "And real sprites weren't monochrome: hardware allowed a few flat colors per monster, usually one for the body and another for eyes or details — like the invaders below.",
    ],
    galleryCaption:
      "Six 8×8 sprites, two colors each: one for the body, one for the eyes.",
    galleryHint: "Click a monster to draw it on the canvas.",
    editLabel: "Edit",
    hColor: "Then color arrived",
    pColor: [
      "Early cabinets were black and white, sometimes with a colored plastic film taped over the screen. Once real color displays showed up, each sprite could use three or four flat colors instead of one — body, limbs, eyes, mouth, each its own color.",
      "That's what turns a silhouette into a character. The gallery below adds a third color, still one filled tile per pixel.",
    ],
    galleryCaption2:
      "Eight more sprites, three colors each: body, limbs or spikes, and eyes.",
    hTry: "Try it in the app",
    pTry: [
      "Pick any color, zoom in, and fill single cells one at a time — that's all a sprite like these is. Mirror your strokes left-to-right as you go and the silhouette stays symmetric for free.",
    ],
    cta: "Open Patchwork →",
  },
  es: {
    metaTitle: "Pixelar juegos arcade — Patchwork",
    metaDescription:
      "Cómo el hardware de los recreativos de los 70 obligó a los juegos a vivir en una grilla de cuadrados de color — y cómo esa misma grilla, un mosaico cuadrado relleno por píxel, reproduce en Patchwork los clásicos monstruos invasores y fantasmas.",
    backToArticles: "← Artículos",
    backToApp: "Abrir Patchwork →",
    footer: "Patchwork — una aplicación para dibujar con mosaicos.",
    date: "14 de julio de 2026",
    readingTime: "4 min de lectura",
    title: "Pixelar juegos arcade",
    lead: "Mucho antes de que el 'pixel art' fuera una elección estética, era una limitación de hardware: las máquinas recreativas dibujaban a sus monstruos sobre una grilla tosca de celdas cuadradas, cada una de un solo color sólido. Esa grilla es, literalmente, lo que ya es un lienzo de mosaicos.",
    hHistory: "Poca resolución, mucha imaginación",
    pHistory: [
      "Máquinas como Space Invaders (1978) dibujaban sus sprites en pantallas de mapa de bits con apenas unos pocos miles de celdas direccionables. No había lugar para degradados ni suavizado de bordes: un monstruo tenía que leerse como monstruo dentro de un bloque de 8×8 u 11×8 cuadrados, cada uno encendido o apagado, y cada cuadrado 'encendido' de un único color plano.",
      "Esa limitación creó todo un lenguaje visual: siluetas simétricas (basta espejar la mitad izquierda para obtener la derecha), contornos gruesos y reconocibles, y un puñado de colores por sprite. Décadas después, ese mismo aspecto se lee al instante como 'retro arcade' — no a pesar de la pixelación, sino gracias a ella.",
    ],
    hTile: "Un mosaico es un píxel",
    pTile: [
      "Un mosaico cuadrado relleno, sin ninguna forma dibujada, es simplemente un píxel. Y una grilla de mosaicos es un mapa de bits — justo lo que es una hoja de sprites arcade.",
      "Además, los sprites reales no eran de un solo color: el hardware permitía unos pocos colores planos por monstruo, uno para el cuerpo y otro para los ojos o detalles — como los invasores de abajo.",
    ],
    galleryCaption:
      "Seis sprites de 8×8, con dos colores cada uno: uno para el cuerpo y otro para los ojos.",
    galleryHint: "Haz clic en un monstruo para dibujarlo en el lienzo.",
    editLabel: "Editar",
    hColor: "Después llegó el color",
    pColor: [
      "Las primeras máquinas eran en blanco y negro, a veces con una lámina de plástico de color pegada sobre la pantalla. Cuando llegaron las pantallas a color de verdad, cada sprite pudo usar tres o cuatro colores planos en vez de uno — cuerpo, extremidades, ojos, boca, cada uno con su propio color.",
      "Eso es lo que convierte una silueta en un personaje. La galería de abajo suma un tercer color, siempre con un mosaico relleno por píxel.",
    ],
    galleryCaption2:
      "Ocho sprites más, con tres colores cada uno: cuerpo, extremidades o púas, y ojos.",
    hTry: "Probarlo en la aplicación",
    pTry: [
      "Elige cualquier color, acércate con el zoom y rellena las celdas de una en una — eso es todo lo que es un sprite como estos. Espeja tus trazos de izquierda a derecha a medida que avanzas y la silueta queda simétrica sin esfuerzo.",
    ],
    cta: "Abrir Patchwork →",
  },
  fr: {
    metaTitle: "Pixeliser les jeux d'arcade — Patchwork",
    metaDescription:
      "Comment le matériel des bornes d'arcade des années 70 a forcé les jeux à vivre dans une grille de carrés colorés — et comment cette même grille, un carreau carré plein par pixel, reproduit dans Patchwork les monstres envahisseurs et fantômes classiques.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    footer: "Patchwork — un jouet de dessin à base de carreaux.",
    date: "14 juillet 2026",
    readingTime: "4 min de lecture",
    title: "Pixeliser les jeux d'arcade",
    lead: "Bien avant que le 'pixel art' ne devienne un choix esthétique, c'était une contrainte matérielle : les bornes d'arcade dessinaient leurs monstres sur une grille grossière de cellules carrées, chacune d'une seule couleur pleine. Cette grille est exactement ce qu'est déjà une toile de carreaux.",
    hHistory: "Basse résolution, haute imagination",
    pHistory: [
      "Des machines comme Space Invaders (1978) dessinaient leurs sprites sur des écrans bitmap avec à peine quelques milliers de cellules adressables. Pas de place pour les dégradés ni l'anti-aliasing : un monstre devait se lire comme un monstre dans un bloc de 8×8 ou 11×8 carrés, chacun allumé ou éteint, chaque carré 'allumé' d'une seule couleur plate.",
      "Cette contrainte a produit tout un langage visuel : silhouettes symétriques (il suffit de reproduire en miroir la moitié gauche pour obtenir la droite), contours épais et reconnaissables, une poignée de couleurs par sprite. Des décennies plus tard, ce même aspect se lit instantanément comme 'rétro arcade' — non pas malgré la pixelisation, mais grâce à elle.",
    ],
    hTile: "Un carreau est un pixel",
    pTile: [
      "Un carreau carré plein, sans aucune forme dessinée, est simplement un pixel. Et une grille de carreaux est un bitmap — exactement ce qu'est une feuille de sprites d'arcade.",
      "Les sprites réels n'étaient d'ailleurs pas monochromes : le matériel permettait quelques couleurs plates par monstre, une pour le corps et une autre pour les yeux ou les détails — comme les envahisseurs ci-dessous.",
    ],
    galleryCaption:
      "Six sprites de 8×8, avec deux couleurs chacun : une pour le corps, une pour les yeux.",
    galleryHint: "Cliquez sur un monstre pour le dessiner sur la toile.",
    editLabel: "Éditer",
    hColor: "Puis la couleur est arrivée",
    pColor: [
      "Les premières bornes étaient en noir et blanc, parfois avec un film plastique coloré collé sur l'écran. Quand les vrais écrans couleur sont arrivés, chaque sprite a pu utiliser trois ou quatre couleurs plates au lieu d'une seule — corps, membres, yeux, bouche, chacun sa couleur.",
      "C'est ce qui transforme une silhouette en personnage. La galerie ci-dessous ajoute une troisième couleur, toujours un carreau plein par pixel.",
    ],
    galleryCaption2:
      "Huit sprites de plus, avec trois couleurs chacun : corps, membres ou pointes, et yeux.",
    hTry: "Essayez-le dans l'application",
    pTry: [
      "Choisissez une couleur, zoomez, et remplissez les cellules une par une — c'est tout ce qu'est un sprite comme ceux-ci. Reproduisez vos traits en miroir de gauche à droite au fur et à mesure et la silhouette reste symétrique sans effort.",
    ],
    cta: "Ouvrir Patchwork →",
  },
};

function SpriteButton({
  sprite,
  label,
  editLabel,
  onClick,
}: {
  sprite: ArcadeSprite;
  label: string;
  editLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer"
    >
      <PixelSprite grid={sprite.grid} colors={sprite.colors} cellPx={10} title={label} />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-teal-400">
        {editLabel}
      </span>
    </button>
  );
}

export default function ArcadePixelArtArticle() {
  const router = useRouter();
  const { locale } = router;
  const lang = ((locale ?? "en") as Lang) in content ? (locale as Lang) : "en";
  const c = content[lang];

  const handleSpriteClick = (sprite: ArcadeSprite) => {
    drawSpriteOnCanvas(sprite);
    router.push("/");
  };

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
            href={`${code === "en" ? "" : `/${code}`}/articles/arcade-pixel-art`}
          />
        ))}
      </Head>

      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <ArticleHeader
          currentHref="/articles/arcade-pixel-art"
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
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hHistory}</h2>
              {c.pHistory.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hTile}</h2>
              <p className={paragraph}>{c.pTile[0]}</p>
              <p className={paragraph}>{c.pTile[1]}</p>

              <figure className="my-6">
                <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl bg-slate-900 p-8">
                  {arcadeSprites.map((sprite) => (
                    <SpriteButton
                      key={sprite.id}
                      sprite={sprite}
                      label={sprite.name[lang]}
                      editLabel={c.editLabel}
                      onClick={() => handleSpriteClick(sprite)}
                    />
                  ))}
                </div>
                <figcaption className="text-xs text-zinc-400 mt-3 text-center">
                  {c.galleryCaption}
                  <br />
                  {c.galleryHint}
                </figcaption>
              </figure>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hColor}</h2>
              <p className={paragraph}>{c.pColor[0]}</p>
              <p className={paragraph}>{c.pColor[1]}</p>

              <figure className="my-6">
                <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl bg-slate-900 p-8">
                  {colorSprites.map((sprite) => (
                    <SpriteButton
                      key={sprite.id}
                      sprite={sprite}
                      label={sprite.name[lang]}
                      editLabel={c.editLabel}
                      onClick={() => handleSpriteClick(sprite)}
                    />
                  ))}
                </div>
                <figcaption className="text-xs text-zinc-400 mt-3 text-center">
                  {c.galleryCaption2}
                  <br />
                  {c.galleryHint}
                </figcaption>
              </figure>
            </section>

            <section className="rounded-xl bg-slate-800 p-8 my-10">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {c.hTry}
              </h2>
              {c.pTry.map((p, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed mb-5">
                  {p}
                </p>
              ))}
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
