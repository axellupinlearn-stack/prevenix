'use client'

import React, { useState } from 'react'
import {
  Image as ImageIcon,
  Play,
  Film,
  Sparkles,
  X,
  Maximize2,
  ExternalLink,
} from 'lucide-react'
import { MediaItem } from '@/lib/types'

interface MediaGalleryProps {
  media: MediaItem[]
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('tout')
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null)

  const filterTabs = [
    { id: 'tout', label: 'Tout' },
    { id: 'photo', label: 'Photos' },
    { id: 'video', label: 'Vidéos' },
    { id: 'publicite', label: 'Affiches & Publicités' },
    { id: 'evenement', label: 'Événements' },
  ]

  const filteredMedia =
    activeFilter === 'tout'
      ? media
      : media.filter((m) => m.type === activeFilter)

  const getYoutubeEmbedUrl = (url: string, ytId?: string) => {
    if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`
    }
    return url
  }

  return (
    <section id="galerie" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prevenix-blue/10 text-prevenix-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5" />
            Galerie Multimédia
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-prevenix-navy tracking-tight">
            Photos, Vidéos & Campagnes Officielles
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Découvrez nos visuels officiels, nos affiches de campagne et les temps forts de PREVENIX en Côte d’Ivoire.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-prevenix-navy text-white shadow-md'
                  : 'bg-prevenix-gray text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => {
            const isVideo = item.type === 'video'
            return (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Media Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-prevenix-navy/90 via-prevenix-navy/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-prevenix-navy backdrop-blur-md uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>

                  {/* Play / Zoom Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isVideo ? (
                      <button
                        onClick={() => setSelectedVideo(item)}
                        className="w-14 h-14 rounded-full bg-prevenix-red text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition"
                        aria-label="Lire la vidéo"
                      >
                        <Play className="w-6 h-6 ml-1 fill-white" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedPhoto(item)}
                        className="w-12 h-12 rounded-full bg-white/90 text-prevenix-navy flex items-center justify-center shadow-lg transform hover:scale-110 transition"
                        aria-label="Agrandir la photo"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Caption / Title */}
                <div className="p-5 bg-white flex flex-col justify-between">
                  <h3 className="font-bold text-prevenix-navy text-sm sm:text-base group-hover:text-prevenix-blue transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2">
                    {item.description || "Élément officiel de communication PREVENIX"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Fermer"
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative rounded-2xl overflow-hidden max-h-[75vh] w-auto shadow-2xl bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="mt-4 text-center max-w-xl text-white">
              <h4 className="font-bold text-lg">{selectedPhoto.title}</h4>
              {selectedPhoto.description && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              aria-label="Fermer"
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
              <iframe
                src={getYoutubeEmbedUrl(selectedVideo.url, selectedVideo.youtube_id)}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="mt-4 text-white">
              <h4 className="font-bold text-lg">{selectedVideo.title}</h4>
              <p className="text-xs text-slate-300">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
