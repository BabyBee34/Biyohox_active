-- BiyoHox RLS (Row Level Security) Politika Düzeltmesi
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- Mevcut politikaları sil (varsa hata verir, görmezden gelin)
DROP POLICY IF EXISTS "Public read posts" ON posts;
DROP POLICY IF EXISTS "Admin full access posts" ON posts;
DROP POLICY IF EXISTS "Public read grades" ON grades;
DROP POLICY IF EXISTS "Public read units" ON units;
DROP POLICY IF EXISTS "Public read topics" ON topics;
DROP POLICY IF EXISTS "Public insert contact" ON contact_messages;
DROP POLICY IF EXISTS "Public insert newsletter" ON newsletter_subscribers;

-- POSTS için yeni politikalar
CREATE POLICY "Anyone can read published posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete posts" ON posts FOR DELETE USING (true);

-- GRADES
CREATE POLICY "Anyone can read grades" ON grades FOR SELECT USING (true);

-- UNITS  
CREATE POLICY "Anyone can read units" ON units FOR SELECT USING (true);

-- TOPICS
CREATE POLICY "Anyone can read topics" ON topics FOR SELECT USING (true);

-- LESSONS
DROP POLICY IF EXISTS "Public read lessons" ON lessons;
DROP POLICY IF EXISTS "Admin full access lessons" ON lessons;
CREATE POLICY "Anyone can read lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can insert lessons" ON lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update lessons" ON lessons FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete lessons" ON lessons FOR DELETE USING (true);

-- RESOURCES
DROP POLICY IF EXISTS "Public read resources" ON resources;
DROP POLICY IF EXISTS "Admin full access resources" ON resources;
CREATE POLICY "Anyone can read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Anyone can insert resources" ON resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete resources" ON resources FOR DELETE USING (true);

-- CONTACT MESSAGES - TAM YENİDEN OLUŞTUR
DROP POLICY IF EXISTS "Anyone can insert contact" ON contact_messages;
DROP POLICY IF EXISTS "Public insert contact" ON contact_messages;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select contact_messages" ON contact_messages FOR SELECT USING (true);

-- NEWSLETTER - TAM YENİDEN OLUŞTUR
DROP POLICY IF EXISTS "Anyone can subscribe newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public insert newsletter" ON newsletter_subscribers;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select newsletter" ON newsletter_subscribers FOR SELECT USING (true);
