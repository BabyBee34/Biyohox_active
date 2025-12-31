import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle, BookOpen, PlayCircle, ChevronRight, ChevronDown,
    Clock, Target, Award, CheckCircle, XCircle, ArrowRight,
    Loader2, Filter, Lightbulb, Video, FileText, Sparkles
} from 'lucide-react';
import { GRADES } from '../constants';
import { dbService } from '../lib/supabase';

interface Question {
    id: string;
    title: string;
    content: string;
    options: { id: string; text: string }[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    grade_id: string;
    unit_id: string;
    topic_id: string;
    points: number;
    time_limit: number;
}

interface Solution {
    id: string;
    question_id: string;
    title: string;
    content: string;
    video_url: string;
    solution_type: 'text' | 'video' | 'both';
    grade_id: string;
    unit_id: string;
    topic_id: string;
}

interface Unit {
    id: string;
    title: string;
    slug: string;
    topics: Topic[];
}

interface Topic {
    id: string;
    title: string;
    slug: string;
    question_count?: number;
}

const Questions: React.FC = () => {
    const { gradeSlug } = useParams<{ gradeSlug?: string }>();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'questions' | 'solutions'>('questions');
    const [selectedGrade, setSelectedGrade] = useState<string | null>(gradeSlug || null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [gradeCounts, setGradeCounts] = useState<Record<string, { questionCount: number; solutionCount: number }>>({});

    useEffect(() => {
        if (gradeSlug) {
            const gradeId = gradeSlug.replace('-sinif', '');
            setSelectedGrade(gradeId);
            loadUnits(gradeId);
        }
        loadGradeCounts();
    }, [gradeSlug]);

    const loadGradeCounts = async () => {
        try {
            const data = await dbService.getQuestionCounts();
            setGradeCounts(data || {});
        } catch (error) {
            // Fallback counts
            setGradeCounts({
                '9': { questionCount: 0, solutionCount: 0 },
                '10': { questionCount: 0, solutionCount: 0 },
                '11': { questionCount: 0, solutionCount: 0 },
                '12': { questionCount: 0, solutionCount: 0 }
            });
        }
    };

    const loadUnits = async (gradeId: string) => {
        setLoading(true);
        try {
            const data = await dbService.getUnitsByGrade(gradeId);
            setUnits(data || []);
        } catch (error) {
            console.error('Error loading units:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadQuestionsByTopic = async (topicId: string) => {
        setLoading(true);
        try {
            const data = await dbService.getQuestionsByTopic(topicId);
            setQuestions(data || []);
            setSelectedTopic(topicId);
        } catch (error) {
            console.error('Error loading questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSolutionsByTopic = async (topicId: string) => {
        setLoading(true);
        try {
            const data = await dbService.getSolutionsByTopic(topicId);
            setSolutions(data || []);
            setSelectedTopic(topicId);
        } catch (error) {
            console.error('Error loading solutions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeSelect = (gradeId: string) => {
        setSelectedGrade(gradeId);
        navigate(`/sorular/${gradeId}-sinif`);
        loadUnits(gradeId);
        setSelectedTopic(null);
        setQuestions([]);
        setSolutions([]);
    };

    const handleTopicSelect = (topicId: string) => {
        if (activeTab === 'questions') {
            loadQuestionsByTopic(topicId);
        } else {
            loadSolutionsByTopic(topicId);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Kolay';
            case 'medium': return 'Orta';
            case 'hard': return 'Zor';
            default: return 'Bilinmiyor';
        }
    };

    // Grade Selection View
    if (!selectedGrade) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* Hero */}
                <div className="relative bg-white pt-32 pb-20 overflow-hidden border-b border-slate-100">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-bio-coral/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                        <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-bio-mint/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bio-coral/10 border border-bio-coral/20 text-bio-coral text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                                <HelpCircle size={14} />
                                <span>Soru Bankası</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold font-display text-slate-900 mb-6 tracking-tight">
                                Sorular & <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-coral to-bio-mint">Çözümler</span>
                            </h1>

                            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light">
                                Konulara göre ayrılmış sorular ve detaylı çözümleriyle bilgini test et.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Grade Selection */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Sınıf Seçin</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {GRADES.map((grade) => (
                            <motion.button
                                key={grade.id}
                                onClick={() => handleGradeSelect(grade.id)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-bio-coral/50 hover:shadow-lg transition-all text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bio-coral/10 to-bio-mint/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                    {grade.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{grade.name}</h3>
                                <p className="text-sm text-slate-500 mb-4">{grade.description}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-1">
                                        <HelpCircle size={14} />
                                        {gradeCounts[grade.id]?.questionCount || 0} Soru
                                    </span>
                                    <ArrowRight size={18} className="text-bio-coral group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Grade Selected - Show Tabs and Content
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="relative bg-white pt-32 pb-12 overflow-hidden border-b border-slate-100">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-bio-coral/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <Link to="/sorular" className="hover:text-bio-coral transition-colors">Sorular</Link>
                        <ChevronRight size={16} />
                        <span className="text-slate-800 font-medium">{selectedGrade}. Sınıf</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 mb-4">
                        {selectedGrade}. Sınıf {activeTab === 'questions' ? 'Soruları' : 'Soru Çözümleri'}
                    </h1>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-8">
                        <button
                            onClick={() => { setActiveTab('questions'); setSelectedTopic(null); setQuestions([]); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'questions'
                                    ? 'bg-gradient-to-r from-bio-coral to-orange-400 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            <HelpCircle size={20} />
                            Sorular
                        </button>
                        <button
                            onClick={() => { setActiveTab('solutions'); setSelectedTopic(null); setSolutions([]); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'solutions'
                                    ? 'bg-gradient-to-r from-bio-mint to-bio-cyan text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            <PlayCircle size={20} />
                            Soru Çözümleri
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Units & Topics */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-24">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <BookOpen size={18} className="text-bio-coral" />
                                    Üniteler & Konular
                                </h3>
                            </div>

                            {loading && units.length === 0 ? (
                                <div className="p-8 flex justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-bio-coral" />
                                </div>
                            ) : units.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <p>Henüz içerik eklenmemiş.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {units.map((unit) => (
                                        <div key={unit.id}>
                                            <button
                                                onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="font-medium text-slate-700 text-left">{unit.title}</span>
                                                <ChevronDown
                                                    size={18}
                                                    className={`text-slate-400 transition-transform ${expandedUnit === unit.id ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {expandedUnit === unit.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-slate-50"
                                                    >
                                                        {unit.topics?.map((topic) => (
                                                            <button
                                                                key={topic.id}
                                                                onClick={() => handleTopicSelect(topic.id)}
                                                                className={`w-full px-6 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${selectedTopic === topic.id
                                                                        ? 'bg-bio-coral/10 text-bio-coral font-medium'
                                                                        : 'text-slate-600 hover:bg-slate-100'
                                                                    }`}
                                                            >
                                                                <span>{topic.title}</span>
                                                                {topic.question_count && (
                                                                    <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">
                                                                        {topic.question_count}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {!selectedTopic ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                <div className="w-20 h-20 rounded-full bg-bio-coral/10 flex items-center justify-center mx-auto mb-6">
                                    {activeTab === 'questions' ? (
                                        <HelpCircle className="w-10 h-10 text-bio-coral" />
                                    ) : (
                                        <PlayCircle className="w-10 h-10 text-bio-mint" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {activeTab === 'questions' ? 'Konu Seçin' : 'Çözüm İzlemek İçin Konu Seçin'}
                                </h3>
                                <p className="text-slate-500">
                                    Sol taraftaki listeden bir konu seçerek {activeTab === 'questions' ? 'soruları görüntüleyin' : 'çözümleri izleyin'}.
                                </p>
                            </div>
                        ) : loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-bio-coral" />
                            </div>
                        ) : activeTab === 'questions' ? (
                            // Questions List
                            <div className="space-y-4">
                                {questions.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">Bu konuda henüz soru bulunmuyor.</p>
                                    </div>
                                ) : (
                                    questions.map((question, index) => (
                                        <motion.div
                                            key={question.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <Link to={`/sorular/soru/${question.id}`} className="block p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                                                {getDifficultyLabel(question.difficulty)}
                                                            </span>
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Clock size={12} /> {question.time_limit}s
                                                            </span>
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Award size={12} /> {question.points} puan
                                                            </span>
                                                        </div>
                                                        <h3 className="font-bold text-slate-800 mb-2">{question.title}</h3>
                                                        <p className="text-slate-600 text-sm line-clamp-2">{question.content}</p>
                                                    </div>
                                                    <ArrowRight className="text-bio-coral flex-shrink-0" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Solutions List
                            <div className="space-y-4">
                                {solutions.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                        <PlayCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">Bu konuda henüz çözüm bulunmuyor.</p>
                                    </div>
                                ) : (
                                    solutions.map((solution, index) => (
                                        <motion.div
                                            key={solution.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <Link to={`/sorular/cozum/${solution.id}`} className="block p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${solution.solution_type === 'video' || solution.solution_type === 'both'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-bio-mint/10 text-bio-mint-dark'
                                                        }`}>
                                                        {solution.solution_type === 'video' || solution.solution_type === 'both' ? (
                                                            <Video size={24} />
                                                        ) : (
                                                            <FileText size={24} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {solution.solution_type === 'video' && (
                                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                                    Video Çözüm
                                                                </span>
                                                            )}
                                                            {solution.solution_type === 'text' && (
                                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-bio-mint/10 text-bio-mint-dark">
                                                                    Yazılı Çözüm
                                                                </span>
                                                            )}
                                                            {solution.solution_type === 'both' && (
                                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                                                                    Video + Yazılı
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="font-bold text-slate-800">{solution.title}</h3>
                                                    </div>
                                                    <ArrowRight className="text-bio-mint flex-shrink-0" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Questions;
