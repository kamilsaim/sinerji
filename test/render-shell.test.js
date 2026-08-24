// test/render-shell.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderShell } from '../src/ui/render-shell.js';

vi.mock('../src/lib/rings.js', () => ({
  RING_TYPE_LABELS: { süresiz: 'Süresiz', hedefli: 'Hedefli', süreli: 'Süreli', dua: 'Dua isteği' },
  listActiveRings: vi.fn().mockResolvedValue([]),
  createRing: vi.fn(),
  addContribution: vi.fn(),
  getRing: vi.fn().mockResolvedValue({ id: 'r1', title: 'Test Halka', total_count: 0, participant_count: 0 }),
  getMyContributions: vi.fn().mockResolvedValue([]),
  subscribeToRing: vi.fn(() => () => {}),
}));

describe('renderShell', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
  });

  it('loading true iken yükleniyor durumu gösterir', () => {
    renderShell(root, { session: null, loading: true });
    expect(root.textContent).toContain('Yükleniyor');
  });

  it('session null ve guest false iken giriş ekranı, logo, Google butonu ve misafir bağlantısı gösterir', () => {
    renderShell(root, { session: null, loading: false, guest: false });
    const button = root.querySelector('[data-action="sign-in-google"]');
    const logo = root.querySelector('.login-screen__logo');
    const guestLink = root.querySelector('[data-action="continue-as-guest"]');
    expect(button).not.toBeNull();
    expect(logo).not.toBeNull();
    expect(logo.getAttribute('src')).toBe('/logo.png');
    expect(guestLink).not.toBeNull();
    expect(root.textContent).toContain('Google ile Giriş Yap');
    expect(root.textContent).toContain('Misafir olarak devam et');
  });

  it('session varsa 5 sekmeli alt menüyü, her sekmede bir ikonla, gösterir', async () => {
    await renderShell(root, { session: { user: { id: 'u1' } }, loading: false, guest: false }, {});
    const tabs = root.querySelectorAll('.tab');
    expect(tabs.length).toBe(5);
    tabs.forEach((tab) => {
      expect(tab.querySelector('.tab__ico')).not.toBeNull();
    });
    expect(root.textContent).toContain('Akış');
    expect(root.textContent).toContain('Halkalar');
    expect(root.textContent).toContain('Zikir');
    expect(root.textContent).toContain('Dua');
    expect(root.textContent).toContain('Günlüğüm');
  });

  it('ilk sekme (Akış) varsayılan olarak aktif (.on) durumdadır', async () => {
    await renderShell(root, { session: { user: { id: 'u1' } }, loading: false, guest: false }, {});
    const tabs = root.querySelectorAll('.tab');
    expect(tabs[0].classList.contains('on')).toBe(true);
    expect(tabs[1].classList.contains('on')).toBe(false);
  });

  it('session yok ama guest true ise yine 5 sekmeli kabuğu gösterir', async () => {
    await renderShell(root, { session: null, loading: false, guest: true }, {});
    const tabs = root.querySelectorAll('.tab');
    expect(tabs.length).toBe(5);
  });

  it('guest modda kabukta bir "giriş yap" davet rozeti gösterir', async () => {
    await renderShell(root, { session: null, loading: false, guest: true }, {});
    expect(root.querySelector('[data-action="sign-in-google"]')).not.toBeNull();
    expect(root.textContent).toContain('Misafir modundasın');
  });

  it('ilk render sonrası #screen-content içinde Akış ekranı (kandil şeridi) görünür', async () => {
    await renderShell(root, { session: { user: { id: 'u1' } }, loading: false, guest: false }, {});
    expect(root.querySelector('#screen-content .kandil-strip')).not.toBeNull();
  });

  it('Halkalar sekmesine tıklanınca gerçek Halkalar ekranı gösterilir ve sekme aktifleşir', async () => {
    await renderShell(root, { session: { user: { id: 'u1' } }, loading: false, guest: false }, {});
    const tabs = root.querySelectorAll('.tab');

    tabs[1].dispatchEvent(new Event('click', { bubbles: true }));
    await vi.waitFor(() => {
      expect(root.querySelector('#screen-content .rings-screen')).not.toBeNull();
    });

    expect(tabs[1].classList.contains('on')).toBe(true);
    expect(tabs[0].classList.contains('on')).toBe(false);
  });

  it('Akış sekmesine geri tıklanınca yeniden Akış ekranı gösterilir', async () => {
    await renderShell(root, { session: { user: { id: 'u1' } }, loading: false, guest: false }, {});
    const tabs = root.querySelectorAll('.tab');

    tabs[1].dispatchEvent(new Event('click', { bubbles: true }));
    await vi.waitFor(() => expect(root.querySelector('#screen-content .rings-screen')).not.toBeNull());

    tabs[0].dispatchEvent(new Event('click', { bubbles: true }));
    await vi.waitFor(() => expect(root.querySelector('#screen-content .kandil-strip')).not.toBeNull());

    expect(tabs[0].classList.contains('on')).toBe(true);
  });

  it('bir halka kartına tıklanınca Zikir sekmesine geçilir ve o halka gösterilir', async () => {
    const { listActiveRings } = await import('../src/lib/rings.js');
    vi.mocked(listActiveRings).mockResolvedValue([
      { id: 'r1', title: 'Fatiha okuyalım', type: 'süresiz', total_count: 10, participant_count: 2 },
    ]);

    await renderShell(root, { session: { user: { id: 'u1' } }, loading: false, guest: false }, {});
    await vi.waitFor(() => expect(root.querySelector('.ring-card')).not.toBeNull());

    root.querySelector('.ring-card').dispatchEvent(new Event('click', { bubbles: true }));

    await vi.waitFor(() => {
      const zikirTab = root.querySelectorAll('.tab')[2];
      expect(zikirTab.classList.contains('on')).toBe(true);
    });
    await vi.waitFor(() => expect(root.querySelector('#screen-content .zikir-screen')).not.toBeNull());
    expect(root.querySelector('#screen-content').textContent).toContain('Test Halka');
  });
});
