import Head from 'next/head'
import App from '../components/App'

export default function Home() {
  return (
    <>
      <Head>
        <title>Patchwork</title>
        <meta name="description" content="Collaborative patchwork" />
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
  )
}
