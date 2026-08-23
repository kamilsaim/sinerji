import { describe, it, expect, vi } from 'vitest';
import { createSessionStore } from '../src/lib/session-store.js';

describe('createSessionStore', () => {
  it('başlangıç durumu: session null, loading true, guest false', () => {
    const store = createSessionStore();
    expect(store.getState()).toEqual({ session: null, loading: true, guest: false });
  });

  it('setSession çağrılınca durumu günceller ve abonelere bildirir', () => {
    const store = createSessionStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.setSession({ user: { id: 'u1' } });

    expect(store.getState()).toEqual({ session: { user: { id: 'u1' } }, loading: false, guest: false });
    expect(listener).toHaveBeenCalledWith({ session: { user: { id: 'u1' } }, loading: false, guest: false });
  });

  it('setSession(null) ile çıkış durumunu yansıtır', () => {
    const store = createSessionStore();
    store.setSession({ user: { id: 'u1' } });
    store.setSession(null);
    expect(store.getState()).toEqual({ session: null, loading: false, guest: false });
  });

  it('unsubscribe sonrası listener çağrılmaz', () => {
    const store = createSessionStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setSession({ user: { id: 'u1' } });
    expect(listener).not.toHaveBeenCalled();
  });

  it('setGuest(true) ile misafir moduna geçer, loading false olur', () => {
    const store = createSessionStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.setGuest(true);

    expect(store.getState()).toEqual({ session: null, loading: false, guest: true });
    expect(listener).toHaveBeenCalledWith({ session: null, loading: false, guest: true });
  });

  it('misafir moddayken gerçek girişle session gelirse guest false olur', () => {
    const store = createSessionStore();
    store.setGuest(true);
    store.setSession({ user: { id: 'u1' } });
    expect(store.getState()).toEqual({ session: { user: { id: 'u1' } }, loading: false, guest: false });
  });
});
