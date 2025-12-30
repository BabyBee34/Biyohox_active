
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import InterestingFacts from './pages/InterestingFacts';
import PostDetail from './pages/PostDetail';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import LessonManager from './pages/admin/LessonManager';
import LessonBuilder from './pages/admin/LessonBuilder';
import NoteManager from './pages/admin/NoteManager';
import PostManager from './pages/admin/PostManager';
import PostEditor from './pages/admin/PostEditor';
import { usePageTracking } from './hooks/usePageTracking';

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

// Admin Ayarlar Sayfası
const AdminSettings: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('biyohox_admin_session');
    window.location.href = '/#/admin';
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ayarlar</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div>
          <h2 className="font-bold text-gray-800 mb-2">Oturum</h2>
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
    <Router>
      <ScrollToTop />
      <PageTracker />
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-slate-800">
        <Routes>
          {/* Admin Routes without Navbar/Footer - Protected */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="/admin/lessons" element={<ProtectedRoute><LessonManager /></ProtectedRoute>} />
          <Route path="/admin/lessons/new" element={<ProtectedRoute><LessonBuilder /></ProtectedRoute>} />
          <Route path="/admin/lessons/:id/edit" element={<ProtectedRoute><LessonBuilder /></ProtectedRoute>} />

          <Route path="/admin/notes" element={<ProtectedRoute><NoteManager /></ProtectedRoute>} />

          <Route path="/admin/posts" element={<ProtectedRoute><PostManager /></ProtectedRoute>} />
          <Route path="/admin/posts/new" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
          <Route path="/admin/posts/:id/edit" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />

          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

          {/* Public Routes with Navbar/Footer */}
          <Route path="*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dersler" element={<Lessons />} />
                  <Route path="/dersler/:gradeSlug" element={<Lessons />} />
                  <Route path="/dersler/:gradeSlug/:unitSlug/:lessonSlug" element={<LessonDetail />} />
                  <Route path="/notlar" element={<Notes />} />
                  <Route path="/notlar/:id" element={<NoteDetail />} />
                  <Route path="/ilgincler" element={<InterestingFacts />} />
                  <Route path="/ilgincler/:id" element={<PostDetail />} />
                  <Route path="/iletisim" element={<Contact />} />
                  <Route path="/sss" element={<FAQ />} />
                  <Route path="/gizlilik" element={<PrivacyPage />} />
                  <Route path="/kullanim" element={<TermsPage />} />
                  <Route path="*" element={<div className="p-20 text-center text-xl">Sayfa Bulunamadı (404)</div>} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
