-- PREVENIX ASSURANCES - SUPABASE DATABASE SCHEMA
-- Exécutez ce script dans le SQL Editor de Supabase pour configurer la base de données cloud.

-- 1. Table des Paramètres du site
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  site_name TEXT NOT NULL DEFAULT 'PREVENIX',
  denomination TEXT NOT NULL DEFAULT 'Société de Courtage d''Assurances',
  slogan TEXT NOT NULL DEFAULT 'Votre meilleure assurance, c''est votre courtier.',
  phone1 TEXT NOT NULL DEFAULT '08 84 97 25',
  phone2 TEXT NOT NULL DEFAULT '03 43 43 25',
  whatsapp TEXT NOT NULL DEFAULT '+22508849725',
  email TEXT NOT NULL DEFAULT 'contact@prevenix.ci',
  address TEXT NOT NULL DEFAULT 'Cocody Angré Djibi, 100 m avant la station Shell',
  city_country TEXT NOT NULL DEFAULT 'Abidjan, Côte d''Ivoire',
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  about_title TEXT NOT NULL,
  about_text TEXT NOT NULL,
  cta_title TEXT NOT NULL,
  cta_subtitle TEXT NOT NULL,
  social_facebook TEXT,
  social_linkedin TEXT,
  social_instagram TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table des Solutions d'assurance
CREATE TABLE IF NOT EXISTS insurance_solutions (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT,
  full_desc TEXT,
  icon TEXT DEFAULT 'ShieldCheck',
  image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  order_num INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table des Articles (Actualités & Conseils)
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Conseils',
  summary TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT DEFAULT 'L''équipe PREVENIX',
  read_time TEXT DEFAULT '3 min de lecture',
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table de la Galerie Médias
CREATE TABLE IF NOT EXISTS media_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'publicite', 'evenement')),
  url TEXT NOT NULL,
  thumbnail TEXT,
  youtube_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table des Demandes de Devis
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  insurance_type TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'traite')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Table des Messages de Contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'lu', 'repondu')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Politiques de Sécurité Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les éléments du site
CREATE POLICY "Lecture publique paramètres" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Lecture publique assurances" ON insurance_solutions FOR SELECT USING (is_active = true);
CREATE POLICY "Lecture publique articles" ON articles FOR SELECT USING (is_published = true);
CREATE POLICY "Lecture publique médias" ON media_gallery FOR SELECT USING (true);

-- Insertion publique pour les formulaires de devis et contact
CREATE POLICY "Insertion publique devis" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertion publique messages" ON contact_messages FOR INSERT WITH CHECK (true);
