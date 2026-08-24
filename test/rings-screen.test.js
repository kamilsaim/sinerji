import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderRingsScreen } from '../src/ui/screens/rings-screen.js';
import { createRing, listActiveRings } from '../src/lib/rings.js';

vi.mock('../src/lib/rings.js', () => ({
  RING_TYPE_LABELS: { süresiz: 'Süresiz', hedefli: 'Hedefli', süreli: 'Süreli', dua: 'Dua isteği' },
  createRing: vi.fn(),
  listActiveRings: vi.fn(),
}));

describe('renderRingsScreen', () => {
  beforeEach(() => {
    vi.mocked(createRing).mockReset();
    vi.mocked(listActiveRings).mockReset();
  });

  it('giriş yapmış kullanıcıya oluşturma formu ve halka listesini gösterir (dua hariç)', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([
      { id: 'r1', title: 'Fatiha okuyalım', type: 'süresiz', total_count: 5, participant_count: 1 },
      { id: 'r2', title: 'Dua isteği', type: 'dua', total_count: 0, participant_count: 3 },
    ]);
    const container = document.createElement('div');
    await renderRingsScreen(container, {
      state: { session: { user: { id: 'u1' } }, guest: false },
      client: {},
      onSelectRing: vi.fn(),
    });

    expect(container.querySelector('.ring-form')).not.toBeNull();
    expect(container.querySelectorAll('.ring-card').length).toBe(1);
    expect(container.textContent).toContain('Fatiha okuyalım');
    expect(container.textContent).not.toContain('Dua isteği');
  });

  it('misafir modda form yerine giriş uyarısı gösterir', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderRingsScreen(container, { state: { session: null, guest: true }, client: {}, onSelectRing: vi.fn() });

    expect(container.querySelector('.ring-form')).toBeNull();
    expect(container.textContent).toContain('giriş yap');
  });

  it('form gönderilince createRing çağrılır ve liste yenilenir', async () => {
    vi.mocked(listActiveRings).mockResolvedValueOnce([]).mockResolvedValueOnce([
      { id: 'r1', title: 'Yeni Halka', type: 'süresiz', total_count: 0, participant_count: 0 },
    ]);
    vi.mocked(createRing).mockResolvedValue({ id: 'r1' });

    const container = document.createElement('div');
    await renderRingsScreen(container, {
      state: { session: { user: { id: 'u1' } }, guest: false },
      client: {},
      onSelectRing: vi.fn(),
    });

    container.querySelector('.ring-form__title').value = 'Yeni Halka';
    container.querySelector('.ring-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => expect(container.textContent).toContain('Yeni Halka'));
    expect(createRing).toHaveBeenCalledWith(
      {},
      { title: 'Yeni Halka', type: 'süresiz', goal: null, deadline: null }
    );
  });

  it('tip hedefli seçilince hedef alanı görünür olur', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderRingsScreen(container, {
      state: { session: { user: { id: 'u1' } }, guest: false },
      client: {},
      onSelectRing: vi.fn(),
    });

    const typeSelect = container.querySelector('.ring-form__type');
    typeSelect.value = 'hedefli';
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));

    expect(container.querySelector('.ring-form__goal').style.display).not.toBe('none');
  });

  it('karta tıklanınca onSelectRing çağrılır', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([
      { id: 'r1', title: 'Fatiha okuyalım', type: 'süresiz', total_count: 5, participant_count: 1 },
    ]);
    const onSelectRing = vi.fn();
    const container = document.createElement('div');
    await renderRingsScreen(container, {
      state: { session: { user: { id: 'u1' } }, guest: false },
      client: {},
      onSelectRing,
    });

    container.querySelector('.ring-card').dispatchEvent(new Event('click', { bubbles: true }));
    expect(onSelectRing).toHaveBeenCalledWith('r1');
  });

  it('halka yoksa boş durum mesajı gösterir', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderRingsScreen(container, {
      state: { session: { user: { id: 'u1' } }, guest: false },
      client: {},
      onSelectRing: vi.fn(),
    });
    expect(container.textContent).toContain('Henüz bir halka yok');
  });
});
