
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Menu, Clock, Eye, ArrowLeft, ChevronDown, CheckCircle2, Circle, PlayCircle, PanelRightClose, PanelRightOpen, X } from 'lucide-react';
import { MOCK_LESSON, MOCK_UNITS, GRADES } from '../constants';
import QuizComponent from '../components/QuizComponent';
import FlashcardDeck from '../components/FlashcardDeck';
import { AnimatePresence, motion } from 'framer-motion';
import { markLessonComplete, getCompletedLessons, saveLastAccessedLesson } from '../lib/storage';

const LessonDetail: React.FC = () => {
    const { gradeSlug, unitSlug, lessonSlug } = useParams();
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile state
    const [showDesktopSidebar, setShowDesktopSidebar] = useState(true); // Desktop state
    const navigate = useNavigate();
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    const lesson = MOCK_LESSON; // Default mock
    const grade = GRADES.find(g => g.slug === gradeSlug);
    const currentUnit = MOCK_UNITS.find(u => u.slug === unitSlug);

    // Get ALL units for this grade to display in sidebar
    const gradeUnits = MOCK_UNITS.filter(u => u.gradeId === grade?.id);

    // Load progress on mount
    useEffect(() => {
        setCompletedLessons(getCompletedLessons());

        const handleStorageChange = () => {
            setCompletedLessons(getCompletedLessons());
        };

        window.addEventListener('lesson-progress-updated', handleStorageChange);
        return () => window.removeEventListener('lesson-progress-updated', handleStorageChange);
    }, []);

    // Save last accessed lesson
    useEffect(() => {
        if (gradeSlug && unitSlug && lessonSlug && lesson) {
            saveLastAccessedLesson(gradeSlug, unitSlug, lessonSlug, lesson.title);
        }
    }, [gradeSlug, unitSlug, lessonSlug, lesson]);

    // --- NAVIGATION LOGIC ---
    interface FlatLesson {
        id: string;
        title: string;
        slug: string;
        unitSlug: string;
        gradeSlug: string;
    }

    const allLessons: FlatLesson[] = [];
    if (grade) {
        const units = MOCK_UNITS.filter(u => u.gradeId === grade.id);
        units.forEach(u => {
            u.topics.forEach(t => {
                t.lessons.forEach(l => {
                    allLessons.push({
                        id: l.id,
                        title: l.title,
                        slug: l.slug,
                        unitSlug: u.slug,
                        gradeSlug: grade.slug
                    });
                });
            });
        });
    }

    const currentIndex = allLessons.findIndex(l => l.slug === lessonSlug && l.unitSlug === unitSlug);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const handleNavigate = (target: FlatLesson, isNext: boolean = false) => {
        if (isNext && lessonSlug) {
            // Mark current lesson as complete when moving to next
            markLessonComplete(lessonSlug);
        }
        navigate(`/dersler/${target.gradeSlug}/${target.unitSlug}/${target.slug}`);
        window.scrollTo(0, 0);
    };
    // ------------------------

    // Accordion State for Sidebar
    const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);

    // Set the current unit as expanded when page loads
    useEffect(() => {
        if (currentUnit) {
            setExpandedUnitIds(prev => {
                if (!prev.includes(currentUnit.id)) {
                    return [...prev, currentUnit.id];
                }
                return prev;
            });
        }
    }, [currentUnit]);

    if (!lesson || !grade || !currentUnit) return <div className="p-20 text-center text-slate-500 font-display text-xl">Ders Yükleniyor...</div>;

    const toggleUnit = (id: string) => {
        setExpandedUnitIds(prev =>
            prev.includes(id)
                ? prev.filter(uid => uid !== id)
                : [...prev, id]
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 pt-20 relative">

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="bg-bio-mint text-white p-4 rounded-full shadow-lg shadow-bio-mint/40 hover:bg-bio-mint-dark transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar Toggle (Visible when sidebar is closed) */}
            <AnimatePresence>
                {!showDesktopSidebar && (
                    <motion.button
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={() => setShowDesktopSidebar(true)}
                        className="hidden lg:flex fixed right-0 top-32 z-40 bg-slate-900 text-white shadow-2xl shadow-slate-900/30 py-3 px-5 rounded-l-2xl items-center gap-3 hover:bg-slate-800 hover:pr-6 transition-all group"
                        title="Ders Listesini Aç"
                    >
                        <div className="bg-bio-mint/20 p-1.5 rounded-lg text-bio-mint group-hover:bg-bio-mint group-hover:text-slate-900 transition-colors">
                            <PanelRightOpen size={20} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Ders</span>
                            <span className="text-sm font-bold font-display leading-none">Listesi</span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT AREA */}
            <main className={`flex-1 w-full mx-auto p-6 sm:p-10 lg:p-16 transition-all duration-500 ease-in-out ${showDesktopSidebar ? 'lg:mr-80' : ''} max-w-7xl`}>

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
                    <Link to="/" className="hover:text-bio-mint transition-colors">Anasayfa</Link>
                    <ChevronRight size={12} />
                    <Link to={`/dersler/${gradeSlug}`} className="hover:text-bio-mint transition-colors">{grade.name}</Link>
                    <ChevronRight size={12} />
                    <span className="text-slate-500">{currentUnit.title}</span>
                    <ChevronRight size={12} />
                    <span className="text-slate-800">{lesson.title}</span>
                </nav>

                {/* Lesson Header */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-display text-slate-900 mb-6 leading-tight">
                        {lesson.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="px-3 py-1 bg-bio-mint/10 text-bio-mint-dark rounded-full font-bold border border-bio-mint/20">
                            {grade.name}
                        </div>
                        <div className="px-3 py-1 bg-bio-lavender/10 text-bio-lavender-dark rounded-full font-bold border border-bio-lavender/20">
                            {currentUnit.title}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 ml-auto">
                            <Clock size={16} /> <span>{lesson.duration} dk</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <Eye size={16} /> <span>{lesson.viewCount}</span>
                        </div>
                    </div>
                </header>

                {/* Content Blocks */}
                <div className="space-y-16">
                    {lesson.blocks.map(block => (
                        <div key={block.id} className="scroll-mt-32">
                            {/* TEXT BLOCK */}
                            {block.type === 'text' && block.content && (
                                <div
                                    className="prose prose-lg prose-slate max-w-none 
                            prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 
                            prose-p:text-slate-600 prose-p:leading-relaxed 
                            prose-a:text-bio-mint prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-bio-mint-dark
                            prose-li:marker:text-bio-mint"
                                    dangerouslySetInnerHTML={{ __html: block.content }}
                                />
                            )}

                            {/* IMAGE BLOCK */}
                            {block.type === 'image' && (
                                <figure className="my-10 relative group rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
                                    <img
                                        src={block.data?.items?.[0]?.url || block.data?.url}
                                        alt={block.data?.items?.[0]?.caption || block.data?.caption || ''}
                                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {(block.data?.items?.[0]?.caption || block.data?.caption) && (
                                        <figcaption className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur-md text-white text-center p-4 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            {block.data?.items?.[0]?.caption || block.data?.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            )}

                            {/* VIDEO BLOCK */}
                            {block.type === 'video' && block.data?.url && (
                                <div className="my-10">
                                    {block.data.title && (
                                        <h4 className="text-lg font-bold text-slate-800 mb-4">{block.data.title}</h4>
                                    )}
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-slate-900">
                                        <iframe
                                            src={block.data.url.includes('youtube') ? block.data.url.replace('watch?v=', 'embed/') : block.data.url}
                                            title={block.data.title || 'Video'}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}

                            {/* CALLOUT BLOCK */}
                            {block.type === 'callout' && (
                                <div className={`p-6 rounded-xl border-l-4 my-8 ${block.data?.type === 'warning' ? 'bg-amber-50 border-amber-400 text-amber-900' :
                                        block.data?.type === 'error' ? 'bg-red-50 border-red-400 text-red-900' :
                                            'bg-blue-50 border-bio-mint text-slate-800'
                                    }`}>
                                    <h4 className="font-bold font-display flex items-center gap-2 mb-2 text-lg">
                                        {block.data?.title || 'Bilgi'}
                                    </h4>
                                    <p className="leading-relaxed">{block.data?.text}</p>
                                </div>
                            )}

                            {/* QUOTE BLOCK */}
                            {block.type === 'quote' && (
                                <blockquote className="my-10 pl-6 border-l-4 border-bio-lavender italic text-slate-600">
                                    <p className="text-xl leading-relaxed mb-2">"{block.data?.text}"</p>
                                    {block.data?.author && (
                                        <cite className="text-sm font-medium text-slate-500 not-italic">— {block.data.author}</cite>
                                    )}
                                </blockquote>
                            )}

                            {/* DIVIDER BLOCK */}
                            {block.type === 'divider' && (
                                <div className="my-12 flex items-center gap-4">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                                    <div className="w-2 h-2 rounded-full bg-bio-mint"></div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                                </div>
                            )}

                            {/* TABLE BLOCK */}
                            {block.type === 'table' && block.data?.headers && (
                                <div className="my-10 overflow-x-auto">
                                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
                                        <thead>
                                            <tr className="bg-slate-800 text-white">
                                                {block.data.headers.map((header: string, i: number) => (
                                                    <th key={i} className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {block.data.rows?.map((row: string[], rowIndex: number) => (
                                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                                    {row.map((cell: string, cellIndex: number) => (
                                                        <td key={cellIndex} className="px-6 py-4 text-slate-700 border-t border-slate-100">{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* LIST BLOCK */}
                            {block.type === 'list' && block.data?.items && (
                                <div className="my-8">
                                    {block.data.style === 'ordered' ? (
                                        <ol className="list-decimal list-inside space-y-2 text-slate-700">
                                            {block.data.items.map((item: string, i: number) => (
                                                <li key={i} className="text-lg leading-relaxed">{item}</li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <ul className="space-y-2 text-slate-700">
                                            {block.data.items.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-lg leading-relaxed">
                                                    <span className="w-2 h-2 rounded-full bg-bio-mint mt-2.5 shrink-0"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* STEPS BLOCK */}
                            {block.type === 'steps' && block.data?.steps && (
                                <div className="my-10 relative">
                                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-bio-mint via-bio-cyan to-bio-lavender"></div>
                                    <div className="space-y-6">
                                        {block.data.steps.map((step: { title: string; description: string }, i: number) => (
                                            <div key={i} className="relative pl-14">
                                                <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-bio-mint to-bio-cyan flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-bio-mint/20">
                                                    {i + 1}
                                                </div>
                                                <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100">
                                                    <h4 className="font-bold font-display text-slate-900 text-lg mb-1">{step.title}</h4>
                                                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ACCORDION BLOCK */}
                            {block.type === 'accordion' && (
                                <details className="my-8 group bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold font-display text-slate-900 text-lg hover:bg-slate-50 transition-colors">
                                        {block.data?.title || 'Detaylar'}
                                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="p-5 pt-0 text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data?.content || '' }} />
                                </details>
                            )}

                            {/* CODE BLOCK */}
                            {block.type === 'code' && (
                                <div className="my-10">
                                    {block.data?.language && (
                                        <div className="bg-slate-700 text-slate-300 px-4 py-2 rounded-t-xl text-xs font-mono uppercase">{block.data.language}</div>
                                    )}
                                    <pre className={`p-5 bg-slate-900 text-green-400 font-mono text-sm overflow-x-auto ${block.data?.language ? 'rounded-b-xl' : 'rounded-xl'}`}>
                                        <code>{block.data?.code}</code>
                                    </pre>
                                </div>
                            )}

                            {/* AUDIO BLOCK */}
                            {block.type === 'audio' && block.data?.url && (
                                <div className="my-8 bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    {block.data.title && (
                                        <h4 className="font-bold text-slate-800 mb-3">{block.data.title}</h4>
                                    )}
                                    <audio controls className="w-full">
                                        <source src={block.data.url} type="audio/mpeg" />
                                        Tarayıcınız ses oynatmayı desteklemiyor.
                                    </audio>
                                </div>
                            )}

                            {/* FILE BLOCK */}
                            {block.type === 'file' && block.data?.url && (
                                <div className="my-8">
                                    <a
                                        href={block.data.url}
                                        download
                                        className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-bio-mint hover:shadow-lg transition-all group"
                                    >
                                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                            <span className="font-bold text-xs">PDF</span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-bold text-slate-800 group-hover:text-bio-mint-dark transition-colors">{block.data.label || 'Dosyayı İndir'}</span>
                                            {block.data.size && <span className="text-sm text-slate-500 ml-2">({block.data.size})</span>}
                                        </div>
                                    </a>
                                </div>
                            )}

                            {/* SPLIT BLOCK */}
                            {block.type === 'split' && (
                                <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Panel */}
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        {block.data?.left?.type === 'text' && block.data.left.content && (
                                            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: block.data.left.content }} />
                                        )}
                                        {block.data?.left?.type === 'callout' && (
                                            <div className={`p-4 rounded-lg border-l-4 ${block.data.left.data?.type === 'warning' ? 'bg-amber-50 border-amber-400 text-amber-900' :
                                                    block.data.left.data?.type === 'error' ? 'bg-red-50 border-red-400 text-red-900' :
                                                        'bg-blue-50 border-bio-mint text-slate-800'
                                                }`}>
                                                <h5 className="font-bold mb-1">{block.data.left.data?.title}</h5>
                                                <p className="text-sm">{block.data.left.data?.text}</p>
                                            </div>
                                        )}
                                        {block.data?.left?.type === 'image' && block.data.left.data?.items?.[0]?.url && (
                                            <img src={block.data.left.data.items[0].url} alt="" className="w-full rounded-lg" />
                                        )}
                                    </div>
                                    {/* Right Panel */}
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        {block.data?.right?.type === 'text' && block.data.right.content && (
                                            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: block.data.right.content }} />
                                        )}
                                        {block.data?.right?.type === 'callout' && (
                                            <div className={`p-4 rounded-lg border-l-4 ${block.data.right.data?.type === 'warning' ? 'bg-amber-50 border-amber-400 text-amber-900' :
                                                    block.data.right.data?.type === 'error' ? 'bg-red-50 border-red-400 text-red-900' :
                                                        'bg-blue-50 border-bio-mint text-slate-800'
                                                }`}>
                                                <h5 className="font-bold mb-1">{block.data.right.data?.title}</h5>
                                                <p className="text-sm">{block.data.right.data?.text}</p>
                                            </div>
                                        )}
                                        {block.data?.right?.type === 'image' && block.data.right.data?.items?.[0]?.url && (
                                            <img src={block.data.right.data.items[0].url} alt="" className="w-full rounded-lg" />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* FLASHCARD BLOCK */}
                            {block.type === 'flashcard' && (
                                <div className="my-12">
                                    <div className="text-center mb-8">
                                        <span className="text-bio-lavender font-bold uppercase tracking-widest text-xs">Pekiştirme</span>
                                        <h3 className="text-2xl font-bold font-display text-slate-900 mt-2">{block.data?.title}</h3>
                                    </div>
                                    <FlashcardDeck cards={block.data?.cards || []} />
                                </div>
                            )}

                            {/* QUIZ BLOCK */}
                            {block.type === 'quiz' && (
                                <div className="my-16 p-1 bg-gradient-to-br from-bio-mint to-bio-cyan rounded-3xl">
                                    <div className="bg-white rounded-[20px] overflow-hidden">
                                        <QuizComponent questions={block.data?.questions || []} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>


                {/* Lesson Footer Navigation */}
                <div className="mt-20 pt-10 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={() => prevLesson && handleNavigate(prevLesson, false)}
                        disabled={!prevLesson}
                        className={`flex items-center gap-2 font-medium px-6 py-3 rounded-xl transition-all w-full sm:w-auto justify-center ${!prevLesson ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm'}`}
                    >
                        <ChevronLeft size={20} /> Önceki Ders
                    </button>

                    <button
                        onClick={() => nextLesson && handleNavigate(nextLesson, true)}
                        disabled={!nextLesson}
                        className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto justify-center group ${!nextLesson ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20'}`}
                    >
                        {nextLesson ? 'Sonraki Ders' : 'Dersler Bitti'} <ChevronRight size={20} className={nextLesson ? "group-hover:translate-x-1 transition-transform" : ""} />
                    </button>
                </div>
            </main>

            {/* SIDEBAR NAVIGATION */}
            <aside className={`
        fixed inset-y-0 right-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200 
        transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:h-[calc(100vh-80px)] lg:top-20
        ${showDesktopSidebar ? 'lg:translate-x-0' : 'lg:translate-x-full'}
      `}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-slate-100 bg-white z-10 relative group">
                    {/* Close Button Desktop */}
                    <button
                        onClick={() => setShowDesktopSidebar(false)}
                        className="hidden lg:flex absolute top-5 right-5 p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-all shadow-sm z-20"
                        title="Listeyi Gizle"
                    >
                        <PanelRightClose size={18} />
                    </button>

                    {/* Close Button Mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X size={18} />
                    </button>

                    <div className="pt-2 pr-8">
                        <Link to={`/dersler/${gradeSlug}`} className="text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-bio-mint flex items-center mb-3 transition-colors">
                            <ArrowLeft size={12} className="mr-1" /> Müfredata Dön
                        </Link>
                        <h2 className="font-display font-bold text-xl text-slate-800 leading-tight">{grade.name} Dersleri</h2>
                        <div className="text-xs text-slate-500 mt-1">{gradeUnits.length} Ünite • {grade.lessonCount} Ders</div>
                    </div>
                </div>

                {/* Units List (Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {gradeUnits.map((u, index) => {
                        const isExpanded = expandedUnitIds.includes(u.id);
                        const isActiveUnit = u.id === currentUnit.id;

                        return (
                            <div key={u.id} className={`rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-slate-50 ring-1 ring-slate-200' : 'bg-white hover:bg-slate-50'}`}>
                                {/* Unit Header */}
                                <button
                                    onClick={() => toggleUnit(u.id)}
                                    className="w-full flex items-center justify-between p-3 text-left focus:outline-none group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isActiveUnit ? 'bg-bio-mint text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}>
                                            {index + 1}
                                        </div>
                                        <span className={`text-sm font-bold truncate transition-colors ${isActiveUnit ? 'text-bio-mint-dark' : 'text-slate-700'}`}>
                                            {u.title}
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Lessons List */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-3 pb-3 pt-1 space-y-4 border-t border-slate-100/50">
                                                {u.topics.map(topic => (
                                                    <div key={topic.id}>
                                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2 mt-2">
                                                            {topic.title}
                                                        </h3>
                                                        <ul className="space-y-0.5">
                                                            {topic.lessons.map(l => {
                                                                const isActive = l.slug === lessonSlug;
                                                                const isCompleted = completedLessons.includes(l.slug);

                                                                return (
                                                                    <li key={l.id}>
                                                                        <Link
                                                                            to={`/dersler/${gradeSlug}/${u.slug}/${l.slug}`}
                                                                            className={`relative flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-medium transition-all duration-300 ${isActive
                                                                                    ? 'bg-bio-mint/10 text-bio-mint-dark border-l-2 border-bio-mint'
                                                                                    : 'text-slate-600 hover:bg-slate-100 border-l-2 border-transparent'
                                                                                }`}
                                                                            onClick={() => setSidebarOpen(false)}
                                                                        >
                                                                            {isActive && (
                                                                                <div className="absolute inset-0 bg-bio-mint/5 animate-pulse rounded-lg pointer-events-none"></div>
                                                                            )}

                                                                            {isCompleted ? (
                                                                                <div className="mt-0.5 shrink-0"><CheckCircle2 size={16} className="text-white fill-emerald-500" /></div>
                                                                            ) : isActive ? (
                                                                                <div className="mt-0.5 text-bio-mint shrink-0"><PlayCircle size={16} /></div>
                                                                            ) : (
                                                                                <div className="mt-0.5 text-slate-300 shrink-0"><Circle size={16} /></div>
                                                                            )}

                                                                            <span className={`leading-tight ${isCompleted && !isActive ? 'opacity-70 line-through decoration-slate-300 decoration-1' : ''}`}>
                                                                                {l.title}
                                                                            </span>
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
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
            </aside>

        </div>
    );
};

export default LessonDetail;
