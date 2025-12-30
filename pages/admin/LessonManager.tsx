
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Trash2, Edit, Search, CheckCircle, Eye, XCircle, Loader2 } from 'lucide-react';
import { dbService } from '../../lib/supabase';
import { Lesson } from '../../types';

const LessonManager: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await dbService.getAllLessons();
      const mapped: Lesson[] = (data || []).map((l: any) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        gradeId: l.grade_id || '',
        unitId: l.unit_id || '',
        duration: l.duration || 15,
        viewCount: l.view_count || 0,
        description: l.description || '',
        isPublished: l.is_published,
        blocks: l.blocks || []
      }));
      setLessons(mapped);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await dbService.deleteLesson(id);
        setLessons(lessons.filter(l => l.id !== id));
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Ders silinirken bir hata oluştu.');
      }
    }
  };

  const filteredLessons = lessons.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'all' || l.gradeId === gradeFilter;
    return matchSearch && matchGrade;
  });

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
          <input
            type="text"
            placeholder="Ders ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-mint/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-bio-mint transition-colors cursor-pointer"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="all">Tüm Sınıflar</option>
            <option value="9">9. Sınıf</option>
            <option value="10">10. Sınıf</option>
            <option value="11">11. Sınıf</option>
            <option value="12">12. Sınıf</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
        </div>
      ) : (
        /* Table */
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
                {filteredLessons.map(lesson => (
                  <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{lesson.title}</div>
                      <div className="text-xs text-gray-400">/{lesson.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lesson.gradeId}. Sınıf</td>
                    <td className="px-6 py-4">
                      {lesson.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle size={12} /> Yayında
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <XCircle size={12} /> Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lesson.viewCount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            // Sınıf ID'sinden slug oluştur (9 -> 9-sinif)
                            const gradeSlug = lesson.gradeId ? `${lesson.gradeId}-sinif` : '9-sinif';
                            window.open(`/#/dersler/${gradeSlug}/unite/${lesson.slug}`, '_blank');
                          }}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Önizle"
                          aria-label={`${lesson.title} dersini önizle`}
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
                {filteredLessons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {lessons.length === 0 ? 'Henüz ders eklenmemiş.' : 'Arama kriterlerine uygun ders bulunamadı.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default LessonManager;
