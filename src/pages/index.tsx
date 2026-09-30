import Head from "next/head";
import App from "../components/App";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

interface HomeProps {
  siteUrl: string;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Patchwork",
  description:
    "Create infinite geometric patterns with modular tiles, inspired by Sébastien Truchet's 1704 tiling system.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  inLanguage: ["en", "es", "fr"],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  about: {
    "@type": "Thing",
    name: "Truchet tiling",
    description:
      "A system of square modular tiles, each divided diagonally into two contrasting sections, arranged to generate an infinite variety of geometric patterns. Documented by Dominique Douat in 1722 based on the work of Sébastien Truchet.",
  },
};

export default function Home({ siteUrl }: HomeProps) {
  const t = useTranslations("meta");
  const { locale } = useRouter();

  const canonicalUrl = locale === "en" ? siteUrl : `${siteUrl}/${locale}`;
  const ogLocaleMap: Record<string, string> = { en: "en_US", es: "es_ES", fr: "fr_FR" };
  const ogLocale = ogLocaleMap[locale ?? "en"] ?? "en_US";
  const altLocales = Object.entries(ogLocaleMap).filter(([l]) => l !== locale).map(([, v]) => v);

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta charSet="utf-8" />
        <meta name="description" content={t("description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />

        {siteUrl && (
          <>
            <link rel="canonical" href={canonicalUrl} />
            <link rel="alternate" hrefLang="en" href={siteUrl} />
            <link rel="alternate" hrefLang="es" href={`${siteUrl}/es`} />
            <link rel="alternate" hrefLang="fr" href={`${siteUrl}/fr`} />
            <link rel="alternate" hrefLang="x-default" href={siteUrl} />
          </>
        )}

        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("title")} />
        <meta property="og:description" content={t("description")} />
        <meta property="og:site_name" content="Patchwork" />
        <meta property="og:locale" content={ogLocale} />
        {altLocales.map((alt) => (
          <meta key={alt} property="og:locale:alternate" content={alt} />
        ))}
        {siteUrl && (
          <>
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={`${siteUrl}/screenshots/Screenshot.png`} />
            <meta property="og:image:alt" content={t("ogImageAlt")} />
          </>
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("title")} />
        <meta name="twitter:description" content={t("description")} />
        {siteUrl && (
          <meta name="twitter:image" content={`${siteUrl}/screenshots/Screenshot.png`} />
        )}

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <link rel="preload" href="/icons/default.png" as="image" />
        <link rel="preload" href="/icons/pointer.png" as="image" />
        <link rel="preload" href="/icons/draw.png" as="image" />
        <link rel="preload" href="/icons/paint.png" as="image" />
        <link rel="preload" href="/icons/move.png" as="image" />
        <link rel="preload" href="/icons/rotate.png" as="image" />
        <link rel="preload" href="/icons/delete.png" as="image" />
        <link rel="preload" href="/icons/forbiden.png" as="image" />
      </Head>
      <App />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      locale,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};
