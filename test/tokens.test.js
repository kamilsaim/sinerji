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
