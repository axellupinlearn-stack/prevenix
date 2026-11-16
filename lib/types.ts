export interface SiteSettings {
  id: string
  site_name: string
  denomination: string
  slogan: string
  phone1: string
  phone2: string
  whatsapp: string
  email: string
  address: string
  city_country: string
  hero_title: string
  hero_subtitle: string
  about_title: string
  about_text: string
  cta_title: string
  cta_subtitle: string
  social_facebook: string
  social_linkedin: string
  social_instagram: string
  updated_at: string
}

export interface InsuranceSolution {
  id: string
  slug: string
  title: string
  short_desc: string
  full_desc: string
  icon: string
  image_url: string
  features: string[]
  order_num: number
  is_active: boolean
  created_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  content: string
  cover_image: string
  author: string
  read_time: string
  is_published: boolean
  published_at: string
  created_at: string
}

export interface MediaItem {
  id: string
  title: string
  type: 'photo' | 'video' | 'publicite' | 'evenement'
  url: string
  thumbnail?: string
  youtube_id?: string
  description: string
  created_at: string
}

export interface QuoteRequest {
  id: string
  full_name: string
  phone: string
  email: string
  insurance_type: string
  details?: string
  status: 'nouveau' | 'en_cours' | 'traite'
  notes?: string
  created_at: string
}

export interface ContactMessage {
  id: string
  full_name: string
  phone: string
  email: string
  subject: string
  message: string
  status: 'nouveau' | 'lu' | 'repondu'
  created_at: string
}

export interface DatabaseSchema {
  settings: SiteSettings
  solutions: InsuranceSolution[]
  articles: Article[]
  media: MediaItem[]
  quotes: QuoteRequest[]
  messages: ContactMessage[]
}
