import { describe, it, expect, vi, beforeEach } from 'vitest';

function makeFakeClient() {
  return {
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'u1' } } }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  };
}

describe('auth', () => {
  let fakeClient;
  beforeEach(() => {
    fakeClient = makeFakeClient();
  });

  it('signInWithGoogle, google provider ile OAuth başlatır', async () => {
    const { signInWithGoogle } = await import('../src/lib/auth.js');
    await signInWithGoogle(fakeClient);
    expect(fakeClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  });

  it('signOut, client.auth.signOut çağırır', async () => {
    const { signOut } = await import('../src/lib/auth.js');
    await signOut(fakeClient);
    expect(fakeClient.auth.signOut).toHaveBeenCalled();
  });

  it('getCurrentSession, mevcut oturumu döner', async () => {
    const { getCurrentSession } = await import('../src/lib/auth.js');
    const session = await getCurrentSession(fakeClient);
    expect(session.user.id).toBe('u1');
  });

  it('getCurrentSession, oturum yoksa null döner', async () => {
    fakeClient.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    const { getCurrentSession } = await import('../src/lib/auth.js');
    const session = await getCurrentSession(fakeClient);
    expect(session).toBeNull();
  });
});
