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
      </Head>
      <App />
    </>
  )
}
