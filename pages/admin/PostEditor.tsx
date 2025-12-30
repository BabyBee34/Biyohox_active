import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Save, ArrowLeft, Image as ImageIcon, Tag, AlignLeft,
    Calendar, Eye, EyeOff, Settings, X, Globe, Clock, CheckCircle, Loader2
} from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';
import { dbService } from '../../lib/supabase';

const PostEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // UI States
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Content States
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [readTime, setReadTime] = useState(5);
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            loadPost(id);
        }
    }, [isEditMode, id]);

    const loadPost = async (postId: string) => {
        try {
            setLoading(true);
            const post = await dbService.getPostById(postId);
            if (post) {
                setTitle(post.title);
                setSlug(post.slug);
                setExcerpt(post.excerpt || '');
                setImageUrl(post.image || '');
                setTags((post.tags || []).join(', '));
                setReadTime(post.read_time || 5);
                setPublishDate(post.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]);
                setContent(post.content || '');
                setIsPublished(post.is_published || false);
            }
        } catch (error) {
            console.error('Error loading post:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEditMode) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
        }
    }, [title, isEditMode]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const postData = {
                title,
                slug,
                excerpt,
                content,
                image: imageUrl,
                tags: tags.split(',').map(t => t.trim()).filter(t => t),
                read_time: readTime,
                is_published: isPublished
            };

            if (isEditMode && id) {
                await dbService.updatePost(id, postData);
            } else {
                await dbService.createPost(postData);
            }

            alert('Yazı başarıyla kaydedildi!');
            navigate('/admin/posts');
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Kaydetme sırasında bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/posts');
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
            </div>
        );
    }

    // --- PREVIEW COMPONENT ---
    const renderPreview = () => (
        <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-xl rounded-xl overflow-hidden mt-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Image */}
            <div className="h-64 md:h-96 w-full relative">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <ImageIcon size={64} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                        <div className="flex gap-2 mb-3">
                            {tags.split(',').map((tag, i) => (
                                tag.trim() && <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">{tag.trim()}</span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{title || 'Başlıksız Yazı'}</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-200">
                            <span className="flex items-center gap-2"><Calendar size={16} /> {publishDate}</span>
                            <span className="flex items-center gap-2"><Clock size={16} /> {readTime} dk okuma</span>
                            <span className="flex items-center gap-2"><Globe size={16} /> BiyoHox Editör</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
                <div className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-xl">
                    {excerpt && (
                        <div className="text-xl font-medium text-gray-500 italic border-l-4 border-primary-500 pl-4 mb-10">
                            {excerpt}
                        </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blog Editörü</span>
                        <h1 className="text-sm font-bold text-gray-800 truncate max-w-[200px] md:max-w-md">
                            {title || 'Yeni Yazı'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        {isPreviewMode ? <EyeOff size={18} /> : <Eye size={18} />}
                        <span className="hidden md:inline">{isPreviewMode ? 'Düzenlemeye Dön' : 'Önizle'}</span>
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <Settings size={18} />
                        <span className="hidden md:inline">Ayarlar</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Kaydet
                    </button>
                </div>
            </header>

            {/* Main Area */}
            <div className="flex-1 overflow-y-auto relative">
                {isPreviewMode ? (
                    <div className="bg-gray-100 pb-20 px-4">
                        {renderPreview()}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-6 py-10 pb-32">
                        <input
                            type="text"
                            placeholder="Başlık Yazın..."
                            className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent mb-8"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Hikayenizi anlatmaya başlayın..."
                                className="border-none min-h-[500px]"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Drawer */}
            <div className={`
        fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-30 transform transition-transform duration-300 flex flex-col
        ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Settings size={18} /> Yazı Ayarları</h3>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Cover Image */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kapak Görseli</label>
                        <div className="space-y-3">
                            <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative group">
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button onClick={() => setImageUrl('')} className="text-white bg-red-500 p-2 rounded-full"><X size={16} /></button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="text-center p-4 cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                                        <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                                        <span className="text-sm font-medium text-gray-500">Dosya seçmek için tıklayın</span>
                                        <span className="text-xs text-gray-400">veya aşağıya URL girin</span>
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
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary-500"
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
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Özet (Excerpt)</label>
                            <textarea
                                rows={3}
                                className="w-full p-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary-500 resize-none"
                                placeholder="Yazının kısa bir özeti..."
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Etiketler</label>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 focus-within:border-primary-500">
                                <Tag size={16} className="text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full text-sm outline-none"
                                    placeholder="Biyoloji, DNA, Evrim..."
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Publishing */}
                    <div className="pt-6 border-t border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-4">Yayın Durumu</h4>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-600">Durum</span>
                            <button
                                onClick={() => setIsPublished(!isPublished)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {isPublished ? <><CheckCircle size={12} /> Yayında</> : 'Taslak'}
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Slug</label>
                                <input
                                    type="text"
                                    className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-500"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarih</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 text-sm border border-gray-200 rounded outline-none"
                                        value={publishDate}
                                        onChange={(e) => setPublishDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Okuma (dk)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 text-sm border border-gray-200 rounded outline-none"
                                        value={readTime}
                                        onChange={(e) => setReadTime(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="w-full py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostEditor;