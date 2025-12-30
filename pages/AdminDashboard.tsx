import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, FileText, Activity, AlertTriangle, ArrowRight, Loader2, Mail, Newspaper } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { dbService } from '../lib/supabase';

interface Stats {
    lessonCount: number;
    resourceCount: number;
    totalDownloads: number;
    postCount: number;
    unreadMessages: number;
}

interface ChartDataPoint {
    name: string;
    uv: number;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsData, weeklyData] = await Promise.all([
                dbService.getStats(),
                dbService.getWeeklyStats()
            ]);
            setStats(statsData);
            setChartData(weeklyData);
        } catch (err: any) {
            console.error('Stats load error:', err);
            setError(err.message || 'İstatistikler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout title="Dashboard">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700 font-medium">{error}</p>
                    <button
                        onClick={loadData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Toplam Ders</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.lessonCount || 0}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen size={20} /></div>
                    </div>
                    <Link to="/admin/lessons" className="mt-4 text-xs text-blue-600 font-medium hover:underline block">
                        Dersleri Yönet →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">PDF İndirme</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.totalDownloads?.toLocaleString() || 0}</h3>
                        </div>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FileText size={20} /></div>
                    </div>
                    <Link to="/admin/notes" className="mt-4 text-xs text-red-600 font-medium hover:underline block">
                        Kaynakları Yönet →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Blog Yazısı</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.postCount || 0}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Newspaper size={20} /></div>
                    </div>
                    <Link to="/admin/posts" className="mt-4 text-xs text-purple-600 font-medium hover:underline block">
                        Yazıları Yönet →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Okunmamış Mesaj</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.unreadMessages || 0}</h3>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Mail size={20} /></div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">İletişim formundan</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Chart - Placeholder for future analytics */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-6">Haftalık Görüntülenme</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="uv" fill="#00D9A3" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-4">
                        Gerçek analitik verileri için Google Analytics entegrasyonu gereklidir.
                    </p>
                </div>

                {/* Summary Widget */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-bio-mint" /> İçerik Özeti
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm text-gray-700">Toplam Ders</span>
                            <span className="font-bold text-blue-600">{stats?.lessonCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-sm text-gray-700">Toplam Kaynak</span>
                            <span className="font-bold text-green-600">{stats?.resourceCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                            <span className="text-sm text-gray-700">Blog Yazısı</span>
                            <span className="font-bold text-purple-600">{stats?.postCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                            <span className="text-sm text-gray-700">PDF İndirme</span>
                            <span className="font-bold text-amber-600">{stats?.totalDownloads || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/lessons/new" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-bio-mint hover:shadow-md transition-all group">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-bio-mint">Yeni Ders Ekle</h3>
                    <p className="text-sm text-gray-500 mb-4">Müfredata yeni bir ders ekle.</p>
                    <div className="flex items-center text-sm font-medium text-bio-mint">
                        Oluştur <ArrowRight size={16} className="ml-1" />
                    </div>
                </Link>
                <Link to="/admin/notes" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-bio-mint hover:shadow-md transition-all group">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-bio-mint">PDF Yükle</h3>
                    <p className="text-sm text-gray-500 mb-4">Yeni çalışma kağıtları ve notlar ekle.</p>
                    <div className="flex items-center text-sm font-medium text-bio-mint">
                        Git <ArrowRight size={16} className="ml-1" />
                    </div>
                </Link>
                <Link to="/admin/posts/new" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-bio-mint hover:shadow-md transition-all group">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-bio-mint">Blog Yazısı Ekle</h3>
                    <p className="text-sm text-gray-500 mb-4">İlginç bilgiler bölümü için içerik üret.</p>
                    <div className="flex items-center text-sm font-medium text-bio-mint">
                        Yaz <ArrowRight size={16} className="ml-1" />
                    </div>
                </Link>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;