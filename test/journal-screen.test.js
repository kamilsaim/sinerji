import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderJournalScreen } from '../src/ui/screens/journal-screen.js';
import { getMyContributions } from '../src/lib/rings.js';

vi.mock('../src/lib/rings.js', () => ({
  getMyContributions: vi.fn(),
}));

describe('renderJournalScreen', () => {
  beforeEach(() => {
    vi.mocked(getMyContributions).mockReset();
  });

  it('misafir modda giriş uyarısı gösterir, sorgu yapmaz', async () => {
    const container = document.createElement('div');
    await renderJournalScreen(container, { state: { session: null, guest: true }, client: {} });
    expect(container.textContent).toContain('giriş yap');
    expect(getMyContributions).not.toHaveBeenCalled();
  });

  it('katkı yoksa boş durum mesajı gösterir', async () => {
    vi.mocked(getMyContributions).mockResolvedValue([]);
    const container = document.createElement('div');
    await renderJournalScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });
    expect(container.textContent).toContain('Henüz bir okuman yok');
  });

  it('toplam özet ve halka başına satırları gösterir', async () => {
    vi.mocked(getMyContributions).mockResolvedValue([
      { ringId: 'r1', ringTitle: 'Fatiha okuyalım', myTotal: 5 },
      { ringId: 'r2', ringTitle: '1.000.000 Salavat', myTotal: 12 },
    ]);
    const container = document.createElement('div');
    await renderJournalScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });

    expect(container.textContent).toContain('Toplam 17');
    expect(container.textContent).toContain('2 halkada');
    expect(container.querySelectorAll('.journal-item').length).toBe(2);
    expect(container.textContent).toContain('Fatiha okuyalım');
    expect(container.textContent).toContain('1.000.000 Salavat');
  });

  it('yükleme hatasında hata mesajı gösterir', async () => {
    vi.mocked(getMyContributions).mockRejectedValue(new Error('db error'));
    const container = document.createElement('div');
    await renderJournalScreen(container, { state: { session: { user: { id: 'u1' } }, guest: false }, client: {} });
    expect(container.textContent).toContain('yüklenemedi');
  });
});
