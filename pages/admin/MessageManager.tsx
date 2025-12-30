import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Mail, Inbox, Trash2, Eye, Search, Calendar, User, Check, X, Loader2, Bell, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
    is_read?: boolean;
}

interface NewsletterSubscriber {
    id: string;
    email: string;
    created_at: string;
}

const MessageManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'messages' | 'subscribers'>('messages');
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load messages
            const { data: msgData, error: msgError } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (msgError) throw msgError;
            setMessages(msgData || []);

            // Load subscribers
            const { data: subData, error: subError } = await supabase
                .from('newsletter_subscribers')
                .select('*')
                .order('created_at', { ascending: false });

            if (subError) throw subError;
            setSubscribers(subData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

        try {
            const { error } = await supabase.from('contact_messages').delete().eq('id', id);
            if (error) throw error;
            setMessages(messages.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Mesaj silinirken bir hata oluştu.');
        }
    };

    const handleDeleteSubscriber = async (id: string) => {
        if (!window.confirm('Bu aboneyi silmek istediğinizden emin misiniz?')) return;

        try {
            const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
            if (error) throw error;
            setSubscribers(subscribers.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            alert('Abone silinirken bir hata oluştu.');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout title="Mesaj Yönetimi">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'messages'
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <Inbox size={18} />
                    İletişim Mesajları
                    {messages.length > 0 && (
                        <span className="bg-bio-mint text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold">
                            {messages.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('subscribers')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'subscribers'
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <Users size={18} />
                    Bülten Aboneleri
                    {subscribers.length > 0 && (
                        <span className="bg-bio-mint text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold">
                            {subscribers.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="relative w-full md:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-mint/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
                </div>
            ) : (
                <div className="flex gap-6">
                    {/* List */}
                    <div className={`flex-1 ${selectedMessage && activeTab === 'messages' ? 'max-w-md' : ''}`}>
                        {activeTab === 'messages' ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {filteredMessages.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Mail size={48} className="mx-auto mb-4 opacity-30" />
                                        <p>Henüz mesaj yok.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {filteredMessages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                onClick={() => setSelectedMessage(msg)}
                                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-bio-mint/5 border-l-4 border-bio-mint' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-gray-900 truncate">{msg.name}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                            <Calendar size={12} /> {formatDate(msg.created_at)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {filteredSubscribers.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell size={48} className="mx-auto mb-4 opacity-30" />
                                        <p>Henüz abone yok.</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                                                <th className="px-6 py-4 text-left font-semibold">E-posta</th>
                                                <th className="px-6 py-4 text-left font-semibold">Tarih</th>
                                                <th className="px-6 py-4 text-right font-semibold">İşlem</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredSubscribers.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-900">{sub.email}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {formatDate(sub.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteSubscriber(sub.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Sil"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Message Detail */}
                    {selectedMessage && activeTab === 'messages' && (
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <User size={14} />
                                        <span>{selectedMessage.name}</span>
                                        <span className="text-gray-300">•</span>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-bio-mint hover:underline">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="text-sm text-gray-400 mb-4 flex items-center gap-1">
                                <Calendar size={14} /> {formatDate(selectedMessage.created_at)}
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-bio-mint text-slate-900 font-bold rounded-lg hover:bg-bio-mint-light transition-colors"
                                >
                                    <Mail size={18} /> Yanıtla
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
};

export default MessageManager;
