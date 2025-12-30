
import React, { useState } from 'react';
import { Mail, Send, MessageCircle, Instagram, Twitter, Youtube, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Genel Soru',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({ name: '', email: '', subject: 'Genel Soru', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* 1. HERO SECTION */}
            <div className="relative bg-white pt-32 pb-20 overflow-hidden border-b border-slate-100">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-bio-mint/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-bio-lavender/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bio-mint/10 border border-bio-mint/20 text-bio-mint-dark text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <MessageCircle size={14} className="text-bio-mint" />
                            <span>Bize Ulaşın</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold font-display text-slate-900 mb-6 tracking-tight leading-tight">
                            İletişime <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-mint-dark to-bio-cyan">Geç</span>
                        </h1>

                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-4 font-light leading-relaxed">
                            Sorularınız, önerileriniz veya iş birliği teklifleriniz için buradayız.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* LEFT COLUMN: Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold font-display text-slate-800 mb-4">Nasıl Yardımcı Olabiliriz?</h3>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                BiyoHox platformu hakkında merak ettikleriniz, içerik önerileriniz veya karşılaştığınız teknik sorunlar için aşağıdaki kanallardan bize ulaşabilirsiniz.
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 group hover:border-bio-mint/50 transition-colors">
                                <div className="w-12 h-12 bg-bio-mint/10 rounded-xl flex items-center justify-center text-bio-mint-dark group-hover:bg-bio-mint group-hover:text-white transition-colors">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">E-posta</h4>
                                    <p className="text-slate-500 text-sm mb-1">Genel sorular ve destek için</p>
                                    <a href="mailto:info@biyohox.com" className="text-bio-mint-dark font-bold hover:underline">info@biyohox.com</a>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 group hover:border-bio-lavender/50 transition-colors">
                                <div className="w-12 h-12 bg-bio-lavender/10 rounded-xl flex items-center justify-center text-bio-lavender-dark group-hover:bg-bio-lavender group-hover:text-white transition-colors">
                                    <HelpCircle size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Yardım Merkezi</h4>
                                    <p className="text-slate-500 text-sm mb-1">Sıkça sorulan sorulara göz atın</p>
                                    <span className="text-bio-lavender-dark font-bold text-sm">SSS sayfası yakında eklenecek</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Bizi Takip Edin</h4>
                            <div className="flex gap-3">
                                <a href="#" title="Instagram - Yakında" className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 transition-all shadow-sm">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" title="Twitter - Yakında" className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition-all shadow-sm">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" title="YouTube - Yakında" className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm">
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative overflow-hidden"
                        >
                            {/* Decor Blob */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-bio-mint/10 to-bio-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

                            <h3 className="text-2xl font-bold font-display text-slate-800 mb-6 relative z-10">Bize Yazın</h3>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                {submitSuccess && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                                        ✅ Mesajınız başarıyla gönderildi! En kısa sürede size döneceğiz.
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-bold text-slate-600 ml-1">Isim Soyisim</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bio-mint/20 focus:border-bio-mint transition-all"
                                            placeholder="Adınız"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-bold text-slate-600 ml-1">E-posta</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bio-mint/20 focus:border-bio-mint transition-all"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-bold text-slate-600 ml-1">Konu</label>
                                    <div className="relative">
                                        <select
                                            id="subject"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bio-mint/20 focus:border-bio-mint transition-all appearance-none cursor-pointer"
                                        >
                                            <option>Genel Soru</option>
                                            <option>Öneri / Istek</option>
                                            <option>Hata Bildirimi</option>
                                            <option>Diğer</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-bold text-slate-600 ml-1">Mesaj</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bio-mint/20 focus:border-bio-mint transition-all resize-none"
                                        placeholder="Mesajınızı buraya yazın..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Gönderiliyor...' : 'Gönder'} <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
