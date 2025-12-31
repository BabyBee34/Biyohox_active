-- =============================================
-- BiyoHox Questions & Solutions Schema
-- Supabase SQL Editor'da çalıştırın
-- =============================================

-- =============================================
-- 1. QUESTIONS (SORULAR) TABLOSU
-- =============================================
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    options JSONB, -- Çoktan seçmeli sorular için: [{id: "A", text: "Seçenek A"}, ...]
    correct_answer TEXT, -- Doğru cevap (örn: "A", "B", "C", "D")
    explanation TEXT, -- Cevap açıklaması
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    grade_id TEXT NOT NULL,
    unit_id TEXT,
    topic_id TEXT,
    image_url TEXT,
    points INTEGER DEFAULT 10,
    time_limit INTEGER DEFAULT 60, -- Saniye cinsinden
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. QUESTION SOLUTIONS (SORU ÇÖZÜMLERİ) TABLOSU
-- =============================================
CREATE TABLE IF NOT EXISTS question_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT, -- Yazılı çözüm
    video_url TEXT, -- Video çözüm URL'si (YouTube, Vimeo vb.)
    solution_type TEXT DEFAULT 'text' CHECK (solution_type IN ('text', 'video', 'both')),
    grade_id TEXT NOT NULL,
    unit_id TEXT,
    topic_id TEXT,
    duration INTEGER DEFAULT 0, -- Video süresi (saniye)
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. USER QUESTION PROGRESS (Kullanıcı İlerlemesi)
-- =============================================
CREATE TABLE IF NOT EXISTS user_question_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL, -- Anonim kullanıcılar için session
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_spent INTEGER, -- Saniye cinsinden
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. INDEXLER
-- =============================================
CREATE INDEX IF NOT EXISTS idx_questions_grade ON questions(grade_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_published ON questions(is_published);
CREATE INDEX IF NOT EXISTS idx_solutions_question ON question_solutions(question_id);
CREATE INDEX IF NOT EXISTS idx_solutions_grade ON question_solutions(grade_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_session ON user_question_progress(session_id);

-- =============================================
-- 5. RLS POLİTİKALARI
-- =============================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;

-- Questions: Yayınlananları herkes okuyabilir
CREATE POLICY "questions_public_read" ON questions 
    FOR SELECT USING (is_published = true);
CREATE POLICY "questions_admin_all" ON questions 
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "questions_admin_insert" ON questions 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "questions_admin_update" ON questions 
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "questions_admin_delete" ON questions 
    FOR DELETE USING (auth.role() = 'authenticated');

-- Solutions: Yayınlananları herkes okuyabilir
CREATE POLICY "solutions_public_read" ON question_solutions 
    FOR SELECT USING (is_published = true);
CREATE POLICY "solutions_admin_all" ON question_solutions 
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "solutions_admin_insert" ON question_solutions 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "solutions_admin_update" ON question_solutions 
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "solutions_admin_delete" ON question_solutions 
    FOR DELETE USING (auth.role() = 'authenticated');

-- User Progress: Herkes yazabilir (anonim)
CREATE POLICY "progress_public_insert" ON user_question_progress 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "progress_public_read" ON user_question_progress 
    FOR SELECT USING (true);

-- =============================================
-- TAMAMLANDI!
-- =============================================
