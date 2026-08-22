import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('manifest.webmanifest', () => {
  it('geçerli JSON ve zorunlu PWA alanlarını içerir', () => {
    const raw = readFileSync(resolve(process.cwd(), 'public/manifest.webmanifest'), 'utf-8');
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
