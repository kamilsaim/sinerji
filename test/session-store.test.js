import { describe, it, expect, vi } from 'vitest';
import { createSessionStore } from '../src/lib/session-store.js';

describe('createSessionStore', () => {
  it('başlangıç durumu: session null, loading true', () => {
    const store = createSessionStore();
    expect(store.getState()).toEqual({ session: null, loading: true });
  });

  it('setSession çağrılınca durumu günceller ve abonelere bildirir', () => {
    const store = createSessionStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.setSession({ user: { id: 'u1' } });

    expect(store.getState()).toEqual({ session: { user: { id: 'u1' } }, loading: false });
    expect(listener).toHaveBeenCalledWith({ session: { user: { id: 'u1' } }, loading: false });
  });

  it('setSession(null) ile çıkış durumunu yansıtır', () => {
    const store = createSessionStore();
    store.setSession({ user: { id: 'u1' } });
    store.setSession(null);
    expect(store.getState()).toEqual({ session: null, loading: false });
  });

  it('unsubscribe sonrası listener çağrılmaz', () => {
    const store = createSessionStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setSession({ user: { id: 'u1' } });
    expect(listener).not.toHaveBeenCalled();
  });
});
