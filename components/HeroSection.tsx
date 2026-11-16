'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Car,
  HeartPulse,
  Home,
  Briefcase,
  PhoneCall,
} from 'lucide-react'
import { SiteSettings } from '@/lib/types'

interface HeroSectionProps {
  settings: SiteSettings
  onOpenQuote: (selectedCategory?: string) => void
}

export default function HeroSection({ settings, onOpenQuote }: HeroSectionProps) {
  const [selectedQuickType, setSelectedQuickType] = useState('auto')
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = [
    {
      image: '/images/hero/happy-african-family.jpg',
      badge: 'Protection Famille & Santé',
      title: 'La sérénité absolue pour vos proches',
      highlight: 'Votre famille mérite la meilleure couverture',
    },
    {
      image: '/images/hero/man-smiling-blue.jpg',
      badge: 'Courtage & Conseil sur Mesure',
      title: 'Un interlocuteur dédié à votre écoute',
      highlight: 'Votre meilleur allié face aux assureurs',
    },
    {
      image: '/images/hero/auto-zen-car.jpg',
      badge: 'Offre Automobile ZEN',
      title: 'Roulez l’esprit 100% libéré à Abidjan',
      highlight: 'Assistance 24/7 et garanties renforcées',
    },
  ]

  const quickTypes = [
    { id: 'auto', label: 'Automobile', icon: Car },
    { id: 'sante', label: 'Santé Famille', icon: HeartPulse },
    { id: 'habitation', label: 'Habitation', icon: Home },
    { id: 'pro', label: 'Entreprise', icon: Briefcase },
  ]

  return (
    <section id="accueil" className="relative overflow-hidden bg-prevenix-navy text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background visual graphics with modern geometric gradients inspired by PREVENIX */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-prevenix-blue blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-prevenix-red blur-[140px] opacity-40" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-[#1a3a8a] blur-[150px] opacity-60" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Slogan, Messaging & Fast Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 w-fit mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-prevenix-red animate-ping" />
              <span className="text-xs font-semibold tracking-wide uppercase text-blue-200">
                {settings.denomination || "Société de Courtage d'Assurances"} • Côte d'Ivoire
              </span>
            </div>

            {/* Main Headline / Slogan */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.15] mb-6 text-white">
              « {settings.slogan || "Votre meilleure assurance, c'est votre courtier."} »
            </h1>

            {/* Official Accompanying Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-light leading-relaxed mb-8 max-w-2xl">
              {settings.hero_subtitle ||
                "Parce que votre tranquillité d'esprit mérite le meilleur accompagnement, PREVENIX vous aide à trouver des solutions d'assurance adaptées à vos besoins et à votre quotidien."}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={() => onOpenQuote()}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-prevenix-red hover:bg-prevenix-red-dark active:scale-[0.98] rounded-xl shadow-lg shadow-prevenix-red/30 transition-all duration-200 group"
              >
                <span>Demander un devis gratuit</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#assurances"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                Découvrir nos assurances
              </a>
            </div>

            {/* Fast Interactive Quote Selector */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-prevenix-blue" />
                Devis express par catégorie :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {quickTypes.map((t) => {
                  const Icon = t.icon
                  const isSelected = selectedQuickType === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedQuickType(t.id)}
                      className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-prevenix-blue text-white shadow-md'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span>{t.label}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Étude gratuite et sans engagement
                </span>
                <button
                  onClick={() => onOpenQuote(selectedQuickType)}
                  className="font-semibold text-white underline hover:text-prevenix-blue-light transition"
                >
                  Continuer &rarr;
                </button>
              </div>
            </div>

            {/* Key trust bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-prevenix-blue/20 flex items-center justify-center text-prevenix-blue">
                  <Award className="w-4 h-4" />
                </div>
                <span>100% Indépendant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Défense de vos intérêts</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="w-7 h-7 rounded-lg bg-prevenix-red/20 flex items-center justify-center text-prevenix-red">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span>Assistance Sinistres</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-prevenix-blue via-transparent to-prevenix-red opacity-30 blur-xl" />

              {/* Main Card Container */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/20 shadow-2xl">
                {/* Image showcase */}
                <div className="relative aspect-[4/5] sm:aspect-[4/4.5] w-full overflow-hidden bg-slate-800">
                  <img
                    src={slides[activeSlide].image}
                    alt={slides[activeSlide].title}
                    className="w-full h-full object-cover object-center transition-all duration-700 transform hover:scale-105"
                  />

                  {/* Top gradient badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-prevenix-navy/85 backdrop-blur-md text-white border border-white/20 shadow-md">
                      {slides[activeSlide].badge}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-prevenix-red text-white shadow">
                      PREVENIX
                    </span>
                  </div>

                  {/* Bottom overlay with slide navigation */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-prevenix-navy via-prevenix-navy/80 to-transparent p-6 pt-16">
                    <p className="text-xs uppercase tracking-wider text-prevenix-blue font-bold mb-1">
                      {slides[activeSlide].highlight}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {slides[activeSlide].title}
                    </h3>

                    {/* Slide switcher dots */}
                    <div className="flex items-center gap-2">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlide(idx)}
                          aria-label={`Afficher diapositive ${idx + 1}`}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activeSlide === idx
                              ? 'w-8 bg-prevenix-red'
                              : 'w-2 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Trust Badge */}
                <div className="p-4 bg-white/95 backdrop-blur-sm text-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-prevenix-navy">Cocody Angré Djibi</p>
                    <p className="text-[11px] text-slate-500">100 m avant la station Shell</p>
                  </div>
                  <div className="text-right">
                    <a
                      href={`tel:${settings.phone1?.replace(/\s+/g, '') || '08849725'}`}
                      className="text-xs font-extrabold text-prevenix-red hover:underline"
                    >
                      {settings.phone1 || '08 84 97 25'}
                    </a>
                    <p className="text-[10px] text-slate-500">Conseiller disponible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
