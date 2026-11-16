import React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07164D',
}

export const metadata: Metadata = {
  title: "PREVENIX Assurances | Votre meilleure assurance, c'est votre courtier — Côte d'Ivoire",
  description:
    "Société de Courtage d'Assurances en Côte d'Ivoire. Nous comparons et négocions pour vous les meilleures garanties au juste prix : Auto, Santé & Famille, Habitation, Vie, Risques Professionnels à Cocody Angré Djibi, Abidjan.",
  keywords: [
    'courtier assurance côte d ivoire',
    'assurance abidjan',
    'prevenix assurances',
    'assurance auto abidjan',
    'assurance santé famille côte d ivoire',
    'courtier cocody angré djibi',
    'comparateur assurance abidjan',
    'assurance habitation abidjan',
    'assurance vie prévoyance abidjan',
    'multirisque professionnelle côte d ivoire',
  ],
  authors: [{ name: 'PREVENIX Assurances' }],
  creator: 'PREVENIX',
  publisher: 'PREVENIX Assurances Internationales',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://prevenix.ci',
    siteName: 'PREVENIX Assurances',
    title: "PREVENIX Assurances | Votre meilleure assurance, c'est votre courtier",
    description:
      "Société de Courtage d'Assurances en Côte d'Ivoire. Votre sérénité mérite le meilleur accompagnement.",
    images: [
      {
        url: '/images/campaigns/affiche-sourire-courtier.png',
        width: 1104,
        height: 1000,
        alt: "PREVENIX Assurances - Votre meilleure assurance, c'est votre courtier",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "PREVENIX Assurances | Votre meilleure assurance, c'est votre courtier",
    description: "Société de Courtage d'Assurances en Côte d'Ivoire.",
    images: ['/images/campaigns/affiche-sourire-courtier.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: 'PREVENIX Assurances',
    alternateName: "PREVENIX - Société de Courtage d'Assurances",
    description:
      "Société de courtage d'assurances en Côte d'Ivoire : Auto, Santé, Habitation, Vie et Professionnelle.",
    url: 'https://prevenix.ci',
    logo: 'https://prevenix.ci/images/logo.png',
    telephone: ['+22508849725', '+22503434325'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Cocody Angré Djibi, 100 m avant la station Shell',
      addressLocality: 'Abidjan',
      addressRegion: 'Lagunes',
      addressCountry: 'CI',
    },
    openingHours: ['Mo-Fr 08:00-18:00', 'Sa 08:30-13:00'],
    priceRange: 'FCFA',
    areaServed: "Côte d'Ivoire",
  }

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-prevenix-blue selection:text-white">
        {children}
      </body>
    </html>
  )
}
