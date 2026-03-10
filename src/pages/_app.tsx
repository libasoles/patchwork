import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NextIntlClientProvider } from 'next-intl'

export default function App({ Component, pageProps }: AppProps) {
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
