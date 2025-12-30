
import React, { useRef, useEffect, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered,
  Subscript, Superscript,
  Undo, Redo, Eraser,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon,
  Highlighter, Palette, Quote,
  ChevronDown, X, Check
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder, className = "" }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentBlockType, setCurrentBlockType] = useState('P');

  // Active format states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);

  // Modal states
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  // Color picker states
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState('#000000');
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('#ffff00');

  // Predefined colors for quick selection
  const textColors = [
    '#000000', '#374151', '#dc2626', '#ea580c', '#ca8a04',
    '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777'
  ];

  const highlightColors = [
    '#fef08a', '#fde047', '#bef264', '#86efac', '#67e8f9',
    '#a5b4fc', '#c4b5fd', '#f9a8d4', '#fca5a5', '#fed7aa'
  ];

  // Sync content prop with innerHTML
  useEffect(() => {
    if (editorRef.current) {
      if (content !== editorRef.current.innerHTML) {
        const isEditorFocused = document.activeElement === editorRef.current;
        const isEmpty = editorRef.current.innerHTML === '' || editorRef.current.innerHTML === '<br>';

        if (!isEditorFocused || isEmpty) {
          editorRef.current.innerHTML = content;
        }
      }
    }
  }, [content]);

  // --- CORE LOGIC ---

  const updateFormatStates = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
    setIsStrikethrough(document.queryCommandState('strikeThrough'));
    setIsSuperscript(document.queryCommandState('superscript'));
    setIsSubscript(document.queryCommandState('subscript'));
  };

  const updateEditorState = () => {
    if (!editorRef.current) return;

    // 1. Notify Parent of content change
    const html = editorRef.current.innerHTML;
    if (html !== content) {
      onChange(html);
    }

    // 2. Update format states
    updateFormatStates();

    // 3. Detect Block Type at Cursor
    const selection = window.getSelection();
    if (selection && selection.anchorNode) {
      let node = selection.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeType === 1) {
          const tagName = (node as HTMLElement).tagName;
          if (['H2', 'H3', 'H4', 'P', 'BLOCKQUOTE', 'PRE', 'LI', 'DIV'].includes(tagName)) {
            setCurrentBlockType(tagName === 'DIV' ? 'P' : tagName);
            return;
          }
        }
        node = node.parentNode as Node;
      }
      setCurrentBlockType('P');
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand(command, false, value);
    updateEditorState();
  };

  // Toggle format - if already active, turn it off
  const toggleFormat = (command: string) => {
    execCommand(command);
  };

  const insertSymbol = (symbol: string) => {
    execCommand('insertText', symbol);
  };

  const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const val = e.target.value;
    execCommand('formatBlock', val);
    setCurrentBlockType(val);
  };

  // --- LINK HANDLING ---
  const handleLinkInsert = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setLinkText(selection.toString());
    }
    setShowLinkModal(true);
  };

  const insertLink = () => {
    if (!linkUrl) return;

    if (editorRef.current) editorRef.current.focus();

    if (linkText) {
      // Insert as HTML
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener">${linkText}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      document.execCommand('createLink', false, linkUrl);
    }

    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
    updateEditorState();
  };

  // --- IMAGE HANDLING ---
  const handleImageInsert = () => {
    setShowImageModal(true);
  };

  const insertImage = () => {
    if (!imageUrl) return;

    if (editorRef.current) editorRef.current.focus();

    const imgHtml = `<img src="${imageUrl}" alt="${imageAlt || 'Görsel'}" style="max-width: 100%; border-radius: 8px; margin: 8px 0;" />`;
    document.execCommand('insertHTML', false, imgHtml);

    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
    updateEditorState();
  };

  // --- COLOR HANDLING ---
  const applyTextColor = (color: string) => {
    setSelectedTextColor(color);
    execCommand('foreColor', color);
    setShowTextColorPicker(false);
  };

  const applyHighlight = (color: string) => {
    setSelectedHighlightColor(color);
    execCommand('hiliteColor', color);
    setShowHighlightPicker(false);
  };

  // --- COMPONENTS ---

  const ToolbarButton = ({ onClick, icon: Icon, title, active = false, className: btnClass = "" }: any) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${active ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-300' : 'text-gray-600'} ${btnClass}`}
    >
      <Icon size={18} />
    </button>
  );

  const SymbolButton = ({ symbol, title }: { symbol: string, title: string }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); insertSymbol(symbol); }}
      title={title}
      className="px-2 py-1 min-w-[32px] text-sm font-bold bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-700 transition-colors shadow-sm"
    >
      {symbol}
    </button>
  );

  // Color Picker Dropdown
  const ColorPickerDropdown = ({
    colors,
    onSelect,
    onClose,
    title
  }: {
    colors: string[],
    onSelect: (color: string) => void,
    onClose: () => void,
    title: string
  }) => (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50 w-48">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-600">{title}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            onMouseDown={(e) => { e.preventDefault(); onSelect(color); }}
            className="w-7 h-7 rounded border border-gray-200 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <label className="text-xs text-gray-500 flex items-center gap-2">
          Özel:
          <input
            type="color"
            className="w-8 h-6 cursor-pointer border-0"
            onChange={(e) => onSelect(e.target.value)}
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col bg-gray-50 border-b border-gray-200 select-none">

        {/* Top Row: Formatting & Styles */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200">
          {/* History */}
          <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <ToolbarButton onClick={() => execCommand('undo')} icon={Undo} title="Geri Al" />
            <ToolbarButton onClick={() => execCommand('redo')} icon={Redo} title="İleri Al" />
          </div>

          {/* Block Type Dropdown */}
          <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-2 pr-8 rounded text-sm font-semibold focus:outline-none focus:border-primary-500 cursor-pointer hover:bg-gray-50 shadow-sm w-36"
                onChange={handleBlockChange}
                value={currentBlockType}
                title="Metin Tipi"
              >
                <option value="P">Normal Metin</option>
                <option value="H2">Başlık 1 (Büyük)</option>
                <option value="H3">Başlık 2 (Orta)</option>
                <option value="H4">Başlık 3 (Küçük)</option>
                <option value="BLOCKQUOTE">Alıntı Bloğu</option>
                <option value="PRE">Kod Bloğu</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Basic Style - with active states */}
          <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <ToolbarButton onClick={() => toggleFormat('bold')} icon={Bold} title="Kalın (Ctrl+B)" active={isBold} />
            <ToolbarButton onClick={() => toggleFormat('italic')} icon={Italic} title="İtalik (Ctrl+I)" active={isItalic} />
            <ToolbarButton onClick={() => toggleFormat('underline')} icon={Underline} title="Altı Çizili (Ctrl+U)" active={isUnderline} />
            <ToolbarButton onClick={() => toggleFormat('strikeThrough')} icon={Strikethrough} title="Üstü Çizili" active={isStrikethrough} />
          </div>

          {/* Colors with Dropdown */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative">
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setShowTextColorPicker(!showTextColorPicker); setShowHighlightPicker(false); }}
                title="Yazı Rengi"
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors flex flex-col items-center"
              >
                <Palette size={16} />
                <div className="w-4 h-1 rounded-full mt-0.5" style={{ backgroundColor: selectedTextColor }}></div>
              </button>
              {showTextColorPicker && (
                <ColorPickerDropdown
                  colors={textColors}
                  onSelect={applyTextColor}
                  onClose={() => setShowTextColorPicker(false)}
                  title="Yazı Rengi"
                />
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setShowHighlightPicker(!showHighlightPicker); setShowTextColorPicker(false); }}
                title="Vurgu Rengi"
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors flex flex-col items-center"
              >
                <Highlighter size={16} />
                <div className="w-4 h-1 rounded-full mt-0.5" style={{ backgroundColor: selectedHighlightColor }}></div>
              </button>
              {showHighlightPicker && (
                <ColorPickerDropdown
                  colors={highlightColors}
                  onSelect={applyHighlight}
                  onClose={() => setShowHighlightPicker(false)}
                  title="Vurgu Rengi"
                />
              )}
            </div>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 ml-auto">
            <ToolbarButton onClick={() => execCommand('justifyLeft')} icon={AlignLeft} title="Sola Yasla" />
            <ToolbarButton onClick={() => execCommand('justifyCenter')} icon={AlignCenter} title="Ortala" />
            <ToolbarButton onClick={() => execCommand('justifyRight')} icon={AlignRight} title="Sağa Yasla" />
          </div>
        </div>

        {/* Bottom Row: Insert & Biology Tools */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100">
          {/* Lists */}
          <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
            <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Madde İşaretleri" />
            <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={ListOrdered} title="Numaralı Liste" />
          </div>

          {/* Sub/Super with TOGGLE indication */}
          <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1 bg-white rounded px-1 shadow-sm border border-gray-200">
            <ToolbarButton
              onClick={() => toggleFormat('subscript')}
              icon={Subscript}
              title={isSubscript ? "Alt Simge KAPALI" : "Alt Simge (H₂O)"}
              active={isSubscript}
              className="text-blue-600 hover:text-blue-700"
            />
            <ToolbarButton
              onClick={() => toggleFormat('superscript')}
              icon={Superscript}
              title={isSuperscript ? "Üst Simge KAPALI" : "Üst Simge (m²)"}
              active={isSuperscript}
              className="text-blue-600 hover:text-blue-700"
            />
          </div>

          {/* Biology Arrows */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
            <SymbolButton symbol="→" title="Sağ Ok (Ürünler)" />
            <SymbolButton symbol="←" title="Sol Ok" />
            <SymbolButton symbol="↔" title="Çift Yönlü" />
            <SymbolButton symbol="⇌" title="Denge (Tersinir)" />
            <SymbolButton symbol="∆" title="Delta (Isı/Değişim)" />
          </div>

          {/* Insert */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton onClick={handleLinkInsert} icon={LinkIcon} title="Link Ekle" />
            <ToolbarButton onClick={handleImageInsert} icon={ImageIcon} title="Görsel Ekle" />
            <ToolbarButton onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')} icon={Quote} title="Alıntı Bloğu" />
          </div>

          <div className="ml-auto">
            <ToolbarButton onClick={() => execCommand('removeFormat')} icon={Eraser} title="Biçimlendirmeyi Temizle" className="text-red-500 hover:bg-red-50" />
          </div>
        </div>

        {/* Active Format Indicator */}
        {(isSuperscript || isSubscript) && (
          <div className="bg-blue-50 border-t border-blue-200 px-3 py-1.5 text-xs text-blue-700 flex items-center justify-between">
            <span>
              <strong>{isSuperscript ? 'Üst Simge' : 'Alt Simge'}</strong> modu aktif.
              Normal yazıya dönmek için butona tekrar tıklayın veya <kbd className="bg-blue-100 px-1 rounded">→</kbd> ile ilerleyin.
            </span>
            <button
              onClick={() => {
                if (isSuperscript) execCommand('superscript');
                if (isSubscript) execCommand('subscript');
              }}
              className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold hover:bg-blue-700"
            >
              Normal Metne Dön
            </button>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        className="p-6 min-h-[250px] max-h-[600px] overflow-y-auto outline-none prose prose-slate max-w-none cursor-text bg-white"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={updateEditorState}
        onKeyUp={updateEditorState}
        onMouseUp={updateEditorState}
        onKeyDown={(e) => {
          // ESC key to exit sub/superscript mode
          if (e.key === 'Escape') {
            if (isSuperscript) execCommand('superscript');
            if (isSubscript) execCommand('subscript');
          }
        }}
        spellCheck={false}
        data-placeholder={placeholder}
        style={{ fontFamily: 'Inter, sans-serif' }}
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LinkIcon size={20} className="text-blue-500" />
              Link Ekle
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Metni</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Görünecek metin..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check size={16} /> Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[480px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-green-500" />
              Görsel Ekle
            </h3>
            <div className="space-y-4">
              {/* File Upload Area */}
              {!imageUrl && (
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                  <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Dosya seçmek için tıklayın</span>
                  <span className="block text-xs text-gray-400 mt-1">veya aşağıya URL girin</span>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl?.startsWith('data:') ? 'Yerel dosya yüklendi' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    disabled={imageUrl?.startsWith('data:')}
                  />
                  <label className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-green-700 transition-colors flex items-center gap-1 whitespace-nowrap">
                    <ImageIcon size={14} /> Dosya
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternatif Metin (Opsiyonel)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Görsel açıklaması..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              {/* Preview */}
              {imageUrl && (
                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Önizleme:</p>
                  <img
                    src={imageUrl}
                    alt={imageAlt || 'Önizleme'}
                    className="max-w-full max-h-32 rounded object-contain mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowImageModal(false); setImageUrl(''); setImageAlt(''); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={insertImage}
                disabled={!imageUrl}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check size={16} /> Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles for content and placeholder */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        /* Custom Prose Overrides for Editor */
        .prose h2 { margin-top: 0.8em; margin-bottom: 0.4em; font-size: 1.6em; color: #111827; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; border-bottom: 2px solid #f3f4f6; padding-bottom: 4px; }
        .prose h3 { margin-top: 0.8em; margin-bottom: 0.4em; font-size: 1.3em; color: #1f2937; font-weight: 700; }
        .prose h4 { margin-top: 0.8em; margin-bottom: 0.4em; font-size: 1.1em; color: #374151; font-weight: 600; text-decoration: underline; text-decoration-color: #e5e7eb; text-underline-offset: 4px; }
        .prose p { margin-bottom: 0.8em; line-height: 1.7; color: #374151; }
        .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.8em; }
        .prose ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.8em; }
        .prose li { margin-bottom: 0.3em; }
        .prose blockquote { border-left: 4px solid #3b82f6; background-color: #eff6ff; padding: 0.5em 1em; margin-bottom: 1em; font-style: italic; color: #1e40af; border-radius: 0 8px 8px 0; }
        .prose pre { background: #1e293b; color: #e2e8f0; padding: 1em; border-radius: 0.5em; font-family: monospace; overflow-x: auto; margin-bottom: 1em; }
        .prose a { color: #2563eb; text-decoration: underline; cursor: pointer; font-weight: 500; }
        .prose img { max-width: 100%; border-radius: 0.5em; margin: 1em 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .prose sup { font-size: 0.75em; vertical-align: super; }
        .prose sub { font-size: 0.75em; vertical-align: sub; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
