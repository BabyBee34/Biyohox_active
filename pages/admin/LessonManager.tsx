
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Trash2, Edit, Search, CheckCircle, Eye } from 'lucide-react';
import { MOCK_LESSON } from '../../constants';

// Mock data extension for listing
const INITIAL_LESSONS = [
  MOCK_LESSON,
  { ...MOCK_LESSON, id: 'l8', title: 'Hücre Organelleri', slug: 'hucre-organelleri', viewCount: 850 },
  { ...MOCK_LESSON, id: 'l9', title: 'Mitoz Bölünme', slug: 'mitoz-bolunme', viewCount: 1500, gradeId: '10' },
  { ...MOCK_LESSON, id: 'l10', title: 'Mayoz Bölünme', slug: 'mayoz-bolunme', viewCount: 1200, gradeId: '10' },
];

const LessonManager: React.FC = () => {
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  return (
    <AdminLayout
      title="Ders Yönetimi"
      action={
        <Link
          to="/admin/lessons/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm font-bold text-sm"
        >
          <Plus size={18} /> Yeni Ders Oluştur
        </Link>
      }
    >
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Ders ara..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-mint/50 transition-all" />
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-bio-mint transition-colors cursor-pointer">
            <option>Tüm Sınıflar</option>
            <option>9. Sınıf</option>
            <option>10. Sınıf</option>
            <option>11. Sınıf</option>
            <option>12. Sınıf</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                <th className="px-6 py-4 font-semibold">Ders Başlığı</th>
                <th className="px-6 py-4 font-semibold">Sınıf</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold">Görüntülenme</th>
                <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lessons.map(lesson => (
                <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{lesson.title}</div>
                    <div className="text-xs text-gray-400">/{lesson.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lesson.gradeId}. Sınıf</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      <CheckCircle size={12} /> Yayında
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lesson.viewCount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        // Not: Dinamik URL için grade ve unit slug gerekiyor. Mock data yapısı güncellenmeli.
                        onClick={() => window.open(`/dersler/9-sinif/hucre/${lesson.slug}`, '_blank')}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Önizle"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/lessons/${lesson.id}/edit`)}
                        className="p-2 text-gray-500 hover:text-bio-mint-dark hover:bg-bio-mint/10 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Kayıtlı ders bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LessonManager;
