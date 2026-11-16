'use client'

import React, { useState } from 'react'
import {
  Car,
  HeartPulse,
  Home,
  ShieldCheck,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
  Phone,
} from 'lucide-react'
import { InsuranceSolution } from '@/lib/types'

interface InsuranceSolutionsProps {
  solutions: InsuranceSolution[]
  onOpenQuote: (solutionTitle?: string) => void
}

const iconMap: Record<string, any> = {
  Car,
  HeartPulse,
  Home,
  ShieldCheck,
  Briefcase,
  Layers,
}

export default function InsuranceSolutions({
  solutions,
  onOpenQuote,
}: InsuranceSolutionsProps) {
  const [activeModalSolution, setActiveModalSolution] = useState<InsuranceSolution | null>(null)

  // Filter active solutions and sort by order_num
  const displaySolutions = solutions
    .filter((s) => s.is_active)
    .sort((a, b) => a.order_num - b.order_num)

  return (
    <section id="assurances" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prevenix-blue/10 text-prevenix-blue text-xs font-bold uppercase tracking-wider mb-3">
              Couverture Complète
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-prevenix-navy tracking-tight">
              Nos Solutions d'Assurance
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Particuliers, familles et professionnels : découvrez notre gamme d'assurances sélectionnées auprès des meilleures compagnies de Côte d'Ivoire.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onOpenQuote()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-prevenix-navy text-white text-sm font-semibold hover:bg-prevenix-navy-light transition shadow-sm"
            >
              <span>Comparer toutes les offres</span>
              <ArrowRight className="w-4 h-4 text-prevenix-blue" />
            </button>
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displaySolutions.map((sol) => {
            const Icon = iconMap[sol.icon] || ShieldCheck
            return (
              <div
                key={sol.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Image Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={sol.image_url || '/images/hero/man-smiling-blue.jpg'}
                    alt={sol.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-prevenix-navy/80 via-transparent to-transparent opacity-60" />

                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-prevenix-navy group-hover:bg-prevenix-red group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-prevenix-navy group-hover:text-prevenix-blue transition-colors mb-3">
                      {sol.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {sol.short_desc}
                    </p>

                    {/* Features list */}
                    {sol.features && sol.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {sol.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-prevenix-blue shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalSolution(sol)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-prevenix-blue hover:text-prevenix-navy transition-colors"
                    >
                      <span>En savoir plus</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenQuote(sol.title)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-prevenix-gray text-prevenix-navy hover:bg-prevenix-red hover:text-white transition-colors"
                    >
                      Devis express
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Solution Modal */}
      {activeModalSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header Image */}
            <div className="relative h-48 sm:h-56 w-full bg-prevenix-navy overflow-hidden">
              <img
                src={activeModalSolution.image_url || '/images/hero/man-smiling-blue.jpg'}
                alt={activeModalSolution.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-prevenix-navy via-prevenix-navy/60 to-transparent" />
              
              <button
                onClick={() => setActiveModalSolution(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-prevenix-red text-white uppercase tracking-wider mb-2 inline-block">
                  PREVENIX Courtage
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {activeModalSolution.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Présentation détaillée
                </h4>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {activeModalSolution.full_desc || activeModalSolution.short_desc}
                </p>
              </div>

              {activeModalSolution.features && activeModalSolution.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Principaux avantages & garanties
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeModalSolution.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-prevenix-blue shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-prevenix-blue/10 border border-prevenix-blue/20 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-prevenix-blue shrink-0" />
                <p className="text-xs text-slate-700">
                  Notre équipe de courtiers négocie directement les conditions avec les assureurs pour vous faire bénéficier du meilleur tarif en vigueur.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalSolution(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition"
              >
                Fermer
              </button>

              <button
                onClick={() => {
                  const title = activeModalSolution.title
                  setActiveModalSolution(null)
                  onOpenQuote(title)
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-prevenix-red hover:bg-prevenix-red-dark text-white text-sm font-bold shadow transition"
              >
                Demander un devis pour cette assurance
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
