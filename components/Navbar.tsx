
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dna, Menu, X, Lock } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // O7 düzeltmesi: Menü dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Route değiştiğinde menüyü kapat
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-2 shadow-sm' : 'bg-transparent py-4'}`}
      role="navigation"
      aria-label="Ana menü"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="BiyoHox Anasayfa">
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
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
            >
              <Lock size={14} /> Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4" ref={menuRef}>
            <Link to="/admin" className="p-2 text-slate-500" aria-label="Admin paneli">
              <Lock size={20} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 focus:outline-none bg-white/50 p-2 rounded-lg backdrop-blur-sm"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Overlay */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 w-full glass border-t border-white/20 shadow-xl animate-in slide-in-from-top-2 z-50"
          >
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
        </>
      )}
    </nav>
  );
};

export default Navbar;
