
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Share2, Printer, Bookmark, ChevronRight, FolderOpen, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../lib/supabase';
import { StudyResource } from '../types';

const NoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [note, setNote] = useState<StudyResource | null>(null);
    const [relatedNotes, setRelatedNotes] = useState<StudyResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNote();
    }, [id]);

    const loadNote = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await dbService.getResourceById(id);
            if (data) {
                const mapped: StudyResource = {
                    id: data.id,
                    type: data.type,
                    title: data.title,
                    grade: data.grade || '',
                    unit: data.unit || '',
                    topic: data.topic,
                    content: data.content,
                    fileUrl: data.file_url,
                    size: data.file_size,
                    downloads: data.downloads || 0,
                    views: data.views || 0,
                    date: new Date(data.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
                };
                setNote(mapped);

                // Load related notes
                const allResources = await dbService.getResources();
                const related = (allResources || [])
                    .filter((r: any) => r.grade === data.grade && r.id !== data.id && r.type === 'note')
                    .slice(0, 3)
                    .map((r: any) => ({
                        id: r.id,
                        type: r.type,
                        title: r.title,
                        grade: r.grade || '',
                        unit: r.unit || '',
                        topic: r.topic,
                        content: r.content,
                        fileUrl: r.file_url,
                        size: r.file_size,
                        downloads: r.downloads || 0,
                        views: r.views || 0,
                        date: new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
                    }));
                setRelatedNotes(related);
            }
        } catch (error) {
            console.error('Error loading note:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Not Bulunamadı</h2>
                <button onClick={() => navigate('/notlar')} className="text-bio-mint font-bold hover:underline">
                    Notlara Dön
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-bio-mint/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Breadcrumb & Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/notlar"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
                    >
                        <ArrowLeft size={16} /> Kütüphaneye Dön
                    </Link>

                    <div className="flex gap-2">
                        <button className="p-2 bg-white text-slate-500 rounded-full border border-slate-200 hover:bg-slate-50 hover:text-bio-mint transition-colors" title="Kaydet">
                            <Bookmark size={18} />
                        </button>
                        <button className="p-2 bg-white text-slate-500 rounded-full border border-slate-200 hover:bg-slate-50 hover:text-bio-mint transition-colors" title="Paylaş">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2 bg-white text-slate-500 rounded-full border border-slate-200 hover:bg-slate-50 hover:text-bio-mint transition-colors" title="Yazdır" onClick={() => window.print()}>
                            <Printer size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/50">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bio-mint/10 text-bio-mint-dark text-xs font-bold uppercase tracking-wider">
                                        {note.grade}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        <FolderOpen size={14} /> {note.unit}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 mb-6 leading-tight">
                                    {note.title}
                                </h1>

                                <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                                    <span className="flex items-center gap-2"><Calendar size={16} /> {note.date}</span>
                                    <span className="flex items-center gap-2"><Eye size={16} /> {note.views} Görüntülenme</span>
                                    <span className="flex items-center gap-2"><Clock size={16} /> 5 dk okuma</span>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-8 md:p-10">
                                <div
                                    className="prose prose-lg prose-slate max-w-none 
                            prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 
                            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:text-bio-mint-dark prose-h3:mt-6
                            prose-p:text-slate-600 prose-p:leading-relaxed 
                            prose-a:text-bio-mint prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-800
                            prose-li:marker:text-bio-mint prose-img:rounded-2xl prose-img:shadow-lg"
                                    dangerouslySetInnerHTML={{ __html: note.content || '<p>İçerik hazırlanıyor...</p>' }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">

                        {/* Topic Info Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FolderOpen size={18} className="text-bio-mint" /> Konu Hiyerarşisi
                            </h3>
                            <div className="space-y-4 relative pl-2">
                                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                                <div className="relative flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">{note.grade}</span>
                                </div>

                                <div className="relative flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">{note.unit}</span>
                                </div>

                                <div className="relative flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-bio-mint border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-800">{note.topic || note.title}</span>
                                </div>
                            </div>
                        </div>

                        {/* Related Notes */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Benzer Notlar</h3>
                            <div className="space-y-3">
                                {relatedNotes.length > 0 ? relatedNotes.map(related => (
                                    <Link
                                        key={related.id}
                                        to={`/notlar/${related.id}`}
                                        className="block p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                                    >
                                        <div className="text-xs text-slate-400 mb-1">{related.unit}</div>
                                        <div className="text-sm font-bold text-slate-700 group-hover:text-bio-mint-dark leading-snug">
                                            {related.title}
                                        </div>
                                    </Link>
                                )) : (
                                    <p className="text-sm text-slate-400 italic">Benzer not bulunamadı.</p>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <Link to="/notlar" className="text-sm font-bold text-bio-mint flex items-center gap-1 hover:gap-2 transition-all">
                                    Tümünü Gör <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Banner */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-bio-mint/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h4 className="font-bold text-lg mb-2 relative z-10">Sınava mı Hazırlanıyorsun?</h4>
                            <p className="text-sm text-slate-300 mb-4 relative z-10">Daha fazla test ve çalışma kağıdı için PDF arşivine göz at.</p>
                            <Link to="/notlar" className="w-full py-2 bg-bio-mint text-slate-900 font-bold rounded-lg hover:bg-white transition-colors text-sm relative z-10 block">
                                PDF Arşivine Git
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetail;
