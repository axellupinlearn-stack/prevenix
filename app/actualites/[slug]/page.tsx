import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
} from 'lucide-react'
import { getArticleBySlug, getArticles, getSettings } from '@/lib/db'
import { formatDateFr } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) {
    return { title: 'Article non trouvé | PREVENIX Assurances' }
  }
  return {
    title: `${article.title} | PREVENIX Assurances Côte d'Ivoire`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.cover_image || '/images/hero/man-smiling-blue.jpg'],
    },
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const [article, allArticles, settings] = await Promise.all([
    getArticleBySlug(params.slug),
    getArticles(true),
    getSettings(),
  ])

  if (!article || !article.is_published) {
    notFound()
  }

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar siteSettings={settings} />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Back */}
          <div className="mb-6">
            <Link
              href="/#actualites"
              className="inline-flex items-center gap-2 text-xs font-bold text-prevenix-blue hover:text-prevenix-navy transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à toutes les actualités</span>
            </Link>
          </div>

          {/* Article Header Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl mb-12">
            {/* Cover image */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
              <img
                src={article.cover_image || '/images/hero/man-smiling-blue.jpg'}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-prevenix-navy via-prevenix-navy/40 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-prevenix-red text-white uppercase tracking-wider shadow">
                  {article.category}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {article.title}
                </h1>
              </div>
            </div>

            {/* Meta bar */}
            <div className="px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="w-4 h-4 text-prevenix-blue" />
                  {article.author || 'L’équipe PREVENIX'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDateFr(article.published_at || article.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {article.read_time || '3 min'}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-slate-400">
                PREVENIX Courtage • Abidjan
              </span>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Summary lead */}
              <div className="p-5 rounded-2xl bg-prevenix-gray border-l-4 border-prevenix-blue text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
                {article.summary}
              </div>

              <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {article.content}
              </div>

              {/* In-article CTA box */}
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-prevenix-navy to-prevenix-blue text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold">Besoin d'un conseil personnalisé ?</h3>
                  <p className="text-xs text-slate-200 mt-1 max-w-md">
                    Nos courtiers comparent gratuitement les assurances pour votre situation en Côte d’Ivoire.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="px-6 py-3 rounded-xl bg-prevenix-red hover:bg-prevenix-red-dark text-white font-bold text-xs uppercase tracking-wider transition shadow shrink-0"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-prevenix-navy">
                Articles complémentaires
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/actualites/${rel.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                        <img
                          src={rel.cover_image || '/images/hero/man-smiling-blue.jpg'}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-prevenix-blue uppercase">
                        {rel.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-2 mt-1 group-hover:text-prevenix-navy transition">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-3 block">
                      {formatDateFr(rel.published_at || rel.created_at)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloatingButton whatsappNumber={settings.whatsapp} />
    </div>
  )
}
