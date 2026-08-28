<p align="center">
  <img src="logo.png" alt="Sinerji" width="200" />
</p>

<h1 align="center">Sinerji</h1>
<p align="center"><b>Manevi Birlik ve Dua Halkası</b></p>
<p align="center">Aynı anda, aynı niyetle okuyan bir topluluk.</p>

<p align="center">
  <a href="https://sinerji.web.app"><img alt="Canlı" src="https://img.shields.io/badge/canlı-sinerji.web.app-3ee6cf?style=flat-square"></a>
  <img alt="Sürüm" src="https://img.shields.io/badge/sürüm-1.1.1-f5c451?style=flat-square">
  <img alt="Ücretsiz" src="https://img.shields.io/badge/ücretsiz-reklamsız-08222b?style=flat-square">
</p>

---

## Nedir?

İnsanlar birbirinden dua ister; mübarek gecelerde ne okunacağını paylaşır; "şu zikri birlikte
çekelim" der. **Sinerji** bunları tek yerde toplar — tek başına okumak yerine, aynı anda aynı
niyetle okuyan bir topluluk hissi yaratır.

Üç ayrı kavram üzerine kurulu:

| Kavram | Nedir |
|---|---|
| **Grup** | *Kimler.* Aile, mahalle camii, sınıf. Bir kere kurulur, linkle katılınır. |
| **Halka** | *Ne okunacak.* Niyeti, hedefi, süresi vardır. Bitince mühürlenir, grup kalır. |
| **Kişisel vird** | *Kendi günlük zikrin.* Halkalardan bağımsız, kimseye görünmez — yönetici dahil. |

## Öne çıkan tasarım kararları

- **Sıralama / liderlik tablosu yok.** Kimin kaç çektiği başkasına gösterilmez — riya riski.
- **Sessiz katılım varsayılan açık.** İsim görünmeden sayaca eklenirsin.
- **Ücretsiz.** Reklam yok, abonelik yok, ücretli özellik yok.
- **Hedef dolmadan biten halka "başarısız" demez.** Okunan sayıyı öne alır, uzatma teklif eder.
- **Her zikrin kaynağı yazılı.** İhtilaflı adetlerde "gelenektir, farz değildir" notu düşülür.
- **Kişisel vird dokunulmazdır.** Yöneticiler denetim amacıyla halka ve grupları görebilir,
  ama kişisel vird hiçbir zaman kimseye açılmaz.

## Neler var

- 🕋 Ortak zikir/salavat/tesbihat halkaları — açık, linkle veya grup içi
- ✏️ Kurulduktan sonra da düzenlenebilir — halka (başlık, niyet, hedef, zikir) ve kişisel
  vird sahibi kendi kaydını sonradan değiştirebilir
- ✨ AI destekli Arapça + anlam önerisi — kendi yazdığın zikrin okunuşundan Arapça yazımını
  ve kısa Türkçe anlamını otomatik önerir (önce kütüphaneden, yoksa ücretsiz bir yapay
  zeka modelinden; her zaman kullanıcı onayından geçer)
- 📖 Hatim halkaları — cüz/sayfa paylaşımlı, otomatik havuz yönetimi
- 🤲 Dua istekleri — tek dokunuşla "âmin", ya da sayılı okumaya dönüşen istekler
- 🌙 2026-2027 Diyanet dinî gün/gece takvimi + mübarek gecelerde ne okunacağına dair program
- 📿 Kişisel günlük vird — süre hedefli veya süresiz, geçmiş ve seri takibi
- 👥 Grup yönetimi — ad değiştirme, üye çıkarma; katılım yalnızca davet linkiyle
- 🔔 Anlık bildirimler — halka/dua tamamlandığında, onay bekleyen içerikte gerçek OS bildirimi
- 🗓️ Haftalık zikir programı — her gün için önerilen zikirler, ana ekrandan tek dokunuşla virde ekleme
- 🖼️ Paylaşım kartı — tamamlanan halkanın özetini görsel kart olarak PNG'ye çevirip paylaşma
- 📱 PWA — ana ekrana eklenir, çevrimdışı sayaç kuyruğu, kulaklık/ses tuşuyla sayma (Cepte Mod)
- 🛡️ Otomatik risk taraması + moderasyon — kötüye kullanım insan onayından önce işaretlenir
- 🔒 Davet linkleri girişsiz kullanıcıya içerik göstermez — önce giriş, sonra içerik
- 🗑️ Hesabını dilediğin zaman tamamen silme — katıldığın halkalar, verdiğin katkılar korunur

## Teknoloji

- **Vite 7 + React 19 + TypeScript** — react-router-dom 7 ile tek sayfa uygulama
- **Supabase** — Postgres, Auth (yalnızca Google), Row Level Security, pg_cron zamanlanmış işler,
  Edge Functions
- **Google Gemini API** — ücretsiz katman, kendi yazılan zikirler için Arapça/anlam önerisi
- **Firebase Hosting** — statik PWA dağıtımı
- **Service Worker + Web Push + Web App Manifest** — kurulabilir, bildirim gönderebilen PWA deneyimi
- **Android** — Trusted Web Activity (TWA) paketleme, Play Console kapalı test aşamasında

## Durum

🟢 Canlı: **[sinerji.web.app](https://sinerji.web.app)**
🧪 Android: Play Console'da kapalı test aşamasında

Bu depo yalnızca tanıtım amaçlıdır; kaynak kod ve altyapı yapılandırması ayrı, özel tutulur.

## İçerik ve telif

Zikir ve mübarek gece programlarındaki *hangi zikrin kaç defa okunduğu* bilgisi klasik
kaynaklardan (âyet, hadis, ilmihal) derlenir; her kayıtta kaynağı belirtilir. İhtilaflı veya
adet-tabanlı gelenekler "gelenektir, farz değildir" notuyla işaretlenir.
