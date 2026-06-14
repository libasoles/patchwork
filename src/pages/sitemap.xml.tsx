import { GetServerSideProps } from 'next'

export default function Sitemap() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <url>
    <loc>${siteUrl}/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/es</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.write(sitemap)
  res.end()

  return { props: {} }
}
