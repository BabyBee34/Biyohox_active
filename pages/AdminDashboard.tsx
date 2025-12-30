import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, FileText, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const data = [
    { name: 'Pzt', uv: 4000 },
    { name: 'Sal', uv: 3000 },
    { name: 'Çar', uv: 2000 },
    { name: 'Per', uv: 2780 },
    { name: 'Cum', uv: 1890 },
    { name: 'Cmt', uv: 2390 },
    { name: 'Paz', uv: 3490 },
];

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    return (
        <AdminLayout title="Dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Toplam Ders</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">114</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen size={20} /></div>
                    </div>
                    <div className="mt-4 text-xs text-green-600 font-medium">+2 bu hafta</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">PDF İndirme</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">8,234</h3>
                        </div>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FileText size={20} /></div>
                    </div>
                    <div className="mt-4 text-xs text-green-600 font-medium">+12% geçen aya göre</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Ziyaretçi</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">45.2k</h3>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users size={20} /></div>
                    </div>
                    <div className="mt-4 text-xs text-green-600 font-medium">+5.4% artış</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Quiz Çözülme</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">1,203</h3>
                        </div>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Activity size={20} /></div>
                    </div>
                    <div className="mt-4 text-xs text-gray-400 font-medium">Bugün</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-6">Haftalık Ziyaretçi Analizi</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="uv" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Health Widget */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-yellow-500" /> Site Sağlığı
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Boş İçerik</p>
                                <p className="text-xs text-gray-500">10. Sınıf / Genetik ünitesinde ders eklenmemiş.</p>
                                <button onClick={() => navigate('/admin/lessons')} className="text-xs text-red-600 font-medium mt-1 hover:underline">Düzenle</button>
                            </div>
                        </div>
                        <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Quiz Eksik</p>
                                <p className="text-xs text-gray-500">Hücre Bölünmesi dersinde quiz bulunmuyor.</p>
                                <button onClick={() => navigate('/admin/lessons')} className="text-xs text-yellow-600 font-medium mt-1 hover:underline">Ekle</button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <button className="text-sm text-gray-500 hover:text-gray-800 font-medium">Tam Raporu Gör</button>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/lessons" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all group">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600">Dersleri Yönet</h3>
                    <p className="text-sm text-gray-500 mb-4">Müfredat, ünite ve konuları düzenle.</p>
                    <div className="flex items-center text-sm font-medium text-primary-600">
                        Git <ArrowRight size={16} className="ml-1" />
                    </div>
                </Link>
                <Link to="/admin/notes" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all group">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600">PDF Yükle</h3>
                    <p className="text-sm text-gray-500 mb-4">Yeni çalışma kağıtları ve notlar ekle.</p>
                    <div className="flex items-center text-sm font-medium text-primary-600">
                        Git <ArrowRight size={16} className="ml-1" />
                    </div>
                </Link>
                <Link to="/admin/posts" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all group">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600">Blog Yazısı Ekle</h3>
                    <p className="text-sm text-gray-500 mb-4">İlginç bilgiler bölümü için içerik üret.</p>
                    <div className="flex items-center text-sm font-medium text-primary-600">
                        Git <ArrowRight size={16} className="ml-1" />
                    </div>
                </Link>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;