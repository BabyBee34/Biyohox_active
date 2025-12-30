-- BiyoHox Veritabanı Şeması
-- Supabase SQL Editor'da çalıştırın

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sınıflar
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  unit_count INTEGER DEFAULT 0,
  lesson_count INTEGER DEFAULT 0,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Üniteler
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Konular
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Dersler
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  grade_id UUID REFERENCES grades(id),
  unit_id UUID REFERENCES units(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT false,
  blocks JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kaynaklar (PDF & Notlar)
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('pdf', 'note')),
  title TEXT NOT NULL,
  grade TEXT,
  unit TEXT,
  topic TEXT,
  content TEXT,
  file_url TEXT,
  file_size TEXT,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Yazıları
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  tags TEXT[],
  read_time INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- İletişim Mesajları
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Aboneleri
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Kullanıcıları (Supabase Auth ile birlikte)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public okuma politikaları
CREATE POLICY "Public read grades" ON grades FOR SELECT USING (true);
CREATE POLICY "Public read units" ON units FOR SELECT USING (true);
CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON posts FOR SELECT USING (is_published = true);

-- Public insert politikaları (anonim gönderimler için)
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access grades" ON grades FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access units" ON units FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access topics" ON topics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access lessons" ON lessons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access resources" ON resources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access posts" ON posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read contact" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read newsletter" ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');

-- Başlangıç verileri (Sınıflar)
INSERT INTO grades (name, slug, unit_count, lesson_count, color) VALUES
  ('9. Sınıf', '9-sinif', 3, 24, 'bg-emerald-100 text-emerald-800'),
  ('10. Sınıf', '10-sinif', 3, 28, 'bg-teal-100 text-teal-800'),
  ('11. Sınıf', '11-sinif', 4, 32, 'bg-cyan-100 text-cyan-800'),
  ('12. Sınıf', '12-sinif', 4, 30, 'bg-sky-100 text-sky-800')
ON CONFLICT (slug) DO NOTHING;
