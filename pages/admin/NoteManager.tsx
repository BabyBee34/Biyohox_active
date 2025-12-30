
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
    Plus, Trash2, FileText, Download, X, Edit, UploadCloud, Search,
    BookOpen, Check, ArrowRight, LayoutTemplate, Save, ChevronRight,
    CornerDownRight, Table, List, GitMerge, AlignLeft, Grid, Loader2
} from 'lucide-react';
import { GRADES } from '../../constants';
import { StudyResource } from '../../types';
import RichTextEditor from '../../components/RichTextEditor';
import { dbService } from '../../lib/supabase';

// --- HTML TEMPLATES FOR NOTES ---
const NOTE_TEMPLATES = [
    {
        id: 'standard',
        name: 'Standart Özet',
        icon: <AlignLeft size={20} />,
        description: 'Başlık, alt başlıklar ve maddeler.',
        content: `
            <h2 class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Giriş</h2>
            <p class="mb-4">Bu konunun temel amacı...</p>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Temel Kavramlar</h3>
            <ul class="list-disc pl-5 mb-4 space-y-1">
                <li>Kavram 1: Açıklaması...</li>
                <li>Kavram 2: Açıklaması...</li>
            </ul>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Önemli Noktalar</h3>
            <p>Burası detaylı açıklama alanıdır.</p>
        `
    },
    {
        id: 'comparison',
        name: 'Karşılaştırma Tablosu',
        icon: <Table size={20} />,
        description: 'İki kavramı kıyaslamak için (Örn: Mitoz vs Mayoz).',
        content: `
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Karşılaştırma</h2>
            <p class="mb-4">Aşağıdaki tabloda iki kavramın temel farkları verilmiştir:</p>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
                <thead>
                    <tr style="background-color: #f9fafb;">
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Özellik</th>
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Kavram A</th>
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Kavram B</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #e5e7eb; padding: 12px;">Tanım</td>
                        <td style="border: 1px solid #e5e7eb; padding: 12px;">...</td>
                        <td style="border: 1px solid #e5e7eb; padding: 12px;">...</td>
                    </tr>
                </tbody>
            </table>
        `
    },
    {
        id: 'process',
        name: 'Süreç / Döngü',
        icon: <GitMerge size={20} />,
        description: 'Adım adım işleyen süreçler için (Örn: Krebs).',
        content: `
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Süreç Adımları</h2>
            <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin-bottom: 16px;">
                <strong>1. Başlangıç Evresi:</strong> Reaksiyon burada başlar...
            </div>
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin-bottom: 16px;">
                <strong>2. Gelişme Evresi:</strong> ATP üretimi gerçekleşir...
            </div>
        `
    },
    {
        id: 'vocabulary',
        name: 'Terimler Sözlüğü',
        icon: <List size={20} />,
        description: 'Üniteye ait önemli terimler ve tanımları.',
        content: `
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Ünite Sözlüğü</h2>
            <dl>
                <dt style="font-weight: bold; color: #15803d; margin-top: 12px;">Terim 1</dt>
                <dd style="margin-left: 20px; margin-bottom: 8px;">Bu terimin bilimsel açıklaması buraya gelir.</dd>
                
                <dt style="font-weight: bold; color: #15803d; margin-top: 12px;">Terim 2</dt>
                <dd style="margin-left: 20px; margin-bottom: 8px;">Bu terimin bilimsel açıklaması buraya gelir.</dd>
            </dl>
        `
    }
];

const NoteManager: React.FC = () => {
    // --- LIST VIEW STATE ---
    const [resources, setResources] = useState<StudyResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeListTab, setActiveListTab] = useState<'note' | 'pdf'>('note');
    const [activeGradeFilter, setActiveGradeFilter] = useState('Tümü');

    // --- WIZARD / CREATE STATE ---
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [editorKey, setEditorKey] = useState(0);
    const [saving, setSaving] = useState(false);

    // Wizard Data
    const [newResType, setNewResType] = useState<'note' | 'pdf'>('note');
    const [gradeId, setGradeId] = useState('');
    const [unitTitle, setUnitTitle] = useState('');
    const [topicTitle, setTopicTitle] = useState('');

    // Content Data
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // Load resources from database
    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await dbService.getResources();
            const mapped: StudyResource[] = (data || []).map((r: any) => ({
                id: r.id,
                type: r.type,
                title: r.title,
                grade: r.grade || '',
                unit: r.unit || '',
                topic: r.topic,
                content: r.content,
                fileUrl: r.file_url,
                size: r.file_size,
                downloads: r.downloads || 0,
                views: r.views || 0,
                date: new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
            }));
            setResources(mapped);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- HELPER FUNCTIONS ---
    const filteredResources = resources.filter(res => {
        const typeMatch = res.type === activeListTab;
        const gradeMatch = activeGradeFilter === 'Tümü' || res.grade === activeGradeFilter;
        return typeMatch && gradeMatch;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Silmek istediğinizden emin misiniz?')) {
            try {
                await dbService.deleteResource(id);
                setResources(resources.filter(r => r.id !== id));
            } catch (error) {
                console.error('Error deleting resource:', error);
                alert('Kaynak silinirken bir hata oluştu.');
            }
        }
    };

    const resetWizard = () => {
        setIsWizardOpen(false);
        setWizardStep(1);
        setNewResType('note');
        setGradeId('');
        setUnitTitle('');
        setTopicTitle('');
        setTitle('');
        setContent('');
        setFile(null);
        setEditorKey(0);
    };

    const handleSave = async () => {
        const gradeName = GRADES.find(g => g.id === gradeId)?.name || 'Genel';

        try {
            setSaving(true);
            const newResource = {
                type: newResType,
                title: title,
                grade: gradeName,
                unit: unitTitle,
                topic: topicTitle || null,
                content: newResType === 'note' ? content : null,
                file_url: newResType === 'pdf' && file ? URL.createObjectURL(file) : null, // In production, upload to storage
                file_size: newResType === 'pdf' && file ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : null,
                downloads: 0,
                views: 0
            };

            const created = await dbService.createResource(newResource);

            // Add to local state
            const mapped: StudyResource = {
                id: created.id,
                type: created.type,
                title: created.title,
                grade: created.grade || '',
                unit: created.unit || '',
                topic: created.topic,
                content: created.content,
                fileUrl: created.file_url,
                size: created.file_size,
                downloads: created.downloads || 0,
                views: created.views || 0,
                date: new Date(created.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            setResources([mapped, ...resources]);
            resetWizard();
        } catch (error) {
            console.error('Error saving resource:', error);
            alert('Kaynak kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const applyTemplate = (templateContent: string) => {
        setContent(templateContent);
        setEditorKey(prev => prev + 1);
    };

    // --- WIZARD RENDERERS ---

    const renderStep1Type = () => (
        <div className="space-y-6 animate-in fade-in">
            <h3 className="text-xl font-bold text-center text-gray-800">Ne eklemek istersiniz?</h3>
            <div className="grid grid-cols-2 gap-6">
                <button
                    onClick={() => { setNewResType('note'); setWizardStep(2); }}
                    className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen size={32} />
                    </div>
                    <span className="font-bold text-lg text-gray-800">Ders Notu</span>
                    <span className="text-sm text-gray-500 text-center mt-2">HTML formatında, okunabilir zengin metin içeriği.</span>
                </button>

                <button
                    onClick={() => { setNewResType('pdf'); setWizardStep(2); }}
                    className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all group"
                >
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={32} />
                    </div>
                    <span className="font-bold text-lg text-gray-800">PDF Doküman</span>
                    <span className="text-sm text-gray-500 text-center mt-2">İndirilebilir test, çalışma kağıdı veya fasikül.</span>
                </button>
            </div>
        </div>
    );

    const renderStep2Hierarchy = () => (
        <div className="space-y-6 animate-in fade-in">
            <h3 className="text-xl font-bold text-center text-gray-800">Konum Seçimi</h3>

            {/* Grade */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">1. Sınıf</label>
                <div className="grid grid-cols-4 gap-3">
                    {GRADES.map(g => (
                        <button
                            key={g.id}
                            onClick={() => setGradeId(g.id)}
                            className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${gradeId === g.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300'}`}
                        >
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Unit */}
            {gradeId && (
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">2. Ünite</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary-500"
                            placeholder="Ünite adı..."
                            value={unitTitle}
                            onChange={(e) => setUnitTitle(e.target.value)}
                        />
                    </div>

                    {/* Topic */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">3. Konu (opsiyonel)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary-500"
                            placeholder="Konu adı..."
                            value={topicTitle}
                            onChange={(e) => setTopicTitle(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => setWizardStep(3)}
                    disabled={!gradeId || !unitTitle.trim()}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Devam Et <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderStep3Content = () => (
        <div className="space-y-6 h-full flex flex-col animate-in fade-in">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Başlık</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 text-lg font-bold border border-gray-300 rounded-xl outline-none focus:border-primary-500"
                    placeholder={newResType === 'pdf' ? "Örn: 9. Sınıf Ünite 1 Özeti" : "Örn: Enzimlerin Yapısı"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {newResType === 'pdf' ? (
                <div className="border-2 border-dashed border-primary-200 bg-primary-50/50 rounded-xl p-10 text-center hover:bg-primary-50 hover:border-primary-300 transition-all cursor-pointer group flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform text-red-500 border border-red-100">
                        <FileText size={32} />
                    </div>
                    {file ? (
                        <div>
                            <div className="text-gray-800 font-bold text-lg mb-1">{file.name}</div>
                            <div className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Hazır</div>
                            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-red-600 text-sm font-bold mt-4 hover:underline">Dosyayı Kaldır</button>
                        </div>
                    ) : (
                        <>
                            <div className="text-gray-700 font-bold mb-1 text-lg">Dosyayı buraya sürükleyin</div>
                            <div className="text-sm text-gray-500">veya seçmek için tıklayın (PDF - Max 10MB)</div>
                            <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                        </>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-4">

                    {/* Template Selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <LayoutTemplate size={14} /> Hazır Şablonlar
                        </label>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {NOTE_TEMPLATES.map(template => (
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
                    <div className="flex-1 border border-gray-300 rounded-xl overflow-hidden bg-white flex flex-col shadow-sm">
                        <RichTextEditor
                            key={editorKey}
                            content={content}
                            onChange={setContent}
                            placeholder="Not içeriğini buraya yazın veya yukarıdan bir şablon seçin..."
                            className="border-none h-full"
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-100">
                <button onClick={() => setWizardStep(2)} className="text-gray-500 font-medium hover:text-gray-800">Geri Dön</button>
                <button
                    onClick={handleSave}
                    disabled={!title || (newResType === 'pdf' && !file) || (newResType === 'note' && !content) || saving}
                    className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {newResType === 'pdf' ? 'PDF Yükle' : 'Notu Kaydet'}
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout
            title="Kaynak Yönetimi"
            action={
                <button
                    onClick={() => setIsWizardOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors shadow-sm font-bold text-sm"
                >
                    <Plus size={18} /> Yeni Kaynak Ekle
                </button>
            }
        >
            {/* 1. LIST VIEW */}
            {!isWizardOpen && (
                <>
                    {/* Filter & Tabs */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveListTab('note')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeListTab === 'note' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <BookOpen size={16} /> Notlar
                            </button>
                            <button
                                onClick={() => setActiveListTab('pdf')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeListTab === 'pdf' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FileText size={16} /> PDF'ler
                            </button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                            <button onClick={() => setActiveGradeFilter('Tümü')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${activeGradeFilter === 'Tümü' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}>Tümü</button>
                            {GRADES.map(g => (
                                <button key={g.id} onClick={() => setActiveGradeFilter(g.name)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${activeGradeFilter === g.name ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}>{g.name}</button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
                        </div>
                    ) : (
                        /* Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredResources.map(res => (
                                <div key={res.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform ${res.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {res.type === 'pdf' ? <FileText size={24} /> : <BookOpen size={24} />}
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDelete(res.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wide">{res.grade}</span>
                                            <span className="text-gray-300 text-xs">•</span>
                                            <span className="text-[10px] font-medium text-gray-400 truncate max-w-[100px]">{res.unit}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors" title={res.title}>{res.title}</h3>
                                        {res.type === 'note' && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{res.content?.replace(/<[^>]+>/g, '')}</p>}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 mt-2">
                                        {res.type === 'pdf' ? <span className="font-medium bg-gray-50 px-2 py-1 rounded">{res.size}</span> : <span>HTML İçerik</span>}
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                {res.type === 'pdf' ? <Download size={14} /> : <ArrowRight size={14} />}
                                                {res.type === 'pdf' ? res.downloads : 'Oku'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredResources.length === 0 && (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    {resources.length === 0 ? 'Henüz kaynak eklenmemiş.' : 'Bu filtreye uygun kaynak bulunamadı.'}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* 2. WIZARD MODAL */}
            {isWizardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${wizardStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                <div className="w-8 h-0.5 bg-gray-200"></div>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${wizardStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                <div className="w-8 h-0.5 bg-gray-200"></div>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${wizardStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                            </div>
                            <button onClick={resetWizard} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={24} /></button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
                            {wizardStep === 1 && renderStep1Type()}
                            {wizardStep === 2 && renderStep2Hierarchy()}
                            {wizardStep === 3 && renderStep3Content()}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default NoteManager;
