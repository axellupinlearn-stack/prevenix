import fs from 'fs'
import path from 'path'
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

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

function ensureDatabase(): DatabaseSchema {
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
  const db = ensureDatabase()
  return db.settings
}

export async function updateSettings(
  partial: Partial<SiteSettings>
): Promise<SiteSettings> {
  const db = ensureDatabase()
  db.settings = {
    ...db.settings,
    ...partial,
    updated_at: new Date().toISOString(),
  }
  saveDatabase(db)
  return db.settings
}

// ---------------- Insurance Solutions ----------------
export async function getSolutions(activeOnly = false): Promise<InsuranceSolution[]> {
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
  const db = ensureDatabase()
  return db.solutions.find((s) => s.slug === slug) || null
}

export async function saveSolution(
  solution: Partial<InsuranceSolution> & { title: string }
): Promise<InsuranceSolution> {
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
  const db = ensureDatabase()
  return db.articles.find((a) => a.slug === slug) || null
}

export async function saveArticle(
  article: Partial<Article> & { title: string }
): Promise<Article> {
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
  const db = ensureDatabase()
  return (db.quotes || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function createQuote(
  data: Omit<QuoteRequest, 'id' | 'status' | 'created_at'>
): Promise<QuoteRequest> {
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
  const db = ensureDatabase()
  return (db.messages || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function createMessage(
  data: Omit<ContactMessage, 'id' | 'status' | 'created_at'>
): Promise<ContactMessage> {
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
  const db = ensureDatabase()
  const publishedArticles = db.articles.filter((a) => a.is_published).length
  const photos = db.media.filter((m) => m.type === 'photo' || m.type === 'publicite').length
  const videos = db.media.filter((m) => m.type === 'video').length
  const quotesCount = db.quotes.length
  const newQuotesCount = db.quotes.filter((q) => q.status === 'nouveau').length
  const messagesCount = db.messages.length
  const newMessagesCount = db.messages.filter((m) => m.status === 'nouveau').length

  return {
    articles: publishedArticles,
    totalArticles: db.articles.length,
    photos,
    videos,
    quotes: quotesCount,
    newQuotes: newQuotesCount,
    messages: messagesCount,
    newMessages: newMessagesCount,
    recentQuotes: db.quotes.slice(0, 5),
    recentMessages: db.messages.slice(0, 5),
    recentArticles: db.articles.slice(0, 4),
  }
}
