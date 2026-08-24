import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderZikirScreen } from '../src/ui/screens/zikir-screen.js';
import { getRing, addContribution, subscribeToRing } from '../src/lib/rings.js';

vi.mock('../src/lib/rings.js', () => ({
  getRing: vi.fn(),
  addContribution: vi.fn(),
  subscribeToRing: vi.fn(),
}));

describe('renderZikirScreen', () => {
  beforeEach(() => {
    vi.mocked(getRing).mockReset();
    vi.mocked(addContribution).mockReset().mockResolvedValue({});
    vi.mocked(subscribeToRing).mockReset().mockReturnValue(vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('selectedRingId yoksa halka seçme uyarısı gösterir', async () => {
    const container = document.createElement('div');
    await renderZikirScreen(container, { state: { session: { user: { id: 'u1' } } }, client: {}, selectedRingId: null });
    expect(container.textContent).toContain('önce Halkalar sekmesinden');
    expect(getRing).not.toHaveBeenCalled();
  });

  it('halkayı yükler, başlığını ve toplamlarını gösterir', async () => {
    vi.mocked(getRing).mockResolvedValue({ id: 'r1', title: 'Fatiha okuyalım', total_count: 100, participant_count: 5 });
    const container = document.createElement('div');
    await renderZikirScreen(container, {
      state: { session: { user: { id: 'u1' } } },
      client: {},
      selectedRingId: 'r1',
    });

    expect(container.textContent).toContain('Fatiha okuyalım');
    expect(container.querySelector('.zikir-screen__ring-total-count').textContent).toBe('100');
    expect(container.querySelector('.zikir-screen__participants').textContent).toBe('5');
  });

  it('misafir modda +1 butonu yerine giriş uyarısı gösterir', async () => {
    vi.mocked(getRing).mockResolvedValue({ id: 'r1', title: 'Fatiha okuyalım', total_count: 0, participant_count: 0 });
    const container = document.createElement('div');
    await renderZikirScreen(container, { state: { session: null, guest: true }, client: {}, selectedRingId: 'r1' });

    expect(container.querySelector('.zikir-screen__button')).toBeNull();
    expect(container.textContent).toContain('giriş yap');
  });

  it('+1 butonuna tıklayınca kendi sayacı anında artar, 2sn sonra addContribution toplu gönderilir', async () => {
    vi.useFakeTimers();
    vi.mocked(getRing).mockResolvedValue({ id: 'r1', title: 'Fatiha okuyalım', total_count: 0, participant_count: 0 });
    const container = document.createElement('div');
    await renderZikirScreen(container, { state: { session: { user: { id: 'u1' } } }, client: {}, selectedRingId: 'r1' });

    const button = container.querySelector('.zikir-screen__button');
    button.dispatchEvent(new Event('click', { bubbles: true }));
    button.dispatchEvent(new Event('click', { bubbles: true }));
    button.dispatchEvent(new Event('click', { bubbles: true }));

    expect(container.querySelector('.zikir-screen__mine-count').textContent).toBe('3');
    expect(addContribution).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);

    expect(addContribution).toHaveBeenCalledWith({}, 'r1', 3);
  });

  it('subscribeToRing ile abone olur, gelen UPDATE toplamları günceller', async () => {
    let onUpdate;
    vi.mocked(subscribeToRing).mockImplementation((_client, _ringId, cb) => {
      onUpdate = cb;
      return vi.fn();
    });
    vi.mocked(getRing).mockResolvedValue({ id: 'r1', title: 'Fatiha okuyalım', total_count: 10, participant_count: 2 });
    const container = document.createElement('div');
    await renderZikirScreen(container, { state: { session: { user: { id: 'u1' } } }, client: {}, selectedRingId: 'r1' });

    onUpdate({ total_count: 15, participant_count: 4 });

    expect(container.querySelector('.zikir-screen__ring-total-count').textContent).toBe('15');
    expect(container.querySelector('.zikir-screen__participants').textContent).toBe('4');
  });

  it('container._zikirCleanup çağrılınca interval durur ve abonelik kapanır', async () => {
    vi.useFakeTimers();
    const unsubscribe = vi.fn();
    vi.mocked(subscribeToRing).mockReturnValue(unsubscribe);
    vi.mocked(getRing).mockResolvedValue({ id: 'r1', title: 'Fatiha okuyalım', total_count: 0, participant_count: 0 });
    const container = document.createElement('div');
    await renderZikirScreen(container, { state: { session: { user: { id: 'u1' } } }, client: {}, selectedRingId: 'r1' });

    container.querySelector('.zikir-screen__button').dispatchEvent(new Event('click', { bubbles: true }));
    await container._zikirCleanup();

    expect(unsubscribe).toHaveBeenCalled();
    expect(addContribution).toHaveBeenCalledWith({}, 'r1', 1);

    await vi.advanceTimersByTimeAsync(5000);
    expect(addContribution).toHaveBeenCalledTimes(1);
  });
});
