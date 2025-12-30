
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dna, Menu, X, Search, Lock } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Dersler', path: '/dersler' },
    { name: 'Notlar', path: '/notlar' },
    { name: 'İlginç Bilgiler', path: '/ilgincler' },
    { name: 'İletişim', path: '/iletisim' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-2 shadow-sm' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-bio-mint blur opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
              <div className="relative bg-gradient-to-br from-bio-mint to-bio-cyan p-2 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Dna size={22} className="animate-pulse" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight font-display text-slate-800">
              Biyo<span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-mint to-bio-lavender">Hox</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/40 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path)
                    ? 'bg-white text-bio-mint-dark shadow-sm'
                    : 'text-slate-600 hover:text-bio-mint hover:bg-white/50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Arama butonu - Backend hazır olduğunda aktifleştirilecek
             <button className="p-2.5 rounded-full text-slate-500 hover:bg-white/80 hover:text-bio-mint hover:shadow-sm transition-all">
                <Search size={20} />
             </button>
             */}
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
            >
              <Lock size={14} /> Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/admin" className="p-2 text-slate-500"><Lock size={20} /></Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 focus:outline-none bg-white/50 p-2 rounded-lg backdrop-blur-sm"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-t border-white/20 shadow-xl animate-in slide-in-from-top-2">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(link.path)
                    ? 'bg-bio-mint/10 text-bio-mint-dark'
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
