import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import {
  DatabaseSchema,
  SiteSettings,
  InsuranceSolution,
  Article,
  MediaItem,
  QuoteRequest,
  ContactMessage,
} from './types'
import { initialData } from './initial-data'
import { getSupabaseConfig, supabaseRequest } from './supabase-rest'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')
const INITIAL_DATA_MARKER = 'initial-data-v1'

function useSupabase(): boolean {
  if (process.env.NEXT_PHASE === 'phase-production-build') return false
  if (getSupabaseConfig()) return true
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Production data storage requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }
  return false
}

function ensureDatabase(): DatabaseSchema {
  if (process.env.NEXT_PHASE === 'phase-production-build') return initialData
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8')
      return initialData
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as DatabaseSchema

    // Ensure all keys exist
    return {
      settings: parsed.settings || initialData.settings,
      solutions: parsed.solutions || initialData.solutions,
      articles: parsed.articles || initialData.articles,
      media: parsed.media || initialData.media,
      quotes: parsed.quotes || initialData.quotes,
      messages: parsed.messages || initialData.messages,
    }
  } catch (err) {
    console.error('Error reading database file:', err)
    return initialData
  }
}

async function ensureSupabaseSeeded(): Promise<void> {
  const marker = await supabaseRequest<Array<{ key: string }>>('app_meta', {
    query: { select: 'key', key: `eq.${INITIAL_DATA_MARKER}`, limit: '1' },
  })
  if (marker.length > 0) return

  const seedTables: Array<[string, unknown[]]> = [
    ['site_settings', [initialData.settings]],
    ['insurance_solutions', initialData.solutions],
    ['articles', initialData.articles],
    ['media_gallery', initialData.media],
  ]

  await Promise.all(
    seedTables.map(([table, rows]) =>
      supabaseRequest(table, {
        method: 'POST',
        query: { on_conflict: 'id' },
        body: rows,
        prefer: 'resolution=ignore-duplicates,return=minimal',
      })
    )
  )

  await supabaseRequest('app_meta', {
    method: 'POST',
    query: { on_conflict: 'key' },
    body: { key: INITIAL_DATA_MARKER, value: 'seeded' },
    prefer: 'resolution=ignore-duplicates,return=minimal',
  })
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}`
}

function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error saving database:', err)
  }
}

// ---------------- Site Settings ----------------
export async function getSettings(): Promise<SiteSettings> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<SiteSettings[]>('site_settings', {
      query: { select: '*', id: 'eq.default_settings', limit: '1' },
    })
    if (!rows[0]) throw new Error('The default site settings are missing from Supabase.')
    return rows[0]
  }
  const db = ensureDatabase()
  return db.settings
}

export async function updateSettings(
  partial: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await getSettings()
  const updated = {
    ...current,
    ...partial,
    updated_at: new Date().toISOString(),
  }
  if (useSupabase()) {
    const rows = await supabaseRequest<SiteSettings[]>('site_settings', {
      method: 'POST',
      query: { on_conflict: 'id' },
      body: updated,
      prefer: 'resolution=merge-duplicates,return=representation',
    })
    if (!rows[0]) throw new Error('Supabase did not return the updated site settings.')
    return rows[0]
  }
  const db = ensureDatabase()
  db.settings = updated
  saveDatabase(db)
  return db.settings
}

// ---------------- Insurance Solutions ----------------
export async function getSolutions(activeOnly = false): Promise<InsuranceSolution[]> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const query: Record<string, string> = { select: '*', order: 'order_num.asc' }
    if (activeOnly) query.is_active = 'eq.true'
    return supabaseRequest<InsuranceSolution[]>('insurance_solutions', { query })
  }
  const db = ensureDatabase()
  let list = db.solutions || []
  if (activeOnly) {
    list = list.filter((s) => s.is_active)
  }
  return list.sort((a, b) => a.order_num - b.order_num)
}

export async function getSolutionBySlug(
  slug: string
): Promise<InsuranceSolution | null> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<InsuranceSolution[]>('insurance_solutions', {
      query: { select: '*', slug: `eq.${slug}`, limit: '1' },
    })
    return rows[0] || null
  }
  const db = ensureDatabase()
  return db.solutions.find((s) => s.slug === slug) || null
}

export async function saveSolution(
  solution: Partial<InsuranceSolution> & { title: string }
): Promise<InsuranceSolution> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const existing = solution.id
      ? (
          await supabaseRequest<InsuranceSolution[]>('insurance_solutions', {
            query: { select: '*', id: `eq.${solution.id}`, limit: '1' },
          })
        )[0]
      : undefined
    const count = solution.order_num ?? (await getSolutions()).length + 1
    const saved: InsuranceSolution = existing
      ? { ...existing, ...solution }
      : {
          id: solution.id || newId('sol'),
          slug:
            solution.slug ||
            solution.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, ''),
          title: solution.title,
          short_desc: solution.short_desc || '',
          full_desc: solution.full_desc || '',
          icon: solution.icon || 'ShieldCheck',
          image_url: solution.image_url || '/images/hero/man-smiling-blue.jpg',
          features: solution.features || [],
          order_num: count,
          is_active: solution.is_active !== undefined ? solution.is_active : true,
          created_at: new Date().toISOString(),
        }
    const rows = await supabaseRequest<InsuranceSolution[]>('insurance_solutions', {
      method: 'POST',
      query: { on_conflict: 'id' },
      body: saved,
      prefer: 'resolution=merge-duplicates,return=representation',
    })
    if (!rows[0]) throw new Error('Supabase did not return the saved insurance solution.')
    return rows[0]
  }
  const db = ensureDatabase()
  if (solution.id) {
    const idx = db.solutions.findIndex((s) => s.id === solution.id)
    if (idx !== -1) {
      db.solutions[idx] = {
        ...db.solutions[idx],
        ...solution,
      } as InsuranceSolution
      saveDatabase(db)
      return db.solutions[idx]
    }
  }

  // Create new
  const newSol: InsuranceSolution = {
    id: 'sol-' + Date.now(),
    slug:
      solution.slug ||
      solution.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
    title: solution.title,
    short_desc: solution.short_desc || '',
    full_desc: solution.full_desc || '',
    icon: solution.icon || 'ShieldCheck',
    image_url: solution.image_url || '/images/hero/man-smiling-blue.jpg',
    features: solution.features || [],
    order_num: solution.order_num ?? db.solutions.length + 1,
    is_active: solution.is_active !== undefined ? solution.is_active : true,
    created_at: new Date().toISOString(),
  }

  db.solutions.push(newSol)
  saveDatabase(db)
  return newSol
}

export async function deleteSolution(id: string): Promise<boolean> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<Array<{ id: string }>>('insurance_solutions', {
      method: 'DELETE',
      query: { id: `eq.${id}`, select: 'id' },
      prefer: 'return=representation',
    })
    return rows.length > 0
  }
  const db = ensureDatabase()
  const initialLen = db.solutions.length
  db.solutions = db.solutions.filter((s) => s.id !== id)
  if (db.solutions.length !== initialLen) {
    saveDatabase(db)
    return true
  }
  return false
}

// ---------------- Articles ----------------
export async function getArticles(publishedOnly = false): Promise<Article[]> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const query: Record<string, string> = {
      select: '*',
      order: 'published_at.desc.nullslast,created_at.desc',
    }
    if (publishedOnly) query.is_published = 'eq.true'
    return supabaseRequest<Article[]>('articles', { query })
  }
  const db = ensureDatabase()
  let list = db.articles || []
  if (publishedOnly) {
    list = list.filter((a) => a.is_published)
  }
  return list.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at).getTime() -
      new Date(a.published_at || a.created_at).getTime()
  )
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<Article[]>('articles', {
      query: { select: '*', slug: `eq.${slug}`, limit: '1' },
    })
    return rows[0] || null
  }
  const db = ensureDatabase()
  return db.articles.find((a) => a.slug === slug) || null
}

export async function saveArticle(
  article: Partial<Article> & { title: string }
): Promise<Article> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const existing = article.id
      ? (
          await supabaseRequest<Article[]>('articles', {
            query: { select: '*', id: `eq.${article.id}`, limit: '1' },
          })
        )[0]
      : undefined
    const now = new Date().toISOString()
    const saved: Article = existing
      ? { ...existing, ...article }
      : {
          id: newId('art'),
          slug:
            article.slug ||
            article.title
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, ''),
          title: article.title,
          category: article.category || 'Conseils',
          summary: article.summary || '',
          content: article.content || '',
          cover_image: article.cover_image || '/images/hero/man-smiling-blue.jpg',
          author: article.author || 'L’équipe PREVENIX',
          read_time: article.read_time || '3 min de lecture',
          is_published: article.is_published ?? true,
          published_at: article.is_published ? now : null,
          created_at: now,
        }
    const rows = await supabaseRequest<Article[]>('articles', {
      method: 'POST',
      query: { on_conflict: 'id' },
      body: saved,
      prefer: 'resolution=merge-duplicates,return=representation',
    })
    if (!rows[0]) throw new Error('Supabase did not return the saved article.')
    return rows[0]
  }
  const db = ensureDatabase()
  if (article.id) {
    const idx = db.articles.findIndex((a) => a.id === article.id)
    if (idx !== -1) {
      db.articles[idx] = {
        ...db.articles[idx],
        ...article,
      } as Article
      saveDatabase(db)
      return db.articles[idx]
    }
  }

  const newArt: Article = {
    id: 'art-' + Date.now(),
    slug:
      article.slug ||
      article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
    title: article.title,
    category: article.category || 'Conseils',
    summary: article.summary || '',
    content: article.content || '',
    cover_image: article.cover_image || '/images/hero/man-smiling-blue.jpg',
    author: article.author || 'L’équipe PREVENIX',
    read_time: article.read_time || '3 min de lecture',
    is_published: article.is_published ?? true,
    published_at: article.is_published ? new Date().toISOString() : '',
    created_at: new Date().toISOString(),
  }

  db.articles.push(newArt)
  saveDatabase(db)
  return newArt
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<Array<{ id: string }>>('articles', {
      method: 'DELETE',
      query: { id: `eq.${id}`, select: 'id' },
      prefer: 'return=representation',
    })
    return rows.length > 0
  }
  const db = ensureDatabase()
  const initialLen = db.articles.length
  db.articles = db.articles.filter((a) => a.id !== id)
  if (db.articles.length !== initialLen) {
    saveDatabase(db)
    return true
  }
  return false
}

// ---------------- Media Gallery ----------------
export async function getMedia(category?: string): Promise<MediaItem[]> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const query: Record<string, string> = { select: '*', order: 'created_at.desc' }
    if (category && category !== 'tout') query.type = `eq.${category}`
    return supabaseRequest<MediaItem[]>('media_gallery', { query })
  }
  const db = ensureDatabase()
  let list = db.media || []
  if (category && category !== 'tout') {
    list = list.filter((m) => m.type === category)
  }
  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function saveMedia(
  item: Partial<MediaItem> & { title: string; url: string }
): Promise<MediaItem> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const existing = item.id
      ? (
          await supabaseRequest<MediaItem[]>('media_gallery', {
            query: { select: '*', id: `eq.${item.id}`, limit: '1' },
          })
        )[0]
      : undefined
    const saved: MediaItem = existing
      ? { ...existing, ...item }
      : {
          id: newId('med'),
          title: item.title,
          type: item.type || 'photo',
          url: item.url,
          thumbnail: item.thumbnail || item.url,
          youtube_id: item.youtube_id || '',
          description: item.description || '',
          created_at: new Date().toISOString(),
        }
    const rows = await supabaseRequest<MediaItem[]>('media_gallery', {
      method: 'POST',
      query: { on_conflict: 'id' },
      body: saved,
      prefer: 'resolution=merge-duplicates,return=representation',
    })
    if (!rows[0]) throw new Error('Supabase did not return the saved media item.')
    return rows[0]
  }
  const db = ensureDatabase()
  if (item.id) {
    const idx = db.media.findIndex((m) => m.id === item.id)
    if (idx !== -1) {
      db.media[idx] = {
        ...db.media[idx],
        ...item,
      } as MediaItem
      saveDatabase(db)
      return db.media[idx]
    }
  }

  const newMedia: MediaItem = {
    id: 'med-' + Date.now(),
    title: item.title,
    type: item.type || 'photo',
    url: item.url,
    thumbnail: item.thumbnail || item.url,
    youtube_id: item.youtube_id || '',
    description: item.description || '',
    created_at: new Date().toISOString(),
  }

  db.media.push(newMedia)
  saveDatabase(db)
  return newMedia
}

export async function deleteMedia(id: string): Promise<boolean> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<Array<{ id: string }>>('media_gallery', {
      method: 'DELETE',
      query: { id: `eq.${id}`, select: 'id' },
      prefer: 'return=representation',
    })
    return rows.length > 0
  }
  const db = ensureDatabase()
  const initialLen = db.media.length
  db.media = db.media.filter((m) => m.id !== id)
  if (db.media.length !== initialLen) {
    saveDatabase(db)
    return true
  }
  return false
}

// ---------------- Quote Requests ----------------
export async function getQuotes(): Promise<QuoteRequest[]> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    return supabaseRequest<QuoteRequest[]>('quote_requests', {
      query: { select: '*', order: 'created_at.desc' },
    })
  }
  const db = ensureDatabase()
  return (db.quotes || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function createQuote(
  data: Omit<QuoteRequest, 'id' | 'status' | 'created_at'>
): Promise<QuoteRequest> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<QuoteRequest[]>('quote_requests', {
      method: 'POST',
      body: {
        id: newId('q'),
        ...data,
        status: 'nouveau',
        created_at: new Date().toISOString(),
      },
      prefer: 'return=representation',
    })
    if (!rows[0]) throw new Error('Supabase did not return the created quote request.')
    return rows[0]
  }
  const db = ensureDatabase()
  const newQuote: QuoteRequest = {
    id: 'q-' + Date.now(),
    ...data,
    status: 'nouveau',
    created_at: new Date().toISOString(),
  }
  db.quotes.unshift(newQuote)
  saveDatabase(db)
  return newQuote
}

export async function updateQuoteStatus(
  id: string,
  status: 'nouveau' | 'en_cours' | 'traite',
  notes?: string
): Promise<QuoteRequest | null> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<QuoteRequest[]>('quote_requests', {
      method: 'PATCH',
      query: { id: `eq.${id}`, select: '*' },
      body: notes === undefined ? { status } : { status, notes },
      prefer: 'return=representation',
    })
    return rows[0] || null
  }
  const db = ensureDatabase()
  const idx = db.quotes.findIndex((q) => q.id === id)
  if (idx !== -1) {
    db.quotes[idx].status = status
    if (notes !== undefined) {
      db.quotes[idx].notes = notes
    }
    saveDatabase(db)
    return db.quotes[idx]
  }
  return null
}

export async function deleteQuote(id: string): Promise<boolean> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<Array<{ id: string }>>('quote_requests', {
      method: 'DELETE',
      query: { id: `eq.${id}`, select: 'id' },
      prefer: 'return=representation',
    })
    return rows.length > 0
  }
  const db = ensureDatabase()
  const initialLen = db.quotes.length
  db.quotes = db.quotes.filter((q) => q.id !== id)
  if (db.quotes.length !== initialLen) {
    saveDatabase(db)
    return true
  }
  return false
}

// ---------------- Contact Messages ----------------
export async function getMessages(): Promise<ContactMessage[]> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    return supabaseRequest<ContactMessage[]>('contact_messages', {
      query: { select: '*', order: 'created_at.desc' },
    })
  }
  const db = ensureDatabase()
  return (db.messages || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function createMessage(
  data: Omit<ContactMessage, 'id' | 'status' | 'created_at'>
): Promise<ContactMessage> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<ContactMessage[]>('contact_messages', {
      method: 'POST',
      body: {
        id: newId('msg'),
        ...data,
        status: 'nouveau',
        created_at: new Date().toISOString(),
      },
      prefer: 'return=representation',
    })
    if (!rows[0]) throw new Error('Supabase did not return the created contact message.')
    return rows[0]
  }
  const db = ensureDatabase()
  const newMsg: ContactMessage = {
    id: 'msg-' + Date.now(),
    ...data,
    status: 'nouveau',
    created_at: new Date().toISOString(),
  }
  db.messages.unshift(newMsg)
  saveDatabase(db)
  return newMsg
}

export async function updateMessageStatus(
  id: string,
  status: 'nouveau' | 'lu' | 'repondu'
): Promise<ContactMessage | null> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<ContactMessage[]>('contact_messages', {
      method: 'PATCH',
      query: { id: `eq.${id}`, select: '*' },
      body: { status },
      prefer: 'return=representation',
    })
    return rows[0] || null
  }
  const db = ensureDatabase()
  const idx = db.messages.findIndex((m) => m.id === id)
  if (idx !== -1) {
    db.messages[idx].status = status
    saveDatabase(db)
    return db.messages[idx]
  }
  return null
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (useSupabase()) {
    await ensureSupabaseSeeded()
    const rows = await supabaseRequest<Array<{ id: string }>>('contact_messages', {
      method: 'DELETE',
      query: { id: `eq.${id}`, select: 'id' },
      prefer: 'return=representation',
    })
    return rows.length > 0
  }
  const db = ensureDatabase()
  const initialLen = db.messages.length
  db.messages = db.messages.filter((m) => m.id !== id)
  if (db.messages.length !== initialLen) {
    saveDatabase(db)
    return true
  }
  return false
}

// ---------------- Admin Stats ----------------
export async function getDashboardStats() {
  const [articles, media, quotes, messages] = await Promise.all([
    getArticles(),
    getMedia(),
    getQuotes(),
    getMessages(),
  ])
  const publishedArticles = articles.filter((a) => a.is_published).length
  const photos = media.filter((m) => m.type === 'photo' || m.type === 'publicite').length
  const videos = media.filter((m) => m.type === 'video').length
  const quotesCount = quotes.length
  const newQuotesCount = quotes.filter((q) => q.status === 'nouveau').length
  const messagesCount = messages.length
  const newMessagesCount = messages.filter((m) => m.status === 'nouveau').length

  return {
    articles: publishedArticles,
    totalArticles: articles.length,
    photos,
    videos,
    quotes: quotesCount,
    newQuotes: newQuotesCount,
    messages: messagesCount,
    newMessages: newMessagesCount,
    recentQuotes: quotes.slice(0, 5),
    recentMessages: messages.slice(0, 5),
    recentArticles: articles.slice(0, 4),
  }
}
