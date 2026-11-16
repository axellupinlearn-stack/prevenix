'use client'

import React, { useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/utils'

interface WhatsAppFloatingButtonProps {
  whatsappNumber?: string
}

export default function WhatsAppFloatingButton({
  whatsappNumber = '+22508849725',
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const quickMessages = [
    'Bonjour, je souhaite un devis pour une assurance automobile (Offre ZEN).',
    'Bonjour, je souhaite des informations sur une assurance santé pour ma famille.',
    'Bonjour, j’ai un sinistre en cours et j’ai besoin d’assistance.',
    'Bonjour PREVENIX, je souhaite qu’un conseiller me rappelle.',
  ]

  const defaultLink = getWhatsAppLink(
    whatsappNumber,
    'Bonjour PREVENIX, je vous contacte via votre site web.'
  )

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick chat popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  PX
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075E54]" />
              </div>
              <div>
                <h4 className="font-bold text-sm">PREVENIX Assurances</h4>
                <p className="text-[11px] text-emerald-200">En ligne • Réponse rapide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 text-xs space-y-3 max-h-72 overflow-y-auto">
            <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-200 text-slate-700">
              👋 Bonjour ! Comment pouvons-nous vous accompagner aujourd’hui ? Cliquez sur un motif ou écrivez-nous directement.
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Suggestions rapides :
            </p>

            <div className="space-y-2">
              {quickMessages.map((msg, i) => (
                <a
                  key={i}
                  href={getWhatsAppLink(whatsappNumber, msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 rounded-xl bg-white hover:bg-[#25D366]/10 hover:border-[#25D366]/40 border border-slate-200 text-slate-800 text-[11px] transition text-left"
                >
                  {msg}
                </a>
              ))}
            </div>
          </div>

          {/* Footer action */}
          <div className="p-3 bg-white border-t border-slate-100">
            <a
              href={defaultLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ouvrir la conversation WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contacter sur WhatsApp"
        className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="font-bold text-xs hidden sm:inline">WhatsApp Courtier</span>
      </button>
    </div>
  )
}
