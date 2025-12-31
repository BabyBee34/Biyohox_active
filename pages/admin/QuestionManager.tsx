import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
    Plus, Trash2, Edit, Search, CheckCircle, Eye, XCircle, Loader2,
    HelpCircle, Video, Filter
} from 'lucide-react';
import { dbService } from '../../lib/supabase';

interface Question {
    id: string;
    title: string;
    grade_id: string;
    difficulty: 'easy' | 'medium' | 'hard';
    is_published: boolean;
    view_count: number;
    points: number;
    created_at: string;
}

interface Solution {
    id: string;
    title: string;
    grade_id: string;
    solution_type: 'text' | 'video' | 'both';
    is_published: boolean;
    view_count: number;
    created_at: string;
}

const QuestionManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'questions' | 'solutions'>('questions');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [gradeFilter, setGradeFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [questionsData, solutionsData] = await Promise.all([
                dbService.getAllQuestions(),
                dbService.getAllSolutions()
            ]);
            setQuestions(questionsData || []);
            setSolutions(solutionsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;
        try {
            await dbService.deleteQuestion(id);
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Soru silinirken bir hata oluştu.');
        }
    };

    const handleDeleteSolution = async (id: string) => {
        if (!window.confirm('Bu çözümü silmek istediğinizden emin misiniz?')) return;
        try {
            await dbService.deleteSolution(id);
            setSolutions(solutions.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting solution:', error);
            alert('Çözüm silinirken bir hata oluştu.');
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Kolay';
            case 'medium': return 'Orta';
            case 'hard': return 'Zor';
            default: return '-';
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchGrade = gradeFilter === 'all' || q.grade_id === gradeFilter;
        return matchSearch && matchGrade;
    });

    const filteredSolutions = solutions.filter(s => {
        const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchGrade = gradeFilter === 'all' || s.grade_id === gradeFilter;
        return matchSearch && matchGrade;
    });

    return (
        <AdminLayout
            title="Soru Yönetimi"
            action={
                <div className="flex gap-2">
                    <Link
                        to="/admin/questions/new"
                        className="bg-bio-coral text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-500 transition-colors shadow-sm font-bold text-sm"
                    >
                        <Plus size={18} /> Yeni Soru
                    </Link>
                    <Link
                        to="/admin/solutions/new"
                        className="bg-bio-mint text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-bio-mint-light transition-colors shadow-sm font-bold text-sm"
                    >
                        <Plus size={18} /> Yeni Çözüm
                    </Link>
                </div>
            }
        >
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'questions'
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                >
                    <HelpCircle size={18} />
                    Sorular
                    <span className="bg-bio-coral/20 text-bio-coral text-xs px-2 py-0.5 rounded-full font-bold">
                        {questions.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('solutions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'solutions'
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                >
                    <Video size={18} />
                    Çözümler
                    <span className="bg-bio-mint/20 text-bio-mint-dark text-xs px-2 py-0.5 rounded-full font-bold">
                        {solutions.length}
                    </span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-coral/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-bio-coral transition-colors cursor-pointer"
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

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-bio-coral" />
                </div>
            ) : activeTab === 'questions' ? (
                /* Questions Table */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                                    <th className="px-6 py-4 font-semibold">Soru Başlığı</th>
                                    <th className="px-6 py-4 font-semibold">Sınıf</th>
                                    <th className="px-6 py-4 font-semibold">Zorluk</th>
                                    <th className="px-6 py-4 font-semibold">Durum</th>
                                    <th className="px-6 py-4 font-semibold">Görüntülenme</th>
                                    <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredQuestions.map(question => (
                                    <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{question.title}</div>
                                            <div className="text-xs text-gray-400">{question.points} puan</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{question.grade_id}. Sınıf</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                                {getDifficultyLabel(question.difficulty)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {question.is_published ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    <CheckCircle size={12} /> Yayında
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    <XCircle size={12} /> Taslak
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{question.view_count}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/#/sorular/soru/${question.id}`, '_blank')}
                                                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Önizle"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/questions/${question.id}/edit`)}
                                                    className="p-2 text-gray-500 hover:text-bio-coral hover:bg-bio-coral/10 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredQuestions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            {questions.length === 0 ? 'Henüz soru eklenmemiş.' : 'Arama kriterlerine uygun soru bulunamadı.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Solutions Table */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                                    <th className="px-6 py-4 font-semibold">Çözüm Başlığı</th>
                                    <th className="px-6 py-4 font-semibold">Sınıf</th>
                                    <th className="px-6 py-4 font-semibold">Tür</th>
                                    <th className="px-6 py-4 font-semibold">Durum</th>
                                    <th className="px-6 py-4 font-semibold">Görüntülenme</th>
                                    <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSolutions.map(solution => (
                                    <tr key={solution.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{solution.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{solution.grade_id}. Sınıf</td>
                                        <td className="px-6 py-4">
                                            {solution.solution_type === 'video' && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">Video</span>
                                            )}
                                            {solution.solution_type === 'text' && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-bio-mint/10 text-bio-mint-dark">Yazılı</span>
                                            )}
                                            {solution.solution_type === 'both' && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">Her İkisi</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {solution.is_published ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    <CheckCircle size={12} /> Yayında
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    <XCircle size={12} /> Taslak
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{solution.view_count}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/#/sorular/cozum/${solution.id}`, '_blank')}
                                                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Önizle"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/solutions/${solution.id}/edit`)}
                                                    className="p-2 text-gray-500 hover:text-bio-mint-dark hover:bg-bio-mint/10 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSolution(solution.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSolutions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            {solutions.length === 0 ? 'Henüz çözüm eklenmemiş.' : 'Arama kriterlerine uygun çözüm bulunamadı.'}
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

export default QuestionManager;
