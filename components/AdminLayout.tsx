
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Book, FileText, Lightbulb, LogOut, Settings,
  Dna, Image, Activity, Bell, User, ExternalLink, Mail, HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, action }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const navGroups = [
    {
      label: 'Genel',
      items: [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      ]
    },
    {
      label: 'İçerik Yönetimi',
      items: [
        { path: '/admin/lessons', icon: <Book size={20} />, label: 'Dersler' },
        { path: '/admin/questions', icon: <HelpCircle size={20} />, label: 'Sorular' },
        { path: '/admin/notes', icon: <FileText size={20} />, label: 'Notlar & PDF' },
        { path: '/admin/posts', icon: <Lightbulb size={20} />, label: 'İlginç Bilgiler' },
      ]
    },
    {
      label: 'Yönetim',
      items: [
        { path: '/admin/messages', icon: <Mail size={20} />, label: 'Mesajlar' },
        { path: '/admin/settings', icon: <Settings size={20} />, label: 'Ayarlar' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR - Dark & Glassy */}
      <aside className="w-72 bg-bio-dark text-white flex-shrink-0 hidden md:flex flex-col fixed h-full z-20 border-r border-white/5 shadow-2xl backdrop-blur-xl">
        {/* Logo Area */}
        <div className="p-8 pb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-bio-mint to-bio-cyan p-2 rounded-xl shadow-lg shadow-bio-mint/20 group-hover:scale-105 transition-transform">
              <Dna size={24} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight block">BiyoHox</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h4 className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 pl-4">{group.label}</h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                        ? 'bg-bio-mint/15 text-bio-mint font-semibold shadow-[inset_3px_0_0_0_#00D9A3]'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span className={`${isActive ? 'text-bio-mint' : 'text-slate-500 group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 min-w-0 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-30 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold font-display text-slate-800">{title}</h1>
            <span className="text-xs text-slate-400 font-medium">Hoş geldin, Yönetici</span>
          </div>

          <div className="flex items-center gap-4">
            {action}
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button className="p-2.5 text-slate-400 hover:text-bio-mint hover:bg-bio-mint/10 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/" target="_blank" className="p-2.5 text-slate-400 hover:text-bio-mint hover:bg-bio-mint/10 rounded-full transition-colors" title="Siteyi Görüntüle">
              <ExternalLink size={20} />
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bio-mint to-bio-lavender p-0.5 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-700 font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-bio-mint/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
