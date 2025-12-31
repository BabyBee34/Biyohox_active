import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, FileText, Video, ChevronRight, Loader2, Clock, Eye } from 'lucide-react';
import { dbService } from '../lib/supabase';

interface Solution {
    id: string;
    question_id: string;
    title: string;
    content: string;
    video_url: string;
    solution_type: 'text' | 'video' | 'both';
    grade_id: string;
    duration: number;
    view_count: number;
}

const SolutionDetail: React.FC = () => {
    const { solutionId } = useParams<{ solutionId: string }>();
    const navigate = useNavigate();

    const [solution, setSolution] = useState<Solution | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeContent, setActiveContent] = useState<'video' | 'text'>('video');

    useEffect(() => {
        if (solutionId) {
            loadSolution(solutionId);
        }
    }, [solutionId]);

    const loadSolution = async (id: string) => {
        setLoading(true);
        try {
            const data = await dbService.getSolutionById(id);
            if (data) {
                setSolution(data as Solution);
                // Set default active content based on solution type
                if (data.solution_type === 'text') {
                    setActiveContent('text');
                }
            }
        } catch (error) {
            console.error('Error loading solution:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs}s`;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getVideoEmbedUrl = (url: string) => {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }
        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
        return url;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
            </div>
        );
    }

    if (!solution) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Çözüm Bulunamadı</h1>
                    <Link to="/sorular" className="text-bio-mint hover:underline">
                        Sorulara Dön
                    </Link>
                </div>
            </div>
        );
    }

    const hasVideo = solution.solution_type === 'video' || solution.solution_type === 'both';
    const hasText = solution.solution_type === 'text' || solution.solution_type === 'both';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-4 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Geri
                    </button>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        {solution.duration > 0 && (
                            <span className="flex items-center gap-1">
                                <Clock size={16} />
                                {formatDuration(solution.duration)}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Eye size={16} />
                            {solution.view_count} görüntülenme
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-4">
                        {hasVideo && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 flex items-center gap-1">
                                <Video size={12} /> Video
                            </span>
                        )}
                        {hasText && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-bio-mint/10 text-bio-mint-dark flex items-center gap-1">
                                <FileText size={12} /> Yazılı
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 font-display">
                        {solution.title}
                    </h1>
                </motion.div>

                {/* Content Toggle (if both types available) */}
                {solution.solution_type === 'both' && (
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveContent('video')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeContent === 'video'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'
                                }`}
                        >
                            <Play size={18} />
                            Video Çözüm
                        </button>
                        <button
                            onClick={() => setActiveContent('text')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeContent === 'text'
                                    ? 'bg-bio-mint text-white'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-bio-mint'
                                }`}
                        >
                            <FileText size={18} />
                            Yazılı Çözüm
                        </button>
                    </div>
                )}

                {/* Video Content */}
                {hasVideo && (activeContent === 'video' || solution.solution_type === 'video') && solution.video_url && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black rounded-2xl overflow-hidden shadow-xl mb-8"
                    >
                        <div className="relative pt-[56.25%]">
                            <iframe
                                src={getVideoEmbedUrl(solution.video_url)}
                                title={solution.title}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}

                {/* Text Content */}
                {hasText && (activeContent === 'text' || solution.solution_type === 'text') && solution.content && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
                    >
                        <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: solution.content }}
                        />
                    </motion.div>
                )}

                {/* Related Question Link */}
                {solution.question_id && (
                    <div className="mt-8 bg-gradient-to-r from-bio-coral/10 to-bio-mint/10 rounded-2xl p-6 border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-3">İlgili Soru</h3>
                        <Link
                            to={`/sorular/soru/${solution.question_id}`}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-bio-coral/50 hover:shadow-md transition-all"
                        >
                            <span className="font-medium text-slate-700">Bu çözümün sorusuna git</span>
                            <ChevronRight className="text-bio-coral" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolutionDetail;
