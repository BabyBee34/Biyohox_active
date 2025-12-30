import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle, Home, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sayfa yüklendiğinde mevcut oturumu kontrol et
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      // Oturum kontrolü başarısız, normal giriş göster
    } finally {
      setCheckingSession(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      // Generic hata mesajları (Y2 düzeltmesi - bilgi sızması önleme)
      if (err.message?.includes('Invalid login credentials')) {
        setError('E-posta veya şifre hatalı.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('E-posta adresiniz henüz onaylanmamış.');
      } else {
        setError('Giriş yapılamadı. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Oturum kontrolü sırasında loading göster
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="bg-bio-mint/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-bio-mint-dark">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">Admin Girişi</h1>
            <p className="text-gray-500 text-sm mt-2">İçerik yönetim sistemine erişmek için giriş yapın.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-700 text-sm border border-red-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-mint/20 focus:border-bio-mint transition-all"
                  placeholder="E-posta adresiniz"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-mint/20 focus:border-bio-mint transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
          <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-bio-mint-dark transition-colors text-sm">
            <Home size={14} /> Anasayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;