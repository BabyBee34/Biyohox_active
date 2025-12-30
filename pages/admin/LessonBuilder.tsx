
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, ArrowLeft, Plus, Type, Image as ImageIcon, HelpCircle, Layers,
  Trash2, ChevronUp, ChevronDown, Video, AlertTriangle, Eye, EyeOff,
  Settings, GripVertical, Quote, Minus, Columns, X, Table, List,
  Music, ChevronRight, FileText, Code, AlignJustify, ListOrdered, Check,
  LayoutTemplate, MousePointer2, Grid, Square, LayoutGrid, Zap, Globe, Heart, Bone, Network, FlaskConical, Microscope, ArrowRight, Dna, MousePointerClick, Leaf, Brain, Activity, CircleDashed, Thermometer
} from 'lucide-react';
import { GRADES } from '../../constants';
import { dbService } from '../../lib/supabase';
import { Unit } from '../../types';
import { LessonBlock, SubBlock, QuizQuestion, Flashcard } from '../../types';
import QuizComponent from '../../components/QuizComponent';
import FlashcardDeck from '../../components/FlashcardDeck';
import RichTextEditor from '../../components/RichTextEditor';

// --- RICH TEMPLATES DATA ---
const TEMPLATES = [
  {
    id: 'mitosis-detailed',
    name: 'Mitoz Bölünme: Evreler ve Kontrol',
    description: 'Hücre döngüsü, interfaz ve mitotik evrelerin görsel ağırlıklı, adım adım detaylı anlatımı.',
    icon: <CircleDashed size={18} />,
    blocks: [
      { id: 't1-1', type: 'callout', data: { type: 'info', title: 'Derse Hazırlık', text: 'Bu derse başlamadan önce "Hücre Teorisi" ve "DNA Yapısı" konularını hatırlamanız önerilir.' } },
      { id: 't1-2', type: 'text', content: '<h2 style="text-align: center;">Hücre Döngüsü ve Mitoz</h2><p>Hücre döngüsü, yeni bölünmüş bir hücrenin tekrar bölününceye kadar geçirdiği süreçtir. Temel olarak <strong>İnterfaz</strong> (Hazırlık) ve <strong>Mitotik Evre</strong> olmak üzere ikiye ayrılır.</p>' },
      {
        id: 't1-3',
        type: 'steps',
        data: {
          steps: [
            { title: 'G1 Evresi', description: 'Hücre büyür, organel sayısı artar, protein sentezi hızlanır.' },
            { title: 'S Evresi', description: 'DNA kendini eşler (Replikasyon). Kromatin iplikler kardeş kromatitli hale gelir.' },
            { title: 'G2 Evresi', description: 'Bölünme için son hazırlıklar yapılır, ATP sentezi devam eder.' },
            { title: 'M Evresi (Mitoz)', description: 'Çekirdek ve sitoplazma bölünmesi gerçekleşir.' }
          ]
        }
      },
      { id: 't1-4', type: 'video', data: { url: 'https://www.youtube.com/watch?v=f-ldPgEfAHI', title: 'Mitoz Bölünme Gerçek Mikroskop Görüntüsü' } },
      {
        id: 't1-5',
        type: 'split',
        data: {
          left: { type: 'image', data: { items: [{ url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=600&q=80', caption: 'Profaz ve Metafaz Evreleri Temsili' }], columns: 1 } },
          right: { type: 'text', content: '<h3>Kritik Evre: Metafaz</h3><p>Kromozomların en net görüldüğü evredir. Karyotip analizi bu evrede yapılır.</p><ul><li>Kromozomlar ekvatoral düzleme tek sıra dizilir.</li><li>İğ iplikleri kinetokorlara tam olarak tutunur.</li></ul>' }
        }
      },
      { id: 't1-6', type: 'callout', data: { type: 'warning', title: 'Mitoz Sonucu', text: 'Mitoz sonucunda kromozom sayısı ve genetik yapı değişmez. (2n -> 2n, n -> n)' } },
      {
        id: 't1-7',
        type: 'quiz',
        data: {
          title: 'Pekiştirme Sorusu',
          questions: [
            { question: 'Aşağıdaki olaylardan hangisi bitki hücresi sitokinezinde görülür?', options: ['Boğumlanma', 'Sentriyol eşlenmesi', 'Ara lamel oluşumu', 'İğ ipliği kısalması'], correctAnswer: 2, explanation: 'Bitki hücrelerinde hücre çeperi olduğu için boğumlanma olmaz, golgi etkinliği ile ara lamel (orta plak) oluşur.' },
            { question: 'DNA replikasyonu hücre döngüsünün hangi evresinde gerçekleşir?', options: ['Profaz', 'G1', 'S', 'Metafaz'], correctAnswer: 2, explanation: 'DNA eşlenmesi İnterfazın S (Sentez) evresinde olur.' }
          ]
        }
      }
    ]
  },
  {
    id: 'protein-synthesis-master',
    name: 'Protein Sentezi (Santral Doğma)',
    description: 'DNA\'dan RNA\'ya, oradan proteine giden süreci kod blokları ve süreç adımlarıyla anlatan teknik ders.',
    icon: <Dna size={18} />,
    blocks: [
      { id: 't2-1', type: 'text', content: '<h2>Genetik Şifreden Proteine: Santral Doğma</h2><p>DNA üzerindeki genetik bilginin kullanılarak ribozomlarda polipeptid zinciri sentezlenmesi sürecidir. <strong>DNA &rarr; mRNA &rarr; Protein</strong> yönünde işler.</p>' },
      {
        id: 't2-2',
        type: 'accordion',
        data: {
          title: '1. Transkripsiyon (Yazılma)',
          content: '<p>DNA\'nın anlamlı zincirinden mRNA sentezlenmesidir.</p><ul><li>Ökaryotlarda çekirdekte, mitokondride ve kloroplastta gerçekleşir.</li><li>Prokaryotlarda sitoplazmada gerçekleşir.</li><li>RNA Polimeraz enzimi görev alır.</li></ul>'
        }
      },
      {
        id: 't2-3',
        type: 'accordion',
        data: {
          title: '2. Translasyon (Okunma)',
          content: '<p>mRNA şifresine uygun amino asitlerin ribozomda peptit bağlarıyla birleşmesidir.</p><ul><li>Ribozomda gerçekleşir.</li><li>tRNA\'lar amino asitleri taşır.</li><li>ATP ve GTP harcanır.</li></ul>'
        }
      },
      { id: 't2-4', type: 'callout', data: { type: 'error', title: 'Önemli Kural', text: 'Her zaman; Kodon Sayısı = Amino Asit Sayısı + 1 (Stop kodonu amino asit şifrelemez!)' } },
      {
        id: 't2-5',
        type: 'code',
        data: {
          language: 'python',
          code: '# Biyoenformatik Örneği: DNA\'dan mRNA Üretimi\n\ndef transkripsiyon(dna_zinciri):\n    # Timin yerine Uracil gelir\n    mrna = dna_zinciri.replace("T", "U")\n    return mrna\n\ndna = "TAC-GGG-CCC-ATT"\nmrna = transkripsiyon(dna)\nprint(f"DNA: {dna}")\nprint(f"mRNA: {mrna}") # Çıktı: UAC-GGG-CCC-AUU'
        }
      },
      { id: 't2-6', type: 'image', data: { items: [{ url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80', caption: 'Ribozomda Protein Sentezi Temsili' }], columns: 1 } },
      { id: 't2-7', type: 'flashcard', data: { title: 'Terimler', cards: [{ front: 'Kodon', back: 'mRNA üzerindeki 3\'lü nükleotit dizisi.' }, { front: 'Antikodon', back: 'tRNA üzerindeki, kodona karşılık gelen 3\'lü dizi.' }, { front: 'Polizom', back: 'Bir mRNA\'nın birden fazla ribozom tarafından aynı anda okunması.' }] } }
    ]
  },
  {
    id: 'photosynthesis-compare',
    name: 'Fotosentez: Işıklı ve Işıksız Evre',
    description: 'Fotosentez reaksiyonlarını karşılaştırmalı tablolar ve denklemlerle inceleyen akademik ders.',
    icon: <Leaf size={18} />,
    blocks: [
      { id: 't3-1', type: 'quote', data: { text: 'Hayat, güneş ışığının yaprağa düşmesiyle başlar.', author: 'Biyoloji Özdeyişi' } },
      { id: 't3-2', type: 'text', content: '<h3>Fotosentez Genel Denklemi</h3><p style="text-align: center; font-size: 1.2em;"><strong>6CO₂ + 12H₂O + Işık &rarr; C₆H₁₂O₆ + 6O₂ + 6H₂O</strong></p><p>Fotosentez, kloroplastın farklı bölgelerinde gerçekleşen birbirine bağımlı iki ana evreden oluşur.</p>' },
      {
        id: 't3-3',
        type: 'table',
        data: {
          headers: ['Karşılaştırma', 'Işığa Bağımlı Evre', 'Işıktan Bağımsız Evre (Calvin)'],
          rows: [
            ['Gerçekleştiği Yer', 'Granum (Tilakoit Zar)', 'Stroma (Sıvı Kısım)'],
            ['Işık İhtiyacı', 'Doğrudan kullanılır (Zorunlu)', 'Doğrudan kullanılmaz (ATP yeterli)'],
            ['Üretilenler', 'ATP, NADPH, O₂', 'Glikoz, Amino asit, Vitamin'],
            ['Tüketilenler', 'H₂O, NADP+, ADP, Pi', 'CO₂, ATP, NADPH']
          ]
        }
      },
      {
        id: 't3-4',
        type: 'split',
        data: {
          left: { type: 'callout', data: { type: 'warning', title: 'Elektron Kaynağı', text: 'Bitkilerde hidrojen ve elektron kaynağı H₂O\'dur. Bu yüzden yan ürün olarak O₂ çıkar.' } },
          right: { type: 'callout', data: { type: 'info', title: 'Kükürt Bakterileri', text: 'H₂S kullanan bakterilerde yan ürün olarak Oksijen değil, Kükürt (S) çıkar.' } }
        }
      },
      { id: 't3-5', type: 'image', data: { items: [{ url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80', caption: 'Kloroplast Yapısı ve Tilakoitler' }], columns: 1 } },
      { id: 't3-6', type: 'quiz', data: { title: 'Konu Testi', questions: [{ question: 'Fotosentezde atmosferik oksijenin kaynağı nedir?', options: ['Karbondioksit', 'Su', 'Glikoz', 'ATP'], correctAnswer: 1, explanation: 'Suyun fotolizi (ışıkla parçalanması) sonucu oksijen açığa çıkar ve atmosfere verilir.' }] } }
    ]
  },
  {
    id: 'mendel-genetics',
    name: 'Mendel Genetiği ve Çaprazlamalar',
    description: 'Punnett karesi kullanımı, monohibrit ve dihibrit çaprazlamalar için problem çözümlü şablon.',
    icon: <Network size={18} />,
    blocks: [
      { id: 't4-1', type: 'text', content: '<h2>Kalıtımın Temel İlkeleri</h2><p>Gregor Mendel, bezelyelerle yaptığı çalışmalarla Genetiğin babası sayılır. Kalıtım materyalinin parça parça (genler halinde) aktarıldığını keşfetmiştir.</p>' },
      { id: 't4-2', type: 'flashcard', data: { title: 'Temel Kavramlar', cards: [{ front: 'Homozigot', back: 'Alel genlerin aynı olması durumu (AA, aa).' }, { front: 'Heterozigot', back: 'Alel genlerin farklı olması durumu (Aa).' }, { front: 'Fenotip', back: 'Genotip ve çevrenin etkisiyle ortaya çıkan dış görünüş.' }, { front: 'Genotip', back: 'Canlının sahip olduğu genlerin tamamı.' }] } },
      { id: 't4-3', type: 'text', content: '<h3>Örnek Problem: Monohibrit Çaprazlama</h3><p>Heterozigot sarı tohumlu iki bezelyenin (Ss x Ss) çaprazlanması sonucu oluşacak genotip ve fenotip oranlarını bulunuz. (Sarı > Yeşil)</p>' },
      {
        id: 't4-4',
        type: 'table',
        data: {
          headers: ['Gameter', 'S (Sarı)', 's (Yeşil)'],
          rows: [
            ['S (Sarı)', 'SS (Homozigot Sarı)', 'Ss (Heterozigot Sarı)'],
            ['s (Yeşil)', 'Ss (Heterozigot Sarı)', 'ss (Homozigot Yeşil)']
          ]
        }
      },
      {
        id: 't4-5',
        type: 'list',
        data: {
          style: 'bullet',
          items: [
            'Genotip Oranı: 1 SS : 2 Ss : 1 ss (1:2:1)',
            'Fenotip Oranı: 3 Sarı : 1 Yeşil (3:1)',
            'Yeşil tohumlu olma ihtimali: %25'
          ]
        }
      },
      { id: 't4-6', type: 'callout', data: { type: 'info', title: 'Bağımsız Dağılım Yasası', text: 'Farklı karakterlerin genleri gametlere birbirlerinden bağımsız olarak dağılır (Bağlı genler hariç).' } }
    ]
  },
  {
    id: 'enzymes-detailed',
    name: 'Enzimler: Biyolojik Katalizörler',
    description: 'Enzimlerin yapısı, çalışma mekanizması ve hıza etki eden faktörler.',
    icon: <FlaskConical size={18} />,
    blocks: [
      { id: 't5-1', type: 'text', content: '<h2>Enzim Nedir?</h2><p>Aktivasyon enerjisini düşürerek reaksiyonları hızlandıran biyolojik katalizörlerdir. Reaksiyondan değişmeden çıkarlar.</p>' },
      { id: 't5-2', type: 'image', data: { items: [{ url: 'https://cdn.kastatic.org/ka-perseus-images/158b022b700236056d957302227653702552697d.png', caption: 'Anahtar-Kilit Modeli: Enzim ve Substrat Uyumu' }], columns: 1 } },
      {
        id: 't5-3',
        type: 'accordion',
        data: {
          title: 'Sıcaklık Etkisi',
          content: '<p>Enzimler protein yapılıdır. 0°C\'de çalışmazlar (yapı bozulmaz). Yüksek sıcaklıkta (55°C+) denatüre olurlar yani yapıları bozulur ve bir daha çalışmazlar. Optimum sıcaklık genellikle 37°C\'dir.</p>'
        }
      },
      {
        id: 't5-4',
        type: 'accordion',
        data: {
          title: 'pH Etkisi',
          content: '<p>Her enzimin en iyi çalıştığı bir pH aralığı vardır. Örneğin Pepsin (mide) asidik ortamda, Tripsen (bağırsak) bazik ortamda çalışır.</p>'
        }
      },
      {
        id: 't5-5',
        type: 'accordion',
        data: {
          title: 'Substrat Yüzeyi',
          content: '<p>Enzimler substrata dış yüzeyinden etki eder. Substrat yüzeyi arttıkça reaksiyon hızı artar. (Kıyma et, parça etten daha çabuk sindirilir.)</p>'
        }
      },
      { id: 't5-6', type: 'callout', data: { type: 'warning', title: 'İnhibitör Madde', text: 'Enzimlerin çalışmasını durduran maddelerdir. Siyanür, kurşun, cıva gibi ağır metaller örnektir.' } },
      { id: 't5-7', type: 'quiz', data: { title: 'Enzim Testi', questions: [{ question: 'Aşağıdakilerden hangisi enzimlerin özelliklerinden değildir?', options: ['Tekrar tekrar kullanılabilirler', 'Tepkimeyi başlatırlar', 'Aktivasyon enerjisini düşürürler', 'Genellikle protein yapılıdırlar'], correctAnswer: 1, explanation: 'Enzimler tepkimeyi BAŞLATMAZ, başlamış tepkimeyi hızlandırır. Tepkimeyi aktivasyon enerjisi başlatır.' }] } }
    ]
  },
  {
    id: 'digestive-system',
    name: 'İnsanda Sindirim Sistemi Anatomisi',
    description: 'Sindirim kanalı organları, yardımcı organlar ve besinlerin kimyasal sindirim haritası.',
    icon: <Activity size={18} />,
    blocks: [
      { id: 't6-1', type: 'text', content: '<h2>Sindirim Kanalı Yolculuğu</h2><p>Besinlerin vücuda alınıp, hücre zarından geçebilecek boyuta kadar parçalanması sürecidir.</p>' },
      {
        id: 't6-2',
        type: 'steps',
        data: {
          steps: [
            { title: 'Ağız', description: 'Mekanik sindirim (dişler) ve Karbonhidratların kimyasal sindirimi (Amilaz) başlar.' },
            { title: 'Yutak & Yemek Borusu', description: 'Sindirim olmaz. Peristaltik hareketlerle besin mideye iletilir.' },
            { title: 'Mide', description: 'Proteinlerin kimyasal sindirimi başlar (Pepsin). Güçlü asidik ortam (HCl).' },
            { title: 'İnce Bağırsak', description: 'Yağların sindirimi başlar. Tüm besinlerin sindirimi biter. Emilimin çoğu burada olur.' },
            { title: 'Kalın Bağırsak', description: 'Sindirim olmaz. Su, mineral ve vitamin (B, K) emilimi gerçekleşir.' }
          ]
        }
      },
      { id: 't6-3', type: 'callout', data: { type: 'warning', title: 'Karaciğer ve Safra', text: 'Karaciğer sindirim enzimi üretmez! Ürettiği SAFRA sıvısı, yağları mekanik olarak parçalar (Fiziksel sindirim).' } },
      {
        id: 't6-4',
        type: 'table',
        data: {
          headers: ['Besin Grubu', 'Kimyasal Sindirim Başlangıcı', 'Bitiş Yeri', 'Etkili Enzimler'],
          rows: [
            ['Karbonhidrat', 'Ağız', 'İnce Bağırsak', 'Amilaz, Maltaz, Sükraz'],
            ['Protein', 'Mide', 'İnce Bağırsak', 'Pepsin, Tripsen, Erepsin'],
            ['Yağ', 'İnce Bağırsak', 'İnce Bağırsak', 'Lipaz']
          ]
        }
      },
      { id: 't6-5', type: 'video', data: { url: 'https://www.youtube.com/watch?v=Og5xAdC8EUI', title: 'Sindirim Sistemi Animasyonu' } }
    ]
  },
  {
    id: 'taxonomy-classification',
    name: 'Sınıflandırma ve Canlı Alemleri',
    description: 'Taksonomi basamakları, ikili adlandırma ve 6 canlı aleminin genel özellikleri.',
    icon: <Globe size={18} />,
    blocks: [
      { id: 't7-1', type: 'text', content: '<h2>Taksonomi (Sınıflandırma)</h2><p>Canlıların benzerlik ve akrabalık derecelerine göre gruplandırılmasıdır. Günümüzde <strong>Filogenetik (Doğal)</strong> sınıflandırma kullanılır.</p>' },
      {
        id: 't7-2',
        type: 'list',
        data: {
          style: 'ordered',
          items: [
            'Alem (Kingdom) - En Genel',
            'Şube (Phylum)',
            'Sınıf (Class)',
            'Takım (Order)',
            'Aile (Family)',
            'Cins (Genus)',
            'Tür (Species) - En Özel'
          ]
        }
      },
      { id: 't7-3', type: 'callout', data: { type: 'info', title: 'Ezber Kodu', text: 'Türkiye Cumhuriyeti Futbol Takımı Sahada Şut Attı (Tür -> Alem sırasıyla)' } },
      {
        id: 't7-4',
        type: 'split',
        data: {
          left: { type: 'text', content: '<h3>Binomial (İkili) Adlandırma</h3><p>Carl Linnaeus tarafından geliştirilmiştir.</p><p><i>Pinus nigra</i> (Kara Çam)</p><ul><li><i>Pinus</i>: Cins adı (Büyük harfle başlar)</li><li><i>nigra</i>: Tanımlayıcı ad (Küçük harfle başlar)</li></ul>' },
          right: { type: 'callout', data: { type: 'warning', title: 'Akrabalık', text: 'İki canlının akraba olduğunu anlamak için CİNS adlarına bakılır. Tanımlayıcı adın benzerliği akrabalık göstermez.' } }
        }
      },
      { id: 't7-5', type: 'flashcard', data: { title: 'Canlı Alemleri', cards: [{ front: 'Prokaryot Alemler', back: 'Bakteriler ve Arkeler' }, { front: 'Protista', back: 'Ökaryotik, genellikle tek hücreli (Amip, Öglena, Algler).' }, { front: 'Fungi (Mantarlar)', back: 'Heterotrof, kitin çeperli, depo karbonhidratı glikojen.' }] } }
    ]
  },
  {
    id: 'lab-safety-rules',
    name: 'Laboratuvar Güvenliği ve Semboller',
    description: 'Laboratuvar kuralları, tehlike işaretleri ve acil durum prosedürleri.',
    icon: <FlaskConical size={18} />,
    blocks: [
      { id: 't8-1', type: 'callout', data: { type: 'error', title: 'Önce Güvenlik!', text: 'Laboratuvara asla öğretmensiz girmeyin. Yiyecek ve içecek sokmak kesinlikle yasaktır.' } },
      {
        id: 't8-2',
        type: 'table',
        data: {
          headers: ['Sembol Rengi', 'Anlamı', 'Örnek'],
          rows: [
            ['Kırmızı', 'Yanıcı Madde', 'Alkol, Aseton'],
            ['Sarı', 'Oksitleyici / Reaktif', 'Potasyum, Sodyum'],
            ['Mavi', 'Sağlığa Zararlı / Zehirli', 'Cıva, Klor'],
            ['Beyaz', 'Korozif / Aşındırıcı', 'Asitler, Bazlar']
          ]
        }
      },
      { id: 't8-3', type: 'image', data: { items: [{ url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', caption: 'Laboratuvar Malzemeleri: Beher, Erlenmayer, Mezür' }], columns: 1 } },
      {
        id: 't8-4',
        type: 'steps',
        data: {
          steps: [
            { title: 'Kıyafet', description: 'Önlük giyin, uzun saçları toplayın, kapalı ayakkabı tercih edin.' },
            { title: 'Kimyasal Teması', description: 'Asit dökülürse bol su ile yıkayın. Asla asidin üzerine su dökmeyin!' },
            { title: 'Kırık Cam', description: 'Kırık camları asla elinizle toplamayın, faraş ve süpürge kullanın.' }
          ]
        }
      },
      { id: 't8-5', type: 'accordion', data: { title: 'Acil Durum Numaraları', content: '<p>Okul Yönetimi: 1111<br>Ambulans: 112<br>İtfaiye: 110<br>Zehir Danışma: 114</p>' } }
    ]
  },
  {
    id: 'nervous-system-neuron',
    name: 'Sinir Sistemi: Nöron Yapısı',
    description: 'Sinir sisteminin yapı taşı nöronlar, impuls oluşumu ve iletimi.',
    icon: <Brain size={18} />,
    blocks: [
      { id: 't9-1', type: 'text', content: '<h2>Nöron (Sinir Hücresi)</h2><p>Sinir sistemi, uyartıları alan, ileten ve cevap oluşturan nöronlardan ve onlara destek olan glia hücrelerinden oluşur.</p>' },
      { id: 't9-2', type: 'image', data: { items: [{ url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80', caption: 'Nöron Ağları ve Sinapslar' }], columns: 1 } },
      {
        id: 't9-3',
        type: 'steps',
        data: {
          steps: [
            { title: 'Dendrit', description: 'Hücre gövdesinden çıkan, uyarıları alan kısa ve çok sayıdaki uzantılardır.' },
            { title: 'Hücre Gövdesi', description: 'Çekirdek, mitokondri ve nissl taneciklerinin bulunduğu merkezdir.' },
            { title: 'Akson', description: 'Uyartıyı diğer hücreye veya efektör organa ileten uzun uzantıdır.' },
            { title: 'Sinaps', description: 'İki nöron arasındaki kimyasal iletişim bölgesi.' }
          ]
        }
      },
      {
        id: 't9-4',
        type: 'split',
        data: {
          left: { type: 'callout', data: { type: 'info', title: 'Miyelin Kılıf', text: 'Bazı aksonların etrafını saran yağlı tabakadır. İzolasyon sağlayarak impuls hızını 10 kat artırır.' } },
          right: { type: 'callout', data: { type: 'warning', title: 'Ranvier Boğumu', text: 'Miyelin kılıfın kesintiye uğradığı yerlerdir. İmpuls buralarda sıçrayarak ilerler.' } }
        }
      },
      { id: 't9-5', type: 'quiz', data: { title: 'Sinir Sistemi Testi', questions: [{ question: 'Bir nöronda impuls iletim yönü nasıldır?', options: ['Aksondan dendrite', 'Dendritten aksona', 'Hücre gövdesinden dendrite', 'Sinapstan aksona'], correctAnswer: 1, explanation: 'Nöron içinde iletim Dendrit -> Hücre Gövdesi -> Akson şeklindedir.' }] } }
    ]
  },
  {
    id: 'tyt-quick-review-bio',
    name: 'TYT Biyoloji: Hızlı Tekrar Kartları',
    description: 'Sınav öncesi son kontroller için, tüm TYT konularını kapsayan özet kartlar ve kritik bilgiler.',
    icon: <Zap size={18} />,
    blocks: [
      { id: 't10-1', type: 'text', content: '<h2 style="text-align: center;">Sınav Öncesi Son Bakış</h2><p style="text-align: center;">TYT Biyoloji konularından en çok karıştırılan ve unutulan noktaları hızlıca tekrar edelim.</p>' },
      {
        id: 't10-2',
        type: 'flashcard',
        data: {
          title: 'Canlıların Ortak Özellikleri & Hücre',
          cards: [
            { front: 'Homeostazi', back: 'Canlıların değişen çevre şartlarına rağmen iç dengelerini kararlı tutmasıdır.' },
            { front: 'Bazal Metabolizma', back: 'Tam dinlenme halindeki (yemekten 12 saat sonra, uyanık, oda sıcaklığı) metabolizma hızıdır.' },
            { front: 'Pasif Taşıma', back: 'ATP harcanmaz. Çok yoğun -> Az yoğun. (Difüzyon, Osmoz).' },
            { front: 'Aktif Taşıma', back: 'ATP harcanır. Az yoğun -> Çok yoğun. Enzim ve taşıyıcı protein kullanılır.' }
          ]
        }
      },
      { id: 't10-3', type: 'divider' },
      {
        id: 't10-4',
        type: 'flashcard',
        data: {
          title: 'Sınıflandırma & Ekoloji',
          cards: [
            { front: 'Arkeler', back: 'Ekstrem koşullarda yaşarlar. Prokaryotturlar ancak DNA\'larında histon proteini bulunur (Ökaryot benzerliği).' },
            { front: 'Virüsler', back: 'Hücresel yapıları yoktur. Antibiyotikten etkilenmezler. Zorunlu hücre içi parazittirler.' },
            { front: 'Saprofitler', back: 'Madde döngüsündeki en kilit canlılardır. Organik atıkları inorganik maddeye çevirirler.' }
          ]
        }
      },
      { id: 't10-5', type: 'callout', data: { type: 'warning', title: 'Sınav Taktikleri', text: 'Grafik sorularında "Birim zamandaki miktar" ile "Toplam miktar" ifadelerine çok dikkat et!' } },
      {
        id: 't10-6',
        type: 'quiz',
        data: {
          title: 'Çıkması Muhtemel Soru Tipleri',
          questions: [
            { question: 'Aşağıdakilerden hangisi inorganik bileşiklerin (su, mineral) ortak özelliğidir?', options: ['Sindirilmeden kana geçerler', 'Enerji vericidirler', 'Sadece ototroflar üretir', 'Hücre zarından geçemezler'], correctAnswer: 0, explanation: 'Su ve mineraller küçük moleküllerdir, sindirilmezler. Enerji vermezler. Tüm canlılar dışarıdan hazır alır.' },
            { question: 'Bir hücrede ribozom faaliyeti artarsa hangisi gerçekleşmez?', options: ['Amino asit miktarı azalır', 'Turgor basıncı artar', 'pH düşer', 'ATP tüketilir'], correctAnswer: 2, explanation: 'Protein sentezinde (n)Aminoasit -> Protein + (n-1)Su. Su açığa çıktığı için Turgor artar. Aminoasitler (asit) kullanıldığı için asitlik azalır, pH YÜKSELİR.' }
          ]
        }
      }
    ]
  }
];

// Helper for Slug Generation
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// --- QUIZ MODAL COMPONENT ---
interface QuizModalProps {
  initialData: { title: string; questions: QuizQuestion[] };
  onSave: (data: { title: string; questions: QuizQuestion[] }) => void;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ initialData, onSave, onClose }) => {
  const [title, setTitle] = useState(initialData.title || 'Konu Testi');
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialData.questions || []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleUpdateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions[oIndex] = value;
    newQuestions[qIndex].options = newOptions;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="text-xl font-bold text-gray-800">Quiz Düzenle</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Quiz Başlığı</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-bio-mint"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
              <button
                onClick={() => handleRemoveQuestion(qIndex)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
              >
                <X size={16} />
              </button>

              <div className="mb-4 pr-6">
                <label className="block text-xs font-bold text-gray-500 mb-1">Soru {qIndex + 1}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-bio-mint"
                  placeholder="Soruyu buraya yazın..."
                  value={q.question}
                  onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-xs font-bold text-gray-500">Seçenekler</label>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuestion(qIndex, 'correctAnswer', oIndex)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${q.correctAnswer === oIndex ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-green-400'}`}
                      title="Doğru Cevap Olarak İşaretle"
                    >
                      <Check size={14} />
                    </button>
                    <input
                      type="text"
                      className={`flex-1 px-3 py-1.5 border rounded-lg outline-none text-sm ${q.correctAnswer === oIndex ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                      placeholder={`Seçenek ${oIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleUpdateOption(qIndex, oIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Açıklama (Çözüm)</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-bio-mint text-sm"
                  placeholder="Cevap açıklaması..."
                  value={q.explanation}
                  onChange={(e) => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddQuestion}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-bio-mint hover:text-bio-mint-dark hover:bg-bio-mint/5 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Soru Ekle
        </button>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">İptal</button>
        <button
          onClick={() => onSave({ title, questions })}
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 shadow-lg"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
};

// --- FLASHCARD MODAL COMPONENT ---
interface FlashcardModalProps {
  initialData: { title: string; cards: Flashcard[] };
  onSave: (data: { title: string; cards: Flashcard[] }) => void;
  onClose: () => void;
}

const FlashcardModal: React.FC<FlashcardModalProps> = ({ initialData, onSave, onClose }) => {
  const [title, setTitle] = useState(initialData.title || 'Öğrenme Kartları');
  const [cards, setCards] = useState<Flashcard[]>(initialData.cards || []);

  const handleAddCard = () => {
    setCards([
      ...cards,
      {
        id: Date.now().toString(),
        front: '',
        back: ''
      }
    ]);
  };

  const handleUpdateCard = (index: number, field: keyof Flashcard, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="text-xl font-bold text-gray-800">Flashcard Düzenle</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Set Başlığı</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-bio-mint"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {cards.map((card, index) => (
            <div key={card.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative flex flex-col md:flex-row gap-4 items-start">
              <button
                onClick={() => handleRemoveCard(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 md:order-last"
              >
                <X size={16} />
              </button>

              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-xs shrink-0 mt-1">
                {index + 1}
              </div>

              <div className="flex-1 w-full space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Ön Yüz (Kavram)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-bio-mint"
                    placeholder="Örn: Mitokondri"
                    value={card.front}
                    onChange={(e) => handleUpdateCard(index, 'front', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Arka Yüz (Açıklama)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-bio-mint resize-none"
                    placeholder="Örn: Enerji üretim merkezidir..."
                    value={card.back}
                    onChange={(e) => handleUpdateCard(index, 'back', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddCard}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-bio-mint hover:text-bio-mint-dark hover:bg-bio-mint/5 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Kart Ekle
        </button>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">İptal</button>
        <button
          onClick={() => onSave({ title, cards })}
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 shadow-lg"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
};

// --- MAIN LESSON BUILDER COMPONENT ---
const LessonBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // --- STATE FOR WIZARD & BUILDER ---
  const [isSetupComplete, setIsSetupComplete] = useState(isEditMode); // If edit, skip setup

  // Lesson Metadata State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(15);
  const [coverImage, setCoverImage] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // UI States
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    type: 'quiz' | 'flashcard';
    blockId: string;
    side?: 'left' | 'right';
    initialData: any;
  } | null>(null);

  // Lesson Content Blocks State
  const [blocks, setBlocks] = useState<LessonBlock[]>([]);
  const [loading, setLoading] = useState(false);

  // Setup Wizard Local State
  const [tempUnits, setTempUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [isNewUnit, setIsNewUnit] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isNewTopic, setIsNewTopic] = useState(false);

  // Load units when grade is selected
  useEffect(() => {
    if (gradeId) {
      loadUnits(gradeId);
    }
  }, [gradeId]);

  const loadUnits = async (gId: string) => {
    try {
      const data = await dbService.getUnitsByGrade(gId);
      const mapped: Unit[] = (data || []).map((u: any) => ({
        id: u.id,
        gradeId: u.grade_id,
        title: u.title,
        slug: u.slug || u.id,
        topics: (u.topics || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          lessons: t.lessons || []
        }))
      }));
      setTempUnits(mapped);
    } catch (error) {
      console.error('Error loading units:', error);
    }
  };

  // Initialize data for Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      loadLessonData(id);
    } else {
      setBlocks([{ id: 'b-init', type: 'text', content: '' }]);
    }
  }, [isEditMode, id]);

  const loadLessonData = async (lessonId: string) => {
    try {
      setLoading(true);
      const lesson = await dbService.getLessonById(lessonId);
      if (lesson) {
        setTitle(lesson.title);
        setSlug(lesson.slug);
        setGradeId(lesson.grade_id || '');
        setUnitTitle(lesson.unit_title || '');
        setTopicTitle(lesson.topic_title || '');
        setDescription(lesson.description || '');
        setDuration(lesson.duration || 15);
        setCoverImage(lesson.cover_image || '');
        setIsPublished(lesson.is_published || false);

        // Migrate old image blocks if necessary
        const lessonBlocks = lesson.blocks || [];
        const migratedBlocks = lessonBlocks.map((b: any) => {
          if (b.type === 'image' && b.data?.url && !b.data?.items) {
            return { ...b, data: { items: [{ url: b.data.url, caption: b.data.caption }], columns: 1 } };
          }
          return b;
        });
        setBlocks(migratedBlocks as LessonBlock[]);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate Slug & Description in Wizard
  useEffect(() => {
    if (!isEditMode && !isSetupComplete) {
      setSlug(generateSlug(title));

      const gName = GRADES.find(g => g.id === gradeId)?.name || '';
      const uName = isNewUnit ? selectedUnit : (tempUnits.find(u => u.id === selectedUnit)?.title || '');
      const tName = isNewTopic ? selectedTopic : selectedTopic; // Topic selection is string based in mock for simplicity here

      if (title && gradeId) {
        setDescription(`${gName} Biyoloji dersi, ${uName} ünitesi, ${tName} konusu, ${title} ders anlatımı. Konu özeti, görsel anlatımlar ve çıkmış sorular.`);
      }
    }
  }, [title, gradeId, selectedUnit, selectedTopic, isNewUnit, isNewTopic, isSetupComplete, isEditMode]);

  // --- ACTIONS ---

  const handleSetupComplete = () => {
    if (!title || !gradeId || !selectedUnit || !selectedTopic) {
      alert('Lütfen tüm alanları doldurunuz.');
      return;
    }

    // Set final unit/topic titles
    const uTitle = isNewUnit ? selectedUnit : tempUnits.find(u => u.id === selectedUnit)?.title || '';
    setUnitTitle(uTitle);
    setTopicTitle(selectedTopic); // In a real app, this might be an ID if selected from list

    setIsSetupComplete(true);
  };

  const handleSave = () => {
    console.log({ title, slug, gradeId, unitTitle, topicTitle, description, duration, coverImage, isPublished, blocks });
    alert('Ders başarıyla kaydedildi!');
    navigate('/admin/lessons');
  };

  const handleCancel = () => {
    navigate('/admin/lessons');
  };

  const handleSaveModalData = (newData: any) => {
    if (!modalConfig) return;
    const { blockId, side } = modalConfig;

    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;

      if (!side) {
        return { ...b, data: { ...b.data, ...newData } };
      }

      if (b.type === 'split') {
        const subBlock = b.data[side];
        return {
          ...b,
          data: {
            ...b.data,
            [side]: { ...subBlock, data: { ...subBlock.data, ...newData } }
          }
        };
      }
      return b;
    }));
    setModalConfig(null);
  };

  const loadTemplate = (templateBlocks: any[]) => {
    const newBlocks = templateBlocks.map(b => ({
      ...b,
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: JSON.parse(JSON.stringify(b.data || {}))
    }));

    setBlocks(newBlocks as LessonBlock[]);
    setIsTemplateModalOpen(false);
  };

  // --- BLOCK MANAGEMENT ---
  const getInitialDataForType = (type: string) => {
    switch (type) {
      case 'quiz': return { title: 'Konu Testi', questions: [] };
      case 'flashcard': return { title: 'Öğrenme Kartları', cards: [] };
      case 'image': return { items: [{ url: '', caption: '' }], columns: 1 };
      case 'video': return { url: '', title: '' };
      case 'callout': return { type: 'info', title: 'Bilgi', text: '' };
      case 'split': return { left: null, right: null };
      case 'quote': return { text: '', author: '' };
      case 'table': return { headers: ['Özellik 1', 'Özellik 2'], rows: [['Veri A', 'Veri B'], ['Veri C', 'Veri D']] };
      case 'list': return { style: 'bullet', items: [''] };
      case 'audio': return { url: '', title: '' };
      case 'accordion': return { title: 'Başlık Buraya', content: '' };
      case 'steps': return { steps: [{ title: 'Adım 1', description: '' }, { title: 'Adım 2', description: '' }] };
      case 'file': return { url: '', label: 'Dosyayı İndir', size: '' };
      case 'code': return { code: '', language: 'javascript' };
      default: return undefined;
    }
  };

  const addBlock = (type: LessonBlock['type'], indexToInsert?: number) => {
    const newBlock: LessonBlock = {
      id: `b-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      content: type === 'text' ? '' : undefined,
      data: getInitialDataForType(type)
    };

    setBlocks(prev => {
      if (indexToInsert !== undefined) {
        const newBlocks = [...prev];
        newBlocks.splice(indexToInsert, 0, newBlock);
        return newBlocks;
      } else {
        return [...prev, newBlock];
      }
    });

    setActiveBlockId(newBlock.id);
    setTimeout(() => {
      const el = document.getElementById(newBlock.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const removeBlock = (blockId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    if (activeBlockId === blockId) setActiveBlockId(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBlocks(prev => {
      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      }
      return newBlocks;
    });
  };

  const updateBlockData = (blockId: string, data: any) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, data: { ...b.data, ...data } } : b));
  };

  const updateBlockContent = (blockId: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, content } : b));
  };

  // --- RENDERERS ---
  const renderBlockSpecificContent = (type: string, content: string | undefined, data: any, onChange: (field: string, val: any) => void, context: { blockId: string, side?: 'left' | 'right' }) => {
    // 1. Text Editor
    if (type === 'text') return <RichTextEditor content={content || ''} onChange={(val) => onChange('content', val)} placeholder="Konu anlatımı..." />;

    // 2. Quiz Editor
    if (type === 'quiz') return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
          <span className="font-bold text-purple-800 flex items-center gap-2"><HelpCircle size={18} /> Quiz Editörü</span>
          <span className="text-xs text-purple-600">{(data?.questions || []).length} Soru</span>
        </div>
        <button onClick={() => setModalConfig({ type: 'quiz', blockId: context.blockId, side: context.side, initialData: data })} className="text-bio-mint-dark text-sm font-bold hover:underline w-full text-center p-2 border border-dashed rounded bg-white">Soruları Düzenle (Modal)</button>
      </div>
    );

    // 3. Flashcard Editor
    if (type === 'flashcard') return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
          <span className="font-bold text-blue-800 flex items-center gap-2"><Layers size={18} /> Flashcard Editörü</span>
          <span className="text-xs text-blue-600">{(data?.cards || []).length} Kart</span>
        </div>
        <button onClick={() => setModalConfig({ type: 'flashcard', blockId: context.blockId, side: context.side, initialData: data })} className="text-bio-mint-dark text-sm font-bold hover:underline w-full text-center p-2 border border-dashed rounded bg-white">Kartları Düzenle (Modal)</button>
      </div>
    );

    // 4. Image Editor
    if (type === 'image') {
      const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            onChange('data', { ...data, items: [{ ...data.items?.[0], url: base64 }] });
          };
          reader.readAsDataURL(file);
        }
      };

      return (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500">Görsel Kaynağı</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-bio-mint bg-white text-gray-900"
              value={data.items?.[0]?.url?.startsWith('data:') ? 'Yerel dosya yüklendi' : (data.items?.[0]?.url || '')}
              onChange={(e) => onChange('data', { ...data, items: [{ ...data.items?.[0], url: e.target.value }] })}
              placeholder="https://... veya dosya yükle →"
              disabled={data.items?.[0]?.url?.startsWith('data:')}
            />
            <label className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-primary-700 transition-colors flex items-center gap-1 whitespace-nowrap">
              <Plus size={16} /> Dosya Seç
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          {data.items?.[0]?.url?.startsWith('data:') && (
            <button
              onClick={() => onChange('data', { ...data, items: [{ ...data.items?.[0], url: '' }] })}
              className="text-xs text-red-500 hover:underline"
            >
              Görseli Kaldır
            </button>
          )}
          <label className="block text-xs font-bold text-gray-500">Altyazı</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-bio-mint bg-white text-gray-900"
            value={data.items?.[0]?.caption || ''}
            onChange={(e) => onChange('data', { ...data, items: [{ ...data.items?.[0], caption: e.target.value }] })}
            placeholder="Görsel açıklaması..."
          />
          {data.items?.[0]?.url && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
              <img src={data.items[0].url} alt="Preview" className="w-full h-auto max-h-40 object-cover" />
            </div>
          )}
        </div>
      );
    }

    // 5. Video Editor
    if (type === 'video') return (
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500">Video URL (YouTube)</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-bio-mint bg-white text-gray-900"
          value={data.url || ''}
          onChange={(e) => onChange('data', { ...data, url: e.target.value })}
          placeholder="https://youtube.com/..."
        />
        <label className="block text-xs font-bold text-gray-500">Video Başlığı</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-bio-mint bg-white text-gray-900"
          value={data.title || ''}
          onChange={(e) => onChange('data', { ...data, title: e.target.value })}
          placeholder="Video başlığı..."
        />
      </div>
    );

    // 6. Callout (Uyarı) Editor
    if (type === 'callout') return (
      <div className={`p-4 rounded-lg border-l-4 space-y-3 ${data.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
        data.type === 'error' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'
        }`}>
        <div className="flex gap-2">
          <select
            className="bg-white border border-gray-200 rounded-md text-xs py-1 px-2 outline-none text-gray-900"
            value={data.type}
            onChange={(e) => onChange('data', { ...data, type: e.target.value })}
          >
            <option value="info">Bilgi (Mavi)</option>
            <option value="warning">Uyarı (Sarı)</option>
            <option value="error">Hata/Kritik (Kırmızı)</option>
          </select>
          <input
            type="text"
            className="flex-1 bg-white border border-gray-200 rounded-md text-sm px-2 py-1 outline-none font-bold text-gray-900"
            value={data.title || ''}
            onChange={(e) => onChange('data', { ...data, title: e.target.value })}
            placeholder="Başlık"
          />
        </div>
        <textarea
          rows={3}
          className="w-full bg-white border border-gray-200 rounded-md text-sm px-2 py-1 outline-none resize-none text-gray-900"
          value={data.text || ''}
          onChange={(e) => onChange('data', { ...data, text: e.target.value })}
          placeholder="Mesaj içeriği..."
        />
      </div>
    );

    // 7. List Editor
    if (type === 'list') return (
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500">Liste Tipi</label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange('data', { ...data, style: 'bullet' })}
            className={`px-3 py-1 rounded text-xs border ${data.style === 'bullet' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            Noktalı
          </button>
          <button
            onClick={() => onChange('data', { ...data, style: 'ordered' })}
            className={`px-3 py-1 rounded text-xs border ${data.style === 'ordered' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            Numaralı
          </button>
        </div>
        <label className="block text-xs font-bold text-gray-500">Maddeler (Her satır bir madde)</label>
        <textarea
          rows={5}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-bio-mint resize-none bg-white text-gray-900"
          value={(data.items || []).join('\n')}
          onChange={(e) => onChange('data', { ...data, items: e.target.value.split('\n') })}
          placeholder="Madde 1&#10;Madde 2&#10;Madde 3"
        />
      </div>
    );

    // 8. IMPROVED Table Editor
    if (type === 'table') {
      const headers = data.headers || [];
      const rows = data.rows || [];

      const handleHeaderChange = (idx: number, val: string) => {
        const newHeaders = [...headers];
        newHeaders[idx] = val;
        onChange('data', { ...data, headers: newHeaders });
      };

      const handleCellChange = (rowIdx: number, colIdx: number, val: string) => {
        const newRows = [...rows];
        const newRow = [...newRows[rowIdx]];
        newRow[colIdx] = val;
        newRows[rowIdx] = newRow;
        onChange('data', { ...data, rows: newRows });
      };

      const addRow = () => {
        const newRow = new Array(headers.length).fill('');
        onChange('data', { ...data, rows: [...rows, newRow] });
      };

      const removeRow = (idx: number) => {
        onChange('data', { ...data, rows: rows.filter((_: any, i: number) => i !== idx) });
      };

      const addCol = () => {
        const newHeaders = [...headers, `Başlık ${headers.length + 1}`];
        const newRows = rows.map((r: string[]) => [...r, '']);
        onChange('data', { ...data, headers: newHeaders, rows: newRows });
      };

      const removeCol = (idx: number) => {
        if (headers.length <= 1) return;
        const newHeaders = headers.filter((_: any, i: number) => i !== idx);
        const newRows = rows.map((r: string[]) => r.filter((_: any, i: number) => i !== idx));
        onChange('data', { ...data, headers: newHeaders, rows: newRows });
      };

      return (
        <div className="space-y-4 overflow-x-auto pb-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500">Tablo İçeriği</span>
            <div className="flex gap-2">
              <button onClick={addCol} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 text-slate-600">+ Sütun</button>
              <button onClick={addRow} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 text-slate-600">+ Satır</button>
            </div>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h: string, i: number) => (
                  <th key={i} className="p-1 relative group min-w-[120px]">
                    <input
                      value={h}
                      onChange={(e) => handleHeaderChange(i, e.target.value)}
                      className="w-full p-2 bg-slate-100 font-bold border border-slate-300 rounded text-center focus:border-bio-mint outline-none text-slate-800"
                    />
                    <button onClick={() => removeCol(i)} className="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  </th>
                ))}
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: string[], rIdx: number) => (
                <tr key={rIdx}>
                  {row.map((cell: string, cIdx: number) => (
                    <td key={cIdx} className="p-1">
                      <input
                        value={cell}
                        onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded focus:border-bio-mint outline-none bg-white text-gray-900"
                      />
                    </td>
                  ))}
                  <td className="text-center">
                    <button onClick={() => removeRow(rIdx)} className="text-red-300 hover:text-red-500"><X size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 9. NEW: Steps Editor (Process)
    if (type === 'steps') {
      const steps = data.steps || [];
      const updateStep = (idx: number, field: string, val: string) => {
        const newSteps = [...steps];
        newSteps[idx] = { ...newSteps[idx], [field]: val };
        onChange('data', { ...data, steps: newSteps });
      };
      const addStep = () => {
        onChange('data', { ...data, steps: [...steps, { title: `Adım ${steps.length + 1}`, description: '' }] });
      };
      const removeStep = (idx: number) => {
        onChange('data', { ...data, steps: steps.filter((_: any, i: number) => i !== idx) });
      };

      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-500">Süreç Adımları</label>
            <button onClick={addStep} className="text-xs text-bio-mint-dark font-bold hover:underline">+ Adım Ekle</button>
          </div>
          <div className="space-y-2">
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start group">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mt-2">{idx + 1}</div>
                <div className="flex-1 space-y-1">
                  <input
                    value={step.title}
                    onChange={(e) => updateStep(idx, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded text-sm font-bold bg-white text-gray-900 focus:border-bio-mint outline-none"
                    placeholder="Adım Başlığı"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(idx, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded text-xs resize-none bg-white text-gray-700 focus:border-bio-mint outline-none"
                    rows={2}
                    placeholder="Açıklama"
                  />
                </div>
                <button onClick={() => removeStep(idx)} className="text-gray-300 hover:text-red-500 mt-2 opacity-0 group-hover:opacity-100"><X size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 10. NEW: Quote Editor
    if (type === 'quote') return (
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500">Alıntı Metni</label>
        <textarea
          value={data.text || ''}
          onChange={(e) => onChange('data', { ...data, text: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:border-bio-mint outline-none font-serif italic"
          rows={3}
          placeholder="Söz buraya..."
        />
        <label className="block text-xs font-bold text-gray-500">Yazar / Kaynak</label>
        <input
          value={data.author || ''}
          onChange={(e) => onChange('data', { ...data, author: e.target.value })}
          className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:border-bio-mint outline-none"
          placeholder="Örn: Charles Darwin"
        />
      </div>
    );

    // 11. NEW: Accordion Editor
    if (type === 'accordion') return (
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500">Görünen Başlık</label>
        <input
          value={data.title || ''}
          onChange={(e) => onChange('data', { ...data, title: e.target.value })}
          className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold bg-white text-gray-900 focus:border-bio-mint outline-none"
          placeholder="Tıklayınca açılacak başlık..."
        />
        <label className="block text-xs font-bold text-gray-500">Gizli İçerik</label>
        <div className="border border-gray-200 rounded-lg overflow-hidden h-48 bg-white">
          <RichTextEditor
            content={content || ''}
            onChange={(val) => onChange('content', val)}
            placeholder="Detaylı içerik..."
            className="border-none h-full"
          />
        </div>
      </div>
    );

    // 12. NEW: Code Editor
    if (type === 'code') return (
      <div className="space-y-3">
        <div className="flex justify-between">
          <label className="block text-xs font-bold text-gray-500">Kod Bloğu</label>
          <select
            value={data.language || 'javascript'}
            onChange={(e) => onChange('data', { ...data, language: e.target.value })}
            className="text-xs border border-gray-200 rounded bg-white text-gray-700 px-2 py-1 outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
        <textarea
          value={data.code || ''}
          onChange={(e) => onChange('data', { ...data, code: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm font-mono bg-slate-900 text-green-400 focus:border-bio-mint outline-none"
          rows={6}
          placeholder="// Kodunuzu buraya yapıştırın"
        />
      </div>
    );

    // 13. NEW: Audio Editor
    if (type === 'audio') {
      const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            onChange('data', { ...data, url: base64, fileName: file.name });
          };
          reader.readAsDataURL(file);
        }
      };

      return (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500">Ses Dosyası</label>
          <div className="flex gap-2">
            <input
              value={data.url?.startsWith('data:') ? (data.fileName || 'Yerel dosya yüklendi') : (data.url || '')}
              onChange={(e) => onChange('data', { ...data, url: e.target.value })}
              className="flex-1 p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:border-bio-mint outline-none"
              placeholder="https://... (mp3)"
              disabled={data.url?.startsWith('data:')}
            />
            <label className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-primary-700 transition-colors flex items-center gap-1 whitespace-nowrap">
              <Plus size={14} /> Dosya Seç
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioUpload}
              />
            </label>
            {data.url?.startsWith('data:') && (
              <button
                onClick={() => onChange('data', { ...data, url: '', fileName: '' })}
                className="px-2 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <label className="block text-xs font-bold text-gray-500">Başlık (Opsiyonel)</label>
          <input
            value={data.title || ''}
            onChange={(e) => onChange('data', { ...data, title: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:border-bio-mint outline-none"
            placeholder="Ses kaydı başlığı"
          />
          {data.url && (
            <audio controls className="w-full">
              <source src={data.url} type="audio/mpeg" />
            </audio>
          )}
        </div>
      );
    }

    // 14. NEW: File Editor
    if (type === 'file') {
      const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            onChange('data', {
              ...data,
              url: base64,
              fileName: file.name,
              size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
            });
          };
          reader.readAsDataURL(file);
        }
      };

      return (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500">Dosya</label>
          <div className="flex gap-2">
            <input
              value={data.url?.startsWith('data:') ? (data.fileName || 'Yerel dosya yüklendi') : (data.url || '')}
              onChange={(e) => onChange('data', { ...data, url: e.target.value })}
              className="flex-1 p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:border-bio-mint outline-none"
              placeholder="https://... (pdf, docx)"
              disabled={data.url?.startsWith('data:')}
            />
            <label className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-primary-700 transition-colors flex items-center gap-1 whitespace-nowrap">
              <Plus size={14} /> Dosya Seç
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {data.url?.startsWith('data:') && (
              <button
                onClick={() => onChange('data', { ...data, url: '', fileName: '' })}
                className="px-2 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1">Buton Metni</label>
              <input
                value={data.label || ''}
                onChange={(e) => onChange('data', { ...data, label: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:border-bio-mint outline-none"
                placeholder="Dosyayı İndir"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-xs font-bold text-gray-500 mb-1">Boyut</label>
              <input
                value={data.size || ''}
                onChange={(e) => onChange('data', { ...data, size: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:border-bio-mint outline-none"
                placeholder="2.4 MB"
              />
            </div>
          </div>
        </div>
      );
    }

    return <div className="p-4 bg-gray-50 border rounded text-gray-500 text-center text-sm">Blok Ayarları ({type})</div>;
  };

  const renderSplitEditor = (block: LessonBlock) => {
    const left = block.data?.left as SubBlock | null;
    const right = block.data?.right as SubBlock | null;
    const updateSubBlock = (side: 'left' | 'right', newSubBlock: SubBlock | null) => updateBlockData(block.id, { [side]: newSubBlock });

    const handleAddSubBlock = (side: 'left' | 'right', type: string) => {
      updateSubBlock(side, {
        type: type as any,
        content: type === 'text' ? '' : undefined,
        data: getInitialDataForType(type)
      });
    };

    const SubBlockSelector = ({ side }: { side: 'left' | 'right' }) => (
      <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-white hover:border-bio-mint transition-all gap-3 group">
        <div className="text-gray-400 group-hover:text-bio-mint-dark flex flex-col items-center">
          <MousePointerClick size={24} className="mb-2 opacity-50 group-hover:opacity-100" />
          <span className="text-xs font-bold uppercase tracking-wider">İçerik Ekle ({side === 'left' ? 'Sol' : 'Sağ'})</span>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-2 w-full max-w-xs">
          <button onClick={() => handleAddSubBlock(side, 'text')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Metin">
            <Type size={16} className="mb-1" /> <span className="text-[10px]">Metin</span>
          </button>
          <button onClick={() => handleAddSubBlock(side, 'image')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Görsel">
            <ImageIcon size={16} className="mb-1" /> <span className="text-[10px]">Görsel</span>
          </button>
          <button onClick={() => handleAddSubBlock(side, 'video')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Video">
            <Video size={16} className="mb-1" /> <span className="text-[10px]">Video</span>
          </button>
          <button onClick={() => handleAddSubBlock(side, 'callout')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Uyarı">
            <AlertTriangle size={16} className="mb-1" /> <span className="text-[10px]">Uyarı</span>
          </button>
          <button onClick={() => handleAddSubBlock(side, 'quiz')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Quiz">
            <HelpCircle size={16} className="mb-1" /> <span className="text-[10px]">Quiz</span>
          </button>
          <button onClick={() => handleAddSubBlock(side, 'flashcard')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Kartlar">
            <Layers size={16} className="mb-1" /> <span className="text-[10px]">Kart</span>
          </button>
          <button onClick={() => handleAddSubBlock(side, 'table')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Tablo">
            <Table size={16} className="mb-1" /> <span className="text-[10px]">Tablo</span>
          </button>
          <button onClick={() => handleAddSubBlock(side, 'list')} className="flex flex-col items-center p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-slate-800 transition-colors" title="Liste">
            <List size={16} className="mb-1" /> <span className="text-[10px]">Liste</span>
          </button>
        </div>
      </div>
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="min-h-[150px]">
          {left ? (
            <div className="relative border bg-white p-4 rounded-xl shadow-sm h-full">
              <button onClick={() => updateSubBlock('left', null)} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors z-10" title="Kaldır">
                <X size={14} />
              </button>
              {renderBlockSpecificContent(left.type, left.content, left.data, (f, v) => updateSubBlock('left', { ...left, [f]: v }), { blockId: block.id, side: 'left' })}
            </div>
          ) : (
            <SubBlockSelector side="left" />
          )}
        </div>

        <div className="min-h-[150px]">
          {right ? (
            <div className="relative border bg-white p-4 rounded-xl shadow-sm h-full">
              <button onClick={() => updateSubBlock('right', null)} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors z-10" title="Kaldır">
                <X size={14} />
              </button>
              {renderBlockSpecificContent(right.type, right.content, right.data, (f, v) => updateSubBlock('right', { ...right, [f]: v }), { blockId: block.id, side: 'right' })}
            </div>
          ) : (
            <SubBlockSelector side="right" />
          )}
        </div>
      </div>
    );
  };

  const renderPreviewContent = () => {
    return (
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-xl rounded-xl overflow-hidden mt-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Cover */}
        <div className="h-64 md:h-80 w-full relative">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <ImageIcon size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8 md:p-12">
            <div className="text-white w-full">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">
                <span>{GRADES.find(g => g.id === gradeId)?.name}</span>
                <span>•</span>
                <span>{unitTitle}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{title || 'Başlıksız Ders'}</h1>
              <p className="text-white/80 max-w-2xl line-clamp-2">{description}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {blocks.map(block => (
            <div key={block.id}>
              {block.type === 'text' && block.content && (
                <div
                  className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-bio-mint-dark"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}

              {block.type === 'image' && block.data?.items?.[0] && (
                <figure className="my-8">
                  <img src={block.data.items[0].url} alt={block.data.items[0].caption} className="w-full rounded-xl shadow-lg" />
                  {block.data.items[0].caption && (
                    <figcaption className="text-center text-sm text-gray-500 mt-3 italic">{block.data.items[0].caption}</figcaption>
                  )}
                </figure>
              )}

              {block.type === 'video' && block.data?.url && (
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black my-8">
                  <iframe
                    src={block.data.url.includes('youtube') ? block.data.url.replace('watch?v=', 'embed/') : block.data.url}
                    title={block.data.title || 'Video'}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {block.type === 'callout' && (
                <div className={`p-4 border-l-4 rounded-r-lg my-6 ${block.data.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                  block.data.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                    'bg-blue-50 border-blue-400 text-blue-800'
                  }`}>
                  <h4 className="font-bold flex items-center gap-2 mb-1">
                    {block.data.type === 'warning' ? <AlertTriangle size={18} /> : <AlertTriangle size={18} />}
                    {block.data.title}
                  </h4>
                  <p>{block.data.text}</p>
                </div>
              )}

              {block.type === 'flashcard' && (
                <div className="bg-slate-50 p-6 sm:p-10 rounded-2xl border border-slate-200 my-8">
                  <h3 className="text-xl font-bold text-center mb-8 text-gray-800">{block.data.title}</h3>
                  <FlashcardDeck cards={block.data.cards || []} />
                </div>
              )}

              {block.type === 'quiz' && (
                <div className="mt-12">
                  <QuizComponent questions={block.data.questions || []} />
                </div>
              )}

              {block.type === 'divider' && <hr className="my-8 border-gray-200" />}

              {/* SPLIT BLOCK */}
              {block.type === 'split' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  {/* Left Panel */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    {block.data?.left?.type === 'text' && block.data.left.content && (
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: block.data.left.content }} />
                    )}
                    {block.data?.left?.type === 'callout' && (
                      <div className={`p-4 rounded-lg border-l-4 ${block.data.left.data?.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                        block.data.left.data?.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                          'bg-blue-50 border-blue-400 text-blue-800'
                        }`}>
                        <h5 className="font-bold mb-1">{block.data.left.data?.title}</h5>
                        <p className="text-sm">{block.data.left.data?.text}</p>
                      </div>
                    )}
                    {block.data?.left?.type === 'image' && block.data.left.data?.items?.[0]?.url && (
                      <img src={block.data.left.data.items[0].url} alt="" className="w-full rounded-lg" />
                    )}
                  </div>
                  {/* Right Panel */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    {block.data?.right?.type === 'text' && block.data.right.content && (
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: block.data.right.content }} />
                    )}
                    {block.data?.right?.type === 'callout' && (
                      <div className={`p-4 rounded-lg border-l-4 ${block.data.right.data?.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                        block.data.right.data?.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                          'bg-blue-50 border-blue-400 text-blue-800'
                        }`}>
                        <h5 className="font-bold mb-1">{block.data.right.data?.title}</h5>
                        <p className="text-sm">{block.data.right.data?.text}</p>
                      </div>
                    )}
                    {block.data?.right?.type === 'image' && block.data.right.data?.items?.[0]?.url && (
                      <img src={block.data.right.data.items[0].url} alt="" className="w-full rounded-lg" />
                    )}
                  </div>
                </div>
              )}

              {/* STEPS BLOCK */}
              {block.type === 'steps' && block.data?.steps && (
                <div className="my-8 relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-bio-mint via-bio-cyan to-bio-lavender"></div>
                  <div className="space-y-4">
                    {block.data.steps.map((step: { title: string; description: string }, i: number) => (
                      <div key={i} className="relative pl-14">
                        <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-bio-mint to-bio-cyan flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {i + 1}
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TABLE BLOCK */}
              {block.type === 'table' && block.data?.headers && (
                <div className="my-8 overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        {block.data.headers.map((header: string, i: number) => (
                          <th key={i} className="px-4 py-3 text-left text-sm font-bold">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.data.rows?.map((row: string[], rowIndex: number) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          {row.map((cell: string, cellIndex: number) => (
                            <td key={cellIndex} className="px-4 py-3 text-gray-700 border-t border-gray-100 text-sm">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* LIST BLOCK */}
              {block.type === 'list' && block.data?.items && (
                <div className="my-6">
                  {block.data.style === 'ordered' ? (
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {block.data.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="space-y-2 text-gray-700">
                      {block.data.items.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-bio-mint mt-2 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* QUOTE BLOCK */}
              {block.type === 'quote' && (
                <blockquote className="my-8 pl-6 border-l-4 border-bio-lavender italic text-gray-600">
                  <p className="text-lg mb-2">"{block.data?.text}"</p>
                  {block.data?.author && (
                    <cite className="text-sm font-medium text-gray-500 not-italic">— {block.data.author}</cite>
                  )}
                </blockquote>
              )}

              {/* ACCORDION BLOCK */}
              {block.type === 'accordion' && (
                <details className="my-6 bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                  <summary className="p-4 cursor-pointer font-bold text-gray-900 hover:bg-gray-50">
                    {block.data?.title || 'Detaylar'}
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: block.data?.content || '' }} />
                </details>
              )}

              {/* CODE BLOCK */}
              {block.type === 'code' && (
                <div className="my-8">
                  {block.data?.language && (
                    <div className="bg-gray-700 text-gray-300 px-3 py-1.5 rounded-t-lg text-xs font-mono uppercase">{block.data.language}</div>
                  )}
                  <pre className={`p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto ${block.data?.language ? 'rounded-b-lg' : 'rounded-lg'}`}>
                    <code>{block.data?.code}</code>
                  </pre>
                </div>
              )}

              {/* AUDIO BLOCK */}
              {block.type === 'audio' && block.data?.url && (
                <div className="my-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {block.data.title && <h4 className="font-bold text-gray-800 mb-2 text-sm">{block.data.title}</h4>}
                  <audio controls className="w-full">
                    <source src={block.data.url} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* FILE BLOCK */}
              {block.type === 'file' && block.data?.url && (
                <div className="my-6">
                  <a href={block.data.url} download className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-bio-mint hover:shadow transition-all">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                      <span className="font-bold text-xs">PDF</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-gray-800">{block.data.label || 'Dosyayı İndir'}</span>
                      {block.data.size && <span className="text-sm text-gray-500 ml-2">({block.data.size})</span>}
                    </div>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ToolButton = ({ icon: Icon, label, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white hover:shadow-md text-gray-500 hover:text-gray-900 transition-all w-full group">
      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-bio-mint/10 group-hover:text-bio-mint-dark mb-1"><Icon size={20} /></div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  // --- WIZARD RENDER ---
  if (!isSetupComplete) {
    const activeUnits = tempUnits.filter(u => u.gradeId === gradeId);
    const activeTopics = activeUnits.find(u => u.id === selectedUnit)?.topics || [];

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white text-center">
            <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
              <LayoutTemplate size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ders Kurulumu</h1>
            <p className="text-slate-400">İçerik hiyerarşisini ve temel bilgileri belirleyin.</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Step 1: Hierarchy */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">1. Sınıf Seçimi</label>
                <div className="grid grid-cols-4 gap-3">
                  {GRADES.map(g => (
                    <button
                      key={g.id}
                      onClick={() => { setGradeId(g.id); setSelectedUnit(''); setSelectedTopic(''); }}
                      className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${gradeId === g.id ? 'border-bio-mint bg-bio-mint/10 text-bio-mint-dark' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300'}`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {gradeId && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">2. Ünite</label>
                    {isNewUnit ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-bio-mint bg-white text-gray-900"
                          placeholder="Yeni Ünite Adı..."
                          value={selectedUnit}
                          onChange={(e) => setSelectedUnit(e.target.value)}
                          autoFocus
                        />
                        <button onClick={() => { setIsNewUnit(false); setSelectedUnit(''); }} className="text-gray-400 hover:text-red-500"><X /></button>
                      </div>
                    ) : (
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-bio-mint bg-white"
                        value={selectedUnit}
                        onChange={(e) => {
                          if (e.target.value === 'new') { setIsNewUnit(true); setSelectedUnit(''); }
                          else setSelectedUnit(e.target.value);
                        }}
                      >
                        <option value="">Seçiniz...</option>
                        {activeUnits.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                        <option value="new" className="font-bold text-bio-mint-dark">+ Yeni Ünite Ekle</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">3. Konu</label>
                    {isNewTopic ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-bio-mint bg-white text-gray-900"
                          placeholder="Yeni Konu Adı..."
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          autoFocus
                        />
                        <button onClick={() => { setIsNewTopic(false); setSelectedTopic(''); }} className="text-gray-400 hover:text-red-500"><X /></button>
                      </div>
                    ) : (
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-bio-mint bg-white"
                        value={selectedTopic}
                        onChange={(e) => {
                          if (e.target.value === 'new') { setIsNewTopic(true); setSelectedTopic(''); }
                          else setSelectedTopic(e.target.value);
                        }}
                        disabled={!selectedUnit && !isNewUnit}
                      >
                        <option value="">Seçiniz...</option>
                        {activeTopics.map(t => <option key={t.id} value={t.title}>{t.title}</option>)}
                        <option value="new" className="font-bold text-bio-mint-dark">+ Yeni Konu Ekle</option>
                      </select>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Content Details */}
            {selectedTopic && (
              <div className="pt-6 border-t border-gray-100 animate-in fade-in">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">4. Ders Başlığı</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-xl outline-none focus:border-bio-mint focus:ring-4 focus:ring-bio-mint/10 transition-all bg-white text-gray-900"
                    placeholder="Örn: Hücre Zarından Madde Geçişleri"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 text-xs text-gray-500">
                  <div>
                    <span className="font-bold uppercase block mb-1">Otomatik URL (Slug)</span>
                    <div className="bg-gray-100 p-2 rounded truncate text-gray-600">{slug || '...'}</div>
                  </div>
                  <div>
                    <span className="font-bold uppercase block mb-1">Otomatik SEO Açıklaması</span>
                    <div className="bg-gray-100 p-2 rounded truncate text-gray-600">{description || '...'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button onClick={handleCancel} className="text-gray-500 font-medium hover:text-gray-800">İptal</button>
            <button
              onClick={handleSetupComplete}
              disabled={!title || !selectedTopic}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Editörü Başlat <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN EDITOR RENDER ---
  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">

      {/* 1. LEFT SIDEBAR (TOOLS) */}
      <aside className="w-24 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 gap-2 z-20 shadow-sm overflow-y-auto">
        <div className="mb-4">
          <div className="w-10 h-10 bg-bio-mint rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-bio-mint/30">
            Bx
          </div>
        </div>

        <div className="flex-1 w-full px-2 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-1">Temel</p>
          <ToolButton icon={Type} label="Metin" onClick={() => addBlock('text')} />
          <ToolButton icon={ImageIcon} label="Görsel" onClick={() => addBlock('image')} />
          <ToolButton icon={List} label="Liste" onClick={() => addBlock('list')} />
          <ToolButton icon={Table} label="Tablo" onClick={() => addBlock('table')} />

          <p className="text-[10px] font-bold text-gray-400 uppercase text-center mt-4 mb-1">Medya</p>
          <ToolButton icon={Video} label="Video" onClick={() => addBlock('video')} />
          <ToolButton icon={Music} label="Ses" onClick={() => addBlock('audio')} />
          <ToolButton icon={FileText} label="Dosya" onClick={() => addBlock('file')} />

          <p className="text-[10px] font-bold text-gray-400 uppercase text-center mt-4 mb-1">Düzen</p>
          <ToolButton icon={Columns} label="Yan Yana" onClick={() => addBlock('split')} />
          <ToolButton icon={Minus} label="Ayırıcı" onClick={() => addBlock('divider')} />
          <ToolButton icon={ChevronRight} label="Akordiyon" onClick={() => addBlock('accordion')} />

          <p className="text-[10px] font-bold text-gray-400 uppercase text-center mt-4 mb-1">Özel</p>
          <ToolButton icon={AlertTriangle} label="Uyarı" onClick={() => addBlock('callout')} />
          <ToolButton icon={Quote} label="Alıntı" onClick={() => addBlock('quote')} />
          <ToolButton icon={ListOrdered} label="Adımlar" onClick={() => addBlock('steps')} />
          <ToolButton icon={Code} label="Kod" onClick={() => addBlock('code')} />

          <p className="text-[10px] font-bold text-gray-400 uppercase text-center mt-4 mb-1">İnteraktif</p>
          <ToolButton icon={HelpCircle} label="Quiz" onClick={() => addBlock('quiz')} />
          <ToolButton icon={Layers} label="Kartlar" onClick={() => addBlock('flashcard')} />
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 w-full px-2">
          <button
            onClick={handleCancel}
            className="flex flex-col items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <ArrowLeft size={18} className="mb-1" />
            <span className="text-[10px]">Çıkış</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CANVAS AREA */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ders Başlığı Giriniz..."
              className="text-xl font-bold text-gray-800 placeholder-gray-300 outline-none border-none bg-transparent w-96 hover:bg-gray-50 rounded px-2 transition-colors"
            />
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md font-mono">{gradeId}. Sınıf</span>
            <span className="text-gray-300">/</span>
            <span className="text-xs text-gray-500 font-medium">{unitTitle}</span>
            <span className="text-gray-300">/</span>
            <span className="text-xs text-gray-500 font-medium">{topicTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <LayoutTemplate size={16} /> Şablonlar
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
              {isPreviewMode ? 'Düzenle' : 'Önizle'}
            </button>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${isSettingsOpen ? 'bg-bio-mint/10 text-bio-mint-dark border-bio-mint' : 'text-gray-600 bg-gray-50 border-gray-200'}`}
            >
              <Settings size={16} /> Ayarlar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg transition-all"
            >
              <Save size={16} /> Kaydet
            </button>
          </div>
        </header>

        {/* Workspace Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8 relative">
          {isPreviewMode ? renderPreviewContent() : (
            <div className="max-w-3xl mx-auto pb-32">
              {blocks.length === 0 && (
                <div className="text-center py-20 opacity-50">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-xl">Soldaki menüden bir blok ekleyerek başlayın.</p>
                  <button onClick={() => setIsTemplateModalOpen(true)} className="mt-4 text-bio-mint-dark font-bold hover:underline">Veya Hazır Şablon Seçin</button>
                </div>
              )}

              {blocks.map((block, index) => (
                <div key={block.id} id={block.id} className="relative group mb-2">
                  {/* Insert Between Button (Top) */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-3 left-0 right-0 h-6 flex items-center justify-center z-10 transition-opacity">
                    <button className="bg-bio-mint text-white rounded-full p-1 shadow-sm hover:scale-110 transition-transform" onClick={() => document.getElementById(`add-menu-${index}`)?.classList.toggle('hidden')}>
                      <Plus size={14} />
                    </button>
                    {/* Mini Add Menu */}
                    <div id={`add-menu-${index}`} className="hidden absolute top-6 bg-white shadow-xl rounded-lg border border-gray-200 p-2 flex gap-2 z-20">
                      <button onClick={() => addBlock('text', index)} className="p-2 hover:bg-gray-100 rounded text-xs flex flex-col items-center"><Type size={16} /> Metin</button>
                      <button onClick={() => addBlock('image', index)} className="p-2 hover:bg-gray-100 rounded text-xs flex flex-col items-center"><ImageIcon size={16} /> Görsel</button>
                      <button onClick={() => addBlock('split', index)} className="p-2 hover:bg-gray-100 rounded text-xs flex flex-col items-center"><Columns size={16} /> Yan Yana</button>
                    </div>
                  </div>

                  <div
                    className={`
                                    bg-white rounded-xl border-2 transition-all duration-200 relative
                                    ${activeBlockId === block.id ? 'border-bio-mint shadow-lg ring-4 ring-bio-mint/10' : 'border-transparent hover:border-gray-300 shadow-sm'}
                                `}
                    onClick={() => setActiveBlockId(block.id)}
                  >
                    {/* Block Controls (Visible on Active/Hover) */}
                    <div className={`absolute right-2 top-2 flex gap-1 ${activeBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity bg-white/80 backdrop-blur rounded-lg p-1 border border-gray-100 z-10`}>
                      <button onClick={(e) => moveBlock(index, 'up', e)} disabled={index === 0} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><ChevronUp size={14} /></button>
                      <div className="w-px bg-gray-200 mx-1"></div>
                      <button onClick={(e) => moveBlock(index, 'down', e)} disabled={index === blocks.length - 1} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><ChevronDown size={14} /></button>
                      <div className="w-px bg-gray-200 mx-1"></div>
                      <button onClick={(e) => removeBlock(block.id, e)} className="p-1.5 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                    </div>

                    {/* Drag Handle (Visual Only) */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 cursor-move opacity-0 group-hover:opacity-100 p-2">
                      <GripVertical size={16} />
                    </div>

                    <div className="p-6 md:p-8 pl-10">
                      {/* Generic Content Renderer */}
                      {block.type === 'split' ? (
                        renderSplitEditor(block)
                      ) : block.type === 'divider' ? (
                        <hr className="border-gray-200" />
                      ) : (
                        renderBlockSpecificContent(
                          block.type,
                          block.content,
                          block.data,
                          (field, val) => {
                            if (field === 'content') updateBlockContent(block.id, val);
                            else updateBlockData(block.id, val);
                          },
                          { blockId: block.id }
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Button at Bottom */}
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl m-4 hover:border-bio-mint hover:bg-white transition-colors cursor-pointer" onClick={() => addBlock('text')}>
                <div className="text-gray-400 flex flex-col items-center">
                  <Plus size={24} />
                  <span className="text-sm font-medium">Sonuna Ekle</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Settings Drawer and Modals remain same */}
      <div className={`
        fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-30 transform transition-transform duration-300
        ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Settings size={18} /> Ders Ayarları</h3>
            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Settings Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="label-text">Ders Başlığı</label>
                <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="label-text">URL Slug</label>
                <input type="text" className="input-field bg-gray-50 text-gray-500" value={slug} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-text">Sınıf</label>
                  <select className="input-field" value={gradeId} onChange={(e) => setGradeId(e.target.value)} disabled>
                    {GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Ünite</label>
                  <input type="text" className="input-field bg-gray-50" value={unitTitle} readOnly />
                </div>
              </div>
              <div>
                <label className="label-text">Konu</label>
                <input type="text" className="input-field bg-gray-50" value={topicTitle} readOnly />
              </div>
              <div>
                <label className="label-text">Açıklama (SEO)</label>
                <textarea rows={3} className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="label-text">Kapak Görseli</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    value={coverImage?.startsWith('data:') ? 'Yerel dosya yüklendi' : coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    disabled={coverImage?.startsWith('data:')}
                  />
                  <label className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-primary-700 transition-colors flex items-center gap-1 whitespace-nowrap">
                    <Plus size={14} /> Dosya
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setCoverImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {coverImage?.startsWith('data:') && (
                    <button onClick={() => setCoverImage('')} className="px-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
                {coverImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24">
                    <img src={coverImage} alt="Kapak" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700">Yayında</div>
                <div
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${isPublished ? 'bg-bio-mint' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isPublished ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Şablon Seçimi</h3>
                <p className="text-gray-500 text-sm">Hızlı başlangıç için hazır ders yapıları</p>
              </div>
              <button onClick={() => setIsTemplateModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {TEMPLATES.map(template => (
                  <div key={template.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-bio-mint transition-all group flex flex-col h-full cursor-pointer" onClick={() => loadTemplate(template.blocks)}>
                    {/* Template Preview (CSS Scaled Mini-Site) */}
                    <div className="bg-gray-100 h-64 border-b border-gray-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left transform scale-50 bg-white p-6 space-y-4">
                        {template.blocks.slice(0, 5).map((b, i) => (
                          <div key={i} className="w-full">
                            {b.type === 'text' && (
                              <div className="space-y-2">
                                {b.content?.includes('h3') && <div className="h-4 bg-gray-800 rounded w-1/2"></div>}
                                <div className="h-2 bg-gray-300 rounded w-full"></div>
                                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                              </div>
                            )}
                            {b.type === 'image' && (
                              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                <ImageIcon size={32} />
                              </div>
                            )}
                            {b.type === 'video' && (
                              <div className="w-full h-32 bg-slate-900 rounded flex items-center justify-center text-white">
                                <Video size={32} />
                              </div>
                            )}
                            {b.type === 'callout' && (
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded flex gap-2">
                                <AlertTriangle size={16} className="text-yellow-600" />
                                <div className="space-y-1 w-full">
                                  <div className="h-2 bg-yellow-200 w-1/3 rounded"></div>
                                  <div className="h-1 bg-yellow-100 w-full rounded"></div>
                                </div>
                              </div>
                            )}
                            {b.type === 'split' && (
                              <div className="flex gap-4">
                                <div className="w-1/2 h-20 bg-gray-100 rounded border border-gray-200"></div>
                                <div className="w-1/2 h-20 bg-gray-100 rounded border border-gray-200"></div>
                              </div>
                            )}
                            {b.type === 'quiz' && (
                              <div className="p-4 border border-purple-200 bg-purple-50 rounded">
                                <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-xs"><HelpCircle size={12} /> Quiz</div>
                                <div className="h-2 bg-white rounded w-full border border-purple-100"></div>
                              </div>
                            )}
                            {b.type === 'table' && (
                              <div className="border border-gray-200 rounded overflow-hidden">
                                <div className="h-6 bg-gray-100 border-b border-gray-200 flex">
                                  <div className="w-1/3 border-r border-gray-200"></div>
                                  <div className="w-1/3 border-r border-gray-200"></div>
                                  <div className="w-1/3"></div>
                                </div>
                                <div className="h-6 border-b border-gray-200"></div>
                                <div className="h-6"></div>
                              </div>
                            )}
                            {b.type === 'list' && (
                              <div className="space-y-1">
                                <div className="flex gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div><div className="h-1 bg-gray-200 w-3/4 rounded"></div></div>
                                <div className="flex gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div><div className="h-1 bg-gray-200 w-1/2 rounded"></div></div>
                                <div className="flex gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div><div className="h-1 bg-gray-200 w-2/3 rounded"></div></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                          <MousePointer2 size={16} /> Seç
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2 text-bio-mint-dark">
                        {template.icon && template.icon}
                        <h4 className="font-bold text-gray-800 text-sm">{template.name}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">{template.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">{template.blocks.length} Blok</span>
                        <button className="text-xs text-bio-mint-dark font-bold hover:underline">Kullan &rarr;</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

            {modalConfig.type === 'quiz' && (
              <QuizModal
                initialData={modalConfig.initialData}
                onSave={handleSaveModalData}
                onClose={() => setModalConfig(null)}
              />
            )}

            {modalConfig.type === 'flashcard' && (
              <FlashcardModal
                initialData={modalConfig.initialData}
                onSave={handleSaveModalData}
                onClose={() => setModalConfig(null)}
              />
            )}
          </div>
        </div>
      )}

      <style>{`
        .label-text { display: block; font-size: 0.75rem; font-weight: 700; color: #6b7280; margin-bottom: 0.25rem; text-transform: uppercase; }
        .input-field { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.875rem; outline: none; transition: border-color 0.2s; background-color: #ffffff; color: #1f2937; }
        .input-field:focus { border-color: #00D9A3; box-shadow: 0 0 0 2px rgba(0, 217, 163, 0.1); }
      `}</style>
    </div>
  );
};

export default LessonBuilder;
