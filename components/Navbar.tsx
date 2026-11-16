'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, MapPin, Clock, MessageSquare, Menu, X, Shield, ChevronRight } from 'lucide-react'
import PrevenixLogo from './PrevenixLogo'
import { getWhatsAppLink } from '@/lib/utils'

interface NavbarProps {
  onOpenQuote?: () => void
  siteSettings?: {
    phone1?: string
    phone2?: string
    whatsapp?: string
    address?: string
  }
}

export default function Navbar({ onOpenQuote, siteSettings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const phone1 = siteSettings?.phone1 || '08 84 97 25'
  const phone2 = siteSettings?.phone2 || '03 43 43 25'
  const whatsappNumber = siteSettings?.whatsapp || '+22508849725'
  const address = siteSettings?.address || 'Cocody Angré Djibi, 100 m avant la station Shell'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Nos Assurances', href: '#assurances' },
    { name: 'Pourquoi un courtier ?', href: '#comparateur' },
    { name: 'À Propos', href: '#a-propos' },
    { name: 'Actualités & Conseils', href: '#actualites' },
    { name: 'Galerie', href: '#galerie' },
    { name: 'Contact', href: '#contact' },
  ]

  const whatsappUrl = getWhatsAppLink(
    whatsappNumber,
    'Bonjour PREVENIX, je souhaite obtenir des informations sur vos solutions d’assurance.'
  )

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-prevenix-navy text-white text-xs py-2 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-3.5 h-3.5 text-prevenix-blue" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-3.5 h-3.5 text-prevenix-blue" />
              <span>Lun - Ven : 8h00 - 18h00 | Sam : 8h30 - 13h00</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-white/95 font-medium">
              <Phone className="w-3.5 h-3.5 text-prevenix-red" />
              <span>Contact direct :</span>
              <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="hover:text-prevenix-blue transition">
                {phone1}
              </a>
              <span className="text-white/40">/</span>
              <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="hover:text-prevenix-blue transition">
                {phone2}
              </a>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] px-2.5 py-0.5 rounded-full font-medium transition"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              WhatsApp direct
            </a>

            <Link
              href="/admin/login"
              className="text-white/60 hover:text-white transition text-[11px] border-l border-white/20 pl-3"
            >
              Espace Gestion
            </Link>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3.5'
            : 'bg-white py-5 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <PrevenixLogo width={210} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[14px] font-medium text-slate-700 hover:text-prevenix-blue transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-prevenix-blue hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={onOpenQuote}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-gradient-to-r from-prevenix-navy to-prevenix-blue rounded-full shadow hover:shadow-lg hover:brightness-110 active:scale-95 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-prevenix-red" />
                  Demander un devis
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform ease-in-out" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onOpenQuote}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-prevenix-navy rounded-full shadow sm:hidden"
              >
                Devis
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                className="p-2 rounded-lg text-slate-700 hover:text-prevenix-navy hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[72px] bg-white border-b border-slate-200 shadow-2xl px-6 py-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-800 hover:text-prevenix-blue py-2 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (onOpenQuote) onOpenQuote()
                  }}
                  className="w-full py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-prevenix-navy to-prevenix-blue rounded-xl shadow"
                >
                  Demander un devis gratuit
                </button>

                <a
                  href={`tel:${phone1.replace(/\s+/g, '')}`}
                  className="w-full py-2.5 text-center text-sm font-medium text-prevenix-navy bg-prevenix-gray rounded-xl flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Phone className="w-4 h-4 text-prevenix-red" />
                  Appeler : {phone1}
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 text-center text-sm font-medium text-white bg-[#25D366] rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Discuter sur WhatsApp
                </a>
              </div>

              <div className="pt-3 text-center">
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Accès Espace Administrateur
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
