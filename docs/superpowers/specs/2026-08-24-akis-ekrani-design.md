# Sinerji — Akış Ekranı Tasarımı (Plan 2)

**Durum:** Onaylandı
**Son güncelleme:** 2026-08-24
**Önceki:** [2026-08-21-sinerji-tasarim.md](2026-08-21-sinerji-tasarim.md) — genel ürün spec'i, bölüm 2.1

---

## 1. Amaç

Plan 1 (altyapı/auth/PWA) tamamlandı: giriş yapan kullanıcı 5 sekmeli boş bir kabuk görüyor. Bu plan,
o kabuğun ilk sekmesini — **Akış** ekranını — spec'in 2.1 bölümünde tarif edildiği gibi gerçek içerikle
doldurur.

## 2. Kapsam

Giriş sonrası görünen ana ekran:

1. **İnce kandil şeridi** — en üstte tek satır: hicri tarih + o günün özel durumu
   (`14 Rebîülevvel · Perşembe — Akşam: Regâib Kandili`). Kandil olmayan günlerde hafif bir tavsiye
   metni gösterir (`Bugün Perşembe · Salavat günü`).
2. **Selamlama** — `Selamünaleyküm, <ad>` (oturumdaki kullanıcı adından).
3. **Bugünün Niyeti kartı** — altın çerçeveli, sabit/örnek bir niyet metni gösterir.
4. **Canlı Halkalar listesi** — örnek (mock) halka kartları: başlık, tür etiketi, toplam sayı,
   katılımcı sayısı.
5. **Alt menü** artık işlevsel: sekmeye tıklanınca `#screen-content` içeriği değişir. Akış sekmesi
   gerçek ekranı gösterir, diğer 4 sekme (`Halkalar`, `Zikir`, `Dua`, `Günlüğüm`) "yakında" placeholder'ı
   gösterir.

**Kapsam dışı:** Supabase halka/dua tabloları, gerçek katılım/kayıt, canlı sayaç (Realtime), bildirimler,
diğer 4 sekmenin gerçek içeriği. Bunlar ayrı planlara bırakılır (bkz. ana spec bölüm 4).

## 3. Hicri takvim hesaplama

Kütüphanesiz, tabular **Kuwaiti algoritması** ile miladi→hicri çevrim yapılır. Kandil/özel günler
(Regâib, Mirac, Berat, Kadir, Ramazan/Kurban Bayramı vb.) hicri ay+gün eşleşmesiyle sabit bir tablodan
bulunur. ±1 gün sapma olabilir — hicri takvim gözlemsel olduğu için bu kabul edilebilir, spec'te de
not edilmiştir.

`src/lib/hijri.js`:
- `gregorianToHijri(date)` → `{ year, month, day }`
- `getTodayInfo(date = new Date())` → `{ hijriLabel, specialNote }`
  - `hijriLabel`: `"14 Rebîülevvel · Perşembe"` formatında
  - `specialNote`: o gün bir kandil/özel günse `"Akşam: Regâib Kandili"` gibi bir metin, değilse
    günün adına göre hafif bir tavsiye (`"Salavat günü"` gibi, sadece Cuma için; diğer günler `null`)

## 4. Mock veri

`src/lib/mock-data.js` — sabit bir dizi, gerçek veri modeli gelene kadar kullanılır:

```js
export const MOCK_RINGS = [
  { id: '1', title: 'Fatiha okuyalım', type: 'süresiz', total: 12480, participants: 342 },
  { id: '2', title: '1.000.000 Salavat', type: 'hedefli', total: 241800, goal: 1000000, participants: 2418 },
  { id: '3', title: "Mehmet'in sınavı · Cumaya kadar", type: 'dua', participants: 84 },
];
```

`type` alanı kart üzerinde küçük bir etiket olarak gösterilir (süresiz/hedefli/süreli/dua ayrımı,
spec bölüm 2.3).

## 5. Bileşen yapısı

```
src/
├── lib/
│   ├── hijri.js              # miladi→hicri çevrim + kandil tablosu
│   └── mock-data.js          # örnek halka listesi
├── ui/
│   ├── render-shell.js       # GÜNCELLENIR: sekme state'i + screen mount
│   └── screens/
│       ├── feed-screen.js    # Akış ekranı: şerit + selamlama + niyet kartı + halka listesi
│       └── placeholder-screen.js  # diğer 4 sekme için "yakında" ekranı
test/
├── hijri.test.js
├── feed-screen.test.js
└── render-shell.test.js      # GÜNCELLENIR: sekme tıklama davranışı eklenir
```

**render-shell.js değişikliği:** Şu anki `renderShell(root, state)` imzası aynı kalır. İçeride oturum
varsa artık aktif sekme durumunu tutan küçük bir yerel state (`activeTab`, başlangıç `'Akış'`) eklenir;
sekmeye tıklanınca `#screen-content` yeniden render edilir (`feed-screen` ya da `placeholder-screen`).
Bu state component-local'dir, `session-store`'a taşınmaz (henüz başka ekranların ihtiyacı yok — YAGNI).

## 6. Test stratejisi

TDD, kırmızı-yeşil döngüsüyle:
- `hijri.js`: bilinen birkaç miladi↔hicri tarih çifti ile (ör. 2026-08-24 → beklenen hicri tarih) ve
  en az bir kandil gününün doğru tespit edildiği testler.
- `feed-screen.js`: happy-dom ile, mock veriden doğru sayıda halka kartı render edildiğini, başlık ve
  katılımcı sayılarının metinde göründüğünü doğrulayan testler.
- `render-shell.js`: sekmeye tıklayınca `#screen-content` içeriğinin değiştiğini doğrulayan bir test
  eklenir (mevcut 3 test korunur).

## 7. Sonraki plan

Plan 3 (henüz yazılmadı): Halka/Dua veri modeli — Supabase tabloları (halkalar, katılımlar, dua
istekleri), RLS kuralları, gerçek veri çekme. Bu tamamlanınca Akış ekranındaki mock veri gerçek
Supabase sorgusuyla değiştirilir.
