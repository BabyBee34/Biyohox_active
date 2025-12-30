import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle, ArrowRight, Home } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // MOCK LOGIN FOR DEMO/TESTING
    // Gerçek Supabase bağlantısı yapılana kadar bu bilgilerle giriş yapılabilir.
    if (email === 'admin@biyohox.com' && password === 'admin123') {
        setTimeout(() => {
            setLoading(false);
            navigate('/admin/dashboard');
        }, 800);
        return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      // Supabase yapılandırılmamışsa genel bir hata mesajı yerine bilgilendirme gösterelim
      if (err.message && (err.message.includes('fetch') || err.message.includes('apikey'))) {
         setError('Veritabanı bağlantısı yapılandırılmamış. Lütfen aşağıdaki "Demo Panelini Görüntüle" butonunu kullanın veya test bilgilerini (admin@biyohox.com / admin123) deneyin.');
      } else {
         setError('E-posta veya şifre hatalı.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Girişi</h1>
            <p className="text-gray-500 text-sm mt-2">İçerik yönetim sistemine erişmek için giriş yapın.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="admin@biyohox.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-md shadow-primary-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Giriş Yap'
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">VEYA</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button 
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="w-full bg-secondary-50 text-secondary-700 font-medium py-3 rounded-xl border border-secondary-200 hover:bg-secondary-100 transition-colors flex items-center justify-center gap-2"
              >
                Demo Panelini Görüntüle <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs">
          <p className="text-gray-500">
            <strong>Test:</strong> admin@biyohox.com / admin123
          </p>
          <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors">
             <Home size={14} /> Anasayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;