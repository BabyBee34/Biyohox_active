
import { Grade, Lesson, Unit, StudyResource, BlogPost } from './types';

export const GRADES: Grade[] = [
  { id: '9', name: '9. Sınıf', slug: '9-sinif', unitCount: 3, lessonCount: 24, color: 'bg-emerald-100 text-emerald-800' },
  { id: '10', name: '10. Sınıf', slug: '10-sinif', unitCount: 3, lessonCount: 28, color: 'bg-teal-100 text-teal-800' },
  { id: '11', name: '11. Sınıf', slug: '11-sinif', unitCount: 4, lessonCount: 32, color: 'bg-cyan-100 text-cyan-800' },
  { id: '12', name: '12. Sınıf', slug: '12-sinif', unitCount: 4, lessonCount: 30, color: 'bg-sky-100 text-sky-800' },
];

export const MOCK_UNITS: Unit[] = [
  {
    id: 'u1',
    gradeId: '9',
    title: 'Yaşam Bilimi Biyoloji',
    slug: 'yasam-bilimi',
    topics: [
      {
        id: 't1',
        title: 'Bilimsel Yöntem',
        lessons: [
          { id: 'l1', title: 'Bilim Nedir?', slug: 'bilim-nedir' },
          { id: 'l2', title: 'Bilimsel Çalışma Basamakları', slug: 'bilimsel-calisma' },
        ],
      },
      {
        id: 't2',
        title: 'Canlıların Ortak Özellikleri',
        lessons: [
          { id: 'l3', title: 'Hücresel Yapı', slug: 'hucresel-yapi' },
          { id: 'l4', title: 'Beslenme ve Solunum', slug: 'beslenme-solunum' },
        ],
      },
    ],
  },
  {
    id: 'u2',
    gradeId: '9',
    title: 'Hücre',
    slug: 'hucre',
    topics: [
      {
        id: 't3',
        title: 'Hücre Teorisi',
        lessons: [
          { id: 'l5', title: 'Hücrenin Tarihçesi', slug: 'hucre-tarihcesi' },
          { id: 'l6', title: 'Prokaryot ve Ökaryot', slug: 'prokaryot-okaryot' },
        ],
      },
      {
        id: 't4',
        title: 'Hücre Zarı',
        lessons: [
            { id: 'l7', title: 'Hücre Zarı Yapısı', slug: 'hucre-zari-yapisi' },
            { id: 'l8', title: 'Madde Geçişleri', slug: 'madde-gecisleri' },
        ]
      }
    ],
  },
];

export const MOCK_LESSON: Lesson = {
  id: 'l7',
  title: 'Hücre Zarı ve Yapısı',
  slug: 'hucre-zari-yapisi',
  gradeId: '9',
  unitId: 'u2',
  duration: 15,
  viewCount: 1250,
  description: 'Hücre zarının yapısı, akıcı mozaik zar modeli ve görevleri hakkında detaylı konu anlatımı.',
  blocks: [
    {
      id: 'b1',
      type: 'text',
      content: `
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Hücre Zarı Nedir?</h2>
        <p class="mb-4 text-gray-600 leading-relaxed">Hücre zarı, hücreyi dış ortamdan ayıran, canlı ve esnek bir yapıdır. Seçici geçirgen özelliği sayesinde hücrenin madde alışverişini kontrol eder. Hücre zarı, protein, yağ (lipit) ve karbonhidrat moleküllerinden oluşur.</p>
        <p class="mb-4 text-gray-600 leading-relaxed">Günümüzde geçerli olan zar modeli <strong>Akıcı Mozaik Zar Modeli</strong>dir. Bu modele göre yağ tabakası akıcı olup, proteinler bu tabaka içine gömülüdür veya yüzeyindedir.</p>
      `
    },
    {
      id: 'b2',
      type: 'image',
      data: {
        url: 'https://picsum.photos/800/400',
        caption: 'Şekil 1: Akıcı Mozaik Zar Modeli Temsili Gösterimi'
      }
    },
    {
      id: 'b3',
      type: 'text',
      content: `
        <h3 class="text-xl font-bold mb-3 text-gray-800">Zarın Görevleri</h3>
        <ul class="list-disc pl-5 mb-4 text-gray-600 space-y-2">
          <li>Hücreye şekil verir ve bütünlüğünü korur.</li>
          <li>Madde alışverişini düzenler (Seçici geçirgenlik).</li>
          <li>Hücrelerin birbirini tanımasını sağlar (Glikoproteinler sayesinde).</li>
        </ul>
      `
    },
    {
      id: 'b4',
      type: 'flashcard',
      data: {
        title: 'Öğrenme Kartları',
        cards: [
          { id: 'f1', front: 'Akıcı Mozaik Zar Modeli', back: 'Hücre zarının yapısını açıklayan güncel modeldir. Zarın dinamik ve hareketli olduğunu ifade eder.' },
          { id: 'f2', front: 'Seçici Geçirgenlik', back: 'Hücre zarının bazı maddelerin geçişine izin verip, bazılarına vermemesi özelliğidir.' },
          { id: 'f3', front: 'Glikoprotein', back: 'Hücre zarında bulunan, karbonhidrat ve proteinin birleşmesiyle oluşan, hücrenin kimlik kartı gibi davranan moleküldür.' },
        ]
      }
    },
    {
      id: 'b5',
      type: 'quiz',
      data: {
        title: 'Konu Testi',
        questions: [
          {
            id: 'q1',
            question: 'Hücre zarının yapısında en fazla bulunan organik bileşik hangisidir?',
            options: ['Karbonhidrat', 'Protein', 'Yağ (Lipit)', 'Nükleik Asit'],
            correctAnswer: 1,
            explanation: 'Hücre zarının kütlece en büyük kısmını proteinler oluşturur, ancak sayıca en çok fosfolipitler bulunur.'
          },
          {
            id: 'q2',
            question: 'Aşağıdakilerden hangisi hücre zarının görevlerinden değildir?',
            options: ['Madde alışverişini düzenlemek', 'Hücreye şekil vermek', 'ATP sentezlemek', 'Hücreleri birbirine tanıtmak'],
            correctAnswer: 2,
            explanation: 'ATP sentezi mitokondride (veya sitoplazmada) gerçekleşir, hücre zarının temel görevi değildir.'
          }
        ]
      }
    }
  ]
};

export const MOCK_RESOURCES: StudyResource[] = [
  // PDFs
  { id: '1', type: 'pdf', title: '9. Sınıf Tüm Ünite Özetleri', grade: '9. Sınıf', unit: 'Genel', size: '2.4 MB', downloads: 1450, date: '10 Oca 2024' },
  { id: '2', type: 'pdf', title: 'Hücre Organelleri Tablosu', grade: '9. Sınıf', unit: 'Hücre', size: '1.1 MB', downloads: 890, date: '15 Oca 2024' },
  { id: '3', type: 'pdf', title: 'Mitoz ve Mayoz Karşılaştırması', grade: '10. Sınıf', unit: 'Hücre Bölünmeleri', size: '0.8 MB', downloads: 2100, date: '20 Oca 2024' },
  { id: '4', type: 'pdf', title: 'Kalıtım Kavramları Sözlüğü', grade: '10. Sınıf', unit: 'Kalıtım', size: '3.5 MB', downloads: 560, date: '05 Şub 2024' },
  { id: '5', type: 'pdf', title: 'Dolaşım Sistemi Notları', grade: '11. Sınıf', unit: 'Sistemler', size: '4.2 MB', downloads: 1200, date: '12 Şub 2024' },
  // Notes
  { id: '6', type: 'note', title: 'Enzimlerin Çalışmasına Etki Eden Faktörler', grade: '9. Sınıf', unit: 'Yaşam Bilimi', topic: 'Canlıların Yapısındaki Bileşikler', content: '<p>Enzimlerin hızı sıcaklık, pH, substrat yüzeyi gibi faktörlerden etkilenir...</p>', views: 340, date: '18 Mar 2024' },
  { id: '7', type: 'note', title: 'Fotosentez Reaksiyonları Özeti', grade: '12. Sınıf', unit: 'Enerji Dönüşümleri', topic: 'Fotosentez', content: '<p>Işığa bağımlı ve ışıktan bağımsız reaksiyonlar kloroplastta gerçekleşir...</p>', views: 520, date: '20 Mar 2024' },
];

export const MOCK_POSTS: BlogPost[] = [
  { 
    id: '1', 
    title: 'Dinozorların DNA\'sı Bulunabilir mi?', 
    slug: 'dinozor-dna', 
    excerpt: 'Jurassic Park filmi gerçek olabilir mi? DNA molekülünün yarılanma ömrü ve fosilleşme süreci üzerine bilimsel bir bakış.',
    content: `
      <p class="lead">Jurassic Park filmini hepimiz izledik. Bir sivrisineğin emdiği dinozor kanından DNA elde edip dinozorları geri getirme fikri... Peki bu bilimsel olarak ne kadar mümkün?</p>
      
      <h2>DNA'nın Yarılanma Ömrü</h2>
      <p>Bilim insanları, DNA'nın oldukça kararlı bir molekül olmasına rağmen sonsuza kadar dayanmadığını keşfettiler. İdeal koşullarda bile (örneğin donmuş toprak altında), DNA bağlarının yarısının bozulması için geçen süre yaklaşık 521 yıldır.</p>
      
      <p>Bu hesaba göre:</p>
      <ul>
        <li>1.5 milyon yıl sonra DNA zincirleri tamamen okunamaz hale gelir.</li>
        <li>6.8 milyon yıl sonra ise DNA tamamen yok olur.</li>
      </ul>
      
      <h2>Dinozorlar Ne Zaman Yaşadı?</h2>
      <p>Dinozorların nesli yaklaşık 66 milyon yıl önce tükendi. Bu, DNA'nın dayanabileceği teorik sürenin yaklaşık 10 katıdır. Yani, ne yazık ki şu anki bilimsel bilgilerimize göre bir T-Rex'i kopyalamak için gereken genetik materyali bulmamız imkansız görünüyor.</p>
      
      <blockquote>"Fosilleşme sürecinde organik moleküller yerini minerallere bırakır. Bu da elimizde sadece taştan bir kopya kaldığı anlamına gelir, orijinal biyolojik materyal değil."</blockquote>
      
      <h3>Peki ya Kuşlar?</h3>
      <p>Dinozorları geri getiremesek de, onların yaşayan en yakın akrabaları olan kuşlar (özellikle tavuklar) üzerinde yapılan genetik çalışmalar, "Dino-Chicken" (Dinozor-Tavuk) projeleriyle atıl genleri uyandırmayı hedefliyor. Belki de bir gün, bir T-Rex değil ama ona çok benzeyen bir canlı görebiliriz!</p>
    `,
    image: 'https://picsum.photos/id/10/800/500', 
    tags: ['Evrim', 'DNA', 'Genetik', 'Paleontoloji'],
    readTime: 5,
    date: '12 Mart 2024'
  },
  { 
    id: '2', 
    title: 'Neden Uyuruz? Biyolojik Saat', 
    slug: 'neden-uyuruz', 
    excerpt: 'Uyku sadece dinlenmek midir? Beynimizin temizlenme süreci ve sirkadiyen ritmin biyolojimizdeki yeri.',
    content: `
      <p>Hayatımızın üçte birini uykuda geçiriyoruz. Evrimsel açıdan bakıldığında bu çok tehlikeli bir durum: Savunmasızsınız, avlanamıyorsunuz ve eş bulamıyorsunuz. Peki doğa neden bu kadar "pahalı" bir davranışı korudu?</p>
      
      <h2>Beynin Çöp Kamyonları: Glimfatik Sistem</h2>
      <p>Yakın zamanda yapılan keşifler, uykunun sadece dinlenmek için olmadığını gösterdi. Uyku sırasında beynimizdeki hücreler büzüşür ve beyin omurilik sıvısı (BOS) hücrelerin arasından hızla akarak gün boyunca biriken metabolik atıkları temizler.</p>
      <p>Bu atıklardan biri de Alzheimer hastalığıyla ilişkilendirilen <strong>beta-amiloid</strong> plaklarıdır.</p>
      
      <h2>Sirkadiyen Ritim</h2>
      <p>Vücudumuzun, Dünya'nın 24 saatlik döngüsüne uyum sağlayan bir iç saati vardır. Bu saat, suprakiazmatik çekirdek (SCN) tarafından yönetilir.</p>
      <ul>
        <li><strong>Sabah:</strong> Kortizol artar, uyanıklık başlar.</li>
        <li><strong>Akşam:</strong> Melatonin salgılanır, uykuya hazırlık başlar.</li>
      </ul>
      <p>Yapay ışıklar ve ekranlar bu ritmi bozarak modern çağın uyku sorunlarına yol açmaktadır.</p>
    `,
    image: 'https://picsum.photos/id/11/800/500', 
    tags: ['Beyin', 'Fizyoloji', 'Sağlık'],
    readTime: 4,
    date: '10 Mart 2024'
  },
  { 
    id: '3', 
    title: 'Mitokondrilerimiz Nereden Geldi?', 
    slug: 'mitokondri-kokeni', 
    excerpt: 'Endosimbiyotik teoriye göre hücremizin enerji santralleri aslında eski birer bakteri olabilir.',
    content: `
      <p>Hücremizin enerji santrali olan mitokondrinin, diğer organellerden çok farklı bir özelliği var: Kendine ait bir DNA'sı var!</p>
      
      <h2>Endosimbiyotik Teori</h2>
      <p>Lynn Margulis tarafından popülerleştirilen bu teoriye göre, milyarlarca yıl önce büyük bir ilkel hücre, oksijenli solunum yapabilen küçük bir bakteriyi "yedi" ancak sindirmedi. Bunun yerine, bu iki hücre simbiyotik (ortaklaşa) bir yaşam sürmeye başladı.</p>
      
      <h3>Kanıtlar Neler?</h3>
      <ol>
        <li>Mitokondri, bakteriler gibi halkasal DNA'ya sahiptir.</li>
        <li>Mitokondri, bakteriler gibi bölünerek çoğalır.</li>
        <li>Ribozom yapıları, ökaryotik hücre ribozomundan çok bakteriyel ribozoma benzer.</li>
        <li>İç zarı, bakteri zarına benzer özellikler taşır.</li>
      </ol>
      
      <p>Aynı durum bitkilerdeki kloroplastlar için de geçerlidir. Onlar da fotosentez yapan siyanobakterilerin hücre içine alınmasıyla oluşmuştur. Yani içimizde aslında milyarlarca yıl öncesinden gelen "misafirler" taşıyoruz!</p>
    `,
    image: 'https://picsum.photos/id/12/800/500', 
    tags: ['Hücre', 'Evrim', 'Bakteri'],
    readTime: 6,
    date: '08 Mart 2024'
  },
];
