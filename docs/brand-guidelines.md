# Sinerji — Marka Kimliği Rehberi v1.0

> Son güncelleme: 2026-08-23
> Durum: Onaylı temel + genişletme (bkz. `docs/superpowers/specs/2026-08-21-sinerji-tasarim.md`)

## Hızlı Referans

| Öğe | Değer |
|---|---|
| Primary Color | #3ee6cf |
| Secondary Color | #f5c451 |
| Accent Color | #2bb8a5 |
| Ana Zemin | `#08222b` → `#0e3a44` (%55) → `#08222b` degrade |
| Ana Font | Manrope (başlık) / Inter (gövde) |
| Ses | Sakin, samimi, mahrem, gösterişsiz |
| İkon motifi | Sekiz köşeli yıldız ✦ |

---

## 1. Renk Paleti

### Zemin

| Ad | Hex | Kullanım |
|---|---|---|
| Zemin Koyu | `#08222b` | Degradenin uç noktaları, en koyu alan |
| Zemin Orta | `#0e3a44` | Degradenin %55 durağı, gece okuma zemini |

```css
background: linear-gradient(180deg, #08222b 0%, #0e3a44 55%, #08222b 100%);
```

Bu degrade **sabit imzadır** — değiştirilmez. `ilkuretim.jpg`'deki lacivert→yeşil geçiş
reddedildi, bir daha denenmeyecek.

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Turkuaz (Canlı) | #3ee6cf | rgb(62,230,207) | Butonlar, ilerleme çubukları, canlı sayaçlar, aktif sekme halesi |
| Turkuaz Koyu | #2bb8a5 | rgb(43,184,165) | Hover/basılı durum, ikincil turkuaz vurgu |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Altın (Kutsal) | #f5c451 | rgb(245,196,81) | Kandil rozetleri, "bugünün niyeti" kartı, yıldız ikon dolgusu |
| Altın Koyu | #c99a2e | rgb(201,154,46) | Altın öğelerin hover/basılı durumu |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Turkuaz Koyu | #2bb8a5 | rgb(43,184,165) | Vurgu, halka teması |

Kural: **turkuaz = şu an olan/aktif eylem**, **altın = özel/kutsal/dikkat çeken an**.
İkisi aynı öğede aynı ağırlıkta kullanılmaz — biri her zaman baskın olmalı.

### Nötr Palet (koyu zemine göre)

| Ad | Değer | Kullanım |
|---|---|---|
| Kart Yüzeyi | `rgba(255,255,255,.07)` | Kart arkaplanı |
| Kart Kenarlığı | `rgba(62,230,207,.25)` | İnce turkuaz kenarlık, 1px |
| Kart Kenarlığı (hover) | `rgba(62,230,207,.45)` | Etkileşimde belirginleşir |
| Metin Birincil | `rgba(255,255,255,.95)` | Başlıklar, ana metin |
| Metin İkincil | `rgba(255,255,255,.62)` | Alt başlık, açıklama, meta bilgi |
| Metin Üçüncül | `rgba(255,255,255,.38)` | Zaman damgası, çok pasif metin |
| Ayraç | `rgba(255,255,255,.10)` | İnce çizgiler, bölücüler |

### Durum Renkleri

| Durum | Hex | Kullanım |
|---|---|---|
| Başarı / Tamamlandı | `#3ee6cf` (turkuaz aynısı) | Halka tamamlandı, hedefe ulaşıldı — ayrı bir yeşil **kullanılmaz**, marka tutarlılığı için turkuaz görev görür |
| Uyarı / Süre azalıyor | `#f5c451` (altın aynısı) | "Salıya kadar" gibi süreli halkalarda son 24 saat |
| Hata / Bağlantı yok | `#e0645a` | Çevrimdışı/senkron hatası rozeti — **tek kırmızı ton, minimum kullanım** |
| Bilgi / Nötr rozet | `rgba(255,255,255,.62)` üzeri beyaz | Genel bilgilendirme etiketleri |

Not: Dini/manevi bir uygulamada yeşil "başarı" rengi kültürel olarak fazla yüklü olabileceğinden
(bayrak/din çağrışımı) bilinçli olarak **kullanılmıyor** — turkuaz bu rolü de üstleniyor.

### Erişilebilirlik

- Beyaz metin (`.95` opaklık) koyu zemin üzerinde 15:1+ kontrast — AAA.
- Turkuaz `#3ee6cf` koyu zemin üzerinde metin olarak kullanılabilir (7:1+); buton dolgusu olarak
  üzerine **koyu metin** (`#08222b`) konur, beyaz değil.
- Altın `#f5c451` üzerine de koyu metin (`#08222b`) konur.
- Kırmızı hata rengi asla tek başına anlam taşımaz — yanında ikon/metin bulunur (renk körlüğü).

---

## 2. Tipografi

### Font Seçimi

Uygulama Türkçe + Arapça karışık metin taşıyacak (zikir/dua metinleri). Bu yüzden:

- **Başlık/UI:** Manrope — geometrik, sıcak, aşırı kurumsal durmayan bir sans-serif
- **Gövde/uzun metin:** Inter — okunabilirlik yüksek, uzun dua metinlerinde yorulmaz
- **Arapça metin:** Sistem varsayılan Arapça fontu (ör. Noto Naskh Arabic) — kendi font stackine
  karışmaz, dini metnin özgün görünümü korunur

```css
--font-heading: 'Manrope', system-ui, -apple-system, sans-serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
--font-arabic: 'Noto Naskh Arabic', 'Traditional Arabic', serif;
```

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Tip Ölçeği

| Öğe | Boyut | Ağırlık | Satır Yük. | Kullanım |
|---|---|---|---|---|
| H1 | 28px | 700 | 1.2 | Ekran başlığı ("Bugünün Niyeti") |
| H2 | 22px | 600 | 1.25 | Kart başlığı, bölüm başlığı |
| H3 | 18px | 600 | 1.3 | Alt kart başlığı |
| Gövde | 16px | 400 | 1.55 | Standart metin |
| Gövde Büyük | 18px | 400 | 1.65 | Uzun dua/zikir metni (okuma konforu için) |
| Küçük | 14px | 400 | 1.5 | Meta bilgi, "42 kişi" gibi rozet metni |
| Alt yazı | 12px | 500 | 1.4 | Zaman damgası, ikon altı etiket |
| Canlı Sayaç | 32–40px | 800 | 1.1 | Büyük artan toplam rakamı — Manrope Extra Bold |

Kural: Arapça metin her zaman gövde metninden **en az %20 büyük** gösterilir (okunuşundan
ayrışsın), meal ise gövde boyutunda ama `İkincil Metin` renginde.

---

## 3. Logo Kullanımı

### Varyantlar

| Varyant | Dosya | Kullanım |
|---|---|---|
| Koyu zemin logosu | `logo.png` | Uygulama içi koyu turkuaz zemin, splash ekranı |
| Açık zemin logosu | `deneme.png` | Store listing, beyaz zemindeki dokümanlar, paylaşım kartları |
| İkon (yıldız) | logodan türetilecek tek renk ✦ | Favicon, app icon, alt menü aktif hâli |

**Kullanılmayacak:** `ilkuretim.jpg` — reddedilmiş lacivert→yeşil degrade denemesi, hiçbir
üründe kullanılmaz, sadece arşiv amaçlı tutulur.

### Berrak Alan (Clear Space)

Logonun etrafında en az logodaki yıldız işaretinin yüksekliği kadar boşluk bırakılır.

### Minimum Boyut

| Bağlam | Min. Genişlik |
|---|---|
| Splash / tam logo | 160px |
| Sadece yıldız ikon | 20px |
| Favicon | 32px (16px'e kadar okunur kalmalı) |

### Yapılmaması Gerekenler

- Logoyu döndürme veya eğme
- Palet dışı renk kullanma (logo sadece turkuaz/altın/beyaz varyantlarında var olur)
- Gölge, glow, 3D efekt ekleme (yıldızın kendi ince ışıması dışında)
- `ilkuretim.jpg` degradesini arkaplan olarak logoyla birlikte kullanma

---

## 4. İkon / Motif Sistemi — Sekiz Köşeli Yıldız ✦

Logodaki sekiz köşeli yıldız, uygulamanın **tek tekrar eden imza motifi**dir. Diğer ikonlar
(ev, kalp, sekme ikonları vb.) standart outline ikon dilinde kalır; yıldız yalnızca şu
bağlamlarda özel olarak kullanılır:

| Bağlam | Yıldız kullanımı |
|---|---|
| Alt menü aktif sekme | Kabarma animasyonu (bkz. spec 2.2.1), turkuaz hale |
| "Canlı halka" rozeti | Küçük dolu altın yıldız, kandil/özel gün işareti olarak |
| Halka tamamlandı kartı | Büyük yıldız patlaması / konfeti yerine geçen motif |
| Zikirmatik "+1" butonu | Buton dolgusunun ortasında ince yıldız silueti (opsiyonel, aşırıya kaçmadan) |
| Boş durum illüstrasyonları | Soluk, tek renkli yıldız desenleri (arkaplan dokusu gibi, %4-8 opaklık) |

### İkon Stili (genel, yıldız dışı)

- Stil: Outline (dolgusuz), 24px temel ızgara
- Çizgi kalınlığı: 1.5px
- Köşe yarıçapı: 2px
- Renk: varsayılan `İkincil Metin`, aktifken `Turkuaz`

### Yıldız Türevleri

- **Dolu altın yıldız** — kandil/özel gün işareti
- **Dolu turkuaz yıldız** — aktif/canlı durum işareti
- **Outline yıldız** — pasif/nötr referans (ör. "günlük" sekmesi ikonu)
- **Soluk desen yıldız** (%4-8 opaklık, tekrarlanan doku) — kart arkaplanı süslemesi, aşırı
  kullanılmaz, sadece büyük boş alanlarda (onboarding, boş durum ekranları)

---

## 5. Kart & Buton Stil Token'ları

### Kartlar

```css
--card-bg: rgba(255,255,255,.07);
--card-border: 1px solid rgba(62,230,207,.25);
--card-border-hover: rgba(62,230,207,.45);
--card-radius: 14px;
--card-padding: 16px;
--card-shadow: 0 4px 24px rgba(0,0,0,.25);
```

### Butonlar

| Tür | Zemin | Metin | Kenarlık | Radius |
|---|---|---|---|---|
| Birincil (aksiyon) | `#3ee6cf` | `#08222b` (koyu) | yok | 12px |
| İkincil (kutsal/özel) | `#f5c451` | `#08222b` (koyu) | yok | 12px |
| Üçüncül (nötr) | şeffaf | `rgba(255,255,255,.85)` | `1px solid rgba(255,255,255,.18)` | 12px |
| Yıkıcı (nadiren) | şeffaf | `#e0645a` | `1px solid rgba(224,101,90,.35)` | 12px |
| Büyük "+1" sayaç butonu | `#3ee6cf` dairesel gradyan | `#08222b` | ince altın glow (basılınca) | 9999px (tam yuvarlak) |

### Boşluk Ölçeği

| Token | Değer |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

### Köşe Yarıçapı

| Öğe | Radius |
|---|---|
| Kartlar | 14px |
| Butonlar | 12px |
| Rozetler / pill | 9999px |
| Modal / alt sayfa | 20px (üst köşeler) |
| Sayaç butonu | 9999px |

### Animasyon Token'ı — Yıldız Kabarma (imza hareket)

```css
--star-pop-timing: cubic-bezier(.2,1.5,.4,1);
--star-pop-duration: 0.5s;
/* scale: 0.7 -> 1.45 -> 1.12, rotate: -45deg -> 0deg, turkuaz hale fade-in */
```

---

## 6. Marka Sesi & Tonu

### Marka Kişiliği

| Özellik | Açıklama |
|---|---|
| **Sakin** | Aceleci değil, bildirimler günde 1-2 ile sınırlı, dil huzur verici |
| **Samimi** | "Selamünaleyküm, Kamil" gibi kişisel ama resmiyetsiz hitap |
| **Mahrem** | Riya kalkanı ilkesi diline de yansır — "sen ne kadar okudun" değil "topluluk ne yaptı" vurgusu |
| **Gösterişsiz** | Abartılı övgü, başarı rozeti şovu, rekabet dili yok |

### Ses Tablosu

| Özellik | Biziz | Biz değiliz |
|---|---|---|
| Sakin | Yumuşak, davetkâr | Aciliyet yaratan, bildirim spam'i yapan |
| Samimi | Sıcak, birebir hitap | Soğuk-kurumsal ("Sayın kullanıcı") |
| Mahrem | Toplu başarıyı öne çıkaran | Kişisel skor/sıralama gösteren |
| Gösterişsiz | Sade, net ifade | Pazarlama dili, ünlem yığını |

### Bağlama Göre Ton

| Bağlam | Ton | Örnek |
|---|---|---|
| Karşılama | Sıcak, kısa | "Selamünaleyküm, Kamil" |
| Bugünün niyeti | Davetkâr, teşvik edici | "Bugün 2.418 kişiyle birlikte salavat getiriyoruz" |
| Halka tamamlandı | Şükran ifadeli, sakin | "Halka tamamlandı — Allah kabul etsin" |
| Bildirim | Kısa, bilgilendirici, dayatmayan | "Bugünün niyeti: Salavat · 2.418 kişi okuyor" |
| Hata / çevrimdışı | Sakinleştirici, teknik detay yok | "Bağlantı yok, okumaların kaydedildi, bağlanınca eklenecek" |
| Dua isteği paylaşımı | Duygusal ama ölçülü | "Mehmet'in sınavı için · Cumaya kadar" |

### Kaçınılacak İfadeler

| Kaçın | Neden |
|---|---|
| "Skor", "Sıralama", "Liderlik" | Riya kalkanı ilkesiyle doğrudan çelişir |
| "En çok okuyan", "Rekor" | Rekabet hissi yaratır, ilkeye aykırı |
| Aşırı ünlem / pazarlama dili ("Muhteşem!", "Kaçırma!") | Manevi bağlama uygun değil, gösterişsiz ilkesine aykırı |
| Kullanıcıyı suçlayıcı/eksiltici dil ("Bugün okumadın") | Ton ilkesine aykırı, huzur bozar |
| "Senkronize" yerine daima "eşitleniyor/kaydediliyor" gibi sade Türkçe | Teknik jargon yerine gündelik dil tercih edilir |

---

## 7. Görsel/İllüstrasyon Yönü

### Fotoğraf/İllüstrasyon Kullanımı

Bu uygulamada gerçek insan fotoğrafı **kullanılmaz** (mahremiyet ve riya kalkanı ilkesiyle
uyumlu — kimlik öne çıkmaz). Bunun yerine:

- Soyut, yumuşak ışık motifleri (yıldız, hâle, degrade lekeler)
- Hicri takvim/kandil temsilleri için minimal, geometrik hilal + yıldız kompozisyonları
- Kalabalık/topluluk hissi **rakamla** ve **hafif nokta/parıltı deseni** ile verilir, insan
  figürüyle değil

### AI Görsel Üretimi — Temel Prompt Şablonu

```
Dark teal gradient background (#08222b to #0e3a44), glowing turquoise (#3ee6cf) and
gold (#f5c451) eight-pointed star motifs, soft ambient light, minimal and serene,
no human figures, spiritual but not overtly religious-iconographic, mobile app UI
aesthetic, high contrast for night reading, subtle glassmorphism cards.
```

| Kategori | Anahtar Kelimeler |
|---|---|
| **Işıklandırma** | soft glow, ambient, gentle bloom around stars |
| **Ruh Hali** | calm, serene, intimate, unhurried |
| **Kompozisyon** | centered star motif, generous negative space, minimal |
| **İşleme** | subtle gradient, glassmorphic cards, no harsh shadows |
| **Estetik** | modern spiritual minimalism, geometric star patterns |

### Görsel Yasaklar

| Kaçın | Neden |
|---|---|
| Gerçek insan yüzü/figürü | Mahremiyet + riya kalkanı ilkesi |
| Parlak/canlı renkli (pembe, mor neon) paletler | Marka paletiyle çelişir, ciddiyeti bozar |
| Aşırı dini ikonografi (cami silüeti, ayet hattatlığı gibi hassas görseller) | Kültürel/dini hassasiyet — sade soyut motifler tercih edilir |
| Rekabet/skor/lider tahtası görselleştirmeleri | Riya kalkanı ilkesine aykırı |

---

## Değişiklik Geçmişi

| Sürüm | Tarih | Değişiklik |
|---|---|---|
| 1.0 | 2026-08-23 | İlk marka rehberi — mevcut tasarım kararlarından (spec 2026-08-21) türetildi, renk/tipografi/ikon/ses genişletildi |
