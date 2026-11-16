'use client'

import React from 'react'
import { Phone, MessageSquare, ChevronRight, ShieldCheck } from 'lucide-react'
import { SiteSettings } from '@/lib/types'
import { getWhatsAppLink } from '@/lib/utils'

interface FinalCtaProps {
  settings: SiteSettings
  onOpenQuote: () => void
}

export default function FinalCta({ settings, onOpenQuote }: FinalCtaProps) {
  const phone1 = settings.phone1 || '08 84 97 25'
  const whatsappNumber = settings.whatsapp || '+22508849725'
  const whatsappUrl = getWhatsAppLink(
    whatsappNumber,
    'Bonjour PREVENIX, je souhaite échanger avec un conseiller au sujet de mes contrats d’assurance.'
  )

  return (
    <section className="py-24 bg-prevenix-navy text-white relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-prevenix-blue blur-[120px]" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-prevenix-red blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6">
          <ShieldCheck className="w-4 h-4 text-prevenix-blue" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Votre Partenaire Assurance en Côte d'Ivoire
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
          « {settings.cta_title || 'Votre protection commence par le bon conseil.'} »
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          {settings.cta_subtitle ||
            'Faites confiance à PREVENIX pour vous accompagner dans le choix de vos solutions d’assurance.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenQuote}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-prevenix-red hover:bg-prevenix-red-dark active:scale-[0.98] rounded-xl shadow-xl shadow-prevenix-red/30 transition-all duration-200 group"
          >
            <span>Demander un devis gratuit</span>
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            Contactez-nous
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] rounded-xl shadow-lg transition-all duration-200 gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>WhatsApp direct</span>
          </a>
        </div>

        {/* Direct phone shortcut */}
        <div className="mt-10 pt-8 border-t border-white/10 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6">
          <span>Cocody Angré Djibi, 100 m avant la station Shell</span>
          <span className="hidden sm:inline">•</span>
          <a
            href={`tel:${phone1.replace(/\s+/g, '')}`}
            className="text-white font-bold hover:text-prevenix-blue-light transition inline-flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-prevenix-red" />
            Ligne directe : {phone1}
          </a>
        </div>
      </div>
    </section>
  )
}
