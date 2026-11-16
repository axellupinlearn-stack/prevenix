'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Linkedin,
  Instagram,
  Shield,
  X,
  ChevronRight,
} from 'lucide-react'
import PrevenixLogo from './PrevenixLogo'
import { SiteSettings } from '@/lib/types'

interface FooterProps {
  settings: SiteSettings
  onOpenQuote?: () => void
}

export default function Footer({ settings, onOpenQuote }: FooterProps) {
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)

  const currentYear = new Date().getFullYear()

  const phone1 = settings.phone1 || '08 84 97 25'
  const phone2 = settings.phone2 || '03 43 43 25'
  const address = settings.address || 'Cocody Angré Djibi, 100 m avant la station Shell'
  const email = settings.email || 'contact@prevenix.ci'

  const insuranceLinks = [
    { name: 'Assurance Automobile (Zen)', href: '#assurances' },
    { name: 'Assurance Santé & Famille', href: '#assurances' },
    { name: 'Assurance Habitation & Biens', href: '#assurances' },
    { name: 'Assurance Vie & Prévoyance', href: '#assurances' },
    { name: 'Assurance Professionnelle', href: '#assurances' },
    { name: 'Autres Solutions d’Assurance', href: '#assurances' },
  ]

  const quickLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Pourquoi un courtier ?', href: '#comparateur' },
    { name: 'À Propos de PREVENIX', href: '#a-propos' },
    { name: 'Actualités & Conseils', href: '#actualites' },
    { name: 'Galerie & Campagnes', href: '#galerie' },
    { name: 'Nous contacter', href: '#contact' },
  ]

  return (
    <footer className="bg-prevenix-navy-dark text-slate-300 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-block p-2 bg-white rounded-xl">
              <PrevenixLogo width={200} />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              PREVENIX est une société de courtage d’assurances indépendante en Côte d’Ivoire. Nous conseillons, négocions et gérons pour vous les meilleures garanties au juste prix.
            </p>

            <div className="text-xs text-slate-300 font-medium italic border-l-2 border-prevenix-red pl-3 py-1">
              « {settings.slogan || "Votre meilleure assurance, c'est votre courtier."} »
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook PREVENIX"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-prevenix-blue hover:text-white flex items-center justify-center transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn PREVENIX"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-prevenix-blue hover:text-white flex items-center justify-center transition"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram PREVENIX"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-prevenix-red hover:text-white flex items-center justify-center transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Insurance Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-prevenix-blue" />
              Nos Assurances
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {insuranceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-slate-400"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-slate-400"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">
              Contact & Agence
            </h4>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-prevenix-red shrink-0 mt-0.5" />
              <span>{address}, Abidjan, Côte d'Ivoire</span>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <Phone className="w-4 h-4 text-prevenix-blue shrink-0 mt-0.5" />
              <div>
                <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="hover:text-white font-bold block">
                  {phone1}
                </a>
                <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="hover:text-white font-bold block mt-0.5">
                  {phone2}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>Lun - Ven : 8h00 - 18h00 | Sam : 8h30 - 13h00</span>
            </div>

            {onOpenQuote && (
              <button
                onClick={onOpenQuote}
                className="mt-3 w-full py-2.5 px-4 rounded-xl bg-prevenix-red hover:bg-prevenix-red-dark text-white text-xs font-bold transition shadow"
              >
                Demander un devis en ligne
              </button>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} PREVENIX — {settings.denomination || "Société de Courtage d'Assurances"}. Tous droits réservés.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModalOpen(true)}
              className="hover:text-slate-300 transition underline"
            >
              Mentions Légales
            </button>
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="hover:text-slate-300 transition underline"
            >
              Politique de Confidentialité
            </button>
            <Link
              href="/admin/login"
              className="hover:text-white transition font-medium text-slate-400"
            >
              Administration
            </Link>
          </div>
        </div>
      </div>

      {/* Mentions Légales Modal */}
      {legalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setLegalModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-prevenix-navy mb-4">
              Mentions Légales
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Dénomination :</strong> PREVENIX, Société de Courtage d'Assurances.
              </p>
              <p>
                <strong>Siège social :</strong> Cocody Angré Djibi, 100 m avant la station Shell, Abidjan, Côte d'Ivoire.
              </p>
              <p>
                <strong>Téléphones :</strong> {phone1} / {phone2}
              </p>
              <p>
                <strong>Email :</strong> {email}
              </p>
              <p>
                <strong>Activité :</strong> Courtage et intermédiation en assurances en République de Côte d'Ivoire. PREVENIX exerce sous l'agrément et les réglementations en vigueur du Code CIMA (Conférence Interafricaine des Marchés d'Assurances).
              </p>
              <p>
                <strong>Hébergement :</strong> Infrastructure sécurisée Next.js / Cloud Server.
              </p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setLegalModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-prevenix-navy text-white text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Politique de Confidentialité Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-prevenix-navy mb-4">
              Politique de Confidentialité
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                PREVENIX accorde une importance capitale à la protection de la vie privée de ses clients et prospects.
              </p>
              <p>
                <strong>Collecte des données :</strong> Les données collectées via nos formulaires (nom, téléphone, email, nature du risque) sont exclusivement réservées à l'établissement de vos devis comparatifs et à la gestion de vos contrats.
              </p>
              <p>
                <strong>Non-cession :</strong> Vos informations ne sont jamais vendues ou cédées à des organismes de télémarketing tiers.
              </p>
              <p>
                <strong>Vos droits :</strong> Vous disposez à tout moment d'un droit d'accès, de rectification et de suppression de vos données personnelles en contactant notre délégué à la protection des données à {email}.
              </p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-prevenix-navy text-white text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
