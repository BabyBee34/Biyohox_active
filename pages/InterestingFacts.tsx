
import React, { useState } from 'react';
import { MOCK_POSTS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Tag, Lightbulb, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const InterestingFacts: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const allTags = ['Evrim', 'DNA', 'Genetik', 'Ekoloji', 'Hücre', 'Sağlık', 'Beyin', 'Hayvanlar'];

    const filteredPosts = MOCK_POSTS.filter(post => {
        const matchesSearch = searchQuery === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newsletterEmail) {
            alert(`${newsletterEmail} adresi bültene kaydedildi! (Demo: Backend bağlantısı gerekiyor)`);
            setNewsletterEmail('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* 1. HERO SECTION - FRESH LIGHT THEME */}
            <div className="relative bg-white pt-32 pb-20 overflow-hidden border-b border-slate-100">
                {/* Background Effects (Soft Organic Shapes) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -left-[5%] w-[600px] h-[600px] bg-gradient-to-br from-bio-mint/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-bio-lavender/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bio-mint/10 border border-bio-mint/20 text-bio-mint-dark text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <Lightbulb size={14} className="text-bio-mint" />
                            <span>Bilim Köşesi</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold font-display text-slate-900 mb-6 tracking-tight leading-tight">
                            İlginç <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-mint-dark to-bio-cyan">Bilgiler</span>
                        </h1>

                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                            Biyolojinin şaşırtıcı dünyasını keşfedin. Güncel makaleler, bilimsel gerçekler ve doğru bilinen yanlışlar.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-bio-mint to-bio-lavender rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-xl shadow-xl shadow-slate-200/50 flex items-center p-2 border border-slate-100">
                                <div className="pl-4 pr-3 text-slate-400">
                                    <Search size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Merak ettiğin bir konuyu ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-2 py-3 outline-none text-slate-800 placeholder-slate-400 font-medium bg-transparent"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content (Articles) */}
                    <div className="lg:col-span-2 space-y-8">
                        {selectedTag && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span>Filtre:</span>
                                <span className="px-3 py-1 bg-bio-mint/10 text-bio-mint-dark rounded-full font-bold">{selectedTag}</span>
                                <button onClick={() => setSelectedTag(null)} className="text-slate-400 hover:text-red-500 ml-2">Temizle</button>
                            </div>
                        )}
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <p className="text-lg font-medium">Sonuç bulunamadı</p>
                                <p className="text-sm mt-2">Farklı bir arama terimi veya etiket deneyin.</p>
                            </div>
                        ) : filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200 transition-all duration-300 flex flex-col md:flex-row h-full md:h-64"
                            >
                                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                                    <Link to={`/ilgincler/${post.id}`} className="block h-full">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                    </Link>
                                </div>
                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-50 text-slate-500 rounded-md border border-slate-100 group-hover:border-bio-mint/30 group-hover:text-bio-mint-dark group-hover:bg-bio-mint/5 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold font-display text-slate-800 mb-3 leading-tight group-hover:text-bio-mint-dark transition-colors">
                                            <Link to={`/ilgincler/${post.id}`}>{post.title}</Link>
                                        </h2>
                                        <p className="text-slate-500 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} dk</span>
                                        </div>
                                        <Link to={`/ilgincler/${post.id}`} className="text-slate-900 text-sm font-bold flex items-center gap-1 hover:gap-2 hover:text-bio-mint transition-all">
                                            Devamını Oku <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Tags Widget */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                            <h3 className="font-bold font-display text-lg text-slate-800 mb-6 flex items-center gap-2">
                                <Tag size={20} className="text-bio-mint" /> Popüler Etiketler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedTag === tag ? 'bg-bio-mint text-white border-bio-mint shadow-md' : 'bg-slate-50 hover:bg-white hover:shadow-md hover:text-bio-mint-dark hover:ring-1 hover:ring-bio-mint/20 text-slate-600 border-slate-100'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Widget */}
                        <div className="relative overflow-hidden rounded-3xl p-8 text-center border border-slate-200 bg-white group">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-100 group-hover:scale-105 transition-transform duration-700"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-bio-mint rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 text-bio-mint shadow-lg">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="font-bold font-display text-2xl text-white mb-2">Haftalık Bülten</h3>
                                <p className="text-slate-300 text-sm mb-6 leading-relaxed">En ilginç biyoloji gerçekleri ve yeni dersler her hafta e-postana gelsin.</p>

                                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="E-posta adresi"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 focus:border-bio-mint/50 transition-all text-sm"
                                    />
                                    <button type="submit" className="w-full bg-bio-mint hover:bg-bio-mint-light text-slate-900 font-bold py-3 rounded-xl transition-colors shadow-lg shadow-bio-mint/20">
                                        Abone Ol
                                    </button>
                                </form>
                                <p className="text-[10px] text-slate-500 mt-4">Spam yok, sadece bilim. İstediğin zaman ayrılabilirsin.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestingFacts;
