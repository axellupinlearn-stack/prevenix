'use client'

import React, { useState } from 'react'
import {
  X,
  Shield,
  CheckCircle2,
  AlertCircle,
  Car,
  HeartPulse,
  Home,
  Briefcase,
  Layers,
} from 'lucide-react'

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  initialCategory?: string
}

export default function QuoteModal({
  isOpen,
  onClose,
  initialCategory,
}: QuoteModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    insurance_type: initialCategory || 'Assurance Automobile',
    details: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const categories = [
    { title: 'Assurance Automobile', icon: Car },
    { title: 'Assurance Santé & Famille', icon: HeartPulse },
    { title: 'Assurance Habitation & Biens', icon: Home },
    { title: 'Assurance Vie & Prévoyance', icon: Shield },
    { title: 'Assurance Professionnelle', icon: Briefcase },
    { title: 'Autres Solutions', icon: Layers },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’envoi')
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-prevenix-navy to-prevenix-blue text-white p-6 relative">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-prevenix-red text-white uppercase tracking-wider mb-2 inline-block">
            Gratuit & Sans Engagement
          </span>

          <h3 className="text-xl sm:text-2xl font-bold">
            Demande de Devis d'Assurance
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Recevez les meilleures propositions négociées par PREVENIX sous 24h.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-prevenix-navy">
                Demande transmise avec succès !
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Notre équipe de courtiers étudie votre dossier auprès des compagnies partenaires et vous recontacte très rapidement.
              </p>
              <button
                onClick={() => {
                  setSuccess(false)
                  onClose()
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-prevenix-navy text-white text-sm font-bold shadow"
              >
                Fermer la fenêtre
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Category picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Choisissez le type d'assurance *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((c) => {
                    const Icon = c.icon
                    const isSelected = formData.insurance_type === c.title
                    return (
                      <button
                        type="button"
                        key={c.title}
                        onClick={() => setFormData({ ...formData, insurance_type: c.title })}
                        className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center text-center gap-1.5 transition border ${
                          isSelected
                            ? 'bg-prevenix-blue text-white border-prevenix-blue shadow'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="line-clamp-1">{c.title.replace('Assurance ', '')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Personal details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom complet"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Téléphone (avec WhatsApp si possible) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex : 07 00 00 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Adresse E-mail
                </label>
                <input
                  type="email"
                  placeholder="votre.email@domaine.ci"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Précisions sur votre besoin
                </label>
                <textarea
                  rows={2}
                  placeholder="Véhicule, personnes à couvrir, budget..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-prevenix-blue resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-prevenix-red hover:bg-prevenix-red-dark text-white font-bold text-sm shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>{loading ? 'Enregistrement...' : 'Obtenir mon comparatif gratuit'}</span>
                </button>
              </div>

              <p className="text-center text-[10px] text-slate-400">
                L'équipe PREVENIX s'engage à traiter vos coordonnées dans le respect absolu de la confidentialité.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
