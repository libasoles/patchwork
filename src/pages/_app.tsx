import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NextIntlClientProvider } from 'next-intl'

const GA_MEASUREMENT_ID = 'G-NH8E956H7H'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    import('react-ga4').then(({ default: ReactGA }) => {
      ReactGA.initialize(GA_MEASUREMENT_ID)
      ReactGA.send({ hitType: 'pageview', page: router.asPath })
    })
  }, [router.asPath])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      import('react-ga4').then(({ default: ReactGA }) => {
        ReactGA.send({ hitType: 'pageview', page: url })
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
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
  )
}
