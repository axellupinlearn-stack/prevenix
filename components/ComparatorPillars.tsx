'use client'

import React from 'react'
import {
  ShieldAlert,
  Percent,
  FileCheck,
  Headphones,
  Check,
  X,
  Minus,
  Sparkles,
} from 'lucide-react'

export default function ComparatorPillars() {
  const pillars = [
    {
      num: '01',
      title: 'La meilleure assurance',
      desc: 'Nous étudions l’ensemble des offres du marché ivoirien pour sélectionner le contrat qui répond précisément à vos exigences.',
      icon: ShieldAlert,
      color: 'from-blue-600 to-prevenix-blue',
    },
    {
      num: '02',
      title: 'Le meilleur Prix / Garanties',
      desc: 'Nous négocions des tarifs préférentiels et des surprimes allégées grâce à notre force de négociation auprès des assureurs.',
      icon: Percent,
      color: 'from-emerald-600 to-teal-500',
    },
    {
      num: '03',
      title: 'La meilleure prestation sinistre',
      desc: 'En cas d’accident ou de dommage, nous constituons votre dossier, relançons l’assureur et exigeons votre juste indemnisation.',
      icon: FileCheck,
      color: 'from-prevenix-red to-rose-600',
    },
    {
      num: '04',
      title: 'Le meilleur suivi',
      desc: 'Un conseiller personnel dédié, joignable directement par téléphone et WhatsApp à tout moment pour ajuster vos garanties.',
      icon: Headphones,
      color: 'from-amber-500 to-orange-600',
    },
  ]

  const comparisonRows = [
    {
      criteria: 'Indépendance de conseil',
      prevenix: '100% neutre et dans votre intérêt',
      direct: 'Lié aux produits de sa marque uniquement',
      bank: 'Offres standardisées sans sur-mesure',
    },
    {
      criteria: 'Comparaison multi-assureurs',
      prevenix: true,
      direct: false,
      bank: false,
    },
    {
      criteria: 'Négociation tarifaire personnalisée',
      prevenix: true,
      direct: 'Barèmes fixes stricts',
      bank: false,
    },
    {
      criteria: 'Défense active face à la compagnie en cas de sinistre',
      prevenix: 'Défenseur exclusif du client',
      direct: 'Juge et partie (défend sa compagnie)',
      bank: 'Simple intermédiaire sans gestion sinistre',
    },
    {
      criteria: 'Conseiller dédié joignable à Abidjan',
      prevenix: true,
      direct: 'Selon agence',
      bank: 'Plateforme téléphonique impersonnelle',
    },
  ]

  return (
    <section id="comparateur" className="py-24 bg-gradient-to-b from-white via-prevenix-gray to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prevenix-red/10 text-prevenix-red text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            L’Avantage Courtier
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-prevenix-navy tracking-tight">
            Pourquoi choisir PREVENIX pour vos assurances ?
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            En tant que courtier comparateur en Côte d’Ivoire, nous ne vendons pas des contrats rigides : nous construisons votre sécurité sur mesure.
          </p>
        </div>

        {/* The 4 Official Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.num}
                className="relative bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                {/* Accent top border */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${p.color}`} />

                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-prevenix-blue/30 transition-colors">
                    {p.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-prevenix-navy mb-2 group-hover:text-prevenix-blue transition-colors">
                  {p.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-prevenix-navy text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Tableau comparatif : Courtier vs Autres canaux
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Comprendre la différence fondamentale pour votre tranquillité au quotidien
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-prevenix-blue text-xs font-bold text-white w-fit">
              100% à vos côtés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Critères essentiels</th>
                  <th className="py-4 px-6 text-prevenix-navy font-extrabold bg-blue-50/60">
                    PREVENIX (Courtier)
                  </th>
                  <th className="py-4 px-6">Compagnie Directe</th>
                  <th className="py-4 px-6">Banque / Guichet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {row.criteria}
                    </td>

                    {/* PREVENIX column */}
                    <td className="py-4 px-6 bg-blue-50/40 font-bold text-prevenix-navy">
                      {typeof row.prevenix === 'boolean' ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <Check className="w-5 h-5 bg-emerald-100 rounded-full p-0.5" />
                          <span>Inclus & Garanti</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-prevenix-navy">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{row.prevenix}</span>
                        </div>
                      )}
                    </td>

                    {/* Direct Company column */}
                    <td className="py-4 px-6 text-slate-600">
                      {typeof row.direct === 'boolean' ? (
                        row.direct ? (
                          <Check className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-500">
                            <X className="w-4 h-4" />
                            <span>Non</span>
                          </div>
                        )
                      ) : (
                        <span>{row.direct}</span>
                      )}
                    </td>

                    {/* Bank column */}
                    <td className="py-4 px-6 text-slate-600">
                      {typeof row.bank === 'boolean' ? (
                        row.bank ? (
                          <Check className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-500">
                            <X className="w-4 h-4" />
                            <span>Non</span>
                          </div>
                        )
                      ) : (
                        <span>{row.bank}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
