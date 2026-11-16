'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import TrustValues from '@/components/TrustValues'
import InsuranceSolutions from '@/components/InsuranceSolutions'
import ComparatorPillars from '@/components/ComparatorPillars'
import AboutSection from '@/components/AboutSection'
import NewsSection from '@/components/NewsSection'
import MediaGallery from '@/components/MediaGallery'
import ContactQuoteSection from '@/components/ContactQuoteSection'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'
import QuoteModal from '@/components/QuoteModal'
import { SiteSettings, InsuranceSolution, Article, MediaItem } from '@/lib/types'
import { initialData } from '@/lib/initial-data'

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings>(initialData.settings)
  const [solutions, setSolutions] = useState<InsuranceSolution[]>(initialData.solutions)
  const [articles, setArticles] = useState<Article[]>(initialData.articles)
  const [media, setMedia] = useState<MediaItem[]>(initialData.media)

  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [quoteSelectedCategory, setQuoteSelectedCategory] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Fetch live data from database API
    const loadData = async () => {
      try {
        const [resSettings, resSolutions, resArticles, resMedia] = await Promise.all([
          fetch('/api/settings').then((r) => r.json()),
          fetch('/api/solutions?activeOnly=true').then((r) => r.json()),
          fetch('/api/articles?publishedOnly=true').then((r) => r.json()),
          fetch('/api/media').then((r) => r.json()),
        ])

        if (resSettings && !resSettings.error) setSettings(resSettings)
        if (Array.isArray(resSolutions)) setSolutions(resSolutions)
        if (Array.isArray(resArticles)) setArticles(resArticles)
        if (Array.isArray(resMedia)) setMedia(resMedia)
      } catch (err) {
        console.warn('Utilisation des données initiales par défaut', err)
      }
    }

    loadData()
  }, [])

  const handleOpenQuote = (category?: string) => {
    if (category) {
      if (category === 'auto') setQuoteSelectedCategory('Assurance Automobile')
      else if (category === 'sante') setQuoteSelectedCategory('Assurance Santé & Famille')
      else if (category === 'habitation') setQuoteSelectedCategory('Assurance Habitation & Biens')
      else if (category === 'pro') setQuoteSelectedCategory('Assurance Professionnelle')
      else setQuoteSelectedCategory(category)
    } else {
      setQuoteSelectedCategory('Assurance Automobile')
    }
    setQuoteModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        siteSettings={settings}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Hero Section */}
      <HeroSection
        settings={settings}
        onOpenQuote={handleOpenQuote}
      />

      {/* Trust Values Section (Proximité, Accompagnement, Conseil, Confiance) */}
      <TrustValues />

      {/* Insurance Solutions Section (Dynamic CRUD) */}
      <InsuranceSolutions
        solutions={solutions}
        onOpenQuote={handleOpenQuote}
      />

      {/* The 4 Pillars & Comparator Section (Poster 61: 1. Meilleure assurance, 2. Meilleur Prix/Garanties, 3. Meilleure prestation sinistre, 4. Meilleur suivi) */}
      <ComparatorPillars />

      {/* About Section (Institution, Mission, Vision, Commitments) */}
      <AboutSection
        settings={settings}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* News & Expert Advice Section */}
      <NewsSection
        articles={articles}
      />

      {/* Media Gallery (Photos, Videos, Official Posters) */}
      <MediaGallery
        media={media}
      />

      {/* Contact & Quote Section */}
      <ContactQuoteSection
        settings={settings}
      />

      {/* Final Call to Action */}
      <FinalCta
        settings={settings}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Premium Footer */}
      <Footer
        settings={settings}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Floating WhatsApp Direct Button */}
      <WhatsAppFloatingButton
        whatsappNumber={settings.whatsapp}
      />

      {/* Interactive Quick Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialCategory={quoteSelectedCategory}
      />
    </div>
  )
}
