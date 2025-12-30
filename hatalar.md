# BiyoHox Projesi - Tespit Edilen Fonksiyonel Hatalar ve Eksiklikler

Bu dosyada projede tespit edilen **fonksiyonel hatalar** ve **düzeltilmesi gereken sorunlar** listelenmiştir. 
**NOT:** Tasarımsal değişiklikler bu listede yer almamaktadır.

---

## 🔴 KRİTİK / YÜKSEK ÖNCELİKLİ HATALAR

### 1. Supabase Bağlantısı Yapılandırılmamış
**Dosya:** `lib/supabase.ts` (Satır 5-6)

**Sorun:** Supabase URL ve API Key değerleri placeholder olarak bırakılmış:
```typescript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

**Etki:** Gerçek veritabanı bağlantısı çalışmıyor. Uygulama tamamen mock data ile çalışıyor.

**Çözüm:** Gerçek Supabase proje bilgilerini `.env` dosyasından okuyacak şekilde yapılandır:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

---

### 2. Admin Paneli Güvenlik Açığı - Bypass Butonu
**Dosya:** `pages/AdminLogin.tsx` (Satır 121-127)

**Sorun:** "Demo Panelini Görüntüle" butonu, hiçbir kimlik doğrulaması yapmadan doğrudan admin dashboard'a yönlendiriyor:
```typescript
onClick={() => navigate('/admin/dashboard')}
```

**Etki:** Herkes admin paneline erişebilir, güvenlik riski oluşturuyor.

**Çözüm:** Production ortamında bu butonu kaldır veya gerçek authentication sistemi kurulduktan sonra devre dışı bırak.

---

### 3. Protected Route Yok - Admin Sayfaları Korumasız
**Dosya:** `App.tsx` (Satır 38-52)

**Sorun:** Admin route'ları için herhangi bir authentication kontrolü yapılmıyor. URL'den direkt erişim mümkün:
- `/admin/dashboard`
- `/admin/lessons`
- `/admin/notes`
- `/admin/posts`

**Etki:** Oturum açmadan admin sayfalarına doğrudan erişilebilir.

**Çözüm:** Protected Route wrapper component'i oluştur ve session kontrolü ekle:
```typescript
const ProtectedRoute = ({ children }) => {
  const session = useSession(); // veya supabase.auth.getSession()
  if (!session) return <Navigate to="/admin" />;
  return children;
};
```

---

### 4. Quiz Bileşeninde Yanlış Cevap İndeksi
**Dosya:** `constants.ts` (Satır 124)

**Sorun:** "Hücre zarının yapısında en fazla bulunan organik bileşik" sorusunun doğru cevabı "Yağ (Lipit)" olmalı (çünkü "sayıca en çok fosfolipitler bulunur" denmiş), ancak `correctAnswer: 1` olarak ayarlanmış (Protein).

**Etki:** Bilimsel olarak tutarsız soru-cevap. Öğrencilere yanlış bilgi verilebilir.

**Çözüm:** Açıklama veya doğru cevap indeksini düzelt. Eğer "kütlece en büyük kısım proteinler" doğruysa, açıklamayı netleştir.

---

## 🟠 ORTA ÖNCELİKLİ HATALAR

### 5. Footer Linkleri Çalışmıyor
**Dosya:** `components/Footer.tsx` (Satır 38-45, 52-58)

**Sorun:** Footer'daki "Keşfet" ve "Sınıflar" bölümlerindeki tüm linkler ana sayfaya (`/`) yönlendiriyor:
```typescript
<Link to="/" className="...">
  {item}
</Link>
```

**Etki:** Kullanıcı deneyimi bozuk, linkler işlevsiz.

**Çözüm:** Her link için doğru hedef URL'leri belirle:
- Dersler → `/dersler`
- Notlar & PDF → `/notlar`
- İlginç Bilgiler → `/ilgincler`
- 9. Sınıf → `/dersler/9-sinif`
- vb.

---

### 6. Navbar Arama Butonu İşlevsiz
**Dosya:** `components/Navbar.tsx` (Satır 65-67)

**Sorun:** Arama butonu sadece görsel olarak mevcut, tıklandığında hiçbir şey olmuyor:
```typescript
<button className="p-2.5 rounded-full text-slate-500...">
   <Search size={20} />
</button>
```

**Etki:** Kullanıcı arama yapamıyor.

**Çözüm:** Arama modal'ı veya arama sayfası yönlendirmesi ekle, ya da butonu geçici olarak kaldır.

---

### 7. Sosyal Medya Linkleri Placeholder
**Dosya:** `components/Footer.tsx` (Satır 27), `pages/Contact.tsx` (Satır 82-90)

**Sorun:** Tüm sosyal medya linkleri `href="#"` olarak ayarlanmış, gerçek URL'ler yok.

**Etki:** Kullanıcılar sosyal medya hesaplarına erişemiyor.

**Çözüm:** Gerçek sosyal medya URL'lerini ekle veya henüz yoksa bu bölümü geçici olarak gizle.

---

### 8. PDF İndirme İşlevi Yok
**Dosya:** `pages/Notes.tsx` (Satır 230-232)

**Sorun:** PDF kartlarındaki "Hemen İndir" butonu sadece görsel:
```typescript
<button className="w-full py-2.5 bg-slate-900...">
    <ArrowDownToLine size={14} /> Hemen İndir
</button>
```

**Etki:** Kullanıcılar PDF dosyalarını indiremez.

**Çözüm:** Tıklandığında `res.fileUrl` adresine yönlendir veya download attribute'unu kullan:
```typescript
<a href={res.fileUrl} download className="...">
```

---

### 9. Newsletter Abonelik Formu İşlevsiz
**Dosya:** `pages/InterestingFacts.tsx` (Satır 136-143)

**Sorun:** E-posta input'u ve "Abone Ol" butonu hiçbir işlev içermiyor, form submit edilemiyor.

**Etki:** Kullanıcılar bültene abone olamaz.

**Çözüm:** Form submit handler ekle ve backend entegrasyonu yap (Supabase veya üçüncü parti servis).

---

### 10. İletişim Formu Gönderilmiyor
**Dosya:** `pages/Contact.tsx` (Satır 108, 155-160)

**Sorun:** Form `onSubmit={(e) => e.preventDefault()}` ile varsayılan davranışı engelliyor ama başka bir işlem yapmıyor:
```typescript
<form onSubmit={(e) => e.preventDefault()} className="space-y-6">
```

**Etki:** Kullanıcılar mesaj gönderemiyor.

**Çözüm:** Form verisini Supabase'e veya email servisine gönderen bir handler ekle.

---

### 11. Reading Progress Bar Çalışmıyor
**Dosya:** `pages/PostDetail.tsx` (Satır 39-45)

**Sorun:** Okuma ilerleme çubuğu statik olarak `scaleX: 0` değerinde kalmaya ayarlanmış:
```typescript
style={{ scaleX: 0 }} // Placeholder for real scroll tracking implementation
```

**Etki:** İlerleme çubuğu her zaman boş görünüyor.

**Çözüm:** Scroll event listener ekleyerek gerçek ilerleme hesapla:
```typescript
const { scrollYProgress } = useScroll();
// ...
style={{ scaleX: scrollYProgress }}
```

---

### 12. Gizlilik ve Şartlar Sayfaları Yok
**Dosya:** `components/Footer.tsx` (Satır 80-81)

**Sorun:** Footer'da `/gizlilik` ve `/kullanim` linklerine tıklandığında 404 sayfası açılıyor çünkü bu route'lar tanımlı değil.

**Etki:** Yasal sayfalar eksik.

**Çözüm:** Bu sayfaları oluştur veya linkleri geçici olarak kaldır.

---

### 13. SSS Sayfası Yok
**Dosya:** `pages/Contact.tsx` (Satır 73)

**Sorun:** "SSS Sayfasına Git" linki `href="#"` olarak ayarlanmış:
```typescript
<a href="#" className="...">SSS Sayfasına Git</a>
```

**Etki:** SSS sayfası yok veya erişilemiyor.

**Çözüm:** SSS sayfası oluştur veya bu kartı geçici olarak kaldır.

---

### 14. Site Sağlığı Sayfası Placeholder
**Dosya:** `components/AdminLayout.tsx` (Satır 44)

**Sorun:** Admin sidebar'da "Site Sağlığı" menü öğesi var ama route tanımlı değil:
```typescript
{ path: '/admin/site-sagligi', icon: <Activity size={20} />, label: 'Site Sağlığı' },
```

**Etki:** Tıklandığında boş sayfa açılır.

**Çözüm:** Bu sayfayı implement et veya menüden geçici olarak kaldır.

---

### 15. Home'daki Blog Kartları Yanlış Yönlendirme
**Dosya:** `pages/Home.tsx` (Satır 142)

**Sorun:** Blog kartlarının tamamı `/ilgincler` genel sayfasına yönlendiriyor, tek tek post sayfalarına değil:
```typescript
<Link key={post.id} to={`/ilgincler`} className="...">
```

**Etki:** Kullanıcı hangi kartı tıklarsa tıklasın aynı sayfaya gidiyor.

**Çözüm:** Doğru URL'ye yönlendir:
```typescript
<Link key={post.id} to={`/ilgincler/${post.id}`} className="...">
```

---

## 🟡 DÜŞÜK ÖNCELİKLİ HATALAR / İYİLEŞTİRMELER

### 16. Ayarlar Sayfası Placeholder
**Dosya:** `App.tsx` (Satır 51)

**Sorun:** Ayarlar sayfası geçici bir div olarak bırakılmış:
```typescript
<Route path="/admin/settings" element={<div className="p-10 text-center...">Ayarlar Sayfası (Yakında)</div>} />
```

**Etki:** Admin ayarları yapılamıyor.

**Çözüm:** Gerekli ayarlar sayfasını implement et.

---

### 17. Dashboard Widget Butonları İşlevsiz
**Dosya:** `pages/AdminDashboard.tsx` (Satır 95, 103, 108)

**Sorun:** "Düzenle", "Ekle" ve "Tam Raporu Gör" butonları sadece görsel:
```typescript
<button className="...">Düzenle</button>
```

**Etki:** Site sağlığı uyarılarına müdahale edilemiyor.

**Çözüm:** İlgili sayfaya yönlendirme veya modal açma işlevi ekle.

---

### 18. LessonManager - Önizleme URL'si Hardcoded
**Dosya:** `pages/admin/LessonManager.tsx` (Satır 85)

**Sorun:** Önizleme butonu sabit bir URL kullanıyor:
```typescript
window.open(`#/dersler/9-sinif/hucre/${lesson.slug}`, '_blank')
```

**Etki:** Farklı sınıf ve ünitelerdeki dersler için önizleme yanlış çalışır.

**Çözüm:** Dinamik URL oluştur:
```typescript
window.open(`#/dersler/${grade.slug}/${unit.slug}/${lesson.slug}`, '_blank')
```

---

### 19. NoteManager - PDF Upload Gerçekleşmiyor
**Dosya:** `pages/admin/NoteManager.tsx` (Satır 362-380)

**Sorun:** PDF yükleme alanında dosya seçimi yapılabiliyor ancak gerçek upload işlemi yok. Sadece file state'e atanıyor.

**Etki:** PDF'ler sisteme yüklenmiyor, sadece local state'te tutuluyor.

**Çözüm:** Supabase Storage'a upload işlemi ekle:
```typescript
const { data, error } = await supabase.storage
  .from('pdfs')
  .upload(filename, file);
```

---

### 20. Blog Etiket Butonları İşlevsiz
**Dosya:** `pages/InterestingFacts.tsx` (Satır 116-119)

**Sorun:** "Popüler Etiketler" bölümündeki butonlar tıklandığında filtreleme yapmıyor.

**Etki:** Etiketlere göre yazı filtrelenemiyor.

**Çözüm:** Tıklama ile filtreleme state'i güncelleyecek handler ekle.

---

### 21. InterestingFacts Arama Çubuğu İşlevsiz
**Dosya:** `pages/InterestingFacts.tsx` (Satır 47-51)

**Sorun:** Arama input'u var ancak hiçbir filtreleme fonksiyonu bağlı değil.

**Etki:** Kullanıcı yazıları arayamıyor.

**Çözüm:** Arama state'i ve filtreleme mantığı ekle.

---

### 22. PostEditor - Kaydet Sadece Console.log Yapıyor
**Dosya:** `pages/admin/PostEditor.tsx` (Satır 54-58)

**Sorun:** Kaydet butonu veritabanına kaydetmiyor, sadece console'a yazıyor:
```typescript
const handleSave = () => {
    console.log({ title, slug, excerpt, content, imageUrl, tags, isPublished });
    alert('Yazı başarıyla kaydedildi!');
    navigate('/admin/posts');
};
```

**Etki:** Yazılar kalıcı olarak kaydedilmiyor.

**Çözüm:** Supabase insert/update işlemi ekle.

---

### 23. PostManager - Düzenleme Mock Data Kullanıyor
**Dosya:** `pages/admin/PostManager.tsx` (Satır 386)

**Sorun:** Düzenle butonuna tıklandığında gerçek post verisi yerine mock içerik yükleniyor:
```typescript
setContent('<p>Mock edit content...</p>');
```

**Etki:** Mevcut içerik düzenlenemiyor.

**Çözüm:** Gerçek post içeriğini yükle.

---

### 24. Lesson/Note/Post Ekleme - Kalıcı Kayıt Yok
**Dosya:** Tüm admin yönetim dosyaları

**Sorun:** Eklenen içerikler sadece React state'inde tutuluyor, sayfa yenilendiğinde kaybolur.

**Etki:** Tüm admin işlemleri geçici.

**Çözüm:** Supabase veritabanı tablolarını oluştur ve CRUD işlemlerini implement et.

---

### 25. Grade Verileri Statik - MOCK_UNITS Eksik
**Dosya:** `constants.ts`

**Sorun:** Sadece 9. sınıf için ünite ve ders verisi tanımlı. 10, 11, 12. sınıflar için veri yok.

**Etki:** Diğer sınıflar seçildiğinde boş içerik görünür.

**Çözüm:** Diğer sınıflar için de mock veri ekle veya veritabanından dinamik çek.

---

### 26. SessionStorage Uyarısı Kalıcı Değil
**Dosya:** `pages/Lessons.tsx` (Satır 17)

**Sorun:** Oturum bilgilendirme uyarısı her sayfa yüklemesinde tekrar görünüyor (`showSessionAlert: true`).

**Etki:** Kullanıcı her seferinde uyarıyı kapatmak zorunda.

**Çözüm:** LocalStorage kullanarak kullanıcının tercihini hatırla.

---

### 27. index.css Dosyası Eksik veya Boş
**Dosya:** `index.html` (Satır 146)

**Sorun:** `<link rel="stylesheet" href="/index.css">` referansı var ancak bu dosya proje dizininde görünmüyor.

**Etki:** Potansiyel 404 hatası veya eksik stiller.

**Çözüm:** Dosyanın var olduğunu kontrol et, yoksa kaldır veya oluştur.

---

### 28. Türkçe Karakter Encoding Sorunu Potansiyeli
**Dosya:** Genel

**Gözlem:** Dosyalarda Türkçe karakterler doğrudan kullanılmış. UTF-8 encoding doğru ayarlanmış olmasına rağmen, bazı ortamlarda sorun çıkabilir.

**Öneri:** Kritik yerlerde Unicode escape sequence kullanmayı düşün.

---

## 📋 ÖZET

| Kategori | Sayı |
|----------|------|
| 🔴 Kritik | 4 |
| 🟠 Orta | 11 |
| 🟡 Düşük | 13 |
| **TOPLAM** | **28** |

---

## ÖNCELİK SIRASI (Önerilen)

1. Supabase bağlantısını yapılandır
2. Admin authentication sistemini kur
3. Protected Routes ekle
4. Form işlevlerini aktifleştir (İletişim, Newsletter)
5. CRUD işlemlerini veritabanına bağla
6. Kırık linkleri düzelt
7. Placeholder sayfaları oluştur
