'use client'

import React from 'react'
import Image from 'next/image'

interface PrevenixLogoProps {
  variant?: 'light' | 'dark'
  className?: string
  width?: number
  height?: number
  showSubtitle?: boolean
}

export default function PrevenixLogo({
  variant = 'dark',
  className = '',
  width = 220,
  height = 58,
  showSubtitle = true,
}: PrevenixLogoProps) {
  // Use the official transparent cropped logo from the provided assets
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center">
        {/* Official cropped logo with fallback vector styling */}
        <div
          className={`relative overflow-hidden rounded-md transition-transform duration-300 ${
            variant === 'light' ? 'p-1.5 bg-white/95 shadow-sm rounded-lg backdrop-blur-sm' : ''
          }`}
          style={{ width: `${width}px`, height: 'auto' }}
        >
          <img
            src="/images/logo-transparent.png"
            alt="PREVENIX - Société de Courtage d'Assurances"
            className="w-full h-auto object-contain block"
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}
