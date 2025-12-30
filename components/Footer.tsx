
import React from 'react';
import { Link } from 'react-router-dom';
import { Dna, Instagram, Youtube, Twitter, Mail, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-100 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-b from-bio-mint/5 to-transparent rounded-[100%] blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-bio-mint to-bio-cyan p-1.5 rounded-lg text-white">
                <Dna size={20} />
              </div>
              <span className="text-xl font-bold font-display text-slate-800">BiyoHox</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Lise biyolojisini sıkıcı olmaktan çıkarıp, keşfedilmeyi bekleyen canlı bir dünyaya dönüştürüyoruz.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, name: 'Instagram', color: 'hover:bg-pink-500' },
                { Icon: Youtube, name: 'YouTube', color: 'hover:bg-red-500' },
                { Icon: Twitter, name: 'Twitter', color: 'hover:bg-sky-500' }
              ].map(({ Icon, name, color }, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 ${color} hover:text-white hover:scale-110 transition-all duration-300 cursor-not-allowed opacity-60 hover:opacity-100`}
                  aria-label={`${name} - Yakında`}
                  title={`${name} - Yakında`}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-display font-bold text-slate-900 mb-6">Keşfet</h3>
            <ul className="space-y-3">
              {[
                { name: 'Dersler', path: '/dersler' },
                { name: 'Notlar & PDF', path: '/notlar' },
                { name: 'İlginç Bilgiler', path: '/ilgincler' },
                { name: 'İletişim', path: '/iletisim' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-500 hover:text-bio-mint text-sm transition-colors flex items-center gap-1 group">
                    {item.name}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-slate-900 mb-6">Sınıflar</h3>
            <ul className="space-y-3">
              {[
                { name: '9. Sınıf', path: '/dersler/9-sinif' },
                { name: '10. Sınıf', path: '/dersler/10-sinif' },
                { name: '11. Sınıf', path: '/dersler/11-sinif' },
                { name: '12. Sınıf', path: '/dersler/12-sinif' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-500 hover:text-bio-mint text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-slate-900 mb-6">İletişim</h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <a href="mailto:info@biyohox.com" className="flex items-center gap-3 text-slate-600 hover:text-bio-mint transition-colors mb-2">
                <div className="bg-white p-2 rounded-full shadow-sm text-bio-mint"><Mail size={16} /></div>
                <span className="text-sm font-medium">info@biyohox.com</span>
              </a>
              <p className="text-xs text-slate-400 pl-11">Sorularınız için 7/24 yazabilirsiniz.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} BiyoHox. Designed for Future Scientists.
          </p>
          <div className="flex gap-6">
            <Link to="/gizlilik" className="text-slate-400 text-xs hover:text-slate-600 transition-colors">Gizlilik</Link>
            <Link to="/kullanim" className="text-slate-400 text-xs hover:text-slate-600 transition-colors">Şartlar</Link>
            <Link to="/admin" className="text-slate-400 text-xs hover:text-slate-600 transition-colors">Yönetici</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
