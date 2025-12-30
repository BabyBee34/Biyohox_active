-- =============================================
-- Lightweight Analytics Schema
-- Uses daily aggregation for minimal storage
-- =============================================

-- Daily stats table - one row per day per page
CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_path TEXT NOT NULL DEFAULT '/',
    views INT NOT NULL DEFAULT 1,
    unique_visitors INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint for upsert
    UNIQUE(date, page_path)
);

-- Index for fast date range queries
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date DESC);

-- Enable RLS
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Public can insert/update (for tracking)
CREATE POLICY "Allow public to upsert stats" ON daily_stats
    FOR ALL USING (true) WITH CHECK (true);

-- Function to increment page view
CREATE OR REPLACE FUNCTION increment_page_view(p_path TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO daily_stats (date, page_path, views, unique_visitors)
    VALUES (CURRENT_DATE, p_path, 1, 1)
    ON CONFLICT (date, page_path)
    DO UPDATE SET 
        views = daily_stats.views + 1,
        unique_visitors = daily_stats.unique_visitors + 1;
END;
$$ LANGUAGE plpgsql;

-- Weekly stats view for dashboard
CREATE OR REPLACE VIEW weekly_stats AS
SELECT 
    date,
    SUM(views) as total_views,
    SUM(unique_visitors) as total_visitors
FROM daily_stats
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date
ORDER BY date;
