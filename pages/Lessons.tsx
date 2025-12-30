
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GRADES, MOCK_UNITS } from '../constants';
import GradeCard from '../components/GradeCard';
import { ChevronDown, PlayCircle, ArrowLeft, Book, CheckCircle2, Play, Layers, AlertTriangle, RotateCw, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompletedLessons, getLastAccessedLesson, LastAccessedLesson } from '../lib/storage';

const Lessons: React.FC = () => {
    const { gradeSlug } = useParams<{ gradeSlug: string }>();

    // State for accordion (which units are expanded)
    const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>(['u1']);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [lastAccessed, setLastAccessed] = useState<LastAccessedLesson | null>(null);
    const [showSessionAlert, setShowSessionAlert] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('hideSessionAlert') !== 'true';
        }
        return true;
    });

    useEffect(() => {
        if (gradeSlug) {
            setCompletedLessons(getCompletedLessons());
            setLastAccessed(getLastAccessedLesson(gradeSlug));

            // Listen for updates if user goes back/forward
            const handleStorageChange = () => {
                setCompletedLessons(getCompletedLessons());
                setLastAccessed(getLastAccessedLesson(gradeSlug));
            };

            window.addEventListener('lesson-progress-updated', handleStorageChange);
            return () => window.removeEventListener('lesson-progress-updated', handleStorageChange);
        }
    }, [gradeSlug]);

    // If no grade is selected, show grade selection screen
    if (!gradeSlug) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* 1. HERO SECTION - Fresh & Light (Matches Notes Page) */}
                <div className="relative bg-white pt-32 pb-24 overflow-hidden border-b border-slate-100">
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] -right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-bio-mint/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-bio-lavender/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bio-mint/10 border border-bio-mint/20 text-bio-mint-dark text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                                <Book size={14} className="text-bio-mint" />
                                <span>Müfredat</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold font-display text-slate-900 mb-6 tracking-tight leading-tight">
                                Sınıfını <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-mint-dark to-bio-cyan">Seç</span>
                            </h1>

                            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                                Lise müfredatına uygun, ünite ünite ayrılmış interaktif ders içeriklerine ulaşmak için sınıf seviyeni belirle.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* 2. GRADES GRID */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {GRADES.map((grade, index) => (
                            <GradeCard key={grade.id} grade={grade} index={index} uniform={true} />
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    }

    // LOGIC FOR GRADE VIEW
    const grade = GRADES.find(g => g.slug === gradeSlug);
    const units = MOCK_UNITS.filter(u => u.gradeId === grade?.id);

    if (!grade) return <div className="p-20 text-center text-xl text-slate-400">Aradığınız sınıf bulunamadı.</div>;

    // Calculate total progress
    const totalLessons = units.reduce((acc, u) => acc + u.topics.reduce((tAcc, t) => tAcc + t.lessons.length, 0), 0);
    const completedCount = units.reduce((acc, u) => acc + u.topics.reduce((tAcc, t) => tAcc + t.lessons.filter(l => completedLessons.includes(l.slug)).length, 0), 0);
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Helper to find the very first lesson to "Start from Beginning"
    const getFirstLessonUrl = () => {
        if (units.length > 0 && units[0].topics.length > 0 && units[0].topics[0].lessons.length > 0) {
            const firstUnit = units[0];
            const firstLesson = firstUnit.topics[0].lessons[0];
            return `/dersler/${grade.slug}/${firstUnit.slug}/${firstLesson.slug}`;
        }
        return '#';
    };

    const toggleUnit = (unitId: string) => {
        setExpandedUnitIds(prev =>
            prev.includes(unitId)
                ? prev.filter(id => id !== unitId) // Close if open
                : [...prev, unitId] // Open if closed
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* 1. HERO SECTION - Light Theme (Updated for consistency) */}
            <div className="relative bg-white pt-32 pb-24 overflow-hidden border-b border-slate-100">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-bio-mint/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-bio-lavender/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Breadcrumb / Back Link */}
                        <Link
                            to="/dersler"
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-bio-mint transition-colors mb-8 bg-slate-50 px-4 py-2 rounded-full border border-slate-200"
                        >
                            <ArrowLeft size={16} /> Tüm Sınıflar
                        </Link>

                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bio-mint/10 border border-bio-mint/20 text-bio-mint-dark text-xs font-bold uppercase tracking-widest shadow-sm">
                                <Book size={14} className="text-bio-mint" />
                                <span>{grade.name} Müfredatı</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold font-display text-slate-900 mb-6 tracking-tight leading-tight">
                            {grade.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-mint-dark to-bio-cyan">Biyoloji</span>
                        </h1>

                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                            Temel kavramlardan ileri düzey konulara, sınavlara hazırlık için yapılandırılmış eksiksiz bir yol haritası.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-slate-500 mb-10">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <Layers size={18} className="text-bio-mint" />
                                <span>{grade.unitCount} Ünite</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <PlayCircle size={18} className="text-bio-lavender" />
                                <span>{grade.lessonCount} Ders</span>
                            </div>
                        </div>

                        {/* Main Action */}
                        <div className="flex justify-center">
                            {lastAccessed ? (
                                <Link
                                    to={`/dersler/${grade.slug}/${lastAccessed.unitSlug}/${lastAccessed.lessonSlug}`}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-bio-mint/20 hover:scale-105 transition-all duration-300 overflow-hidden text-left"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-bio-mint to-bio-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center gap-4">
                                        <div className="bg-white/10 p-2 rounded-full">
                                            <RotateCw size={24} className="text-bio-mint-light" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-slate-400 group-hover:text-white/90 font-bold tracking-wider mb-0.5">Kaldığın Yerden Devam Et</span>
                                            <span className="text-base leading-none">{lastAccessed.title}</span>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link
                                    to={getFirstLessonUrl()}
                                    className="group relative inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-bio-mint/20 hover:scale-105 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-bio-mint to-bio-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-2">
                                        <Play size={20} fill="currentColor" /> Derse Başla
                                    </span>
                                </Link>
                            )}
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* 2. CURRICULUM CONTENT (Accordion) */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">

                {/* Session Warning Alert (Dismissible) */}
                <AnimatePresence>
                    {showSessionAlert && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-amber-50/95 backdrop-blur-md border border-amber-200/80 rounded-2xl p-5 flex items-start gap-4 shadow-lg shadow-amber-900/5 relative">
                                <div className="bg-amber-100 p-2.5 rounded-full text-amber-600 shrink-0 mt-0.5">
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="pr-8">
                                    <h4 className="text-base font-bold text-amber-900">Oturum Bilgilendirmesi</h4>
                                    <p className="text-sm text-amber-800/80 mt-1 leading-relaxed">
                                        Sitemizde üyelik sistemi bulunmamaktadır. Tarayıcınızı kapattığınızda ilerleme durumunuz ve kaldığınız yer bilgisi sıfırlanacaktır.
                                        <span className="block mt-1 font-medium text-amber-900">💡 İpucu: Kaldığınız dersi bir yere not almayı unutmayın.</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setShowSessionAlert(false); localStorage.setItem('hideSessionAlert', 'true'); }}
                                    className="absolute top-3 right-3 p-2 text-amber-400 hover:text-amber-700 hover:bg-amber-100 rounded-full transition-colors"
                                    title="Uyarıyı Kapat"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Bar */}
                <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 mb-8 border border-white/50 backdrop-blur-sm">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Genel İlerleme</h3>
                            <p className="text-xs text-slate-500">Bu sınıftaki tamamlanan dersler (Oturum süresince)</p>
                        </div>
                        <span className="text-2xl font-bold font-display text-bio-mint">{progressPercentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-bio-mint to-bio-cyan rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Units Accordion */}
                <div className="space-y-4">
                    {units.map((unit, index) => {
                        const isOpen = expandedUnitIds.includes(unit.id);
                        const totalLessonsInUnit = unit.topics.reduce((acc, t) => acc + t.lessons.length, 0);

                        return (
                            <div
                                key={unit.id}
                                className={`group bg-white border transition-all duration-300 overflow-hidden ${isOpen ? 'rounded-3xl border-bio-mint/30 shadow-lg shadow-bio-mint/5' : 'rounded-2xl border-slate-200 hover:border-bio-mint/20 shadow-sm hover:shadow-md'}`}
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleUnit(unit.id)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold font-display transition-colors ${isOpen ? 'bg-bio-mint text-white shadow-lg shadow-bio-mint/30' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h2 className={`text-lg font-bold font-display transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                                {unit.title}
                                            </h2>
                                            <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                <span>{unit.topics.length} Konu</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span>{totalLessonsInUnit} Ders</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-100 rotate-180 text-slate-900' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                {/* Accordion Body */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-8 pt-2 border-t border-slate-100 bg-slate-50/50">
                                                {unit.topics.map((topic, topicIndex) => (
                                                    <div key={topic.id} className="mt-8 first:mt-4">
                                                        {/* Topic Header - Bold & Distinct */}
                                                        <div className="flex items-center gap-3 mb-4 px-2">
                                                            <div className="w-8 h-8 rounded-lg bg-bio-mint/10 flex items-center justify-center text-bio-mint-dark shrink-0">
                                                                <Layers size={16} />
                                                            </div>
                                                            <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight">
                                                                {topic.title}
                                                            </h3>
                                                            <div className="h-px bg-slate-200 flex-1 ml-2"></div>
                                                        </div>

                                                        <div className="space-y-3 pl-3 md:pl-11">
                                                            {topic.lessons.map((lesson, lessonIndex) => {
                                                                const isCompleted = completedLessons.includes(lesson.slug);
                                                                // Check if this is the last accessed lesson
                                                                const isLastAccessed = lastAccessed?.lessonSlug === lesson.slug;

                                                                return (
                                                                    <Link
                                                                        key={lesson.id}
                                                                        to={`/dersler/${grade.slug}/${unit.slug}/${lesson.slug}`}
                                                                        className={`flex items-center justify-between p-4 border rounded-xl hover:shadow-md hover:translate-x-1 transition-all group/lesson ${isLastAccessed
                                                                            ? 'bg-bio-mint/5 border-bio-mint/50 shadow-md ring-1 ring-bio-mint/20'
                                                                            : 'bg-white border-slate-100 hover:border-bio-mint/40'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-4">
                                                                            <div className={`p-2 rounded-full transition-colors ${isCompleted ? 'bg-emerald-100 text-emerald-600' :
                                                                                isLastAccessed ? 'bg-bio-mint text-white' :
                                                                                    'bg-slate-50 text-slate-400 group-hover/lesson:bg-bio-mint/10 group-hover/lesson:text-bio-mint'
                                                                                }`}>
                                                                                {isCompleted ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className={`text-sm font-bold ${isCompleted ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-700 group-hover/lesson:text-slate-900'}`}>
                                                                                    {lesson.title}
                                                                                </span>
                                                                                {isLastAccessed && !isCompleted && (
                                                                                    <span className="text-[10px] text-bio-mint-dark font-bold uppercase tracking-wide">Son Görüntülenen</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            {isCompleted && (
                                                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Tamamlandı</span>
                                                                            )}
                                                                        </div>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Lessons;
