// test/feed-screen.test.js
import { describe, it, expect } from 'vitest';
import { renderFeedScreen } from '../src/ui/screens/feed-screen.js';
import { MOCK_RINGS } from '../src/lib/mock-data.js';

describe('renderFeedScreen', () => {
  it('kandil şeridi, selamlama, niyet kartı ve halka kartlarını render eder', () => {
    const container = document.createElement('div');
    renderFeedScreen(container, { session: null, guest: true, loading: false });

    expect(container.querySelector('.kandil-strip')).not.toBeNull();
    expect(container.textContent).toContain('Selamünaleyküm');
    expect(container.querySelector('.intention-card')).not.toBeNull();

    const cards = container.querySelectorAll('.ring-card');
    expect(cards.length).toBe(MOCK_RINGS.length);
    expect(container.textContent).toContain('Fatiha okuyalım');
    expect(container.textContent).toContain('84 kişi');
  });

  it('oturumdaki kullanıcıyı ilk adıyla selamlar', () => {
    const container = document.createElement('div');
    renderFeedScreen(container, {
      session: { user: { user_metadata: { full_name: 'Kamil Saim' } } },
      guest: false,
      loading: false,
    });
    expect(container.textContent).toContain('Selamünaleyküm, Kamil');
  });

  it('misafir modunda genel bir selamlama gösterir', () => {
    const container = document.createElement('div');
    renderFeedScreen(container, { session: null, guest: true, loading: false });
    expect(container.textContent).toContain('Selamünaleyküm, Kardeşim');
  });
});
