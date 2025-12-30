
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import InterestingFacts from './pages/InterestingFacts';
import PostDetail from './pages/PostDetail';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import LessonManager from './pages/admin/LessonManager';
import LessonBuilder from './pages/admin/LessonBuilder';
import NoteManager from './pages/admin/NoteManager';
import PostManager from './pages/admin/PostManager';
import PostEditor from './pages/admin/PostEditor';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-slate-800">
        <Routes>
          {/* Admin Routes without Navbar/Footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/lessons" element={<LessonManager />} />
          <Route path="/admin/lessons/new" element={<LessonBuilder />} />
          <Route path="/admin/lessons/:id/edit" element={<LessonBuilder />} />

          <Route path="/admin/notes" element={<NoteManager />} />

          <Route path="/admin/posts" element={<PostManager />} />
          <Route path="/admin/posts/new" element={<PostEditor />} />
          <Route path="/admin/posts/:id/edit" element={<PostEditor />} />

          <Route path="/admin/settings" element={<div className="p-10 text-center font-bold text-gray-500">Ayarlar Sayfası (Yakında)</div>} />

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
                  <Route path="/gizlilik" element={
                    <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
                      <h1 className="text-4xl font-bold mb-6">Gizlilik Politikası</h1>
                      <p className="text-slate-600">Bu sayfa hazırlanma aşamasındadır. Kişisel verileriniz güvende tutulmaktadır.</p>
                    </div>
                  } />
                  <Route path="/kullanim" element={
                    <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
                      <h1 className="text-4xl font-bold mb-6">Kullanım Şartları</h1>
                      <p className="text-slate-600">Bu sayfa hazırlanma aşamasındadır. Site içeriği eğitim amaçlıdır.</p>
                    </div>
                  } />
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
