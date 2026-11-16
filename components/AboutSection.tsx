'use client'

import React from 'react'
import { CheckCircle2, Shield, HeartHandshake, Eye, Award } from 'lucide-react'
import { SiteSettings } from '@/lib/types'

interface AboutSectionProps {
  settings: SiteSettings
  onOpenQuote: () => void
}

export default function AboutSection({ settings, onOpenQuote }: AboutSectionProps) {
  return (
    <section id="a-propos" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with Official Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative borders */}
              <div className="absolute -top-4 -left-4 w-48 h-48 bg-prevenix-blue/15 rounded-3xl -z-10" />
              <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-prevenix-red/15 rounded-3xl -z-10" />

              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 relative">
                <img
                  src="/images/campaigns/affiche-partenariat-confiance.png"
                  alt="PREVENIX - Partenaire de confiance"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Stat card */}
              <div className="absolute -bottom-8 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-200/80 max-w-[240px] hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-prevenix-blue/15 flex items-center justify-center text-prevenix-blue">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-prevenix-navy">Courtier Agréé</p>
                    <p className="text-[11px] text-slate-500">Cocody Angré Djibi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission, Vision, Commitments */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prevenix-blue/10 text-prevenix-blue text-xs font-bold uppercase tracking-wider mb-3">
              Notre Institution
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-prevenix-navy tracking-tight mb-6">
              {settings.about_title || 'PREVENIX, votre partenaire de confiance.'}
            </h2>

            <div className="prose prose-slate text-slate-600 text-base leading-relaxed space-y-4 mb-8">
              <p>
                {settings.about_text ||
                  "PREVENIX est une société de courtage d'assurances en Côte d'Ivoire, dédiée à la protection des particuliers, des familles et des entreprises. Contrairement à un agent général lié à une seule marque, nous sommes 100% indépendants : nous négocions pour vous auprès des plus grandes compagnies du marché ivoirien pour vous garantir le meilleur rapport garanties/prix et un accompagnement sans faille en cas de sinistre."}
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-prevenix-gray border border-slate-200">
                <div className="flex items-center gap-2.5 mb-2 text-prevenix-navy font-bold text-base">
                  <HeartHandshake className="w-5 h-5 text-prevenix-blue" />
                  <h4>Notre Mission</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Démocratiser l’accès à une protection de qualité en Côte d’Ivoire, éliminer les pièges des petits caractères et assurer la défense sans compromis de nos clients.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-prevenix-gray border border-slate-200">
                <div className="flex items-center gap-2.5 mb-2 text-prevenix-navy font-bold text-base">
                  <Eye className="w-5 h-5 text-prevenix-red" />
                  <h4>Notre Vision</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Devenir le courtier de référence pour chaque famille et entreprise ivoirienne en alliant rigueur technique, écoute humaine et réactivité immédiate.
                </p>
              </div>
            </div>

            {/* 3 Strong Commitments */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-800">
                  Transparence totale sur les tarifs et franchises sans mauvaise surprise
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-800">
                  Prise en charge active des démarches administratives auprès de la compagnie
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-800">
                  Audit gratuit de vos polices existantes pour identifier les doublons et économies possibles
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <button
                onClick={onOpenQuote}
                className="px-7 py-3 rounded-xl bg-prevenix-navy hover:bg-prevenix-navy-light text-white text-sm font-bold shadow transition"
              >
                Demander un conseil personnalisé
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
