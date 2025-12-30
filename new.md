# BiyoHox - Geliştirme Talimatları

## TÜRKÇE VERSİYON

Merhaba! Sana lise öğrencileri için bir biyoloji eğitim platformu yapmanı istiyorum. Adı BiyoHox. Temel amacı: Öğrenciler buradan ders izleyebilecek, test çözebilecek, kaynaklara erişebilecek ve ilerlemelerini görebilecek.

### Teknoloji Tercihin

HTML, CSS ve JavaScript kullanabilirsin. Eğer daha modern bir yaklaşım istersen React kullan - TypeScript ile. Ben React + TypeScript öneriyorum çünkü proje büyüdükçe tip güvenliği işe yarar. Routing için react-router-dom kullan. Animasyonlar için framer-motion kütüphanesini ekle, ikonlar için lucide-react süper.

Stil tarafında TailwindCSS kullan. Modern ve hızlı. Alternatif olarak Vanilla CSS de olur ama Tailwind işi kolaylaştırır.

### Sayfalar ve İşleyiş

#### Halka Açık Kısım (Öğrencilerin Göreceği)

**Anasayfa:**
- En üstte bir navigasyon menüsü olsun: Anasayfa, Dersler, Notlar, İlginç Bilgiler, İletişim linkleri
- Ortada 4 tane kart: 9. Sınıf, 10. Sınıf, 11. Sınıf, 12. Sınıf. Kullanıcı bunlardan birine tıklayınca o sınıfın ders sayfasına gitsin.
- Bir de istatistik kısmı olsun: Toplam kaç ders var, kaç kaynak var gibi bilgiler
- En altta da son eklenen blog yazılarından 3 tanesinin küçük kartları

**Dersler Sayfası:**
İki mod var:
1. Eğer URL'de sınıf seçilmemişse (sadece /dersler), yine o 4 sınıf kartını göster
2. Eğer sınıf seçiliyse (örnek: /dersler/9-sinif), o sınıfa ait üniteleri göster

Üniteleri accordion yapısında göster. Yani kullanıcı bir üniteye tıklayınca altındaki konular açılsın. Her konunun altında o konuya ait dersler listelenir.

Her dersin yanında küçük bir ikon olsun - eğer kullanıcı o dersi daha önce bitirdiyse "✓ Tamamlandı" işareti göster. 

Bir de akıllı özellik: Eğer kullanıcı daha önce bir ders izlemişse, sayfanın üstünde "Son baktığınız ders: [ders adı]" diye bir hatırlatıcı banner göster. Bu banner'a tıklayınca direkt o derse gitsin.

**Ders İzleme Sayfası:**
URL şöyle olur: /dersler/9-sinif/hucre/hucre-zari

Bu sayfada:
- Sol tarafta küçük bir sidebar olsun, aynı ünitedeki diğer dersleri göstersin (hızlı geçiş için)
- Ortada ders içeriği: Burada **blok** mantığı var. Yani bir ders birden fazla bloktan oluşur:
  - Metin bloğu (zengin içerik: başlık, paragraf, kalın yazı, liste vs)
  - Video bloğu (YouTube embed)
  - Görsel bloğu (resim + açıklama)
  - Quiz bloğu (test soruları)
  - Flashcard bloğu (ezber kartları)
  - Uyarı kutusu (dikkat, önemli, bilgi gibi)
  
Her blok sırayla alt alta gösterilir.

Sayfanın en altında "Dersi Tamamla" butonu olsun. Kullanıcı buna tıklayınca:
1. Bu dersi tamamlandı olarak işaretle (tarayıcıda sessionStorage kullan)
2. Bir sonraki derse geçiş butonu çıksın

**Quiz Çözme Mantığı:**
Kullanıcı quiz bloğuna gelince:
- Sorular tek tek gösterilir
- 4 seçenek var
- Kullanıcı bir seçeneğe tıklayıp "Kontrol Et" butonuna basınca:
  - Doğru cevap yeşil renk olur
  - Yanlış seçtiyse kırmızı olur
  - Altında açıklama metni çıkar
- "Sonraki Soru" butonu ile ilerler
- En sonda toplam skor gösterilir ve "Tekrar Çöz" seçeneği sunulur

**Flashcard (Ezber Kartları):**
- Kart formatında gösterilir
- Karta tıklayınca döner (flip animasyonu)
- Ön yüzde kavram, arka yüzde açıklama var
- Sağ-sol okları ile kartlar arası geçiş yapılır

**Kaynaklar Sayfası (/notlar):**
Burada iki tip kaynak var:
1. Ders Notları (HTML içerik, sitede okunur)
2. PDF Dosyalar (indirilebilir)

Filtreleme sistemi:
- Üstte iki buton: "Notlar" ve "PDF'ler" - seçime göre liste değişir
- Sınıf filtreleri: 9, 10, 11, 12 ve Tümü
- Arama kutusu: Kullanıcı yazarken canlı filtreleme yapsın

Her kaynak bir kart şeklinde gösterilir: Başlık, ünite adı, sınıf bilgisi.

PDF için "İndir" butonu, Not için "Oku" butonu olsun.

**Blog Sayfası (/ilgincler):**
İlginç bilgiler, biyoloji haberler gibi şeyler.

Özellikler:
- Arama kutusu (başlık ve içerikte arama yapsın)
- Etiket butonları: Kullanıcı bir etikete tıklayınca o etiketteki yazıları göster
- Her yazı için kart: Kapak görseli, başlık, özet, okuma süresi
- Karta tıklayınca detay sayfasına git

**Blog Detay Sayfası (/ilgincler/:id):**
- Tam ekran yazı okuma
- Üstte küçük bir okuma ilerleme çubuğu olsun (kullanıcı aşağı kaydırdıkça dolsun)

**İletişim Sayfası (/iletisim):**
Basit bir form:
- Ad Soyad
- E-posta
- Konu
- Mesaj
- Gönder butonu

Gönder'e basınca "Mesajınız başarıyla gönderildi" diye bir uyarı göster. (Backend yok, sadece simülasyon)

#### Yönetim Paneli (Admin)

Bu kısım sadece site yöneticilerinin göreceği kısım.

**Admin Giriş (/admin):**
Basit bir giriş ekranı. (Şu an için sadece görsel, gerçek kimlik doğrulama gerekmiyor)

**Dashboard (/admin/dashboard):**
- Toplam ders sayısı, kullanıcı sayısı gibi istatistikler
- Hızlı işlem butonları: Yeni Ders Ekle, Yeni Yazı Ekle

**Ders Yönetimi (/admin/lessons):**
Tüm dersleri listele, tablo şeklinde.
Her satırda:
- Ders başlığı
- Sınıf
- Ünite
- Durum (Yayında mı?)
- İşlemler: Düzenle, Sil, Önizle

**Ders Oluşturma (/admin/lessons/new):**
Bu biraz karmaşık ama çok önemli. 

İlk adım: Sihirbaz (wizard)
1. Sınıf seç (9, 10, 11, 12)
2. Ünite seç (dropdown)
3. Konu seç (dropdown)
4. Ders başlığı yaz
5. "Editöre Başla" butonuna tıkla

Editör:
- Sol tarafta araç çubuğu: Blok ekleme butonları
  - Metin Ekle
  - Görsel Ekle
  - Video Ekle
  - Quiz Ekle
  - Flashcard Ekle
  - Uyarı Kutusu
  - Kod Bloğu
  - vs...

Kullanıcı bir butona tıkladığında ortada o blok oluşur. Her bloğun kendi ayar penceresi var:

**Metin Bloğu Editörü:**
- Zengin metin editörü (Rich Text)
- Araç çubuğu: Kalın, İtalik, Alt çizgi, Liste, Link ekle, Görsel ekle
- Renk değiştirme (metin rengi ve arka plan vurgusu)
- Üst simge / Alt simge (örnek: H₂O, m²)
- Biyoloji sembolleri: → (sağ ok), ↔ (çift yönlü), ∆ (delta)
- Başlık seviyeleri: Normal metin, Başlık 1, Başlık 2, Başlık 3

ÖNEMLI: Üst/alt simge tuşuna bir kez basınca aktif olsun, tekrar basınca kapansın. Aktifken ekranda "Üst simge modu açık" diye bir uyarı banner göster.

**Quiz Bloğu:**
"Quiz Ekle"ye basınca bir modal açılsın:
- Soru metni
- 4 seçenek (A, B, C, D)
- Doğru cevap işaretle
- Açıklama metni
- "Soru Ekle" butonu ile listeye ekle
- Birden fazla soru eklenebilir

**Flashcard Bloğu:**
Bir modal açılsın:
- Ön yüz (kavram)
- Arka yüz (açıklama)
- "Kart Ekle" butonu
- Birden fazla kart eklenebilir

**Görsel Bloğu:**
- Görsel URL'si gir
- Açıklama metni (opsiyonel)

**Video Bloğu:**
- YouTube URL'si gir
- Otomatik embed olsun

Editörde her blok:
- Yukarı/aşağı hareket ettirilebilir (sırasını değiştirebilme)
- Silinebilir
- Tıklandığında düzenlenebilir

Sağ üstte:
- Önizle butonu (ders nasıl görünecek göster)
- Kaydet butonu

**Kaynak Yönetimi (/admin/notes):**
Sihirbaz ile kaynak ekle:

1. Adım: Tür seç
   - Ders Notu (HTML içerik)
   - PDF Dosya

2. Adım: Konum seç
   - Sınıf
   - Ünite (dropdown, "Yeni Ünite Ekle" seçeneği de olsun)
   - Konu (dropdown, "Yeni Konu Ekle" seçeneği de olsun)

3. Adım: İçerik
   - Eğer Not seçildiyse:
     * Üstte hazır şablonlar: "Karşılaştırma Tablosu", "Terimler Sözlüğü", "Süreç Analizi" gibi
     * Şablona tıklandığında içerik otomatik dolsun
     * Aşağıda zengin metin editörü
   - Eğer PDF seçildiyse:
     * Dosya yükleme alanı
     * Dosya boyutunu göster

**Blog Yönetimi (/admin/posts):**
Yazıları listele, sil, düzenle.

Yeni yazı ekle:
- Başlık
- Özet
- İçerik (zengin metin editörü)
- Kapak görseli URL
- Etiketler (virgülle ayır)
- Okuma süresi (dakika)

Hazır şablonlar olsun:
- "Bilimsel Keşif" (yeni buluşları duyurmak için)
- "Biyografi" (bilim insanı hayat hikayesi)
- "Efsane vs Gerçek" (yanlış bilinen doğrular)

### Veri Yapısı

Verileri tarayıcıda tut (şimdilik). sessionStorage kullan.

**Tamamlanan Dersler:**
```
["ders-slug-1", "ders-slug-2", ...]
```

**Son Erişilen Ders:**
```
{
  "9-sinif": {
    "lessonSlug": "hucre-zari",
    "title": "Hücre Zarı",
    "timestamp": 1234567890
  }
}
```

Mock data olarak bir constants dosyası oluştur, içinde:
- Sınıflar listesi
- Her sınıf için üniteler
- Her ünite için konular ve dersler
- Kaynaklar listesi
- Blog yazıları listesi

### Gereksinimler
- Mobile uyumlu olmalı (responsive)
- Sayfa geçişlerinde yukarı scroll olsun
- Animasyonlar yumuşak olsun
- Tüm formlar boş bırakılamaz kontrolü yapsın

Başarılar!

---

## ENGLISH VERSION

Hey! I need you to build a biology learning platform for high school students. The name is BiyoHox. Main purpose: Students can watch lessons, solve quizzes, access resources, and track their progress.

### Tech Stack

You can use HTML, CSS, and JavaScript. If you want a more modern approach, use React - with TypeScript. I recommend React + TypeScript because type safety helps as the project grows. Use react-router-dom for routing. Add framer-motion for animations, lucide-react for icons.

For styling, use TailwindCSS. It's modern and fast. Vanilla CSS works too but Tailwind makes things easier.

### Pages and Flow

#### Public Section (What Students See)

**Home Page:**
- Navigation menu at top: Home, Lessons, Notes, Interesting Facts, Contact links
- Center: 4 cards for grades 9th, 10th, 11th, 12th. Clicking one goes to that grade's lessons
- Statistics section: Total lessons count, resources count, etc.
- Bottom: Small cards showing 3 latest blog posts

**Lessons Page:**
Two modes:
1. If no grade selected in URL (just /dersler), show those 4 grade cards
2. If grade selected (example: /dersler/9-sinif), show that grade's units

Display units as accordion. User clicks a unit, topics underneath expand. Each topic has its lessons listed.

Show a small icon next to each lesson - if user completed it before, show "✓ Completed" mark.

Smart feature: If user watched a lesson before, show a reminder banner at page top: "Your last lesson: [lesson name]". Clicking this goes directly to that lesson.

**Lesson Viewer Page:**
URL format: /dersler/9-sinif/hucre/hucre-zari

On this page:
- Left sidebar showing other lessons in same unit (for quick navigation)
- Center: lesson content with **block** system. A lesson consists of multiple blocks:
  - Text block (rich content: headings, paragraphs, bold, lists, etc.)
  - Video block (YouTube embed)
  - Image block (image + caption)
  - Quiz block (test questions)
  - Flashcard block (study cards)
  - Alert box (attention, important, info types)
  
Each block renders sequentially top to bottom.

Bottom of page has "Complete Lesson" button. When clicked:
1. Mark this lesson as completed (use sessionStorage)
2. Show "Next Lesson" button

**Quiz Solving Logic:**
When user reaches quiz block:
- Questions shown one at a time
- 4 options shown
- User clicks option and hits "Check Answer":
  - Correct answer turns green
  - Wrong choice turns red
  - Explanation text appears below
- "Next Question" button to proceed
- At end, show total score and "Retry" option

**Flashcards:**
- Shown in card format
- Click to flip (flip animation)
- Front has concept, back has explanation
- Left/right arrows to navigate between cards

**Resources Page (/notlar):**
Two resource types:
1. Study Notes (HTML content, read on site)
2. PDF Files (downloadable)

Filtering system:
- Top: Two buttons "Notes" and "PDFs" - list changes based on selection
- Grade filters: 9, 10, 11, 12, and All
- Search box: Live filtering as user types

Each resource is a card: Title, unit name, grade info.

PDF has "Download" button, Note has "Read" button.

**Blog Page (/ilgincler):**
Interesting facts, biology news, etc.

Features:
- Search box (search in titles and content)
- Tag buttons: Click a tag to filter posts
- Each post card: Cover image, title, excerpt, reading time
- Click card to go to detail page

**Blog Detail Page (/ilgincler/:id):**
- Full screen article reading
- Small reading progress bar at top (fills as user scrolls down)

**Contact Page (/iletisim):**
Simple form:
- Full Name
- Email
- Subject
- Message
- Submit button

On submit, show "Message sent successfully" alert. (No backend, just simulation)

#### Admin Panel

This section only site admins see.

**Admin Login (/admin):**
Simple login screen. (Just visual for now, no real authentication needed)

**Dashboard (/admin/dashboard):**
- Statistics: Total lessons, users, etc.
- Quick action buttons: Add New Lesson, Add New Post

**Lesson Management (/admin/lessons):**
List all lessons in table format.
Each row:
- Lesson title
- Grade
- Unit
- Status (Published?)
- Actions: Edit, Delete, Preview

**Lesson Builder (/admin/lessons/new):**
This is complex but very important.

First step: Wizard
1. Select grade (9, 10, 11, 12)
2. Select unit (dropdown)
3. Select topic (dropdown)
4. Enter lesson title
5. Click "Start Editor" button

Editor:
- Left toolbar: Block add buttons
  - Add Text
  - Add Image
  - Add Video
  - Add Quiz
  - Add Flashcard
  - Add Alert Box
  - Add Code Block
  - etc...

User clicks a button, that block appears in center. Each block has its own settings panel:

**Text Block Editor:**
- Rich text editor
- Toolbar: Bold, Italic, Underline, List, Add Link, Add Image
- Color change (text color and highlight)
- Superscript / Subscript (example: H₂O, m²)
- Biology symbols: → (right arrow), ↔ (bidirectional), ∆ (delta)
- Heading levels: Normal text, Heading 1, Heading 2, Heading 3

IMPORTANT: Press super/subscript button once to activate, press again to deactivate. While active, show warning banner "Superscript mode active".

**Quiz Block:**
Clicking "Add Quiz" opens modal:
- Question text
- 4 options (A, B, C, D)
- Mark correct answer
- Explanation text
- "Add Question" button to add to list
- Multiple questions can be added

**Flashcard Block:**
Opens modal:
- Front side (concept)
- Back side (explanation)
- "Add Card" button
- Multiple cards can be added

**Image Block:**
- Enter image URL
- Caption text (optional)

**Video Block:**
- Enter YouTube URL
- Auto embed

In editor, each block can be:
- Moved up/down (reordering)
- Deleted
- Clicked to edit

Top right:
- Preview button (show how lesson looks)
- Save button

**Resource Management (/admin/notes):**
Add resource with wizard:

1. Step: Select type
   - Study Note (HTML content)
   - PDF File

2. Step: Select location
   - Grade
   - Unit (dropdown, with "Add New Unit" option)
   - Topic (dropdown, with "Add New Topic" option)

3. Step: Content
   - If Note selected:
     * Top: Ready templates: "Comparison Table", "Terminology Glossary", "Process Analysis"
     * Click template to auto-fill content
     * Below: Rich text editor
   - If PDF selected:
     * File upload area
     * Show file size

**Blog Management (/admin/posts):**
List posts, delete, edit.

Add new post:
- Title
- Excerpt
- Content (rich text editor)
- Cover image URL
- Tags (comma separated)
- Reading time (minutes)

Ready templates:
- "Scientific Discovery" (announce new findings)
- "Biography" (scientist life story)
- "Myth vs Fact" (correct misconceptions)

### Data Structure

Store data in browser (for now). Use sessionStorage.

**Completed Lessons:**
```
["lesson-slug-1", "lesson-slug-2", ...]
```

**Last Accessed Lesson:**
```
{
  "9-sinif": {
    "lessonSlug": "hucre-zari",
    "title": "Cell Membrane",
    "timestamp": 1234567890
  }
}
```

Create constants file with mock data containing:
- Grades list
- Units for each grade
- Topics and lessons for each unit
- Resources list
- Blog posts list

### Requirements
- Must be mobile responsive
- Scroll to top on page transitions
- Smooth animations
- All forms validate for empty fields

Good luck!
