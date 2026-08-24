<p align="center">
  <img src="logo.png" alt="Sinerji" width="220" />
</p>

<h1 align="center">Sinerji</h1>
<p align="center"><b>Manevi Birlik ve Dua Halkası</b></p>
<p align="center">Aynı anda, aynı niyetle okuyan bir topluluk.</p>

---

## Nedir?

Sinerji, insanların birbirinden dua istediği, ortak zikir/dua halkalarına katıldığı, özel gün ve
gecelerde ne okunacağını gördüğü ve kendi manevi okumalarının kaydını tuttuğu bir web/mobil
uygulamasıdır. Ana fikir: tek başına okumak yerine **aynı anda, aynı niyetle okuyan bir topluluk
hissi** yaratmak.

- **Halka** — ortak okuma ("Fatiha okuyalım", "1.000.000 Salavat") — süresiz, hedefli veya süreli
- **Dua isteği** — hedefi olmayan, sadece niyet paylaşımı ("Mehmet'in sınavı · Cumaya kadar")
- **Canlı sayaç** — herkesin okuduğu anlık toplam, tesbih gibi tek dokunuşla sayılır
- **Riya kalkanı** — liderlik tablosu yok, kimin kaç okuduğu gösterilmez, sadece toplam görünür
- **Günlüğüm** — kişisel okuma geçmişi, yalnızca kendine açık
- **Hicri takvim & kandiller** — özel gün ve gecelerde ne okunacağına dair tavsiyeler

Tasarım kararları ve görsel kimlik dosyaları yerel projede tutulur (bu repo sadece tanıtım için).

## Görsel Kimlik

| | |
|---|---|
| Zemin | Koyu turkuaz degrade `#08222b → #0e3a44 → #08222b` |
| Vurgu — Canlı | Turkuaz `#3ee6cf` |
| Vurgu — Kutsal/özel gün | Altın `#f5c451` |
| Motif | Sekiz köşeli yıldız ✦ (logodan) |

## Teknoloji

- **Vite** + vanilla JavaScript (ES modules) — tek sayfa, hafif, framework'süz
- **Supabase** — Auth (Google girişi), Postgres, Realtime (canlı sayaçlar), RLS
- **PWA** — Web App Manifest + Service Worker, "ana ekrana ekle" ile kurulabilir
- **Vitest** — birim testleri

## Geliştirme

```bash
npm install
cp .env.example .env   # Supabase proje bilgilerini .env dosyasına gir
npm run dev             # http://localhost:5173
```

```bash
npm test                # birim testlerini çalıştır
npm run build            # production build (dist/)
npm run preview          # build'i yerelde önizle
```

## Durum

🟢 Canlı: [sinerji.web.app](https://sinerji.web.app)

Tamamlanan: proje iskeleti, Google Auth akışı, misafir modu, PWA temeli, Akış ekranı (hicri takvim +
kandil şeridi + gerçek Supabase verisi), Halkalar (oluşturma + listeleme), Zikir (sayma + 2sn toplu
gönderim + Supabase Realtime ile canlı güncelleme), Dua istekleri (oluşturma + tek dokunuş katılım),
Günlüğüm (kişisel okuma özeti).

Sıradaki: çevrimdışı biriktirme/senkron, gerçek zikir/dua metin içerikleri (Arapça + okunuş + meal),
bildirimler, hatim/cüz paylaşımı (v2).
