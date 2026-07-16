import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleHeader from "@/components/ArticleHeader";
import PixelSprite from "@/components/PixelSprite";
import { arcadeSprites } from "@/data/arcadeSprites";
import { fourColorSprites } from "@/data/arcadeSpritesColor";
import { richSprites } from "@/data/arcadeSpritesRich";
import { ArcadeSprite } from "@/data/spriteGrid";
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
    hRich: string;
    pRich: string[];
    galleryCaption3: string;
    hResolution: string;
    pResolution: string[];
    hTry: string;
    pTry: string[];
    cta: string;
  }
> = {
  en: {
    metaTitle: "Pixelating Arcade Games — Patchwork",
    metaDescription:
      "How 1970s arcade hardware forced games onto a strictly monochrome grid, how a handful of flat colors arrived a few years later, and how a 16-color palette finally turned silhouettes into characters — all reproduced in Patchwork, one filled tile per pixel.",
    backToArticles: "← Articles",
    backToApp: "Open Patchwork →",
    footer: "Patchwork — a tile-based drawing toy.",
    date: "July 14, 2026",
    readingTime: "6 min read",
    title: "Pixelating Arcade Games",
    lead: "Long before 'pixel art' was a style choice, it was a hardware constraint: arcade cabinets drew their monsters on a coarse grid of square cells, one solid color each. That grid is exactly what a tile canvas already is.",
    hHistory: "Low resolution, high imagination",
    pHistory: [
      "Machines like Space Invaders (1978) rendered sprites on bitmap displays with only a few thousand addressable cells. There was no room for gradients or anti-aliasing — a monster had to read as a monster in an 8×8 or 11×8 block of squares, each one either on or off.",
      "That constraint produced a whole visual language: symmetric silhouettes (mirror the left half to get the right), thick recognizable outlines, and — at first — a single flat color for the whole screen. Decades later, the same look is instantly legible as 'retro arcade' — not despite the pixelation, but because of it.",
    ],
    hTile: "A tile is a pixel",
    pTile: [
      "A filled square tile, with no shape drawn on it, is just a pixel. So a grid of tiles is a bitmap — exactly what an arcade sprite sheet is.",
      "The very first cabinets didn't have color hardware at all: the display was a single-color CRT, sometimes literally a black-and-white monitor with a sheet of tinted plastic taped over the glass to fake a 'color' game. Every lit cell on screen was the same flat color — like the invaders below.",
    ],
    galleryCaption:
      "Six 8×8 sprites, one color each: pure monochrome, the way the earliest cabinets actually displayed them.",
    galleryHint: "Click a monster to draw it on the canvas.",
    editLabel: "Edit",
    hColor: "Then a few colors arrived",
    pColor: [
      "Real color arcade boards showed up a year or two later — hardware like Galaxian's color board (1979) added a small palette chip, enough for each sprite to use a handful of flat colors instead of one. Four was a common ceiling: one for the body, one for limbs, one for eyes, one more for an accent detail.",
      "That's what starts turning a silhouette into a character. The gallery below uses exactly four colors per sprite, still one filled tile per pixel.",
    ],
    galleryCaption2:
      "Six new 8×8 sprites, four colors each: body, limbs, eyes, and an accent detail.",
    hRich: "Sixteen colors, and silhouettes become characters",
    pRich: [
      "By the mid-1980s, arcade and home-console hardware could address enough colors per sprite — commonly up to sixteen — and enough pixels to fit real detail: not just a body and a couple of accents, but hats, weapons, robes, and faces. Silhouette gave way to costume.",
      "The six figures below use a larger grid and draw from a richer palette across the whole set, though any single sprite still only needs a handful of those colors — a cowboy, a robot, a wizard, a ninja, a small hero, and a horned monster.",
    ],
    galleryCaption3:
      "Six 12×12 sprites, four to six colors each, drawn from a shared 16-color palette.",
    hResolution: "Then the grid itself got finer",
    pResolution: [
      "None of this happened by abandoning the grid — it happened by shrinking it. Space Invaders' whole screen held only a few thousand addressable cells; a decade later, 16-bit era hardware like the Neo Geo (1990) and the Super Nintendo (1990/1991) worked with resolutions roughly in the 256–320 by 224 pixel range — modest by today's standards, but a large jump from an 8×8 invader, and enough room for sprites with real shading and detail.",
      "That climb in resolution and color depth kept going for decades after arcades, eventually reaching full HD displays and beyond — arcades didn't invent that jump, they were just an early stop on the way. The idea underneath never changed, though: a tile is still a pixel, however small the tile gets.",
    ],
    hTry: "Try it in the app",
    pTry: [
      "Pick any color, zoom in, and fill single cells one at a time — that's all a sprite like these is. Mirror your strokes left-to-right as you go and the silhouette stays symmetric for free.",
    ],
    cta: "Open Patchwork →",
  },
  es: {
    metaTitle: "Pixelar juegos arcade — Patchwork",
    metaDescription:
      "Cómo el hardware de los recreativos de los 70 obligó a los juegos a vivir primero en una grilla estrictamente monocromática, cómo llegó después un puñado de colores planos, y cómo una paleta de dieciséis colores terminó convirtiendo siluetas en personajes — todo reproducido en Patchwork, un mosaico relleno por píxel.",
    backToArticles: "← Artículos",
    backToApp: "Abrir Patchwork →",
    footer: "Patchwork — una aplicación para dibujar con mosaicos.",
    date: "14 de julio de 2026",
    readingTime: "6 min de lectura",
    title: "Pixelar juegos arcade",
    lead: "Mucho antes de que el 'pixel art' fuera una elección estética, era una limitación de hardware: las máquinas recreativas dibujaban a sus monstruos sobre una grilla tosca de celdas cuadradas, cada una de un solo color sólido. Esa grilla es, literalmente, lo que ya es un lienzo de mosaicos.",
    hHistory: "Poca resolución, mucha imaginación",
    pHistory: [
      "Máquinas como Space Invaders (1978) dibujaban sus sprites en pantallas de mapa de bits con apenas unos pocos miles de celdas direccionables. No había lugar para degradados ni suavizado de bordes: un monstruo tenía que leerse como monstruo dentro de un bloque de 8×8 u 11×8 cuadrados, cada uno encendido o apagado.",
      "Esa limitación creó todo un lenguaje visual: siluetas simétricas (basta espejar la mitad izquierda para obtener la derecha), contornos gruesos y reconocibles y, al principio, un único color plano para toda la pantalla. Décadas después, ese mismo aspecto se lee al instante como 'retro arcade' — no a pesar de la pixelación, sino gracias a ella.",
    ],
    hTile: "Un mosaico es un píxel",
    pTile: [
      "Un mosaico cuadrado relleno, sin ninguna forma dibujada, es simplemente un píxel. Y una grilla de mosaicos es un mapa de bits — justo lo que es una hoja de sprites arcade.",
      "Las primerísimas máquinas ni siquiera tenían hardware de color: la pantalla era un tubo CRT de un solo color, a veces literalmente un monitor en blanco y negro con una lámina de plástico teñida pegada sobre el vidrio para simular un juego 'a color'. Cada celda encendida en pantalla era del mismo color plano — como los invasores de abajo.",
    ],
    galleryCaption:
      "Seis sprites de 8×8, de un solo color cada uno: monocromía pura, tal como se veían realmente en las primeras máquinas.",
    galleryHint: "Haz clic en un monstruo para dibujarlo en el lienzo.",
    editLabel: "Editar",
    hColor: "Después llegó un puñado de colores",
    pColor: [
      "Las placas arcade a color de verdad llegaron uno o dos años después — hardware como la placa de color de Galaxian (1979) sumó un pequeño chip de paleta, suficiente para que cada sprite usara un puñado de colores planos en vez de uno. Cuatro era un techo habitual: uno para el cuerpo, otro para las extremidades, otro para los ojos y uno más para un detalle de acento.",
      "Eso es lo que empieza a convertir una silueta en un personaje. La galería de abajo usa exactamente cuatro colores por sprite, siempre con un mosaico relleno por píxel.",
    ],
    galleryCaption2:
      "Seis sprites nuevos de 8×8, con cuatro colores cada uno: cuerpo, extremidades, ojos y un detalle de acento.",
    hRich: "Dieciséis colores, y las siluetas se vuelven personajes",
    pRich: [
      "A mediados de los años 80, el hardware de arcade y de consolas domésticas ya podía direccionar suficientes colores por sprite — habitualmente hasta dieciséis — y suficientes píxeles como para caber detalle real: no solo un cuerpo y un par de acentos, sino sombreros, armas, túnicas y rostros. La silueta le cedió el lugar al disfraz.",
      "Las seis figuras de abajo usan una grilla más grande y toman color de una paleta más rica para todo el conjunto, aunque cada sprite individual solo necesita un puñado de esos colores — un vaquero, un robot, un mago, un ninja, un pequeño héroe y un monstruo con cuernos.",
    ],
    galleryCaption3:
      "Seis sprites de 12×12, de cuatro a seis colores cada uno, tomados de una paleta compartida de dieciséis colores.",
    hResolution: "Después la grilla misma se afinó",
    pResolution: [
      "Nada de esto cambió abandonando la grilla — cambió achicándola. Toda la pantalla de Space Invaders tenía apenas unos pocos miles de celdas direccionables; una década después, el hardware de la era de 16 bits, como el Neo Geo (1990) y la Super Nintendo (1990/1991), trabajaba con resoluciones más o menos en el rango de 256–320 por 224 píxeles — modesto para hoy, pero un salto grande respecto a un invasor de 8×8, y suficiente lugar para sprites con sombreado y detalle reales.",
      "Esa escalada en resolución y profundidad de color siguió durante décadas después de los arcades, hasta llegar a pantallas full HD y más allá — los arcades no inventaron ese salto, fueron solo una parada temprana en el camino. La idea de fondo nunca cambió: un mosaico sigue siendo un píxel, por más chico que se vuelva el mosaico.",
    ],
    hTry: "Probarlo en la aplicación",
    pTry: [
      "Elige cualquier color, acércate con el zoom y rellena las celdas de una en una — eso es todo lo que es un sprite como estos. Espeja tus trazos de izquierda a derecha a medida que avanzas y la silueta queda simétrica sin esfuerzo.",
    ],
    cta: "Abrir Patchwork →",
  },
  fr: {
    metaTitle: "Pixeliser les jeux d'arcade — Patchwork",
    metaDescription:
      "Comment le matériel des bornes d'arcade des années 70 a d'abord forcé les jeux à vivre dans une grille strictement monochrome, comment une poignée de couleurs plates est arrivée ensuite, et comment une palette de seize couleurs a fini par transformer des silhouettes en personnages — le tout reproduit dans Patchwork, un carreau plein par pixel.",
    backToArticles: "← Articles",
    backToApp: "Ouvrir Patchwork →",
    footer: "Patchwork — un jouet de dessin à base de carreaux.",
    date: "14 juillet 2026",
    readingTime: "6 min de lecture",
    title: "Pixeliser les jeux d'arcade",
    lead: "Bien avant que le 'pixel art' ne devienne un choix esthétique, c'était une contrainte matérielle : les bornes d'arcade dessinaient leurs monstres sur une grille grossière de cellules carrées, chacune d'une seule couleur pleine. Cette grille est exactement ce qu'est déjà une toile de carreaux.",
    hHistory: "Basse résolution, haute imagination",
    pHistory: [
      "Des machines comme Space Invaders (1978) dessinaient leurs sprites sur des écrans bitmap avec à peine quelques milliers de cellules adressables. Pas de place pour les dégradés ni l'anti-aliasing : un monstre devait se lire comme un monstre dans un bloc de 8×8 ou 11×8 carrés, chacun allumé ou éteint.",
      "Cette contrainte a produit tout un langage visuel : silhouettes symétriques (il suffit de reproduire en miroir la moitié gauche pour obtenir la droite), contours épais et reconnaissables et, au départ, une seule couleur plate pour tout l'écran. Des décennies plus tard, ce même aspect se lit instantanément comme 'rétro arcade' — non pas malgré la pixelisation, mais grâce à elle.",
    ],
    hTile: "Un carreau est un pixel",
    pTile: [
      "Un carreau carré plein, sans aucune forme dessinée, est simplement un pixel. Et une grille de carreaux est un bitmap — exactement ce qu'est une feuille de sprites d'arcade.",
      "Les toutes premières bornes n'avaient même pas de matériel couleur : l'écran était un tube cathodique monochrome, parfois littéralement un moniteur noir et blanc avec une feuille de plastique teintée collée sur la vitre pour simuler un jeu 'en couleur'. Chaque cellule allumée à l'écran était de la même couleur plate — comme les envahisseurs ci-dessous.",
    ],
    galleryCaption:
      "Six sprites de 8×8, d'une seule couleur chacun : du monochrome pur, comme s'affichaient vraiment les toutes premières bornes.",
    galleryHint: "Cliquez sur un monstre pour le dessiner sur la toile.",
    editLabel: "Éditer",
    hColor: "Puis une poignée de couleurs est arrivée",
    pColor: [
      "Les vraies cartes d'arcade en couleur sont arrivées un an ou deux plus tard — du matériel comme la carte couleur de Galaxian (1979) a ajouté une petite puce de palette, assez pour que chaque sprite utilise une poignée de couleurs plates au lieu d'une seule. Quatre était un plafond courant : une pour le corps, une pour les membres, une pour les yeux, une de plus pour un détail d'accent.",
      "C'est ce qui commence à transformer une silhouette en personnage. La galerie ci-dessous utilise exactement quatre couleurs par sprite, toujours un carreau plein par pixel.",
    ],
    galleryCaption2:
      "Six nouveaux sprites de 8×8, avec quatre couleurs chacun : corps, membres, yeux, et un détail d'accent.",
    hRich: "Seize couleurs, et les silhouettes deviennent des personnages",
    pRich: [
      "Au milieu des années 80, le matériel d'arcade et des consoles domestiques pouvait adresser assez de couleurs par sprite — souvent jusqu'à seize — et assez de pixels pour loger un vrai détail : pas seulement un corps et deux accents, mais des chapeaux, des armes, des robes et des visages. La silhouette a cédé la place au costume.",
      "Les six personnages ci-dessous utilisent une grille plus grande et puisent dans une palette plus riche pour l'ensemble, même si chaque sprite pris seul n'a besoin que d'une poignée de ces couleurs — un cow-boy, un robot, un magicien, un ninja, un petit héros et un monstre à cornes.",
    ],
    galleryCaption3:
      "Six sprites de 12×12, de quatre à six couleurs chacun, puisés dans une palette partagée de seize couleurs.",
    hResolution: "Puis la grille elle-même s'est affinée",
    pResolution: [
      "Rien de tout cela n'est arrivé en abandonnant la grille — c'est arrivé en la resserrant. L'écran entier de Space Invaders ne comptait que quelques milliers de cellules adressables ; une décennie plus tard, le matériel de l'ère 16 bits, comme la Neo Geo (1990) et la Super Nintendo (1990/1991), fonctionnait à des résolutions grosso modo dans la fourchette de 256 à 320 par 224 pixels — modeste aujourd'hui, mais un grand bond par rapport à un envahisseur de 8×8, et assez de place pour des sprites avec de vraies ombres et du détail.",
      "Cette montée en résolution et en profondeur de couleur s'est poursuivie pendant des décennies après les bornes d'arcade, jusqu'à atteindre des écrans full HD et au-delà — les bornes d'arcade n'ont pas inventé ce saut, elles n'en ont été qu'une étape précoce. L'idée de fond, elle, n'a jamais changé : un carreau reste un pixel, aussi petit que ce carreau devienne.",
    ],
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
  cellPx,
  onClick,
}: {
  sprite: ArcadeSprite;
  label: string;
  editLabel: string;
  cellPx?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer"
    >
      <PixelSprite grid={sprite.grid} colors={sprite.colors} cellPx={cellPx ?? 10} title={label} />
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
                  {fourColorSprites.map((sprite) => (
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

            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hRich}</h2>
              <p className={paragraph}>{c.pRich[0]}</p>
              <p className={paragraph}>{c.pRich[1]}</p>

              <figure className="my-6">
                <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl bg-slate-900 p-8">
                  {richSprites.map((sprite) => (
                    <SpriteButton
                      key={sprite.id}
                      sprite={sprite}
                      label={sprite.name[lang]}
                      editLabel={c.editLabel}
                      cellPx={7}
                      onClick={() => handleSpriteClick(sprite)}
                    />
                  ))}
                </div>
                <figcaption className="text-xs text-zinc-400 mt-3 text-center">
                  {c.galleryCaption3}
                  <br />
                  {c.galleryHint}
                </figcaption>
              </figure>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.hResolution}</h2>
              {c.pResolution.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
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
