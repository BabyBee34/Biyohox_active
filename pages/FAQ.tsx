import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: 'BiyoHox nedir?',
        answer: 'BiyoHox, lise öğrencileri için tasarlanmış ücretsiz bir biyoloji eğitim platformudur. 9-12. sınıf müfredatına uygun ders anlatımları, testler, flashcard\'lar ve özet notlar içerir.'
    },
    {
        question: 'İçerikler ücretsiz mi?',
        answer: 'Evet! BiyoHox\'taki tüm içerikler tamamen ücretsizdir. Dersler, testler, PDF notlar ve blog yazılarına kayıt olmadan erişebilirsiniz.'
    },
    {
        question: 'Hangi sınıfların konuları bulunuyor?',
        answer: '9, 10, 11 ve 12. sınıf biyoloji müfredatlarına uygun içerikler mevcuttur. Her sınıf için üniteler, konular ve detaylı ders anlatımları hazırlanmıştır.'
    },
    {
        question: 'Mobil cihazlardan erişebilir miyim?',
        answer: 'Evet, BiyoHox tamamen responsive tasarıma sahiptir. Telefon, tablet veya bilgisayarınızdan sorunsuz bir şekilde kullanabilirsiniz.'
    },
    {
        question: 'Testler nasıl çalışıyor?',
        answer: 'Her ders sonunda interaktif testler bulunur. Soruları cevapladıktan sonra doğru cevabı ve açıklamasını görebilirsiniz. Testler puanlanır ve ilerlemeniz takip edilir.'
    },
    {
        question: 'PDF notları indirebilir miyim?',
        answer: 'Evet, "Notlar & PDF" bölümünden konu özetlerini ve çalışma materyallerini PDF formatında indirebilirsiniz.'
    },
    {
        question: 'Bir hata buldum, nasıl bildiririm?',
        answer: 'İletişim sayfamızdaki formu kullanarak veya info@biyohox.com adresine e-posta göndererek hataları bildirebilirsiniz. Her geri bildirim bizim için değerlidir!'
    },
    {
        question: 'İçerik önerisinde bulunabilir miyim?',
        answer: 'Elbette! Hangi konuların eklenmesini veya hangi özelliklerin geliştirilmesini istediğinizi İletişim sayfasından bize iletebilirsiniz.'
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-white pt-32 pb-20 overflow-hidden border-b border-slate-100">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-bio-lavender/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-bio-mint/20 to-transparent rounded-full blur-[80px] opacity-60"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bio-lavender/10 border border-bio-lavender/20 text-bio-lavender-dark text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <HelpCircle size={14} className="text-bio-lavender" />
                            <span>Yardım Merkezi</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold font-display text-slate-900 mb-6 tracking-tight leading-tight">
                            Sıkça Sorulan <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-lavender-dark to-bio-mint">Sorular</span>
                        </h1>

                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-4 font-light leading-relaxed">
                            BiyoHox hakkında merak ettiklerinizi burada bulabilirsiniz.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                            >
                                <span className="font-bold text-slate-800 group-hover:text-bio-mint-dark transition-colors">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-slate-400 group-hover:text-bio-mint transition-colors"
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-bio-mint rounded-full blur-[80px] opacity-20"></div>
                    <div className="relative z-10">
                        <MessageCircle size={40} className="mx-auto text-bio-mint mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-3 font-display">Cevabını Bulamadın mı?</h3>
                        <p className="text-slate-300 mb-6">Bize doğrudan ulaşabilirsin, en kısa sürede yanıt vereceğiz.</p>
                        <Link
                            to="/iletisim"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-bio-mint text-slate-900 font-bold rounded-xl hover:bg-bio-mint-light transition-colors shadow-lg shadow-bio-mint/20"
                        >
                            İletişime Geç
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
