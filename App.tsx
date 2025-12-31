import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { Loader2, Home, AlertTriangle, ArrowLeft, LogOut, Shield, HelpCircle, Mail } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { usePageTracking } from './hooks/usePageTracking';
import { supabase } from './lib/supabase';

// Lazy loading for code splitting (P1 düzeltmesi)
const Home_ = lazy(() => import('./pages/Home'));
const Lessons = lazy(() => import('./pages/Lessons'));
const LessonDetail = lazy(() => import('./pages/LessonDetail'));
const Notes = lazy(() => import('./pages/Notes'));
const NoteDetail = lazy(() => import('./pages/NoteDetail'));
const InterestingFacts = lazy(() => import('./pages/InterestingFacts'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const LessonManager = lazy(() => import('./pages/admin/LessonManager'));
const LessonBuilder = lazy(() => import('./pages/admin/LessonBuilder'));
const NoteManager = lazy(() => import('./pages/admin/NoteManager'));
const PostManager = lazy(() => import('./pages/admin/PostManager'));
const PostEditor = lazy(() => import('./pages/admin/PostEditor'));
const MessageManager = lazy(() => import('./pages/admin/MessageManager'));
const Questions = lazy(() => import('./pages/Questions'));
const QuestionDetail = lazy(() => import('./pages/QuestionDetail'));
const SolutionDetail = lazy(() => import('./pages/SolutionDetail'));

const QuestionManager = lazy(() => import('./pages/admin/QuestionManager'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Page view tracking component
const PageTracker = () => {
  usePageTracking();
  return null;
};

// 404 Sayfası (U1 düzeltmesi - iyileştirilmiş)
const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-24 h-24 bg-bio-mint/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-12 h-12 text-bio-mint" />
      </div>
      <h1 className="text-6xl font-bold font-display text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Sayfa Bulunamadı</h2>
      <p className="text-slate-500 mb-8">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-bio-mint text-white rounded-xl font-bold hover:bg-bio-mint-dark transition-colors"
        >
          <Home size={18} /> Anasayfa
        </Link>
        <Link
          to="/dersler"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={18} /> Derslere Git
        </Link>
      </div>
    </div>
  </div>
);

// Admin Ayarlar Sayfası (düzeltildi - Supabase auth kullanıyor)
const AdminSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-display">Ayarlar</h1>

      <div className="space-y-6">
        {/* Oturum */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <LogOut size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 mb-1">Oturum</h2>
              <p className="text-gray-500 text-sm mb-4">Mevcut admin oturumunuzu sonlandırın.</p>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        {/* Güvenlik Bilgisi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 mb-1">Güvenlik</h2>
              <p className="text-gray-500 text-sm">
                Oturumunuz Supabase Authentication ile korunmaktadır. Şifrenizi değiştirmek için Supabase Dashboard'u kullanın.
              </p>
            </div>
          </div>
        </div>

        {/* Yardım */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <HelpCircle size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 mb-1">Yardım</h2>
              <p className="text-gray-500 text-sm mb-3">
                Teknik destek ve sorular için iletişime geçin.
              </p>
              <a
                href="mailto:info@biyohox.com"
                className="inline-flex items-center gap-2 text-bio-mint-dark font-medium hover:underline"
              >
                <Mail size={16} /> info@biyohox.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Gizlilik Politikası Sayfası
const PrivacyPage: React.FC = () => (
  <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold mb-6 font-display text-slate-900">Gizlilik Politikası</h1>
    <div className="prose prose-slate max-w-none">
      <p className="text-slate-600 mb-6">Son güncelleme: 30 Aralık 2024</p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">1. Toplanan Bilgiler</h2>
      <p className="text-slate-600 mb-4">BiyoHox platformunda, kullanıcı deneyimini iyileştirmek amacıyla aşağıdaki bilgiler toplanabilir:</p>
      <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
        <li>İletişim formları aracılığıyla gönderilen ad, e-posta ve mesaj içerikleri</li>
        <li>Bülten aboneliği için sağlanan e-posta adresleri</li>
        <li>Çerezler aracılığıyla toplanan anonim kullanım verileri</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">2. Bilgilerin Kullanımı</h2>
      <p className="text-slate-600 mb-4">Toplanan bilgiler şu amaçlarla kullanılır:</p>
      <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
        <li>Kullanıcı sorularına yanıt vermek</li>
        <li>Eğitim içeriklerini geliştirmek</li>
        <li>Bülten ve güncellemeler göndermek (izin verilmişse)</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">3. Bilgi Güvenliği</h2>
      <p className="text-slate-600 mb-6">Kişisel bilgileriniz güvenli sunucularda saklanır ve üçüncü taraflarla paylaşılmaz. Verilerinizin korunması için endüstri standartlarında güvenlik önlemleri uygulanır.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">4. İletişim</h2>
      <p className="text-slate-600">Gizlilik politikamız hakkında sorularınız için <a href="mailto:info@biyohox.com" className="text-bio-mint-dark hover:underline">info@biyohox.com</a> adresinden bize ulaşabilirsiniz.</p>
    </div>
  </div>
);

// Kullanım Şartları Sayfası
const TermsPage: React.FC = () => (
  <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold mb-6 font-display text-slate-900">Kullanım Şartları</h1>
    <div className="prose prose-slate max-w-none">
      <p className="text-slate-600 mb-6">Son güncelleme: 30 Aralık 2024</p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">1. Kabul</h2>
      <p className="text-slate-600 mb-6">BiyoHox platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">2. Hizmet Tanımı</h2>
      <p className="text-slate-600 mb-6">BiyoHox, lise öğrencileri için ücretsiz biyoloji eğitim içerikleri sunan bir platformdur. İçerikler ders anlatımları, testler, notlar ve blog yazılarından oluşur.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">3. Fikri Mülkiyet</h2>
      <p className="text-slate-600 mb-4">Platformdaki tüm içerikler (metin, görsel, video, tasarım) telif hakkı ile korunmaktadır:</p>
      <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
        <li>İçerikler kişisel eğitim amaçlı kullanılabilir</li>
        <li>Ticari amaçlı kullanım ve yeniden yayımlama yasaktır</li>
        <li>Kaynak göstererek paylaşım yapılabilir</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">4. Kullanıcı Sorumlulukları</h2>
      <p className="text-slate-600 mb-6">Kullanıcılar platformu yasal amaçlarla kullanmalı, zararlı içerik yüklememeli ve diğer kullanıcıların haklarına saygı göstermelidir.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">5. Sorumluluk Reddi</h2>
      <p className="text-slate-600 mb-6">Eğitim içerikleri bilgilendirme amaçlıdır. İçeriklerin doğruluğu için azami özen gösterilmekle birlikte, olası hatalardan BiyoHox sorumlu tutulamaz.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">6. İletişim</h2>
      <p className="text-slate-600">Kullanım şartları hakkında sorularınız için <a href="mailto:info@biyohox.com" className="text-bio-mint-dark hover:underline">info@biyohox.com</a> adresinden bize ulaşabilirsiniz.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <PageTracker />
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-slate-800">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Admin Routes without Navbar/Footer - Protected */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

              <Route path="/admin/lessons" element={<ProtectedRoute><LessonManager /></ProtectedRoute>} />
              <Route path="/admin/lessons/new" element={<ProtectedRoute><LessonBuilder /></ProtectedRoute>} />
              <Route path="/admin/lessons/:id/edit" element={<ProtectedRoute><LessonBuilder /></ProtectedRoute>} />

              <Route path="/admin/questions" element={<ProtectedRoute><QuestionManager /></ProtectedRoute>} />

              <Route path="/admin/notes" element={<ProtectedRoute><NoteManager /></ProtectedRoute>} />

              <Route path="/admin/posts" element={<ProtectedRoute><PostManager /></ProtectedRoute>} />
              <Route path="/admin/posts/new" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
              <Route path="/admin/posts/:id/edit" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />

              <Route path="/admin/messages" element={<ProtectedRoute><MessageManager /></ProtectedRoute>} />

              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

              {/* Public Routes with Navbar/Footer */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home_ />} />
                      <Route path="/dersler" element={<Lessons />} />
                      <Route path="/dersler/:gradeSlug" element={<Lessons />} />
                      <Route path="/dersler/:gradeSlug/:unitSlug/:lessonSlug" element={<LessonDetail />} />
                      <Route path="/sorular" element={<Questions />} />
                      <Route path="/sorular/:gradeSlug" element={<Questions />} />
                      <Route path="/sorular/soru/:questionId" element={<QuestionDetail />} />
                      <Route path="/sorular/cozum/:solutionId" element={<SolutionDetail />} />
                      <Route path="/notlar" element={<Notes />} />
                      <Route path="/notlar/:id" element={<NoteDetail />} />
                      <Route path="/ilgincler" element={<InterestingFacts />} />
                      <Route path="/ilgincler/:id" element={<PostDetail />} />
                      <Route path="/iletisim" element={<Contact />} />
                      <Route path="/sss" element={<FAQ />} />
                      <Route path="/gizlilik" element={<PrivacyPage />} />
                      <Route path="/kullanim" element={<TermsPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
