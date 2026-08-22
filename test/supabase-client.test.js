// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getSupabaseClient', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('env değişkenleri eksikse anlamlı bir hata fırlatır', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    const { getSupabaseClient } = await import('../src/lib/supabase-client.js');
    expect(() => getSupabaseClient()).toThrow('VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalı');
  });

  it('env değişkenleri varsa bir client örneği döner', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
    const { getSupabaseClient } = await import('../src/lib/supabase-client.js');
    const client = getSupabaseClient();
    expect(client).toBeTruthy();
    expect(client.auth).toBeDefined();
  });

  it('aynı client örneğini tekrar kullanır (singleton)', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
    const { getSupabaseClient } = await import('../src/lib/supabase-client.js');
    const a = getSupabaseClient();
    const b = getSupabaseClient();
    expect(a).toBe(b);
  });
});
