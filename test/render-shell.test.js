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

  it('session null ve guest false iken giriş ekranı, logo, Google butonu ve misafir bağlantısı gösterir', () => {
    renderShell(root, { session: null, loading: false, guest: false });
    const button = root.querySelector('[data-action="sign-in-google"]');
    const logo = root.querySelector('.login-screen__logo');
    const guestLink = root.querySelector('[data-action="continue-as-guest"]');
    expect(button).not.toBeNull();
    expect(logo).not.toBeNull();
    expect(logo.getAttribute('src')).toBe('/logo.png');
    expect(guestLink).not.toBeNull();
    expect(root.textContent).toContain('Google ile Giriş Yap');
    expect(root.textContent).toContain('Misafir olarak devam et');
  });

  it('session varsa 5 sekmeli alt menüyü gösterir', () => {
    renderShell(root, { session: { user: { id: 'u1' } }, loading: false, guest: false });
    const tabs = root.querySelectorAll('.tab');
    expect(tabs.length).toBe(5);
    expect(root.textContent).toContain('Akış');
    expect(root.textContent).toContain('Halkalar');
    expect(root.textContent).toContain('Zikir');
    expect(root.textContent).toContain('Dua');
    expect(root.textContent).toContain('Günlüğüm');
  });

  it('session yok ama guest true ise yine 5 sekmeli kabuğu gösterir', () => {
    renderShell(root, { session: null, loading: false, guest: true });
    const tabs = root.querySelectorAll('.tab');
    expect(tabs.length).toBe(5);
  });

  it('guest modda kabukta bir "giriş yap" davet rozeti gösterir', () => {
    renderShell(root, { session: null, loading: false, guest: true });
    expect(root.querySelector('[data-action="sign-in-google"]')).not.toBeNull();
    expect(root.textContent).toContain('Misafir modundasın');
  });
});
