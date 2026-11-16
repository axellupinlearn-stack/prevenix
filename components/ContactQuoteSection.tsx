'use client'

import React, { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { SiteSettings } from '@/lib/types'
import { getWhatsAppLink } from '@/lib/utils'

interface ContactQuoteSectionProps {
  settings: SiteSettings
}

export default function ContactQuoteSection({ settings }: ContactQuoteSectionProps) {
  const [activeTab, setActiveTab] = useState<'quote' | 'message'>('quote')

  // Quote form state
  const [quoteData, setQuoteData] = useState({
    full_name: '',
    phone: '',
    email: '',
    insurance_type: 'Assurance Automobile',
    details: '',
  })
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)
  const [quoteSuccess, setQuoteSuccess] = useState(false)
  const [quoteError, setQuoteError] = useState('')

  // Contact form state
  const [contactData, setContactData] = useState({
    full_name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactError, setContactError] = useState('')

  const phone1 = settings.phone1 || '08 84 97 25'
  const phone2 = settings.phone2 || '03 43 43 25'
  const address = settings.address || 'Cocody Angré Djibi, 100 m avant la station Shell'
  const email = settings.email || 'contact@prevenix.ci'
  const whatsappNumber = settings.whatsapp || '+22508849725'

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setQuoteSubmitting(true)
    setQuoteError('')
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’envoi')
      }
      setQuoteSuccess(true)
      setQuoteData({
        full_name: '',
        phone: '',
        email: '',
        insurance_type: 'Assurance Automobile',
        details: '',
      })
    } catch (err: any) {
      setQuoteError(err.message || 'Une erreur est survenue')
    } finally {
      setQuoteSubmitting(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactSubmitting(true)
    setContactError('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’envoi')
      }
      setContactSuccess(true)
      setContactData({
        full_name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err: any) {
      setContactError(err.message || 'Une erreur est survenue')
    } finally {
      setContactSubmitting(false)
    }
  }

  const whatsappDirect = getWhatsAppLink(
    whatsappNumber,
    'Bonjour PREVENIX, je vous contacte depuis votre site web pour une demande d’assurance.'
  )

  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prevenix-blue/10 text-prevenix-blue text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            Nous Rencontrer & Nous Contacter
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-prevenix-navy tracking-tight">
            Prêt à optimiser vos contrats d'assurance ?
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Nos courtiers sont disponibles immédiatement à notre agence de Cocody Angré Djibi, par téléphone ou en ligne.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Coordinates & Interactive Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-prevenix-navy">
                Coordonnées de l'Agence
              </h3>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-prevenix-blue/10 text-prevenix-blue flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Téléphones directs</p>
                  <div className="flex flex-col sm:flex-row sm:gap-3 text-base font-bold text-prevenix-navy mt-0.5">
                    <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="hover:text-prevenix-red transition">
                      {phone1}
                    </a>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="hover:text-prevenix-red transition">
                      {phone2}
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Ligne directe avec un courtier conseil</p>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-prevenix-red/10 text-prevenix-red flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Adresse géographique</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {address}
                  </p>
                  <p className="text-xs text-slate-500">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Courrier électronique</p>
                  <a href={`mailto:${email}`} className="text-sm font-bold text-prevenix-navy hover:underline mt-0.5 block">
                    {email}
                  </a>
                  <p className="text-xs text-slate-500">Réponse garantie sous 24h ouvrées</p>
                </div>
              </div>

              {/* Opening hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Horaires d'ouverture</p>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">
                    Lundi au Vendredi : 8h00 – 18h00
                  </p>
                  <p className="text-xs font-medium text-slate-800">
                    Samedi : 8h30 – 13h00
                  </p>
                </div>
              </div>

              {/* WhatsApp direct card */}
              <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Échange instantané WhatsApp</p>
                  <p className="text-[11px] text-slate-600">Discutez en direct avec un conseiller</p>
                </div>
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a] transition flex items-center gap-1.5 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ouvrir
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-white p-2">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                <iframe
                  title="Localisation PREVENIX Cocody Angré Djibi"
                  src="https://maps.google.com/maps?q=Cocody+Angr%C3%A9+Djibi+Abidjan+Shell&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <a
                  href="https://maps.google.com/?q=Cocody+Angré+Djibi+Shell+Abidjan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-prevenix-blue hover:underline inline-flex items-center gap-1"
                >
                  <span>Ouvrir l'itinéraire dans Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Forms (Tabs: Devis / Contact) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">
            {/* Form Mode Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setActiveTab('quote')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'quote'
                    ? 'bg-prevenix-navy text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Demander un Devis Comparatif
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('message')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'message'
                    ? 'bg-prevenix-navy text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Envoyer un Message
              </button>
            </div>

            {/* TAB 1: QUOTE FORM */}
            {activeTab === 'quote' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-prevenix-navy">
                    Demande de devis gratuite & sans engagement
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Renseignez vos coordonnées, notre équipe compare les offres des assureurs et vous recontacte avec la meilleure proposition.
                  </p>
                </div>

                {quoteSuccess && (
                  <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Demande de devis enregistrée avec succès !</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Un conseiller PREVENIX étudie votre demande et vous appellera sous peu au numéro indiqué.
                      </p>
                      <button
                        onClick={() => setQuoteSuccess(false)}
                        className="mt-3 text-xs font-bold text-emerald-800 underline"
                      >
                        Soumettre une autre demande
                      </button>
                    </div>
                  </div>
                )}

                {quoteError && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{quoteError}</span>
                  </div>
                )}

                <form onSubmit={handleQuoteSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Nom et Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Koffi Kouamé"
                        value={quoteData.full_name}
                        onChange={(e) => setQuoteData({ ...quoteData, full_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Numéro de Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex : 07 00 00 00 00"
                        value={quoteData.phone}
                        onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Adresse E-mail
                      </label>
                      <input
                        type="email"
                        placeholder="Ex : koffi@domaine.ci"
                        value={quoteData.email}
                        onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Type d'Assurance Souhaité *
                      </label>
                      <select
                        value={quoteData.insurance_type}
                        onChange={(e) => setQuoteData({ ...quoteData, insurance_type: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue bg-white"
                      >
                        <option value="Assurance Automobile">Assurance Automobile (Zen)</option>
                        <option value="Assurance Santé & Famille">Assurance Santé & Famille</option>
                        <option value="Assurance Habitation & Biens">Assurance Habitation & Biens</option>
                        <option value="Assurance Vie & Prévoyance">Assurance Vie & Prévoyance</option>
                        <option value="Assurance Professionnelle">Assurance Professionnelle & Entreprise</option>
                        <option value="Autres Solutions">Autres Solutions (Voyage, BTP, Transport)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Précisions sur votre besoin (Marque véhicule, nombre de personnes, budget...)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Précisez votre demande pour une étude ultra-rapide..."
                      value={quoteData.details}
                      onChange={(e) => setQuoteData({ ...quoteData, details: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-prevenix-navy to-prevenix-blue hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Shield className="w-5 h-5 text-prevenix-red" />
                    <span>{quoteSubmitting ? 'Enregistrement en cours...' : 'Envoyer ma demande de devis'}</span>
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    🔒 Vos données restent strictement confidentielles et ne seront jamais partagées à des tiers non autorisés.
                  </p>
                </form>
              </div>
            )}

            {/* TAB 2: GENERAL CONTACT FORM */}
            {activeTab === 'message' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-prevenix-navy">
                    Formulaire de Contact
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Une question, une demande de partenariat ou besoin d'un renseignement ? Écrivez-nous directement.
                  </p>
                </div>

                {contactSuccess && (
                  <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Message envoyé avec succès !</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Merci pour votre message. Notre service client prendra contact avec vous dans les plus brefs délais.
                      </p>
                      <button
                        onClick={() => setContactSuccess(false)}
                        className="mt-3 text-xs font-bold text-emerald-800 underline"
                      >
                        Envoyer un autre message
                      </button>
                    </div>
                  </div>
                )}

                {contactError && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{contactError}</span>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Nom et Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom complet"
                        value={contactData.full_name}
                        onChange={(e) => setContactData({ ...contactData, full_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Numéro de contact"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Adresse E-mail
                      </label>
                      <input
                        type="email"
                        placeholder="votre.email@domaine.ci"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Information contrat auto"
                        value={contactData.subject}
                        onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Votre Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Expliquez-nous votre demande..."
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-prevenix-blue resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-4 rounded-xl bg-prevenix-navy hover:bg-prevenix-navy-light text-white font-bold text-sm sm:text-base shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 text-prevenix-blue" />
                    <span>{contactSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
