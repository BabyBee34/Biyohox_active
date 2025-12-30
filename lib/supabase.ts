import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Production için .env.local dosyasında VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalı
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kgrnvxyjqnbytdpuzyqg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtncm52eHlqcW5ieXRkcHV6eXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDQ5OTIsImV4cCI6MjA4MjY4MDk5Mn0.uQ4N_PzOy3QG29XAjHplrl57goK0Vg7YlNl6WJiIJTA';

// Supabase client'ı oluştur
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



// Database service functions
export const dbService = {
    // Grades
    async getGrades() {
        const { data, error } = await supabase.from('grades').select('*').order('slug');
        if (error) throw error;
        return data;
    },

    // Lessons
    async getLessons() {
        const { data, error } = await supabase.from('lessons').select('*').eq('is_published', true);
        if (error) throw error;
        return data;
    },

    async getAllLessons() {
        const { data, error } = await supabase.from('lessons').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getLessonBySlug(slug: string) {
        const { data, error } = await supabase.from('lessons').select('*').eq('slug', slug).single();
        if (error) throw error;
        return data;
    },

    async getLessonById(id: string) {
        const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async createLesson(lesson: any) {
        const { data, error } = await supabase.from('lessons').insert(lesson).select().single();
        if (error) throw error;
        return data;
    },

    async updateLesson(id: string, lesson: any) {
        const { data, error } = await supabase.from('lessons').update(lesson).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteLesson(id: string) {
        const { error } = await supabase.from('lessons').delete().eq('id', id);
        if (error) throw error;
    },

    // Posts (Blog)
    async getPosts() {
        const { data, error } = await supabase.from('posts').select('*').eq('is_published', true).order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getAllPosts() {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getPostById(id: string) {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async createPost(post: any) {
        const { data, error } = await supabase.from('posts').insert(post).select().single();
        if (error) throw error;
        return data;
    },

    async updatePost(id: string, post: any) {
        const { data, error } = await supabase.from('posts').update(post).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deletePost(id: string) {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;
    },

    // Resources (Notes & PDFs)
    async getResources() {
        const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getResourceById(id: string) {
        const { data, error } = await supabase.from('resources').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async createResource(resource: any) {
        const { data, error } = await supabase.from('resources').insert(resource).select().single();
        if (error) throw error;
        return data;
    },

    async updateResource(id: string, resource: any) {
        const { data, error } = await supabase.from('resources').update(resource).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteResource(id: string) {
        const { error } = await supabase.from('resources').delete().eq('id', id);
        if (error) throw error;
    },

    // Contact Messages
    async sendContactMessage(message: { name: string; email: string; subject: string; message: string }) {
        const { data, error } = await supabase.from('contact_messages').insert(message).select().single();
        if (error) throw error;
        return data;
    },

    async getContactMessages() {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    // Newsletter
    async subscribeNewsletter(email: string) {
        const { data, error } = await supabase.from('newsletter_subscribers').insert({ email }).select().single();
        if (error) throw error;
        return data;
    },

    async getNewsletterCount() {
        const { count, error } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
    },

    // Units
    async getUnits() {
        const { data, error } = await supabase.from('units').select('*, topics(*, lessons(*))').order('order_index');
        if (error) throw error;
        return data;
    },

    async getUnitsByGrade(gradeId: string) {
        const { data, error } = await supabase.from('units').select('*, topics(*, lessons(*))').eq('grade_id', gradeId).order('order_index');
        if (error) throw error;
        return data;
    },

    // Dashboard Statistics
    async getStats() {
        const [lessonsRes, resourcesRes, postsRes, messagesRes] = await Promise.all([
            supabase.from('lessons').select('*', { count: 'exact', head: true }),
            supabase.from('resources').select('downloads', { count: 'exact' }),
            supabase.from('posts').select('*', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
        ]);

        // Calculate total downloads
        let totalDownloads = 0;
        if (resourcesRes.data) {
            totalDownloads = resourcesRes.data.reduce((sum: number, r: any) => sum + (r.downloads || 0), 0);
        }

        return {
            lessonCount: lessonsRes.count || 0,
            resourceCount: resourcesRes.count || 0,
            totalDownloads,
            postCount: postsRes.count || 0,
            unreadMessages: messagesRes.count || 0
        };
    },

    // Analytics - Lightweight page tracking
    async trackPageView(pagePath: string) {
        try {
            // Upsert: increment if exists, insert if not
            const today = new Date().toISOString().split('T')[0];
            const { data: existing } = await supabase
                .from('daily_stats')
                .select('id, views')
                .eq('date', today)
                .eq('page_path', pagePath)
                .single();

            if (existing) {
                await supabase
                    .from('daily_stats')
                    .update({ views: existing.views + 1 })
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('daily_stats')
                    .insert({ date: today, page_path: pagePath, views: 1, unique_visitors: 1 });
            }
        } catch (error) {
            // Silently fail - analytics shouldn't break the app
            console.debug('Analytics track failed:', error);
        }
    },

    async getWeeklyStats() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data, error } = await supabase
            .from('daily_stats')
            .select('date, views')
            .gte('date', sevenDaysAgo.toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching weekly stats:', error);
            return [];
        }

        // Aggregate by date
        const aggregated: { [key: string]: number } = {};
        (data || []).forEach((row: any) => {
            const date = row.date;
            aggregated[date] = (aggregated[date] || 0) + row.views;
        });

        // Convert to chart format with Turkish day names
        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
        const result = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            result.push({
                name: dayNames[d.getDay()],
                uv: aggregated[dateStr] || 0
            });
        }

        return result;
    },

    // Get counts for all grades (units and lessons)
    async getGradeCounts() {
        const { data: units, error } = await supabase
            .from('units')
            .select('grade_id, topics(lessons(id))');

        if (error) {
            console.error('Error fetching grade counts:', error);
            return {};
        }

        // Aggregate counts per grade
        const counts: { [gradeId: string]: { unitCount: number; lessonCount: number } } = {};

        (units || []).forEach((unit: any) => {
            const gradeId = unit.grade_id;
            if (!counts[gradeId]) {
                counts[gradeId] = { unitCount: 0, lessonCount: 0 };
            }
            counts[gradeId].unitCount++;

            // Count lessons in all topics of this unit
            (unit.topics || []).forEach((topic: any) => {
                counts[gradeId].lessonCount += (topic.lessons || []).length;
            });
        });

        return counts;
    },

    // FAQs
    async getFaqs() {
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .eq('is_active', true)
            .order('order_index');
        if (error) throw error;
        return data;
    }
};