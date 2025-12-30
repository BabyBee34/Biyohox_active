
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, BookOpen, Clock, Zap, FileText, Activity } from 'lucide-react';
import { GRADES, MOCK_POSTS } from '../constants';
import GradeCard from '../components/GradeCard';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION - LIVING BIOLOGY */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg pt-20">

        {/* Animated Blobs (CSS Based) */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-bio-mint/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-bio-lavender/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-bio-cyan/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/50 shadow-sm mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bio-mint opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bio-mint"></span>
              </span>
              <span className="text-sm font-medium text-slate-600">Biyoloji artık çok daha eğlenceli</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold font-display tracking-tight mb-6 leading-tight">
              Lise Biyolojisi<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-mint via-bio-cyan to-bio-lavender animate-gradient-x">
                Artık Kolay
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              9-12. sınıf müfredatına tam uygun, görsel hafıza teknikleriyle güçlendirilmiş interaktif dersler.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dersler"
                className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden shadow-xl shadow-bio-mint/20 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-bio-mint to-bio-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Derslere Başla <ArrowRight size={20} />
                </span>
              </Link>

              <Link
                to="/notlar"
                className="px-8 py-4 bg-white/50 backdrop-blur-md text-slate-700 border border-white/60 rounded-2xl font-bold text-lg hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play size={18} fill="currentColor" className="text-slate-400" /> Nasıl Çalışır?
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 text-sm font-medium"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Aşağı Kaydır
          <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* 2. GRADE SELECTION - ASYMMETRIC GRID */}
      <section className="py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">Sınıfını Seç, Keşfetmeye Başla</h2>
            <p className="text-slate-500 text-lg">Müfredata uygun üniteler ve konular seni bekliyor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(240px,auto)]">
            {GRADES.map((grade, index) => (
              <GradeCard key={grade.id} grade={grade} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION - DARK MODE */}
      <section className="py-24 bg-bio-dark relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-bio-dark via-transparent to-bio-dark z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: 'Ders İçeriği', value: '120+', icon: BookOpen, color: 'from-bio-mint to-bio-cyan' },
              { label: 'PDF Doküman', value: '450+', icon: FileText, color: 'from-bio-cyan to-bio-lavender' },
              { label: 'Aylık Ziyaret', value: '10k+', icon: Activity, color: 'from-bio-pink to-bio-lavender' },
              { label: 'Ücretsiz Erişim', value: '24/7', icon: Zap, color: 'from-bio-amber to-bio-mint' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <stat.icon size={32} className="text-white" />
                </div>
                <div className={`text-5xl md:text-6xl font-bold font-display mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERESTING FACTS - HORIZONTAL SCROLL */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-bio-mint font-bold uppercase tracking-wider text-sm mb-2 block">Blog</span>
              <h2 className="text-4xl font-bold font-display text-slate-900">Bunları Biliyor muydun?</h2>
            </div>
            <Link to="/ilgincler" className="hidden md:flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
              Tümünü Gör <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_POSTS.map((post, i) => (
              <Link key={post.id} to={`/ilgincler/${post.id}`} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                <div className="h-56 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} Dk</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-800 mb-3 group-hover:text-bio-mint-dark transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-bio-mint font-bold text-sm group-hover:gap-2 transition-all duration-300">
                    Okumaya Başla <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/ilgincler" className="inline-flex items-center gap-2 text-bio-mint font-bold">
              Tümünü Gör <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bio-mint to-bio-lavender"></div>

        {/* Animated Orbs */}
        <motion.div style={{ y: y1 }} className="absolute top-0 left-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-bio-cyan opacity-20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></motion.div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-bold font-display mb-8">Sınavlara Hazır mısın?</h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12 font-light">
            Özet notları indir, eksiklerini kapat ve biyolojide fark yarat.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/notlar" className="px-10 py-5 bg-white text-bio-mint-dark rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-slate-50 hover:scale-105 transition-all duration-300">
              Notları İndir
            </Link>
            <Link to="/dersler" className="px-10 py-5 bg-black/20 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-black/30 transition-all duration-300">
              Derslere Göz At
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
