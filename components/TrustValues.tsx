'use client'

import React from 'react'
import { MapPin, UserCheck, Compass, Shield } from 'lucide-react'

export default function TrustValues() {
  const values = [
    {
      icon: MapPin,
      title: 'Proximité',
      subtitle: 'À vos côtés à Cocody Angré',
      description:
        'Une présence physique accessible à Cocody Angré Djibi et une équipe disponible pour vous recevoir, vous écouter et intervenir rapidement.',
      color: 'from-blue-600/10 to-prevenix-blue/20',
      iconColor: 'text-prevenix-blue',
      borderColor: 'group-hover:border-prevenix-blue',
    },
    {
      icon: UserCheck,
      title: 'Accompagnement',
      subtitle: 'Un suivi continu et personnalisé',
      description:
        'De l’audit initial de vos contrats jusqu’au règlement complet de vos sinistres, votre conseiller dédié veille scrupuleusement sur vos intérêts.',
      color: 'from-emerald-600/10 to-teal-500/20',
      iconColor: 'text-emerald-600',
      borderColor: 'group-hover:border-emerald-500',
    },
    {
      icon: Compass,
      title: 'Conseil',
      subtitle: 'L’expertise indépendante',
      description:
        'En tant que courtier indépendant, nous sélectionnons les solutions les plus pertinentes du marché ivoirien sans aucun parti pris commercial.',
      color: 'from-amber-600/10 to-yellow-500/20',
      iconColor: 'text-amber-600',
      borderColor: 'group-hover:border-amber-500',
    },
    {
      icon: Shield,
      title: 'Confiance',
      subtitle: 'Une relation transparente et durable',
      description:
        'Clarté des conditions, explication rigoureuse des garanties et défense active de vos droits face aux compagnies d’assurance.',
      color: 'from-prevenix-red/10 to-rose-500/20',
      iconColor: 'text-prevenix-red',
      borderColor: 'group-hover:border-prevenix-red',
    },
  ]

  return (
    <section className="py-20 bg-prevenix-gray relative overflow-hidden">
      {/* Background soft styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prevenix-blue/10 text-prevenix-blue text-xs font-bold uppercase tracking-wider mb-3">
            Nos Piliers Fondamentaux
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-prevenix-navy tracking-tight">
            Les valeurs qui guident chaque engagement de PREVENIX
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Choisir un courtier, c’est choisir un défenseur loyal de vos intérêts. Notre engagement repose sur quatre principes immuables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <div
                key={v.title}
                className={`group relative bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${v.borderColor}`}
              >
                {/* Accent top pill */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className={`w-7 h-7 ${v.iconColor}`} />
                </div>

                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  0{i + 1} • {v.subtitle}
                </div>

                <h3 className="text-xl font-bold text-prevenix-navy mb-3 group-hover:text-prevenix-blue transition-colors">
                  {v.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {v.description}
                </p>

                {/* Subtle bottom line */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-400 group-hover:text-prevenix-navy transition-colors">
                  <span>Engagement garanti</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
