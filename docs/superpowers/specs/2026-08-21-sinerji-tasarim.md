# Sinerji — Manevi Birlik ve Dua Halkası

**Durum:** Tasarım / beyin fırtınası aşaması (taslak)
**Son güncelleme:** 2026-08-21
**Klasör:** `E:\ksaim\claude programlar\sinerji`

---

## 1. Amaç

İnsanların birbirinden dua istediği, ortak zikir/dua halkalarına katıldığı, özel gün ve gecelerde ne
okunacağını gördüğü ve kendi manevi okumalarının kaydını tuttuğu bir cep telefonu uygulaması.

Ana fikir: tek başına okuma yerine **aynı anda, aynı niyetle okuyan bir topluluk hissi** — "sinerji".

---

## 2. Karara bağlananlar ✅

### 2.1 Ana ekran: **D — ince kandil şeridi + akış**

- En üstte tek satır: hicri tarih + o günün özel durumu
  (`14 Rebîülevvel · Perşembe — Akşam: Regâib Kandili`). Tıklanınca "Bugün" ekranı tam açılır.
- Kandil olmayan sıradan günlerde şerit boş kalmaz: `Bugün Perşembe · Salavat günü` gibi hafif tavsiye.
- Altında selamlama (`Selamünaleyküm, Kamil`), sonra **Bugünün Niyeti** kartı (altın çerçeveli),
  sonra **Canlı Halkalar** listesi.
- Alt menü (5 sekme): `Akış` · `Halkalar` · `Zikir` · `Dua` · `Günlüğüm`

### 2.2 Görsel kimlik

- Zemin: **koyu turkuaz degrade** — `#08222b → #0e3a44 (55%) → #08222b`
  - Lacivert→yeşil (`ilkuretim.jpg`) degradesi denendi, **beğenilmedi ve geri alındı.**
    Gerekçe: koyu turkuaz hem logoya daha yakın duruyor hem gece okumada göz yormuyor.
- Vurgu 1: **turkuaz** `#3ee6cf` — butonlar, ilerleme çubukları, canlı sayılar
- Vurgu 2: **altın** `#f5c451` — kandil, "bugünün niyeti", yıldız ✦
- Kartlar: yarı saydam beyaz (`rgba(255,255,255,.07)`) + ince turkuaz kenarlık, 14px köşe
- İkon dili: logodaki **sekiz köşeli yıldız ✦** uygulamanın her yerinde tekrar eder

### 2.2.1 Alt menü animasyonu ✅

Sekmeye tıklanınca ikon **logodaki yıldız gibi kabarır**: hafifçe dönerek (-45° → 0) büyür
(0.7 → 1.45 → 1.12 ölçek, `cubic-bezier(.2,1.5,.4,1)`, ~0.5 sn) ve arkasında turkuaz bir hale açılır.
Uygulamanın imza hareketi bu olacak.

### 2.3 İçerik türleri — üç ayrı şey

| Tür | Ne | Nasıl katılınır | Örnek |
|---|---|---|---|
| **Halka** | Ortak okuma | "+ okudum" ya da tesbih gibi tek tek sayarak | "Fatiha okuyalım", "1.000.000 Salavat" |
| **Hatim Halkası** *(v2)* | Paylaşımlı iş (30 cüz vb.) | Cüz/pay "kapılır", bitince işaretlenir | "Merhume Fatma Hanım için hatim" |
| **Dua isteği** | Hedefi yok, sadece niyet | Tek dokunuş "dua ettim" | "Mehmet'in sınavı · Cumaya kadar" |

### 2.4 Halka süre/hedef modelleri

- **Süresiz** — bitiş yok, hedef yok, toplam sürekli artar. (Örn. "Fatiha okuyalım")
- **Hedefli** — 1.000.000'a ulaşınca tamamlanır; istenirse otomatik yeni tur açar.
- **Süreli** — "Salıya kadar"; tarih dolunca kapanır ve özet kartı çıkar.

### 2.5 Canlı zikir / tesbih ekranı

- Büyük daireye ya da butona her dokunuşta **+1**, hafif titreşim.
- Üstte halkanın **canlı artan toplamı** — başkaları okudukça gözünün önünde yükselir.
- `● CANLI · 42 kişi` rozeti; ara ara "az önce biri okudu" bildirimi.
- **Metin uzun olabilir** — sadece kısa zikir değil; uzun bir dua, tövbe/istiğfar metni, uzun salavat
  da olabilir. Bu yüzden metin alanı serbestçe **kaydırılabilir**, sayaç ise **hep sabit** durur.
- Metin bloğu: Arapça + okunuş (transliterasyon) + meal.
- **Performans:** dokunuş ekranda anında görünür, sunucuya 2 saniyede bir **toplu** gönderilir.
  Çevrimdışıyken biriktirilir, bağlanınca senkronlanır.

### 2.5.1 Sayma ekranı yerleşimi ✅ — KARAR VERİLDİ

**A · Metin kayar, sayaç altta sabit** seçildi (bkz. `sayma-v2.html` mockup).

- Üstte başlık ve canlı rozet (`● 42`)
- Ortada kaydırılabilir metin: Arapça + okunuş (transliterasyon) + meal, "devamı" ile genişler
- Altta sabit şerit: solda senin sayın, sağda halkanın canlı toplamı
- Altında büyük `✦ +1` butonu (turkuaz dolgu, tam yuvarlak)

B (odak modu — büyük dokunma dairesi) v2'ye ertelendi / şimdilik uygulanmayacak; ileride
kullanıcı tercihi olarak eklenebilir ama v1 kapsamında değil.

### 2.6 Tasarım ilkesi: riya kalkanı 🔒 — KABUL EDİLDİ ✅

Karar: **isimler gizli kalsın, yarış olmasın.**

- **Liderlik tablosu yok.** Kimin kaç okuduğu başkasına gösterilmez.
- Sadece **toplam** görünür: "2.418 kişi · 241.800 salavat".
- Katılımcılar sayı olarak görünür, isim listesi yok.
- Kişisel istatistik yalnızca kendine açık (`Günlüğüm`).
- Dua isteğinde isim gizleme seçeneği: "Bir kardeşimiz için".

### 2.7 Teknik yön

- **Tek HTML dosyası → PWA**
- **Supabase**: Auth (Google girişi), Postgres, Realtime (canlı sayaçlar), RLS
- **Bildirim**: Web Push (VAPID) + Supabase Edge Function / cron
- ⚠️ iPhone'da web bildirimi ancak uygulama "Ana Ekrana Eklendi"yse çalışır.
  Mağazaya gerçek uygulama gerekirse aynı HTML Capacitor ile APK/IPA'ya sarılır, kod değişmez.

---

## 3. Öneri havuzu (henüz onaylanmadı)

- **Tek dokunuşla katılma** — akıştaki kartın üstünde "+ okudum", sayacı açmadan ekler.
- **Cüz rezervasyonu zaman aşımı** *(v2)* — 24 saatte okunmayan cüz otomatik serbest kalır.
- **Halka tamamlanma kartı** — hedef dolunca paylaşılabilir görsel üretilir (WhatsApp → yeni kullanıcı).
- **Özel halka / davet linki** — aile veya cemaat için gizli halka, link ya da QR ile katılım.
- **Çevrimdışı sayaç** — internetsiz sayar, bağlanınca senkronlar.
- **Metin desteği** — her zikir için Arapça + okunuş + meal; ses opsiyonel.
- **Bildirimler (günde en fazla 1–2)**:
  - Sabah: "Bugünün niyeti: … · 2.418 kişi okuyor"
  - Kandil arifesi akşamı
  - "Senin dua isteğine 84 kişi katıldı"
  - Kullanıcının kendi kurduğu hatırlatıcı (ör. her gün 21:00)

---

## 4. Sürüm bölünmesi ✅

- **v1:** Google giriş · Akış (D ekranı) · Halka + Dua isteği oluşturma/katılma · canlı tesbih sayacı
  (uzun metin destekli) · kişisel zikirmatik · Günlüğüm · hicri takvim & kandil tavsiyeleri · bildirimler
- **v2:** **Hatim (cüz paylaşımı)** · özel/davetli halkalar · ses ve meal · paylaşılabilir tamamlanma görseli

Karar: **hatim halkası v2'ye alındı.**

---

## 5. Açık sorular — hepsi karara bağlandı ✅

1. ~~Sayma ekranı: A mı, B mi?~~ ✅ **A seçildi** (bkz. 2.5.1)
2. ~~Yıldız kabarma animasyonu hızı/şiddeti~~ ✅ **Mevcut (spec) varyant onaylandı** — 0.7→1.45→1.12
   ölçek, -45°→0° dönüş, 0.5sn, `cubic-bezier(.2,1.5,.4,1)`. "Yumuşak" ve "Belirgin/oyunsu"
   alternatifleri denendi, mevcut değer beğenildi, değişiklik yok.

Tasarım dokümanı kesinleşti → sıradaki adım `writing-plans` ile uygulama planı yazımı.

---

## 6. Dosyalar

- `logo.png` — koyu zemin için parlak logo (dikey, alt yazılı)
- `deneme.png` — beyaz zemin için sade logo
- `ilkuretim.jpg` — lacivert→yeşil degrade banner (bu degrade uygulamada **kullanılmayacak**)
- `.superpowers/brainstorm/<oturum>/content/` — görsel mockup'lar (HTML taslaklar):
  - `ana-ekran.html` — A / B / C ilk üç ana ekran fikri
  - `ana-ekran-v2.html` — D / E birleşik fikirler (**D seçildi**)
  - `canli-zikir.html` — canlı zikir ilk denemesi (lacivert palet, **beğenilmedi**)
  - `sayma-v2.html` — düzeltilmiş sayma ekranı A/B + alt menü yıldız animasyonu demosu

---

## 7. Evden devam etmek için

1. Bu dosyayı oku — **2. bölüm** karar verilenler, **5. bölüm** kaldığımız yer.
2. Mockup'ları görmek için tarayıcı sunucusunu yeniden başlat (arka planda):

   ```
   "C:\Users\ksaim\.claude\plugins\cache\claude-plugins-official\superpowers\5.1.0\skills\brainstorming\scripts\start-server.sh" --project-dir "E:\ksaim\claude programlar\sinerji"
   ```

   Sonra `.superpowers/brainstorm/<yeni-oturum>/state/server-info` dosyasındaki adresi tarayıcıda aç.
   Sunucu **en son değişen** HTML'i gösterir; eski bir taslağa bakmak için o dosyayı yeni oturumun
   `content/` klasörüne kopyalamak yeterli.
3. 5. bölümdeki 2 soruyu cevapla, sonra plan yazımına geç.
