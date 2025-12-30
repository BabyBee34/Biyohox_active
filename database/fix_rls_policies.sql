-- =============================================
-- BiyoHox Secure RLS Policies
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
-- TÜM ESKİ POLİTİKALARI SİLİP GÜVENLİ OLANLARLA DEĞİŞTİRİR
-- =============================================

-- =============================================
-- 1. ESKİ POLİTİKALARI TEMİZLE
-- =============================================

-- Posts
DROP POLICY IF EXISTS "Anyone can read published posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;
DROP POLICY IF EXISTS "Public read posts" ON posts;
DROP POLICY IF EXISTS "Admin full access posts" ON posts;

-- Lessons
DROP POLICY IF EXISTS "Anyone can read lessons" ON lessons;
DROP POLICY IF EXISTS "Anyone can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Anyone can update lessons" ON lessons;
DROP POLICY IF EXISTS "Anyone can delete lessons" ON lessons;
DROP POLICY IF EXISTS "Public read lessons" ON lessons;
DROP POLICY IF EXISTS "Admin full access lessons" ON lessons;

-- Resources
DROP POLICY IF EXISTS "Anyone can read resources" ON resources;
DROP POLICY IF EXISTS "Anyone can insert resources" ON resources;
DROP POLICY IF EXISTS "Anyone can delete resources" ON resources;
DROP POLICY IF EXISTS "Public read resources" ON resources;
DROP POLICY IF EXISTS "Admin full access resources" ON resources;

-- Grades
DROP POLICY IF EXISTS "Anyone can read grades" ON grades;
DROP POLICY IF EXISTS "Public read grades" ON grades;
DROP POLICY IF EXISTS "Admin full access grades" ON grades;

-- Units
DROP POLICY IF EXISTS "Anyone can read units" ON units;
DROP POLICY IF EXISTS "Public read units" ON units;
DROP POLICY IF EXISTS "Admin full access units" ON units;

-- Topics
DROP POLICY IF EXISTS "Anyone can read topics" ON topics;
DROP POLICY IF EXISTS "Public read topics" ON topics;
DROP POLICY IF EXISTS "Admin full access topics" ON topics;

-- Contact Messages
DROP POLICY IF EXISTS "Allow public insert contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow public select contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Public insert contact" ON contact_messages;
DROP POLICY IF EXISTS "Admin read contact" ON contact_messages;

-- Newsletter
DROP POLICY IF EXISTS "Allow public insert newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public select newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public insert newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin read newsletter" ON newsletter_subscribers;

-- Daily Stats
DROP POLICY IF EXISTS "Allow public to upsert stats" ON daily_stats;

-- =============================================
-- 2. GÜVENLİ POLİTİKALAR OLUŞTUR
-- =============================================

-- GRADES: Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "grades_public_read" ON grades 
  FOR SELECT USING (true);
CREATE POLICY "grades_admin_write" ON grades 
  FOR ALL USING (auth.role() = 'authenticated');

-- UNITS: Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "units_public_read" ON units 
  FOR SELECT USING (true);
CREATE POLICY "units_admin_write" ON units 
  FOR ALL USING (auth.role() = 'authenticated');

-- TOPICS: Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "topics_public_read" ON topics 
  FOR SELECT USING (true);
CREATE POLICY "topics_admin_write" ON topics 
  FOR ALL USING (auth.role() = 'authenticated');

-- LESSONS: Yalnızca yayınlananlar public, admin full access
CREATE POLICY "lessons_public_read" ON lessons 
  FOR SELECT USING (is_published = true);
CREATE POLICY "lessons_admin_all" ON lessons 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "lessons_admin_insert" ON lessons 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "lessons_admin_update" ON lessons 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "lessons_admin_delete" ON lessons 
  FOR DELETE USING (auth.role() = 'authenticated');

-- POSTS (Blog): Yalnızca yayınlananlar public, admin full access
CREATE POLICY "posts_public_read" ON posts 
  FOR SELECT USING (is_published = true);
CREATE POLICY "posts_admin_all" ON posts 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "posts_admin_insert" ON posts 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "posts_admin_update" ON posts 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "posts_admin_delete" ON posts 
  FOR DELETE USING (auth.role() = 'authenticated');

-- RESOURCES: Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "resources_public_read" ON resources 
  FOR SELECT USING (true);
CREATE POLICY "resources_admin_insert" ON resources 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "resources_admin_update" ON resources 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "resources_admin_delete" ON resources 
  FOR DELETE USING (auth.role() = 'authenticated');

-- CONTACT MESSAGES: Herkes gönderebilir, sadece admin okuyabilir/yönetebilir
CREATE POLICY "contact_public_insert" ON contact_messages 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_admin_read" ON contact_messages 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "contact_admin_update" ON contact_messages 
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "contact_admin_delete" ON contact_messages 
  FOR DELETE USING (auth.role() = 'authenticated');

-- NEWSLETTER: Herkes abone olabilir, sadece admin yönetebilir
CREATE POLICY "newsletter_public_insert" ON newsletter_subscribers 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_read" ON newsletter_subscribers 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "newsletter_admin_delete" ON newsletter_subscribers 
  FOR DELETE USING (auth.role() = 'authenticated');

-- DAILY STATS: Herkes yazabilir (analytics), admin okuyabilir
CREATE POLICY "stats_public_upsert" ON daily_stats 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "stats_public_update" ON daily_stats 
  FOR UPDATE USING (true);
CREATE POLICY "stats_admin_read" ON daily_stats 
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- 3. FAQs TABLOSU OLUŞTUR (Y4 düzeltmesi)
-- =============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs_public_read" ON faqs 
  FOR SELECT USING (is_active = true);
CREATE POLICY "faqs_admin_all" ON faqs 
  FOR ALL USING (auth.role() = 'authenticated');

-- Varsayılan FAQ verileri ekle
INSERT INTO faqs (question, answer, order_index) VALUES
  ('BiyoHox nedir?', 'BiyoHox, lise öğrencileri için tasarlanmış ücretsiz bir biyoloji eğitim platformudur. 9-12. sınıf müfredatına uygun ders anlatımları, testler, flashcard''lar ve özet notlar içerir.', 1),
  ('İçerikler ücretsiz mi?', 'Evet! BiyoHox''taki tüm içerikler tamamen ücretsizdir. Dersler, testler, PDF notlar ve blog yazılarına kayıt olmadan erişebilirsiniz.', 2),
  ('Hangi sınıfların konuları bulunuyor?', '9, 10, 11 ve 12. sınıf biyoloji müfredatlarına uygun içerikler mevcuttur. Her sınıf için üniteler, konular ve detaylı ders anlatımları hazırlanmıştır.', 3),
  ('Mobil cihazlardan erişebilir miyim?', 'Evet, BiyoHox tamamen responsive tasarıma sahiptir. Telefon, tablet veya bilgisayarınızdan sorunsuz bir şekilde kullanabilirsiniz.', 4),
  ('Testler nasıl çalışıyor?', 'Her ders sonunda interaktif testler bulunur. Soruları cevapladıktan sonra doğru cevabı ve açıklamasını görebilirsiniz. Testler puanlanır ve ilerlemeniz takip edilir.', 5),
  ('PDF notları indirebilir miyim?', 'Evet, "Notlar & PDF" bölümünden konu özetlerini ve çalışma materyallerini PDF formatında indirebilirsiniz.', 6),
  ('Bir hata buldum, nasıl bildiririm?', 'İletişim sayfamızdaki formu kullanarak veya info@biyohox.com adresine e-posta göndererek hataları bildirebilirsiniz. Her geri bildirim bizim için değerlidir!', 7),
  ('İçerik önerisinde bulunabilir miyim?', 'Elbette! Hangi konuların eklenmesini veya hangi özelliklerin geliştirilmesini istediğinizi İletişim sayfasından bize iletebilirsiniz.', 8)
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. INDEX EKLE (D3 düzeltmesi)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_grade ON lessons(grade_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published);
CREATE INDEX IF NOT EXISTS idx_resources_grade ON resources(grade);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

-- =============================================
-- TAMAMLANDI!
-- =============================================
