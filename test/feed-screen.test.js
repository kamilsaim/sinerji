// test/feed-screen.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderFeedScreen } from '../src/ui/screens/feed-screen.js';
import { listActiveRings } from '../src/lib/rings.js';

vi.mock('../src/lib/rings.js', () => ({
  RING_TYPE_LABELS: { süresiz: 'Süresiz', hedefli: 'Hedefli', süreli: 'Süreli', dua: 'Dua isteği' },
  listActiveRings: vi.fn(),
}));

describe('renderFeedScreen', () => {
  beforeEach(() => {
    vi.mocked(listActiveRings).mockReset();
  });

  it('veri gelene kadar yükleniyor durumu gösterir', async () => {
    let resolveRings;
    vi.mocked(listActiveRings).mockReturnValue(
      new Promise((resolve) => {
        resolveRings = resolve;
      })
    );

    const container = document.createElement('div');
    const renderPromise = renderFeedScreen(container, {
      state: { session: null, guest: true },
      client: {},
      onSelectRing: vi.fn(),
    });

    expect(container.querySelector('.ring-list').textContent).toContain('Yükleniyor');

    resolveRings([]);
    await renderPromise;
  });

  it('kandil şeridi, selamlama, niyet kartı ve halka kartlarını render eder (dua tipini hariç tutar)', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([
      { id: 'r1', title: 'Fatiha okuyalım', type: 'süresiz', total_count: 12480, participant_count: 342 },
      { id: 'r2', title: "Mehmet'in sınavı", type: 'dua', total_count: 0, participant_count: 84 },
    ]);

    const container = document.createElement('div');
    await renderFeedScreen(container, { state: { session: null, guest: true }, client: {}, onSelectRing: vi.fn() });

    expect(container.querySelector('.kandil-strip')).not.toBeNull();
    expect(container.textContent).toContain('Selamünaleyküm');
    expect(container.querySelector('.intention-card')).not.toBeNull();
    expect(container.querySelectorAll('.ring-card').length).toBe(1);
    expect(container.textContent).toContain('Fatiha okuyalım');
    expect(container.textContent).not.toContain("Mehmet'in sınavı");
  });

  it('oturumdaki kullanıcıyı ilk adıyla selamlar', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderFeedScreen(container, {
      state: { session: { user: { user_metadata: { full_name: 'Kamil Saim' } } }, guest: false },
      client: {},
      onSelectRing: vi.fn(),
    });
    expect(container.textContent).toContain('Selamünaleyküm, Kamil');
  });

  it('misafir modunda genel bir selamlama gösterir', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderFeedScreen(container, { state: { session: null, guest: true }, client: {}, onSelectRing: vi.fn() });
    expect(container.textContent).toContain('Selamünaleyküm, Kardeşim');
  });

  it('halka yoksa boş durum mesajı gösterir', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderFeedScreen(container, { state: { session: null, guest: true }, client: {}, onSelectRing: vi.fn() });
    expect(container.textContent).toContain('Henüz bir halka yok');
  });

  it('yükleme hatasında hata mesajı gösterir', async () => {
    vi.mocked(listActiveRings).mockRejectedValue(new Error('network'));
    const container = document.createElement('div');
    await renderFeedScreen(container, { state: { session: null, guest: true }, client: {}, onSelectRing: vi.fn() });
    expect(container.textContent).toContain('yüklenemedi');
  });

  it('karta tıklanınca onSelectRing doğru id ile çağrılır', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([
      { id: 'r1', title: 'Fatiha okuyalım', type: 'süresiz', total_count: 10, participant_count: 2 },
    ]);
    const onSelectRing = vi.fn();
    const container = document.createElement('div');
    await renderFeedScreen(container, { state: { session: null, guest: true }, client: {}, onSelectRing });

    container.querySelector('.ring-card').dispatchEvent(new Event('click', { bubbles: true }));
    expect(onSelectRing).toHaveBeenCalledWith('r1');
  });
});
