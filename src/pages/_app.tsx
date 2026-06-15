import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NextIntlClientProvider } from 'next-intl'

const GA_MEASUREMENT_ID = 'G-NH8E956H7H'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag?.('config', GA_MEASUREMENT_ID, { page_path: url })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <NextIntlClientProvider
        locale={pageProps.locale ?? 'en'}
        messages={pageProps.messages ?? {}}
        timeZone="UTC"
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={400}>
            <Component {...pageProps} />
            <Toaster position="bottom-right" duration={6000} />
          </TooltipProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  )
}
