
import React, { useState } from 'react';
import { FileText, Download, Filter, Search, BookOpen, ChevronRight, Eye, Calendar, Clock, Sparkles, FolderOpen, ArrowDownToLine } from 'lucide-react';
import { MOCK_RESOURCES, GRADES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Notes: React.FC = () => {
    const [selectedGrade, setSelectedGrade] = useState<string>('Tümü');
    const [activeTab, setActiveTab] = useState<'note' | 'pdf'>('note');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredResources = MOCK_RESOURCES.filter(res => {
        const gradeMatch = selectedGrade === 'Tümü' || res.grade === selectedGrade;
        const typeMatch = res.type === activeTab;
        const searchMatch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.unit.toLowerCase().includes(searchQuery.toLowerCase());
        return gradeMatch && typeMatch && searchMatch;
    });

    // Animation variants for staggered list
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-slate-50 min-h-screen">

            {/* 1. HERO SECTION - Fresh & Light (Biology Theme) */}
            <div className="relative bg-white pt-32 pb-24 overflow-hidden border-b border-slate-100">
                {/* Background Effects (Soft Organic Shapes) */}
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
                            <Sparkles size={14} className="text-bio-mint" />
                            <span>Dijital Kütüphane</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold font-display text-slate-900 mb-6 tracking-tight leading-tight">
                            Kaynak <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-mint-dark to-bio-cyan">Merkezi</span>
                        </h1>

                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                            Sınavlara hazırlanırken ihtiyacın olan tüm özet notlar, PDF dokümanlar ve çalışma kağıtları tek bir yerde.
                        </p>

                        {/* Main Search Input */}
                        <div className="max-w-2xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-bio-mint to-bio-cyan rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-xl shadow-xl shadow-slate-200/50 flex items-center p-2 border border-slate-100">
                                <div className="pl-4 pr-3 text-slate-400">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder={`${activeTab === 'note' ? 'Konu başlığı' : 'Dosya adı'} ile ara...`}
                                    className="w-full px-2 py-4 outline-none text-slate-800 placeholder-slate-400 font-medium bg-transparent text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="hidden sm:flex bg-slate-50 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-400 border border-slate-200 mx-2">
                                    CMD + K
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">

                {/* Controls Bar (Tabs & Filter) */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/40 border border-white p-2 mb-10 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-24 z-30">

                    {/* Type Toggles */}
                    <div className="bg-slate-100 p-1.5 rounded-xl flex w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('note')}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'note'
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                        >
                            <BookOpen size={18} className={activeTab === 'note' ? 'text-bio-mint-dark' : ''} />
                            <span>Ders Notları</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('pdf')}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'pdf'
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                        >
                            <FileText size={18} className={activeTab === 'pdf' ? 'text-red-500' : ''} />
                            <span>PDF Dosyalar</span>
                        </button>
                    </div>

                    {/* Grade Filter (Horizontal Scroll) */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide mask-fade-right">
                        <div className="flex items-center gap-2 px-2 border-l border-slate-200 ml-2 pl-4">
                            <Filter size={16} className="text-slate-400 shrink-0" />
                            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Filtrele:</span>
                        </div>

                        <button
                            onClick={() => setSelectedGrade('Tümü')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedGrade === 'Tümü'
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            Tümü
                        </button>
                        {GRADES.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGrade(g.name)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedGrade === g.name
                                        ? 'bg-bio-mint text-white border-bio-mint shadow-md shadow-bio-mint/20'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resources Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + selectedGrade + searchQuery}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className={activeTab === 'note' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}
                    >
                        {filteredResources.length > 0 ? (
                            filteredResources.map(res => (
                                <motion.div key={res.id} variants={item}>
                                    {activeTab === 'note' ? (
                                        // --- NOTE CARD DESIGN ---
                                        <Link to={`/notlar/${res.id}`} className="block h-full">
                                            <div className="group bg-white rounded-2xl border border-slate-200 p-0 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col cursor-pointer">
                                                <div className="p-6 md:p-8 flex-1 flex flex-col relative">
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-bio-mint to-bio-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider group-hover:bg-bio-mint/10 group-hover:text-bio-mint-dark group-hover:border-bio-mint/20 transition-colors">
                                                            <FolderOpen size={12} /> {res.unit}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{res.grade}</span>
                                                    </div>

                                                    <h3 className="text-xl font-bold font-display text-slate-800 mb-3 group-hover:text-bio-mint-dark transition-colors leading-tight">
                                                        {res.title}
                                                    </h3>

                                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                                        {res.content?.replace(/<[^>]+>/g, '').substring(0, 160)}...
                                                    </p>

                                                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-300" /> {res.date}</span>
                                                            <span className="flex items-center gap-1.5"><Eye size={14} className="text-slate-300" /> {res.views}</span>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-bio-mint group-hover:text-white transition-all duration-300 shadow-sm">
                                                            <ChevronRight size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        // --- PDF CARD DESIGN ---
                                        <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 hover:border-red-100 transition-all duration-300 h-full flex flex-col relative overflow-hidden cursor-pointer">
                                            {/* Decorative Background Icon */}
                                            <FileText className="absolute -bottom-4 -right-4 text-slate-50 w-32 h-32 transform -rotate-12 group-hover:text-red-50 transition-colors duration-300" />

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                        <span className="font-black text-[10px] uppercase tracking-tighter">PDF</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded border border-slate-100">{res.grade}</span>
                                                </div>

                                                <h3 className="text-base font-bold text-slate-800 mb-1 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                                                    {res.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium mb-4">{res.unit}</p>

                                                <div className="mt-auto space-y-3">
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium bg-slate-50/80 p-2 rounded-lg border border-slate-100 backdrop-blur-sm">
                                                        <span>{res.size}</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span>{res.downloads} İndirme</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span>{res.date}</span>
                                                    </div>

                                                    <a
                                                        href={res.fileUrl || '#'}
                                                        download
                                                        onClick={(e) => { if (!res.fileUrl) { e.preventDefault(); alert('PDF dosyası henüz yüklenmemiş.'); } }}
                                                        className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-red-600 transition-colors shadow-lg shadow-slate-900/10 group-hover:shadow-red-600/20"
                                                    >
                                                        <ArrowDownToLine size={14} /> Hemen İndir
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            // --- EMPTY STATE ---
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-24 text-center"
                            >
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Sonuç Bulunamadı</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8">
                                    Aradığınız kriterlere uygun not veya PDF bulunamadı. Lütfen filtreleri değiştirin veya başka bir arama yapın.
                                </p>
                                <button
                                    onClick={() => { setSelectedGrade('Tümü'); setSearchQuery(''); }}
                                    className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    Filtreleri Temizle
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notes;
