import { describe, it, expect } from 'vitest';
import { renderPlaceholderScreen } from '../src/ui/screens/placeholder-screen.js';

describe('renderPlaceholderScreen', () => {
  it('verilen etiketle bir "yakında" mesajı render eder', () => {
    const container = document.createElement('div');
    renderPlaceholderScreen(container, 'Halkalar');
    expect(container.textContent).toContain('Halkalar');
    expect(container.textContent).toContain('yakında');
  });

  it('farklı bir etiketle çağrılınca o etiketi gösterir', () => {
    const container = document.createElement('div');
    renderPlaceholderScreen(container, 'Günlüğüm');
    expect(container.textContent).toContain('Günlüğüm');
  });
});
