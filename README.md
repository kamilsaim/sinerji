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

Tasarım kararlarının tamamı [`docs/superpowers/specs/2026-08-21-sinerji-tasarim.md`](docs/superpowers/specs/2026-08-21-sinerji-tasarim.md),
görsel kimlik ise [`docs/brand-guidelines.md`](docs/brand-guidelines.md) dosyasında.

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

🚧 Aktif geliştirme aşamasında. Şu an tamamlanan: proje iskeleti, Google Auth akışı, misafir modu,
PWA temeli. Sıradaki: akış ekranı, halka/dua sistemi, canlı zikir sayacı, günlük ve bildirimler.
