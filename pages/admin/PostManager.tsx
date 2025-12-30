
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
    Plus, Trash2, Edit, Calendar, Eye, Search,
    LayoutTemplate, Save, X, ArrowRight, Image as ImageIcon,
    Newspaper, Lightbulb, FlaskConical, History, MessageCircleQuestion, Tag, Loader2
} from 'lucide-react';
import { BlogPost } from '../../types';
import RichTextEditor from '../../components/RichTextEditor';
import { supabase } from '../../lib/supabase';

// --- HTML TEMPLATES FOR BLOG POSTS ---
const POST_TEMPLATES = [
    {
        id: 'discovery',
        name: 'Bilimsel Keşif',
        icon: <Newspaper size={20} />,
        description: 'Yeni bir bilimsel gelişmeyi duyurmak için.',
        content: `
            <p class="lead">Bilim dünyasında heyecan verici bir gelişme yaşandı. Araştırmacılar, biyoloji anlayışımızı değiştirebilecek yeni bulgulara ulaştı.</p>
            <h2 class="text-2xl font-bold text-gray-800 mt-6 mb-3">Keşfin Detayları</h2>
            <p>Yapılan son çalışmalarda...</p>
            <blockquote style="border-left: 4px solid #22c55e; padding-left: 16px; margin: 20px 0; color: #555; font-style: italic;">
                "Bu keşif, hücresel mekanizmaları anlama şeklimizi kökten değiştirebilir." - Baş Araştırmacı
            </blockquote>
            <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">Neden Önemli?</h3>
            <p>Bu buluş sayesinde tıp ve genetik alanında yeni kapılar aralanabilir...</p>
        `
    },
    {
        id: 'funfact',
        name: 'Bunları Biliyor muydun?',
        icon: <Lightbulb size={20} />,
        description: 'İlginç ve şaşırtıcı kısa bilgiler için.',
        content: `
            <div style="background-color: #fff7ed; border: 2px dashed #f97316; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <h2 style="color: #c2410c; font-weight: bold; font-size: 24px; margin-bottom: 12px;">Bunları Biliyor Muydun?</h2>
                <p style="font-size: 18px; line-height: 1.6;">İnsan vücudundaki damarların toplam uzunluğu yaklaşık 100.000 kilometredir. Bu uzunluk, Dünya'nın çevresini 2.5 kez dolaşmaya yeter!</p>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">Bilimsel Açıklama</h3>
            <p>Kılcal damarlar o kadar incedir ki...</p>
        `
    },
    {
        id: 'myth',
        name: 'Efsane vs Gerçek',
        icon: <MessageCircleQuestion size={20} />,
        description: 'Yanlış bilinen doğruları düzeltmek için.',
        content: `
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Doğru Bildiğimiz Yanlışlar</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                <div style="background-color: #fee2e2; padding: 20px; border-radius: 12px;">
                    <h3 style="color: #dc2626; font-weight: bold; margin-bottom: 8px;">❌ Efsane</h3>
                    <p>"Beynimizin sadece %10'unu kullanıyoruz."</p>
                </div>
                <div style="background-color: #dcfce7; padding: 20px; border-radius: 12px;">
                    <h3 style="color: #16a34a; font-weight: bold; margin-bottom: 8px;">✅ Gerçek</h3>
                    <p>"Beynimizin tamamını kullanırız. Farklı işlevler için beynin farklı bölgeleri sürekli aktiftir."</p>
                </div>
            </div>
            <p>Bu yaygın inanışın kökeni 19. yüzyıla dayanmaktadır ancak nörolojik görüntüleme teknikleri bunun yanlış olduğunu kanıtlamıştır.</p>
        `
    },
    {
        id: 'biography',
        name: 'Bilim İnsanı Biyografisi',
        icon: <History size={20} />,
        description: 'Önemli biyologların hayatı ve çalışmaları.',
        content: `
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Charles Darwin (1809-1882)</h2>
            <p style="color: #666; font-style: italic; margin-bottom: 20px;">Evrim teorisinin babası ve modern biyolojinin kurucusu.</p>
            <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">Erken Yaşamı ve Eğitimi</h3>
            <p>Darwin, İngiltere'de doğdu ve doğaya olan ilgisi küçük yaşlarda başladı...</p>
            <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">Beagle Yolculuğu</h3>
            <p>1831 yılında HMS Beagle gemisiyle çıktığı 5 yıllık yolculuk, onun düşünce yapısını tamamen değiştirdi...</p>
            <h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">Başlıca Eserleri</h3>
            <ul class="list-disc pl-5">
                <li>Türlerin Kökeni (1859)</li>
                <li>İnsanın Türeyişi (1871)</li>
            </ul>
        `
    },
    {
        id: 'process',
        name: 'Süreç Analizi',
        icon: <FlaskConical size={20} />,
        description: 'Karmaşık bir biyolojik süreci adım adım anlatın.',
        content: `
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Fotosentez Nasıl Gerçekleşir?</h2>
            <p class="mb-6">Fotosentez, bitkilerin güneş enerjisini kimyasal enerjiye dönüştürme sürecidir.</p>
            
            <div style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; color: #0ea5e9;">Adım 1: Işığın Soğurulması</h4>
                <p>Klorofil pigmentleri güneş ışığını yakalar ve elektronları uyarır.</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; color: #0ea5e9;">Adım 2: ATP Üretimi</h4>
                <p>Elektron taşıma sistemi (ETS) üzerinden aktarılan elektronlar sayesinde ATP sentezlenir.</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; color: #0ea5e9;">Adım 3: Karbon Tutma</h4>
                <p>Kalvin döngüsünde CO2 kullanılarak glikoz gibi organik besinler üretilir.</p>
            </div>
        `
    }
];

const PostManager: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');
    const navigate = useNavigate();

    // --- WIZARD STATE ---
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [editorKey, setEditorKey] = useState(0);
    const [saving, setSaving] = useState(false);

    // Form Data
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [readTime, setReadTime] = useState(5);
    const [content, setContent] = useState('');
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);

    // Load posts from Supabase
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map Supabase data to BlogPost format
            const mappedPosts: BlogPost[] = (data || []).map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt || '',
                content: post.content || '',
                image: post.image || 'https://picsum.photos/600/400',
                tags: post.tags || [],
                readTime: post.read_time || 5,
                date: new Date(post.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })
            }));

            setPosts(mappedPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
            try {
                const { error } = await supabase.from('posts').delete().eq('id', id);
                if (error) throw error;
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Silme işlemi başarısız oldu.');
            }
        }
    };

    const filteredPosts = posts.filter(post => {
        if (activeTab === 'all') return true;
        if (activeTab === 'published') return true;
        if (activeTab === 'draft') return false;
        return true;
    });

    const resetWizard = () => {
        setIsWizardOpen(false);
        setWizardStep(1);
        setTitle('');
        setExcerpt('');
        setImageUrl('');
        setTags('');
        setReadTime(5);
        setContent('');
        setEditorKey(0);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const slug = title.toLowerCase()
                .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
                .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

            const newPost = {
                title,
                slug,
                excerpt,
                content,
                image: imageUrl || 'https://picsum.photos/600/400',
                tags: tags.split(',').map(t => t.trim()).filter(t => t),
                read_time: readTime,
                is_published: true,
                created_at: new Date(publishDate).toISOString()
            };

            const { data, error } = await supabase
                .from('posts')
                .insert(newPost)
                .select()
                .single();

            if (error) throw error;

            // Add to local state
            const mappedPost: BlogPost = {
                id: data.id,
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt || '',
                content: data.content || '',
                image: data.image,
                tags: data.tags || [],
                readTime: data.read_time,
                date: new Date(data.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })
            };

            setPosts([mappedPost, ...posts]);
            resetWizard();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Kaydetme işlemi başarısız oldu.');
        } finally {
            setSaving(false);
        }
    };

    const applyTemplate = (templateContent: string) => {
        setContent(templateContent);
        setEditorKey(prev => prev + 1);
    };

    // --- WIZARD RENDERERS ---

    const renderStep1Metadata = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Yazı Başlığı</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 text-lg font-bold border border-gray-300 rounded-xl outline-none focus:border-primary-500"
                            placeholder="Örn: Mitokondrinin Gizemi"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Kısa Özet (Excerpt)</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-primary-500 resize-none"
                            placeholder="Yazının kartta görünecek kısa özeti..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Okuma Süresi (dk)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary-500"
                                value={readTime}
                                onChange={(e) => setReadTime(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Yayın Tarihi</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary-500"
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Kapak Görseli</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary-500"
                                placeholder="https://..."
                                value={imageUrl?.startsWith('data:') ? 'Yerel dosya yüklendi' : imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                disabled={imageUrl?.startsWith('data:')}
                            />
                            <label className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-primary-700 transition-colors flex items-center gap-1 whitespace-nowrap">
                                <ImageIcon size={14} /> Dosya Seç
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setImageUrl(reader.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                            {imageUrl?.startsWith('data:') && (
                                <button
                                    onClick={() => setImageUrl('')}
                                    className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Görseli Kaldır"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div className="aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '')} />
                            ) : (
                                <label className="text-gray-400 flex flex-col items-center cursor-pointer w-full h-full justify-center hover:bg-gray-50 transition-colors">
                                    <ImageIcon size={32} className="mb-2" />
                                    <span className="text-sm font-medium">Dosya seçmek için tıklayın</span>
                                    <span className="text-xs">veya yukarıya URL girin</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setImageUrl(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Etiketler</label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 ring-primary-500/20">
                            <Tag size={18} className="text-gray-400" />
                            <input
                                type="text"
                                className="w-full outline-none text-sm"
                                placeholder="Virgülle ayırın (Örn: DNA, Evrim, Tarih)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={() => setWizardStep(2)}
                    disabled={!title}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    İçerik Editörüne Geç <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderStep2Content = () => (
        <div className="space-y-6 h-full flex flex-col animate-in fade-in">

            <div className="flex-1 flex flex-col gap-4">
                {/* Template Selector */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                        <LayoutTemplate size={14} /> Hazır Blog Şablonları
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {POST_TEMPLATES.map(template => (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => applyTemplate(template.content)}
                                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:shadow-sm transition-all text-sm text-gray-600 group"
                                title={template.description}
                            >
                                <div className="text-gray-400 group-hover:text-primary-500">{template.icon}</div>
                                <span className="font-medium">{template.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div className="flex-1 border border-gray-300 rounded-xl overflow-hidden bg-white flex flex-col shadow-sm min-h-[400px]">
                    <RichTextEditor
                        key={editorKey}
                        content={content}
                        onChange={setContent}
                        placeholder="Blog yazınızı buraya yazın veya yukarıdan bir şablon seçin..."
                        className="border-none h-full"
                    />
                </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
                <button onClick={() => setWizardStep(1)} className="text-gray-500 font-medium hover:text-gray-800">Geri Dön</button>
                <button
                    onClick={handleSave}
                    disabled={!content || content.length < 10 || saving}
                    className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Kaydediliyor...' : 'Yazıyı Yayınla'}
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout
            title="İlginç Bilgiler & Blog"
            action={
                <button
                    onClick={() => setIsWizardOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} /> Yeni Yazı Ekle
                </button>
            }
        >
            {/* 1. LIST VIEW */}
            {!isWizardOpen && (
                <>
                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        {/* Tabs */}
                        <div className="flex p-1 bg-gray-100 rounded-lg">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Tümü
                            </button>
                            <button
                                onClick={() => setActiveTab('published')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'published' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Yayında
                            </button>
                            <button
                                onClick={() => setActiveTab('draft')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'draft' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Taslaklar
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-72">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Yazı başlığı ara..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map(post => (
                            <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm group hover:shadow-lg transition-all duration-300">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-lg shadow-sm backdrop-blur-sm">
                                        <button
                                            onClick={() => { setIsWizardOpen(true); setTitle(post.title); setExcerpt(post.excerpt); setContent('<p>Mock edit content...</p>'); }}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Düzenle"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded tracking-wider">
                                        Yayında
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex gap-2 mb-3">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase px-2 py-1 bg-primary-50 text-primary-700 rounded border border-primary-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 text-lg group-hover:text-primary-600 transition-colors cursor-pointer">{post.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-grow leading-relaxed">{post.excerpt}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 mt-auto">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><Eye size={14} /> 1.2k Okunma</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* 2. WIZARD MODAL */}
            {isWizardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${wizardStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                <div className="font-medium text-sm text-gray-700">Genel Bilgiler</div>
                                <div className="w-8 h-0.5 bg-gray-200"></div>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${wizardStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                <div className="font-medium text-sm text-gray-700">İçerik Editörü</div>
                            </div>
                            <button onClick={resetWizard} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={24} /></button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
                            {wizardStep === 1 && renderStep1Metadata()}
                            {wizardStep === 2 && renderStep2Content()}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default PostManager;
