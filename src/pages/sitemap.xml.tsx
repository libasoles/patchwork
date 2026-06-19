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
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/es</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/fr</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles"/>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles/layers-and-pattern-repeat</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles/layers-and-pattern-repeat"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles/layers-and-pattern-repeat"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles/layers-and-pattern-repeat"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles/layers-and-pattern-repeat"/>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles/truchet-tiling</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles/truchet-tiling"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles/truchet-tiling"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles/truchet-tiling"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles/truchet-tiling"/>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles/tile-combinations</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles/tile-combinations"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles/tile-combinations"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles/tile-combinations"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles/tile-combinations"/>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles/tile-groups</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles/tile-groups"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles/tile-groups"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles/tile-groups"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles/tile-groups"/>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles/truchet-in-practice</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles/truchet-in-practice"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles/truchet-in-practice"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles/truchet-in-practice"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles/truchet-in-practice"/>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles/douat</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles/douat"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles/douat"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles/douat"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles/douat"/>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles/douat-256-designs</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/articles/douat-256-designs"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/es/articles/douat-256-designs"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${siteUrl}/fr/articles/douat-256-designs"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/articles/douat-256-designs"/>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.write(sitemap)
  res.end()

  return { props: {} }
}
