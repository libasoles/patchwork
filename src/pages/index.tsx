import Head from "next/head";
import App from "../components/App";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("meta");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta charSet="utf-16" />
        <meta name="description" content={t("description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/default.png" as="image" />
        <link rel="preload" href="/pointer.png" as="image" />
        <link rel="preload" href="/draw.png" as="image" />
        <link rel="preload" href="/paint.png" as="image" />
        <link rel="preload" href="/move.png" as="image" />
        <link rel="preload" href="/rotate.png" as="image" />
        <link rel="preload" href="/delete.png" as="image" />
        <link rel="preload" href="/forbiden.png" as="image" />
      </Head>
      <App />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};
