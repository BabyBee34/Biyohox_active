
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_POSTS } from '../constants';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Tag, ChevronRight, User } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const post = MOCK_POSTS.find(p => p.id === id);

    // Scroll progress tracking
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Find related posts (exclude current)
    const relatedPosts = MOCK_POSTS
        .filter(p => p.id !== id)
        .slice(0, 3);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Yazı Bulunamadı</h2>
                <button onClick={() => navigate('/ilgincler')} className="text-bio-mint-dark font-bold hover:underline">
                    İlginç Bilgilere Dön
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-20">

            {/* Reading Progress Bar (Top) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-bio-mint z-50 origin-left"
                style={{ scaleX }}
            />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Navigation */}
                <div className="mb-8 mt-4">
                    <Link
                        to="/ilgincler"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-colors">
                            <ArrowLeft size={14} />
                        </div>
                        <span>Tüm Yazılar</span>
                    </Link>
                </div>

                {/* Header Section */}
                <header className="mb-10 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-bio-mint/10 text-bio-mint-dark rounded-full text-xs font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-bio-mint to-bio-cyan rounded-full flex items-center justify-center text-white">
                                <User size={14} />
                            </div>
                            <span>BiyoHox Editör</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {post.date}</span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <span className="flex items-center gap-1.5"><Clock size={16} /> {post.readTime} dk okuma</span>
                    </div>
                </header>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 mb-12 aspect-video relative group"
                >
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Social Share (Desktop Sticky) */}
                    <div className="hidden lg:flex flex-col gap-4 col-span-1 sticky top-32 h-fit items-center">
                        <button className="p-3 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-bio-mint hover:shadow-lg transition-all" title="Beğen">
                            <Bookmark size={20} />
                        </button>
                        <button className="p-3 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-blue-500 hover:shadow-lg transition-all" title="Paylaş">
                            <Share2 size={20} />
                        </button>
                        <div className="h-12 w-px bg-slate-200 my-2"></div>
                        <span className="text-xs font-bold text-slate-300 vertical-text" style={{ writingMode: 'vertical-rl' }}>PAYLAŞ</span>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 
                    prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 relative prose-h2:pl-0
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-bio-mint-dark prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-blockquote:border-l-4 prose-blockquote:border-bio-mint prose-blockquote:bg-bio-mint/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-700
                    prose-li:marker:text-bio-mint prose-img:rounded-2xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: post.content || '<p>İçerik hazırlanıyor...</p>' }}
                        />

                        {/* Mobile Share Buttons */}
                        <div className="flex lg:hidden items-center justify-center gap-4 mt-12 py-6 border-t border-b border-slate-100">
                            <span className="text-sm font-bold text-slate-400">Bu yazıyı paylaş:</span>
                            <button className="p-2 bg-white rounded-full border border-slate-200 text-slate-500"><Share2 size={18} /></button>
                            <button className="p-2 bg-white rounded-full border border-slate-200 text-slate-500"><Bookmark size={18} /></button>
                        </div>

                        {/* Related Posts */}
                        <div className="mt-16 pt-12 border-t border-slate-200">
                            <h3 className="text-2xl font-bold font-display text-slate-900 mb-8">Bunlar da İlginizi Çekebilir</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {relatedPosts.map(related => (
                                    <Link key={related.id} to={`/ilgincler/${related.id}`} className="group flex gap-4 items-start">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                            <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <div className="flex gap-2 mb-1.5">
                                                {related.tags.slice(0, 1).map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold text-bio-mint-dark uppercase tracking-wide">{tag}</span>
                                                ))}
                                            </div>
                                            <h4 className="font-bold text-slate-800 leading-snug mb-1 group-hover:text-bio-mint-dark transition-colors line-clamp-2">
                                                {related.title}
                                            </h4>
                                            <span className="text-xs text-slate-400">{related.readTime} dk okuma</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1"></div>
                </div>
            </article>
        </div>
    );
};

export default PostDetail;
