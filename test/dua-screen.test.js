import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderDuaScreen } from '../src/ui/screens/dua-screen.js';
import { createRing, addContribution, listActiveRings } from '../src/lib/rings.js';

vi.mock('../src/lib/rings.js', () => ({
  createRing: vi.fn(),
  addContribution: vi.fn(),
  listActiveRings: vi.fn(),
}));

describe('renderDuaScreen', () => {
  beforeEach(() => {
    vi.mocked(createRing).mockReset();
    vi.mocked(addContribution).mockReset().mockResolvedValue({});
    vi.mocked(listActiveRings).mockReset();
  });

  it('sadece dua tipindeki kayıtları listeler', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([
      { id: 'r1', title: 'Fatiha okuyalım', type: 'süresiz', total_count: 5, participant_count: 1 },
      { id: 'r2', title: "Mehmet'in sınavı", type: 'dua', total_count: 0, participant_count: 3 },
    ]);
    const container = document.createElement('div');
    await renderDuaScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });

    expect(container.querySelectorAll('.dua-card').length).toBe(1);
    expect(container.textContent).toContain("Mehmet'in sınavı");
    expect(container.textContent).not.toContain('Fatiha okuyalım');
  });

  it('giriş yapmış kullanıcıya oluşturma formu gösterir', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderDuaScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });
    expect(container.querySelector('.dua-form')).not.toBeNull();
  });

  it('misafir modda form yerine giriş uyarısı gösterir', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderDuaScreen(container, { state: { session: null, guest: true }, client: {} });
    expect(container.querySelector('.dua-form')).toBeNull();
    expect(container.textContent).toContain('giriş yap');
  });

  it('form gönderilince createRing type=dua ile çağrılır ve liste yenilenir', async () => {
    vi.mocked(listActiveRings).mockResolvedValueOnce([]).mockResolvedValueOnce([
      { id: 'r1', title: 'Yeni dua isteği', type: 'dua', total_count: 0, participant_count: 0 },
    ]);
    vi.mocked(createRing).mockResolvedValue({ id: 'r1' });

    const container = document.createElement('div');
    await renderDuaScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });

    container.querySelector('.dua-form__title').value = 'Yeni dua isteği';
    container.querySelector('.dua-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => expect(container.textContent).toContain('Yeni dua isteği'));
    expect(createRing).toHaveBeenCalledWith({}, { title: 'Yeni dua isteği', type: 'dua', deadline: null });
  });

  it('"Dua ettim" butonuna tıklayınca addContribution çağrılır ve buton devre dışı kalır', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([
      { id: 'r1', title: "Mehmet'in sınavı", type: 'dua', total_count: 0, participant_count: 3 },
    ]);
    const container = document.createElement('div');
    await renderDuaScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });

    const button = container.querySelector('.dua-card__button');
    button.dispatchEvent(new Event('click', { bubbles: true }));

    await vi.waitFor(() => expect(button.disabled).toBe(true));
    expect(addContribution).toHaveBeenCalledWith({}, 'r1', 1);
  });

  it('dua isteği yoksa boş durum mesajı gösterir', async () => {
    vi.mocked(listActiveRings).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderDuaScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });
    expect(container.textContent).toContain('Henüz bir dua isteği yok');
  });
});
