import { describe, it, expect, beforeEach } from 'vitest';
import { renderShell } from '../src/ui/render-shell.js';

describe('renderShell', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
  });

  it('loading true iken yükleniyor durumu gösterir', () => {
    renderShell(root, { session: null, loading: true });
    expect(root.textContent).toContain('Yükleniyor');
  });

  it('session null iken giriş ekranı, logo ve Google giriş butonu gösterir', () => {
    renderShell(root, { session: null, loading: false });
    const button = root.querySelector('[data-action="sign-in-google"]');
    const logo = root.querySelector('.login-screen__logo');
    expect(button).not.toBeNull();
    expect(logo).not.toBeNull();
    expect(logo.getAttribute('src')).toBe('/logo.png');
    expect(root.textContent).toContain('Google ile Giriş Yap');
  });

  it('session varsa 5 sekmeli alt menüyü gösterir', () => {
    renderShell(root, { session: { user: { id: 'u1' } }, loading: false });
    const tabs = root.querySelectorAll('.tab');
    expect(tabs.length).toBe(5);
    expect(root.textContent).toContain('Akış');
    expect(root.textContent).toContain('Halkalar');
    expect(root.textContent).toContain('Zikir');
    expect(root.textContent).toContain('Dua');
    expect(root.textContent).toContain('Günlüğüm');
  });
});
