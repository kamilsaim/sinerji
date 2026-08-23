# Sinerji — Plan 1: Temel Altyapı + Auth + PWA İskeleti

> **Durum: ✅ TAMAMLANDI ve canlıda** (2026-08-23) — https://sinerji.web.app
>
> Plan yazıldığı haliyle 8 görev de uygulandı ve commit edildi. Uygulama sırasında plana ek olarak
> şunlar da eklendi (kullanıcı isteğiyle, ayrı commit'lerde):
> - **Misafir modu** — girişsiz gezinme, `session-store.js`'e `guest` state'i eklendi
> - **Login ekranı görsel iyileştirmesi** — logo, yanıp sönen yıldız halesi, Google buton parıltısı
> - **Alt menü ikonları + yıldız kabarma animasyonu** — spec 2.2.1'deki animasyon canlıya alındı
> - **`isSupabaseConfigured()`** — gerçek Supabase bilgisi girilene kadar Google girişi güvenli
>   şekilde devre dışı ("yakında aktif olacak" mesajı, hata fırlatmıyor)
> - **Service worker düzeltmesi** — ilk sürüm cache-first'ti ve her deploy'da eski sürümü sonsuza
>   kadar önbellekten sunuyordu; network-first + `sinerji-shell-v2` cache adına geçildi
> - Proje `E:\...\sinerji` (Drive) → `C:\Users\kml\projects\sinerji` (yerel) taşındı, GitHub'a
>   (`github.com/kamilsaim/sinerji`) push edildi, Firebase Hosting'e (`kamilsaim` projesi,
>   `sinerji` sitesi) deploy edildi.
>
> Aşağıdaki plan metni **orijinal haliyle** (tarihi kayıt olarak) korunuyor. Gerçek kod bazı
> detaylarda (dosya yolları, ufak isimlendirmeler) planla birebir örtüşmeyebilir — kaynak kod
> her zaman otoritedir.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sinerji projesini sıfırdan kurmak — Vite tabanlı bir web projesi, Supabase bağlantısı, Google ile
giriş akışı, ve PWA (manifest + service worker) iskeleti. Bu plan bittiğinde: `npm run dev` ile açılan,
Google ile giriş yapılabilen, oturum durumuna göre "giriş ekranı" ya da "boş uygulama kabuğu" gösteren,
telefona "ana ekrana ekle" ile kurulabilen bir PWA olacak. İçerik (halkalar, dua, zikir) bu planın kapsamı
DIŞINDA — sonraki planlarda eklenecek.

**Architecture:** Vite + vanilla JS (framework yok — tek HTML dosyası ruhuna sadık, ama Vite build/test
tooling'i için modüler kaynak dosyalarından derleniyor). Supabase JS client; Auth için Supabase'in
Google OAuth sağlayıcısı. Test: Vitest (birim), tarayıcı DOM'u gerektiren yerlerde `happy-dom`.

**Tech Stack:** Vite, vanilla JavaScript (ES modules), `@supabase/supabase-js`, Vitest, `happy-dom`,
Web App Manifest, Service Worker (Workbox kullanılmadan elle yazılmış minimal cache-first shell).

---

## Dosya Yapısı

```
sinerji/
├── package.json
├── vite.config.js
├── vitest.config.js
├── index.html                      # tek giriş noktası — app shell markup
├── public/
│   ├── manifest.webmanifest
│   ├── icon-192.png                 # logo.png'den türetilecek (bu planda placeholder kopya)
│   └── icon-512.png
├── src/
│   ├── main.js                      # app bootstrap: session kontrolü → login ya da shell göster
│   ├── sw.js                        # service worker (build sırasında public/'e kopyalanır)
│   ├── styles/
│   │   └── tokens.css               # docs/brand-guidelines.md token'ları CSS custom property olarak
│   ├── lib/
│   │   ├── supabase-client.js       # supabase client factory
│   │   ├── auth.js                  # signInWithGoogle/signOut/getSession/onAuthStateChange sarmalayıcı
│   │   └── session-store.js         # basit pub-sub: oturum durumunu tutar, değişince abonelere haber verir
│   └── ui/
│       └── render-shell.js          # session-store'a göre login ekranı ya da 5 sekmeli boş kabuk render eder
├── test/
│   ├── auth.test.js
│   ├── session-store.test.js
│   └── render-shell.test.js
├── .env.example
└── docs/  (zaten var — spec, brand-guidelines, brainstorm mockup'ları)
```

**Not:** `logo.png` / `deneme.png` proje kökünde zaten var; ikon üretimi (192/512 px PNG export) bu planda
elle/placeholder yapılır, gerçek asset optimizasyonu sonraki bir plana bırakılabilir.

---

### Task 1: Proje iskeleti (Vite + Vitest)

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `vitest.config.js`
- Create: `index.html`
- Test: `test/smoke.test.js`

- [ ] **Step 1: package.json oluştur**

```json
{
  "name": "sinerji",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^2.1.0",
    "happy-dom": "^15.0.0"
  }
}
```

- [ ] **Step 2: Bağımlılıkları kur**

Run: `npm install`
Expected: `node_modules/` oluşur, hata yok.

- [ ] **Step 3: vite.config.js oluştur**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
});
```

- [ ] **Step 4: vitest.config.js oluştur**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: false,
  },
});
```

- [ ] **Step 5: Başarısız duman testi yaz (henüz kod yok, kasıtlı fail)**

```js
// test/smoke.test.js
import { describe, it, expect } from 'vitest';
import { APP_NAME } from '../src/lib/constants.js';

describe('proje iskeleti', () => {
  it('APP_NAME sabitini dışa aktarır', () => {
    expect(APP_NAME).toBe('Sinerji');
  });
});
```

- [ ] **Step 6: Testi çalıştır, fail ettiğini doğrula**

Run: `npm test`
Expected: FAIL — `Cannot find module '../src/lib/constants.js'`

- [ ] **Step 7: constants.js oluştur ve testi geçir**

```js
// src/lib/constants.js
export const APP_NAME = 'Sinerji';
```

Run: `npm test`
Expected: PASS (1 test)

- [ ] **Step 8: index.html iskeletini oluştur**

```html
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Sinerji</title>
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="stylesheet" href="/src/styles/tokens.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 9: Boş main.js oluştur (Task 6'da doldurulacak)**

```js
// src/main.js
console.log('Sinerji başlatılıyor…');
```

- [ ] **Step 10: Commit**

```bash
git init
git add package.json vite.config.js vitest.config.js index.html src/main.js src/lib/constants.js test/smoke.test.js
git commit -m "chore: proje iskeletini kur (Vite + Vitest)"
```

---

### Task 2: Marka token'ları CSS'e aktarma

**Files:**
- Create: `src/styles/tokens.css`
- Test: `test/tokens.test.js`

**Kaynak:** `docs/brand-guidelines.md` bölüm 1, 2, 5.

- [ ] **Step 1: Test yaz — tokens.css dosyasının beklenen custom property'leri içerdiğini doğrula**

```js
// test/tokens.test.js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('design tokens', () => {
  it('temel marka renklerini CSS custom property olarak tanımlar', () => {
    const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf-8');
    expect(css).toContain('--color-turquoise: #3ee6cf');
    expect(css).toContain('--color-gold: #f5c451');
    expect(css).toContain('--color-bg-dark: #08222b');
    expect(css).toContain('--radius-card: 14px');
  });
});
```

- [ ] **Step 2: Testi çalıştır, fail ettiğini doğrula**

Run: `npm test -- tokens`
Expected: FAIL — dosya yok

- [ ] **Step 3: tokens.css yaz**

```css
/* src/styles/tokens.css — docs/brand-guidelines.md kaynaklı */
:root {
  /* Zemin */
  --color-bg-dark: #08222b;
  --color-bg-mid: #0e3a44;

  /* Vurgu */
  --color-turquoise: #3ee6cf;
  --color-turquoise-dark: #2bb8a5;
  --color-gold: #f5c451;
  --color-gold-dark: #c99a2e;

  /* Nötr (koyu zemine göre) */
  --color-text-primary: rgba(255, 255, 255, .95);
  --color-text-secondary: rgba(255, 255, 255, .62);
  --color-text-tertiary: rgba(255, 255, 255, .38);
  --color-divider: rgba(255, 255, 255, .10);

  /* Kart */
  --color-card-bg: rgba(255, 255, 255, .07);
  --color-card-border: rgba(62, 230, 207, .25);
  --color-card-border-hover: rgba(62, 230, 207, .45);
  --radius-card: 14px;
  --radius-button: 12px;
  --radius-pill: 9999px;

  /* Durum */
  --color-error: #e0645a;

  /* Boşluk */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Yıldız kabarma animasyonu (spec 2.2.1) */
  --star-pop-timing: cubic-bezier(.2, 1.5, .4, 1);
  --star-pop-duration: 0.5s;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg-dark) 0%, var(--color-bg-mid) 55%, var(--color-bg-dark) 100%);
  color: var(--color-text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini doğrula**

Run: `npm test -- tokens`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css test/tokens.test.js
git commit -m "feat: marka design token'larını CSS custom property olarak ekle"
```

---

### Task 3: Supabase client factory

**Files:**
- Create: `src/lib/supabase-client.js`
- Create: `.env.example`
- Test: `test/supabase-client.test.js`

- [ ] **Step 1: .env.example oluştur**

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
```

- [ ] **Step 2: Test yaz — env değişkenleri eksikse açık hata fırlatmalı**

```js
// test/supabase-client.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getSupabaseClient', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('env değişkenleri eksikse anlamlı bir hata fırlatır', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    const { getSupabaseClient } = await import('../src/lib/supabase-client.js');
    expect(() => getSupabaseClient()).toThrow('VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalı');
  });

  it('env değişkenleri varsa bir client örneği döner', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
    const { getSupabaseClient } = await import('../src/lib/supabase-client.js');
    const client = getSupabaseClient();
    expect(client).toBeTruthy();
    expect(client.auth).toBeDefined();
  });

  it('aynı client örneğini tekrar kullanır (singleton)', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
    const { getSupabaseClient } = await import('../src/lib/supabase-client.js');
    const a = getSupabaseClient();
    const b = getSupabaseClient();
    expect(a).toBe(b);
  });
});
```

- [ ] **Step 3: Testi çalıştır, fail ettiğini doğrula**

Run: `npm test -- supabase-client`
Expected: FAIL — dosya yok

- [ ] **Step 4: supabase-client.js yaz**

```js
// src/lib/supabase-client.js
import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalı');
  }

  cachedClient = createClient(url, anonKey);
  return cachedClient;
}
```

- [ ] **Step 5: Testi çalıştır, geçtiğini doğrula**

Run: `npm test -- supabase-client`
Expected: PASS (3 test)

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabase-client.js .env.example test/supabase-client.test.js
git commit -m "feat: supabase client factory ekle"
```

---

### Task 4: Auth sarmalayıcı (Google girişi)

**Files:**
- Create: `src/lib/auth.js`
- Test: `test/auth.test.js`

- [ ] **Step 1: Test yaz — signInWithGoogle, signOut, getSession fonksiyonları**

```js
// test/auth.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

function makeFakeClient() {
  return {
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'u1' } } }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  };
}

describe('auth', () => {
  let fakeClient;
  beforeEach(() => {
    fakeClient = makeFakeClient();
  });

  it('signInWithGoogle, google provider ile OAuth başlatır', async () => {
    const { signInWithGoogle } = await import('../src/lib/auth.js');
    await signInWithGoogle(fakeClient);
    expect(fakeClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  });

  it('signOut, client.auth.signOut çağırır', async () => {
    const { signOut } = await import('../src/lib/auth.js');
    await signOut(fakeClient);
    expect(fakeClient.auth.signOut).toHaveBeenCalled();
  });

  it('getCurrentSession, mevcut oturumu döner', async () => {
    const { getCurrentSession } = await import('../src/lib/auth.js');
    const session = await getCurrentSession(fakeClient);
    expect(session.user.id).toBe('u1');
  });

  it('getCurrentSession, oturum yoksa null döner', async () => {
    fakeClient.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    const { getCurrentSession } = await import('../src/lib/auth.js');
    const session = await getCurrentSession(fakeClient);
    expect(session).toBeNull();
  });
});
```

- [ ] **Step 2: Testi çalıştır, fail ettiğini doğrula**

Run: `npm test -- auth`
Expected: FAIL — dosya yok

- [ ] **Step 3: auth.js yaz**

```js
// src/lib/auth.js

export async function signInWithGoogle(client) {
  return client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
}

export async function signOut(client) {
  return client.auth.signOut();
}

export async function getCurrentSession(client) {
  const { data } = await client.auth.getSession();
  return data.session ?? null;
}

export function onAuthStateChange(client, callback) {
  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini doğrula**

Run: `npm test -- auth`
Expected: PASS (4 test)

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.js test/auth.test.js
git commit -m "feat: Google OAuth auth sarmalayıcısı ekle"
```

---

### Task 5: Oturum durumu deposu (session-store)

**Files:**
- Create: `src/lib/session-store.js`
- Test: `test/session-store.test.js`

- [ ] **Step 1: Test yaz — basit pub-sub deposu**

```js
// test/session-store.test.js
import { describe, it, expect, vi } from 'vitest';
import { createSessionStore } from '../src/lib/session-store.js';

describe('createSessionStore', () => {
  it('başlangıç durumu: session null, loading true', () => {
    const store = createSessionStore();
    expect(store.getState()).toEqual({ session: null, loading: true });
  });

  it('setSession çağrılınca durumu günceller ve abonelere bildirir', () => {
    const store = createSessionStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.setSession({ user: { id: 'u1' } });

    expect(store.getState()).toEqual({ session: { user: { id: 'u1' } }, loading: false });
    expect(listener).toHaveBeenCalledWith({ session: { user: { id: 'u1' } }, loading: false });
  });

  it('setSession(null) ile çıkış durumunu yansıtır', () => {
    const store = createSessionStore();
    store.setSession({ user: { id: 'u1' } });
    store.setSession(null);
    expect(store.getState()).toEqual({ session: null, loading: false });
  });

  it('unsubscribe sonrası listener çağrılmaz', () => {
    const store = createSessionStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setSession({ user: { id: 'u1' } });
    expect(listener).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Testi çalıştır, fail ettiğini doğrula**

Run: `npm test -- session-store`
Expected: FAIL — dosya yok

- [ ] **Step 3: session-store.js yaz**

```js
// src/lib/session-store.js

export function createSessionStore() {
  let state = { session: null, loading: true };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setSession(session) {
    state = { session, loading: false };
    for (const listener of listeners) listener(state);
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setSession, subscribe };
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini doğrula**

Run: `npm test -- session-store`
Expected: PASS (4 test)

- [ ] **Step 5: Commit**

```bash
git add src/lib/session-store.js test/session-store.test.js
git commit -m "feat: oturum durumu için pub-sub store ekle"
```

---

### Task 6: Uygulama kabuğu render (login ekranı / 5 sekmeli boş kabuk)

**Files:**
- Create: `src/ui/render-shell.js`
- Test: `test/render-shell.test.js`

- [ ] **Step 1: Test yaz — oturum yoksa login ekranı, varsa 5 sekmeli kabuk render edilmeli**

```js
// test/render-shell.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderShell } from '../src/ui/render-shell.js';

describe('renderShell', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
  });

  it('loading true iken yükleniyor durumu gösterir', () => {
    renderShell(root, { session: null, loading: true });
    expect(root.textContent).toContain('Yükleniyor');
  });

  it('session null iken giriş ekranı ve Google giriş butonu gösterir', () => {
    renderShell(root, { session: null, loading: false });
    const button = root.querySelector('[data-action="sign-in-google"]');
    expect(button).not.toBeNull();
    expect(root.textContent).toContain('Google ile Giriş Yap');
  });

  it('session varsa 5 sekmeli alt menüyü gösterir', () => {
    renderShell(root, { session: { user: { id: 'u1' } }, loading: false });
    const tabs = root.querySelectorAll('.tab');
    expect(tabs.length).toBe(5);
    expect(root.textContent).toContain('Akış');
    expect(root.textContent).toContain('Halkalar');
    expect(root.textContent).toContain('Zikir');
    expect(root.textContent).toContain('Dua');
    expect(root.textContent).toContain('Günlüğüm');
  });
});
```

- [ ] **Step 2: Testi çalıştır, fail ettiğini doğrula**

Run: `npm test -- render-shell`
Expected: FAIL — dosya yok

- [ ] **Step 3: render-shell.js yaz**

```js
// src/ui/render-shell.js

const TABS = ['Akış', 'Halkalar', 'Zikir', 'Dua', 'Günlüğüm'];

export function renderShell(root, state) {
  if (state.loading) {
    root.innerHTML = '<p class="loading">Yükleniyor…</p>';
    return;
  }

  if (!state.session) {
    root.innerHTML = `
      <div class="login-screen">
        <h1>Sinerji</h1>
        <p>Aynı anda, aynı niyetle okuyan bir topluluk.</p>
        <button data-action="sign-in-google">Google ile Giriş Yap</button>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="app-shell">
      <main id="screen-content"></main>
      <nav class="tabbar">
        ${TABS.map((label, i) => `<div class="tab${i === 0 ? ' on' : ''}">${label}</div>`).join('')}
      </nav>
    </div>
  `;
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini doğrula**

Run: `npm test -- render-shell`
Expected: PASS (3 test)

- [ ] **Step 5: Commit**

```bash
git add src/ui/render-shell.js test/render-shell.test.js
git commit -m "feat: oturum durumuna göre login/kabuk render ekle"
```

---

### Task 7: main.js bootstrap — hepsini birbirine bağla

**Files:**
- Modify: `src/main.js`
- Test: manuel (bu task DOM/network bootstrap olduğu için birim testi yok, Task 1-6 zaten kapsıyor)

- [ ] **Step 1: main.js'i yaz**

```js
// src/main.js
import { getSupabaseClient } from './lib/supabase-client.js';
import { signInWithGoogle, signOut, getCurrentSession, onAuthStateChange } from './lib/auth.js';
import { createSessionStore } from './lib/session-store.js';
import { renderShell } from './ui/render-shell.js';

const root = document.getElementById('app');
const store = createSessionStore();

store.subscribe((state) => {
  renderShell(root, state);
  const signInBtn = root.querySelector('[data-action="sign-in-google"]');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => signInWithGoogle(client));
  }
});

renderShell(root, store.getState());

const client = getSupabaseClient();

getCurrentSession(client).then((session) => {
  store.setSession(session);
});

onAuthStateChange(client, (session) => {
  store.setSession(session);
});

window.__sinerjiSignOut = () => signOut(client);
```

- [ ] **Step 2: .env dosyasını gerçek Supabase proje bilgileriyle doldur (yerel, commit edilmez)**

```bash
cp .env.example .env
```

`.env` içine gerçek `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` değerlerini gir (Supabase projesi
panelinden alınır — bu adım manuel, kullanıcıdan proje bilgisi istenir).

- [ ] **Step 3: .gitignore oluştur**

```
node_modules/
dist/
.env
```

- [ ] **Step 4: Dev sunucusunu başlat ve tarayıcıda kontrol et**

Run: `npm run dev`
Expected: `http://localhost:5173` açılır, "Yükleniyor…" ardından (env doğruysa) giriş ekranı görünür.
Konsol: `Sinerji başlatılıyor…` log'u YOK artık (bootstrap koduyla değiştirildi) — hata olmamalı.

- [ ] **Step 5: Tüm birim testlerini çalıştır**

Run: `npm test`
Expected: PASS — toplam 15 test (smoke 1, tokens 1, supabase-client 3, auth 4, session-store 4, render-shell 3 → 16 test; sayı projeye göre değişebilir, hepsi yeşil olmalı)

- [ ] **Step 6: Commit**

```bash
git add src/main.js .gitignore
git commit -m "feat: auth + session-store + render-shell bootstrap'ını main.js'de birleştir"
```

---

### Task 8: PWA manifest ve service worker

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `src/sw.js`
- Modify: `src/main.js`
- Test: `test/manifest.test.js`

- [ ] **Step 1: Test yaz — manifest.webmanifest geçerli JSON ve zorunlu alanları içeriyor**

```js
// test/manifest.test.js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('manifest.webmanifest', () => {
  it('geçerli JSON ve zorunlu PWA alanlarını içerir', () => {
    const raw = readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf-8');
    const manifest = JSON.parse(raw);

    expect(manifest.name).toBe('Sinerji');
    expect(manifest.short_name).toBe('Sinerji');
    expect(manifest.display).toBe('standalone');
    expect(manifest.background_color).toBe('#08222b');
    expect(manifest.theme_color).toBe('#08222b');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    expect(manifest.icons.some((i) => i.sizes === '192x192')).toBe(true);
    expect(manifest.icons.some((i) => i.sizes === '512x512')).toBe(true);
  });
});
```

- [ ] **Step 2: Testi çalıştır, fail ettiğini doğrula**

Run: `npm test -- manifest`
Expected: FAIL — dosya yok

- [ ] **Step 3: manifest.webmanifest yaz**

```json
{
  "name": "Sinerji",
  "short_name": "Sinerji",
  "description": "Aynı anda, aynı niyetle okuyan bir topluluk.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#08222b",
  "theme_color": "#08222b",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 4: logo.png'den 192/512 px ikon üret (elle ya da script ile), public/ altına koy**

Bu adım proje kökündeki `logo.png` dosyasından PNG export gerektirir — bir görsel araçla
(ör. `sharp` CLI, ya da elle bir tasarım programında) 192x192 ve 512x512 boyutlarında dışa aktarılır ve
`public/icon-192.png`, `public/icon-512.png` olarak kaydedilir. Bu plan kapsamında **placeholder** olarak
mevcut `logo.png` doğrudan her iki dosya adıyla kopyalanabilir; gerçek optimize export sonraki bir
görselleştirme görevine bırakılır.

```bash
cp logo.png public/icon-192.png
cp logo.png public/icon-512.png
```

- [ ] **Step 5: Testi çalıştır, geçtiğini doğrula**

Run: `npm test -- manifest`
Expected: PASS

- [ ] **Step 6: Minimal service worker yaz (app shell cache-first)**

```js
// src/sw.js
const CACHE_NAME = 'sinerji-shell-v1';
const SHELL_FILES = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request))
  );
});
```

- [ ] **Step 7: main.js'e service worker kaydını ekle**

```js
// src/main.js dosyasının SONUNA ekle:

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/sw.js', { type: 'module' }).catch((err) => {
      console.error('Service worker kaydı başarısız:', err);
    });
  });
}
```

- [ ] **Step 8: Tüm testleri çalıştır**

Run: `npm test`
Expected: PASS — tüm testler yeşil

- [ ] **Step 9: Build alıp önizle**

Run: `npm run build && npm run preview`
Expected: Build hatasız tamamlanır, preview sunucusunda uygulama açılır, DevTools → Application →
Manifest sekmesinde "Sinerji" görünür, Service Workers sekmesinde `sw.js` "activated and running" olur.

- [ ] **Step 10: Commit**

```bash
git add public/manifest.webmanifest public/icon-192.png public/icon-512.png src/sw.js src/main.js test/manifest.test.js
git commit -m "feat: PWA manifest ve service worker ekle"
```

---

## Bu Plan Bittiğinde Elde Edilen Durum

- `npm run dev` ile çalışan bir Vite projesi
- Google ile giriş yapılabilen (Supabase Auth) bir login ekranı
- Giriş yapılınca 5 sekmeli boş bir app shell (Akış / Halkalar / Zikir / Dua / Günlüğüm — henüz içerik yok)
- Marka renkleri/token'ları CSS custom property olarak tanımlı
- PWA olarak "ana ekrana eklenebilir" durumda (manifest + service worker)
- ~20 birim testi, hepsi yeşil

**Sonraki plan (Plan 2):** Akış ekranı (kandil şeridi, bugünün niyeti kartı, hicri takvim hesaplama) —
bu plan bittikten sonra yazılacak.
