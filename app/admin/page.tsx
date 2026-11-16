'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Shield,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Upload,
  RefreshCw,
  Bell,
  Eye,
  X,
  FileCheck,
  Send,
  Phone,
  Mail,
  User,
  Sliders,
  AlertCircle,
  Download,
} from 'lucide-react'
import PrevenixLogo from '@/components/PrevenixLogo'
import {
  SiteSettings,
  InsuranceSolution,
  Article,
  MediaItem,
  QuoteRequest,
  ContactMessage,
} from '@/lib/types'
import { formatDateFr } from '@/lib/utils'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'quotes' | 'messages' | 'articles' | 'solutions' | 'media' | 'settings'
  >('dashboard')

  // Global loaded data
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [solutions, setSolutions] = useState<InsuranceSolution[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])

  // Notifications / feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Modals state
  const [articleModalOpen, setArticleModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null)

  const [solutionModalOpen, setSolutionModalOpen] = useState(false)
  const [editingSolution, setEditingSolution] = useState<Partial<InsuranceSolution> | null>(null)

  const [mediaModalOpen, setMediaModalOpen] = useState(false)
  const [editingMedia, setEditingMedia] = useState<Partial<MediaItem> | null>(null)

  const [viewingQuote, setViewingQuote] = useState<QuoteRequest | null>(null)
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null)

  // Filters
  const [quoteSearch, setQuoteSearch] = useState('')
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('all')

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [resStats, resSettings, resSolutions, resArticles, resMedia, resQuotes, resMessages] =
        await Promise.all([
          fetch('/api/admin/stats').then((r) => r.json()),
          fetch('/api/settings').then((r) => r.json()),
          fetch('/api/solutions').then((r) => r.json()),
          fetch('/api/articles').then((r) => r.json()),
          fetch('/api/media').then((r) => r.json()),
          fetch('/api/quotes').then((r) => r.json()),
          fetch('/api/messages').then((r) => r.json()),
        ])

      setStats(resStats)
      setSettings(resSettings)
      setSolutions(resSolutions)
      setArticles(resArticles)
      setMedia(resMedia)
      setQuotes(resQuotes)
      setMessages(resMessages)
    } catch (err) {
      console.error(err)
      showToast('Erreur de chargement des données', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!response.ok) {
          router.replace('/admin/login')
          return
        }
        if (active) await fetchData()
      } catch {
        router.replace('/admin/login')
      }
    }

    void checkSession()
    return () => {
      active = false
    }
  }, [])

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // File Upload Helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        return data.url
      }
      showToast(data.error || 'Erreur upload', 'error')
      return null
    } catch (err: any) {
      showToast(err.message || 'Erreur upload', 'error')
      return null
    }
  }

  // ------------------ QUOTES ACTIONS ------------------
  const handleUpdateQuoteStatus = async (
    id: string,
    status: 'nouveau' | 'en_cours' | 'traite',
    notes?: string
  ) => {
    try {
      const res = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes }),
      })
      if (res.ok) {
        showToast('Statut du devis mis à jour')
        setQuotes(quotes.map((q) => (q.id === id ? { ...q, status, notes: notes ?? q.notes } : q)))
        if (viewingQuote && viewingQuote.id === id) {
          setViewingQuote({ ...viewingQuote, status, notes: notes ?? viewingQuote.notes })
        }
      }
    } catch (err) {
      showToast('Erreur mise à jour', 'error')
    }
  }

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Confirmer la suppression de cette demande de devis ?')) return
    try {
      const res = await fetch(`/api/quotes?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Devis supprimé')
        setQuotes(quotes.filter((q) => q.id !== id))
        if (viewingQuote?.id === id) setViewingQuote(null)
      }
    } catch (err) {
      showToast('Erreur suppression', 'error')
    }
  }

  // ------------------ MESSAGES ACTIONS ------------------
  const handleUpdateMessageStatus = async (
    id: string,
    status: 'nouveau' | 'lu' | 'repondu'
  ) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        showToast('Message mis à jour')
        setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)))
        if (viewingMessage && viewingMessage.id === id) {
          setViewingMessage({ ...viewingMessage, status })
        }
      }
    } catch (err) {
      showToast('Erreur mise à jour', 'error')
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Confirmer la suppression de ce message ?')) return
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Message supprimé')
        setMessages(messages.filter((m) => m.id !== id))
        if (viewingMessage?.id === id) setViewingMessage(null)
      }
    } catch (err) {
      showToast('Erreur suppression', 'error')
    }
  }

  // ------------------ ARTICLES ACTIONS ------------------
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingArticle || !editingArticle.title) return

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Article enregistré avec succès')
        setArticleModalOpen(false)
        setEditingArticle(null)
        fetchData()
      } else {
        showToast(data.error || 'Erreur enregistrement', 'error')
      }
    } catch (err) {
      showToast('Erreur serveur', 'error')
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Supprimer définitivement cet article ?')) return
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Article supprimé')
        setArticles(articles.filter((a) => a.id !== id))
      }
    } catch (err) {
      showToast('Erreur suppression', 'error')
    }
  }

  // ------------------ SOLUTIONS ACTIONS ------------------
  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSolution || !editingSolution.title) return

    try {
      const res = await fetch('/api/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSolution),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Solution d’assurance enregistrée')
        setSolutionModalOpen(false)
        setEditingSolution(null)
        fetchData()
      } else {
        showToast(data.error || 'Erreur enregistrement', 'error')
      }
    } catch (err) {
      showToast('Erreur serveur', 'error')
    }
  }

  const handleDeleteSolution = async (id: string) => {
    if (!confirm('Supprimer cette solution d’assurance ?')) return
    try {
      const res = await fetch(`/api/solutions?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Solution supprimée')
        setSolutions(solutions.filter((s) => s.id !== id))
      }
    } catch (err) {
      showToast('Erreur suppression', 'error')
    }
  }

  // ------------------ MEDIA ACTIONS ------------------
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMedia || !editingMedia.title || !editingMedia.url) return

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMedia),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Média enregistré')
        setMediaModalOpen(false)
        setEditingMedia(null)
        fetchData()
      } else {
        showToast(data.error || 'Erreur enregistrement', 'error')
      }
    } catch (err) {
      showToast('Erreur serveur', 'error')
    }
  }

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Supprimer ce média ?')) return
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Média supprimé')
        setMedia(media.filter((m) => m.id !== id))
      }
    } catch (err) {
      showToast('Erreur suppression', 'error')
    }
  }

  // ------------------ SETTINGS ACTIONS ------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Paramètres du site mis à jour avec succès')
      } else {
        showToast(data.error || 'Erreur mise à jour', 'error')
      }
    } catch (err) {
      showToast('Erreur serveur', 'error')
    }
  }

  // Export Quotes CSV
  const exportQuotesCSV = () => {
    const headers = ['ID', 'Nom', 'Téléphone', 'Email', 'Type Assurance', 'Détails', 'Statut', 'Date']
    const rows = quotes.map((q) => [
      q.id,
      `"${q.full_name}"`,
      `"${q.phone}"`,
      `"${q.email || ''}"`,
      `"${q.insurance_type}"`,
      `"${(q.details || '').replace(/"/g, '""')}"`,
      q.status,
      q.created_at,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `prevenix-devis-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.full_name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.phone.includes(quoteSearch) ||
      (q.email && q.email.toLowerCase().includes(quoteSearch.toLowerCase())) ||
      q.insurance_type.toLowerCase().includes(quoteSearch.toLowerCase())
    const matchesStatus = quoteStatusFilter === 'all' ? true : q.status === quoteStatusFilter
    return matchesSearch && matchesStatus
  })

  const newQuotesCount = quotes.filter((q) => q.status === 'nouveau').length
  const newMessagesCount = messages.filter((m) => m.status === 'nouveau').length

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" target="_blank" className="flex items-center gap-2" title="Voir le site public">
            <PrevenixLogo width={160} />
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-prevenix-navy/10 text-prevenix-navy text-xs font-bold uppercase tracking-wider">
            Espace d'Administration
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span>Voir le site</span>
            <ExternalLink className="w-3.5 h-3.5 text-prevenix-blue" />
          </Link>

          <button
            onClick={fetchData}
            title="Rafraîchir les données"
            className="p-2 rounded-lg text-slate-500 hover:text-prevenix-navy hover:bg-slate-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-prevenix-navy text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Tableau de bord</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'quotes'
                  ? 'bg-prevenix-navy text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4" />
                <span>Demandes de Devis</span>
              </div>
              {newQuotesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-prevenix-red text-white">
                  {newQuotesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'messages'
                  ? 'bg-prevenix-navy text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Messages Reçus</span>
              </div>
              {newMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-prevenix-blue text-white">
                  {newMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'articles'
                  ? 'bg-prevenix-navy text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Actualités & Blog</span>
              </div>
              <span className="text-xs text-slate-400">{articles.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('solutions')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'solutions'
                  ? 'bg-prevenix-navy text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4" />
                <span>Nos Assurances</span>
              </div>
              <span className="text-xs text-slate-400">{solutions.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'media'
                  ? 'bg-prevenix-navy text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>Galerie & Médias</span>
              </div>
              <span className="text-xs text-slate-400">{media.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-prevenix-navy text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Paramètres du Site</span>
              </div>
            </button>
          </nav>

          <div className="pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-slate-600">PREVENIX Courtage</p>
            <p>Cocody Angré Djibi, Abidjan</p>
            <p className="text-[10px]">Version 1.0 • 2026</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 min-h-[600px]">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-extrabold text-prevenix-navy">
                  Tableau de bord PREVENIX
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Vue d'ensemble de vos performances, demandes de devis et publications
                </p>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-prevenix-gray border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Devis Reçus</span>
                    <FileCheck className="w-4 h-4 text-prevenix-red" />
                  </div>
                  <p className="text-3xl font-black text-prevenix-navy">{quotes.length}</p>
                  <p className="text-xs text-prevenix-red font-semibold mt-1">
                    {newQuotesCount} non traité(s)
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-prevenix-gray border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Messages</span>
                    <MessageSquare className="w-4 h-4 text-prevenix-blue" />
                  </div>
                  <p className="text-3xl font-black text-prevenix-navy">{messages.length}</p>
                  <p className="text-xs text-prevenix-blue font-semibold mt-1">
                    {newMessagesCount} nouveau(x)
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-prevenix-gray border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Articles</span>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-prevenix-navy">
                    {articles.filter((a) => a.is_published).length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">sur {articles.length} total</p>
                </div>

                <div className="p-5 rounded-2xl bg-prevenix-gray border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Médias & Affiches</span>
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-3xl font-black text-prevenix-navy">{media.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Photos, vidéos, campagnes</p>
                </div>
              </div>

              {/* Recent Activity Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* Recent Quotes */}
                <div className="border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-prevenix-navy text-sm">
                      Dernières Demandes de Devis
                    </h3>
                    <button
                      onClick={() => setActiveTab('quotes')}
                      className="text-xs font-semibold text-prevenix-blue hover:underline"
                    >
                      Voir tout ({quotes.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {quotes.slice(0, 4).map((q) => (
                      <div
                        key={q.id}
                        onClick={() => setViewingQuote(q)}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{q.full_name}</p>
                          <p className="text-[11px] text-slate-500">{q.insurance_type}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.status === 'nouveau'
                                ? 'bg-rose-100 text-rose-700'
                                : q.status === 'en_cours'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {q.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">{formatDateFr(q.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-prevenix-navy text-sm">
                      Derniers Messages Reçus
                    </h3>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs font-semibold text-prevenix-blue hover:underline"
                    >
                      Voir tout ({messages.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {messages.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setViewingMessage(m)}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="max-w-[200px] truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">{m.full_name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{m.subject}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.status === 'nouveau'
                                ? 'bg-rose-100 text-rose-700'
                                : m.status === 'lu'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {m.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">{formatDateFr(m.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTES (LEADS) */}
          {activeTab === 'quotes' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-prevenix-navy">
                    Demandes de Devis Reçues
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Gérez vos prospects et suivez l’avancement des propositions commerciales
                  </p>
                </div>

                <button
                  onClick={exportQuotesCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition w-fit"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter en CSV</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, téléphone, assurance..."
                    value={quoteSearch}
                    onChange={(e) => setQuoteSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-prevenix-blue"
                  />
                </div>

                <select
                  value={quoteStatusFilter}
                  onChange={(e) => setQuoteStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="nouveau">Nouveaux</option>
                  <option value="en_cours">En cours</option>
                  <option value="traite">Traités</option>
                </select>
              </div>

              {/* Quotes Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Assurance</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {q.full_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <a href={`tel:${q.phone}`} className="hover:text-prevenix-blue font-semibold block">
                              {q.phone}
                            </a>
                            {q.email && <span className="text-[11px] text-slate-400">{q.email}</span>}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-prevenix-navy">
                            {q.insurance_type}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {formatDateFr(q.created_at)}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={q.status}
                              onChange={(e) =>
                                handleUpdateQuoteStatus(
                                  q.id,
                                  e.target.value as 'nouveau' | 'en_cours' | 'traite'
                                )
                              }
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border-0 focus:ring-1 ${
                                q.status === 'nouveau'
                                  ? 'bg-rose-100 text-rose-800'
                                  : q.status === 'en_cours'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              <option value="nouveau">Nouveau</option>
                              <option value="en_cours">En cours</option>
                              <option value="traite">Traité</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => setViewingQuote(q)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-prevenix-blue hover:bg-blue-50 transition"
                              title="Détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuote(q.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-extrabold text-prevenix-navy">
                  Messages de Contact
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Consultez les messages reçus depuis le formulaire de contact du site
                </p>
              </div>

              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'nouveau'
                              ? 'bg-rose-100 text-rose-700'
                              : m.status === 'lu'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {m.status}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{m.full_name}</h4>
                        <span className="text-xs text-slate-400">• {m.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{formatDateFr(m.created_at)}</span>
                        <select
                          value={m.status}
                          onChange={(e) =>
                            handleUpdateMessageStatus(
                              m.id,
                              e.target.value as 'nouveau' | 'lu' | 'repondu'
                            )
                          }
                          className="px-2 py-0.5 rounded-lg text-xs border border-slate-300 bg-white"
                        >
                          <option value="nouveau">Nouveau</option>
                          <option value="lu">Lu</option>
                          <option value="repondu">Répondu</option>
                        </select>
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-prevenix-navy">
                      Sujet : {m.subject}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      {m.message}
                    </p>

                    <div className="flex items-center gap-3 text-xs">
                      <a
                        href={`tel:${m.phone}`}
                        className="inline-flex items-center gap-1 text-prevenix-blue hover:underline font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Appeler
                      </a>
                      {m.email && (
                        <a
                          href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                          className="inline-flex items-center gap-1 text-slate-600 hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Répondre par e-mail
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-prevenix-navy">
                    Actualités & Conseils
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Rédigez, modifiez ou publiez des articles de conseil en assurance
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingArticle({
                      title: '',
                      category: 'Conseils & Expertise',
                      summary: '',
                      content: '',
                      cover_image: '/images/hero/man-smiling-blue.jpg',
                      author: 'L’équipe PREVENIX',
                      read_time: '3 min de lecture',
                      is_published: true,
                    })
                    setArticleModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-prevenix-navy text-white text-xs font-bold hover:bg-prevenix-navy-light transition shadow w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvel Article</span>
                </button>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-prevenix-blue/10 text-prevenix-blue">
                          {art.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            art.is_published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {art.is_published ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 mb-2 line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {formatDateFr(art.published_at || art.created_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingArticle(art)
                            setArticleModalOpen(true)
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-prevenix-navy hover:bg-slate-100 transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INSURANCE SOLUTIONS */}
          {activeTab === 'solutions' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-prevenix-navy">
                    Solutions d'Assurance
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Gérez les offres d'assurance visibles sur le site public
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSolution({
                      title: '',
                      short_desc: '',
                      full_desc: '',
                      icon: 'ShieldCheck',
                      image_url: '/images/hero/man-smiling-blue.jpg',
                      features: ['Garantie personnalisée', 'Assistance rapide'],
                      order_num: solutions.length + 1,
                      is_active: true,
                    })
                    setSolutionModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-prevenix-navy text-white text-xs font-bold hover:bg-prevenix-navy-light transition shadow w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Solution</span>
                </button>
              </div>

              {/* Solutions List */}
              <div className="space-y-4">
                {solutions.map((sol) => (
                  <div
                    key={sol.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={sol.image_url || '/images/hero/man-smiling-blue.jpg'}
                          alt={sol.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{sol.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              sol.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {sol.is_active ? 'Actif' : 'Masqué'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {sol.short_desc}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Ordre d'affichage : {sol.order_num}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingSolution(sol)
                          setSolutionModalOpen(true)
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteSolution(sol.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MEDIA GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-prevenix-navy">
                    Gestionnaire de Médias
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Gérez les photographies, vidéos, affiches publicitaires et campagnes
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingMedia({
                      title: '',
                      type: 'photo',
                      url: '',
                      description: '',
                    })
                    setMediaModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-prevenix-navy text-white text-xs font-bold hover:bg-prevenix-navy-light transition shadow w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Média</span>
                </button>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className="group border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={m.thumbnail || m.url}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-prevenix-navy uppercase">
                        {m.type}
                      </span>
                    </div>

                    <div className="p-3">
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1 mb-1">
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {m.description || 'Campagne PREVENIX'}
                      </p>
                    </div>

                    <div className="px-3 pb-3 pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setEditingMedia(m)
                          setMediaModalOpen(true)
                        }}
                        className="text-[11px] font-bold text-prevenix-blue hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(m.id)}
                        className="text-slate-400 hover:text-rose-600"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SITE SETTINGS */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-extrabold text-prevenix-navy">
                  Paramètres Généraux du Site
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Modifiez les coordonnées, le slogan officiel, les textes et les liens sans toucher au code
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 1. Identity & Slogan */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-sm text-prevenix-navy uppercase tracking-wider">
                    Identité de la Marque & Slogan Officiel
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Nom de la société
                      </label>
                      <input
                        type="text"
                        value={settings.site_name}
                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Dénomination officielle
                      </label>
                      <input
                        type="text"
                        value={settings.denomination}
                        onChange={(e) => setSettings({ ...settings, denomination: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Slogan Officiel PREVENIX
                    </label>
                    <input
                      type="text"
                      value={settings.slogan}
                      onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* 2. Coordinates */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-sm text-prevenix-navy uppercase tracking-wider">
                    Coordonnées & Contact
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Téléphone 1
                      </label>
                      <input
                        type="text"
                        value={settings.phone1}
                        onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Téléphone secondaire
                      </label>
                      <input
                        type="text"
                        value={settings.phone2}
                        onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Numéro WhatsApp direct
                      </label>
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Adresse E-mail
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Adresse géographique
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Hero & Content Texts */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-sm text-prevenix-navy uppercase tracking-wider">
                    Textes de la Page d'Accueil & À Propos
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Texte d'accompagnement Hero (Accueil)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.hero_subtitle}
                      onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Titre Section À Propos
                    </label>
                    <input
                      type="text"
                      value={settings.about_title}
                      onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Texte Section À Propos
                    </label>
                    <textarea
                      rows={4}
                      value={settings.about_text}
                      onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* 4. Social networks */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <h3 className="font-bold text-sm text-prevenix-navy uppercase tracking-wider">
                    Réseaux Sociaux
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.social_facebook}
                        onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={settings.social_linkedin}
                        onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.social_instagram}
                        onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-prevenix-navy hover:bg-prevenix-navy-light text-white font-bold text-xs sm:text-sm shadow-lg transition"
                  >
                    Enregistrer toutes les modifications
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: VIEW QUOTE DETAILS */}
      {viewingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setViewingQuote(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-prevenix-navy text-white mb-2 inline-block">
              {viewingQuote.insurance_type}
            </span>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {viewingQuote.full_name}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Reçu le {formatDateFr(viewingQuote.created_at)}
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase">Téléphone</p>
                <a href={`tel:${viewingQuote.phone}`} className="font-bold text-prevenix-navy text-sm hover:underline">
                  {viewingQuote.phone}
                </a>
              </div>

              {viewingQuote.email && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                  <p className="font-semibold text-slate-800">{viewingQuote.email}</p>
                </div>
              )}

              {viewingQuote.details && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase">Détails de la demande</p>
                  <p className="text-slate-800 mt-1 whitespace-pre-wrap">{viewingQuote.details}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Statut du dossier</p>
                <div className="flex gap-2">
                  {(['nouveau', 'en_cours', 'traite'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateQuoteStatus(viewingQuote.id, st)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition ${
                        viewingQuote.status === st
                          ? 'bg-prevenix-navy text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <a
                href={`tel:${viewingQuote.phone}`}
                className="px-4 py-2 rounded-xl bg-prevenix-blue text-white text-xs font-bold hover:bg-prevenix-blue-dark transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Appeler le client
              </a>

              <button
                onClick={() => setViewingQuote(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE ARTICLE */}
      {articleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setArticleModalOpen(false)
                setEditingArticle(null)
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-prevenix-navy mb-4">
              {editingArticle.id ? "Modifier l'Article" : 'Rédiger un Nouvel Article'}
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={editingArticle.category || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Temps de lecture
                  </label>
                  <input
                    type="text"
                    value={editingArticle.read_time || '3 min de lecture'}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, read_time: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Image de couverture (URL ou fichier)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingArticle.cover_image || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, cover_image: e.target.value })
                    }
                    placeholder="/images/hero/man-smiling-blue.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = await handleFileUpload(file)
                          if (url) {
                            setEditingArticle({ ...editingArticle, cover_image: url })
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Résumé (accroche)
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.summary || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, summary: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Contenu détaillé de l'article (Markdown supporté) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={editingArticle.is_published ?? true}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, is_published: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-prevenix-blue"
                />
                <label htmlFor="pub-check" className="text-xs font-semibold text-slate-800">
                  Publier immédiatement sur le site public
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setArticleModalOpen(false)
                    setEditingArticle(null)
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-prevenix-navy text-white text-xs font-bold hover:bg-prevenix-navy-light"
                >
                  Enregistrer l'article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE SOLUTION */}
      {solutionModalOpen && editingSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSolutionModalOpen(false)
                setEditingSolution(null)
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-prevenix-navy mb-4">
              {editingSolution.id ? "Modifier la Solution d'Assurance" : 'Nouvelle Solution d’Assurance'}
            </h3>

            <form onSubmit={handleSaveSolution} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Titre de l'assurance *
                </label>
                <input
                  type="text"
                  required
                  value={editingSolution.title || ''}
                  onChange={(e) =>
                    setEditingSolution({ ...editingSolution, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Description courte (carte)
                </label>
                <textarea
                  rows={2}
                  value={editingSolution.short_desc || ''}
                  onChange={(e) =>
                    setEditingSolution({ ...editingSolution, short_desc: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Description complète (fenêtre détaillée)
                </label>
                <textarea
                  rows={4}
                  value={editingSolution.full_desc || ''}
                  onChange={(e) =>
                    setEditingSolution({ ...editingSolution, full_desc: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Image (URL ou fichier)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingSolution.image_url || ''}
                    onChange={(e) =>
                      setEditingSolution({ ...editingSolution, image_url: e.target.value })
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = await handleFileUpload(file)
                          if (url) {
                            setEditingSolution({ ...editingSolution, image_url: url })
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={editingSolution.order_num ?? 1}
                    onChange={(e) =>
                      setEditingSolution({
                        ...editingSolution,
                        order_num: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="sol-active"
                    checked={editingSolution.is_active ?? true}
                    onChange={(e) =>
                      setEditingSolution({ ...editingSolution, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-prevenix-blue mr-2"
                  />
                  <label htmlFor="sol-active" className="text-xs font-semibold text-slate-800">
                    Visible sur le site
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSolutionModalOpen(false)
                    setEditingSolution(null)
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-prevenix-navy text-white text-xs font-bold hover:bg-prevenix-navy-light"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE MEDIA */}
      {mediaModalOpen && editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => {
                setMediaModalOpen(false)
                setEditingMedia(null)
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-prevenix-navy mb-4">
              {editingMedia.id ? 'Modifier le Média' : 'Ajouter un Média'}
            </h3>

            <form onSubmit={handleSaveMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Titre du média *
                </label>
                <input
                  type="text"
                  required
                  value={editingMedia.title || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={editingMedia.type || 'photo'}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        type: e.target.value as 'photo' | 'video' | 'publicite' | 'evenement',
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Vidéo</option>
                    <option value="publicite">Affiche & Publicité</option>
                    <option value="evenement">Événement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    ID YouTube (si vidéo)
                  </label>
                  <input
                    type="text"
                    value={editingMedia.youtube_id || ''}
                    placeholder="Ex : dQw4w9WgXcQ"
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, youtube_id: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  URL de l'image / vidéo *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingMedia.url || ''}
                    onChange={(e) => setEditingMedia({ ...editingMedia, url: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = await handleFileUpload(file)
                          if (url) {
                            setEditingMedia({ ...editingMedia, url, thumbnail: url })
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingMedia.description || ''}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMediaModalOpen(false)
                    setEditingMedia(null)
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-prevenix-navy text-white text-xs font-bold hover:bg-prevenix-navy-light"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
