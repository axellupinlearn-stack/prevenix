'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  User,
  X,
  Share2,
  Check,
} from 'lucide-react'
import { Article } from '@/lib/types'
import { formatDateFr } from '@/lib/utils'

interface NewsSectionProps {
  articles: Article[]
}

export default function NewsSection({ articles }: NewsSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [copiedLink, setCopiedLink] = useState(false)

  // Filter published articles
  const publishedArticles = articles.filter((a) => a.is_published)

  const categories = [
    'all',
    ...Array.from(new Set(publishedArticles.map((a) => a.category).filter(Boolean))),
  ]

  const filteredArticles =
    activeCategory === 'all'
      ? publishedArticles
      : publishedArticles.filter((a) => a.category === activeCategory)

  const handleShare = (art: Article) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/actualites/${art.slug}`
      navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <section id="actualites" className="py-24 bg-prevenix-gray relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prevenix-blue/10 text-prevenix-blue text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Magazine & Conseils Pratiques
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-prevenix-navy tracking-tight">
            Actualités & Conseils d'Experts
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Découvrez nos guides, analyses du marché et conseils pour mieux comprendre vos contrats et optimiser votre protection en Côte d’Ivoire.
          </p>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-prevenix-navy text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'Toutes les publications' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Cover image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={art.cover_image || '/images/hero/man-smiling-blue.jpg'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-prevenix-navy/90 text-white backdrop-blur-sm">
                      {art.category}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateFr(art.published_at || art.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {art.read_time || '3 min'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-prevenix-navy group-hover:text-prevenix-blue transition-colors line-clamp-2 mb-3 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">
                    {art.summary}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-prevenix-blue hover:text-prevenix-navy transition-colors"
                >
                  <span>Lire l'article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href={`/actualites/${art.slug}`}
                  className="text-xs text-slate-400 hover:text-prevenix-navy underline"
                >
                  Page dédiée &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95">
            {/* Header Image */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-900 shrink-0">
              <img
                src={selectedArticle.cover_image || '/images/hero/man-smiling-blue.jpg'}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-prevenix-navy via-prevenix-navy/60 to-transparent" />

              <button
                onClick={() => setSelectedArticle(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-prevenix-red text-white uppercase tracking-wider mb-2 inline-block">
                  {selectedArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            {/* Meta bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {selectedArticle.author || 'L’équipe PREVENIX'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDateFr(selectedArticle.published_at || selectedArticle.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.read_time || '3 min'}
                </span>
              </div>

              <button
                onClick={() => handleShare(selectedArticle)}
                className="inline-flex items-center gap-1.5 text-prevenix-blue hover:text-prevenix-navy font-semibold"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lien copié !</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Partager</span>
                  </>
                )}
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="text-slate-600 font-medium italic text-sm sm:text-base border-l-4 border-prevenix-blue pl-4 py-1">
                {selectedArticle.summary}
              </div>

              <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line pt-2">
                {selectedArticle.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Link
                href={`/actualites/${selectedArticle.slug}`}
                className="text-xs font-semibold text-prevenix-blue hover:underline"
              >
                Ouvrir en pleine page
              </Link>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-prevenix-navy text-white text-xs font-bold hover:bg-prevenix-navy-light transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
