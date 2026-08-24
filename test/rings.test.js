import { describe, it, expect, vi, beforeEach } from 'vitest';

function makeFakeClient({ user = { id: 'u1' }, insertResult, selectResult } = {}) {
  const insertChain = {
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(insertResult ?? { data: { id: 'ring-1' }, error: null }),
  };
  const selectChain = {
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(selectResult ?? { data: [], error: null }),
  };
  const insert = vi.fn().mockReturnValue(insertChain);
  const select = vi.fn().mockReturnValue(selectChain);
  const from = vi.fn().mockReturnValue({ insert, select });

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from,
    __chains: { insert, select, insertChain, selectChain },
  };
}

describe('createRing', () => {
  let client;
  beforeEach(() => {
    client = makeFakeClient();
  });

  it('sin_rings tablosuna doğru payload ile insert eder', async () => {
    const { createRing } = await import('../src/lib/rings.js');
    await createRing(client, { title: 'Fatiha okuyalım', type: 'süresiz' });

    expect(client.from).toHaveBeenCalledWith('sin_rings');
    expect(client.__chains.insert).toHaveBeenCalledWith({
      title: 'Fatiha okuyalım',
      type: 'süresiz',
      goal: null,
      deadline: null,
      created_by: 'u1',
    });
  });

  it('goal ve deadline verilirse payload\'a dahil eder', async () => {
    const { createRing } = await import('../src/lib/rings.js');
    await createRing(client, {
      title: '1.000.000 Salavat',
      type: 'hedefli',
      goal: 1000000,
      deadline: '2026-12-31T00:00:00.000Z',
    });

    expect(client.__chains.insert).toHaveBeenCalledWith({
      title: '1.000.000 Salavat',
      type: 'hedefli',
      goal: 1000000,
      deadline: '2026-12-31T00:00:00.000Z',
      created_by: 'u1',
    });
  });

  it('oluşturulan halkayı döner', async () => {
    client = makeFakeClient({ insertResult: { data: { id: 'ring-42' }, error: null } });
    const { createRing } = await import('../src/lib/rings.js');
    const result = await createRing(client, { title: 'Test', type: 'süresiz' });
    expect(result).toEqual({ id: 'ring-42' });
  });

  it('giriş yapılmamışsa hata fırlatır ve insert denemez', async () => {
    client = makeFakeClient({ user: null });
    const { createRing } = await import('../src/lib/rings.js');
    await expect(createRing(client, { title: 'Test', type: 'süresiz' })).rejects.toThrow(
      'Halka oluşturmak için giriş yapmalısınız'
    );
    expect(client.from).not.toHaveBeenCalled();
  });

  it('insert hata dönerse hatayı fırlatır', async () => {
    client = makeFakeClient({ insertResult: { data: null, error: new Error('db error') } });
    const { createRing } = await import('../src/lib/rings.js');
    await expect(createRing(client, { title: 'Test', type: 'süresiz' })).rejects.toThrow('db error');
  });
});

describe('addContribution', () => {
  it('sin_ring_contributions tablosuna doğru payload ile insert eder', async () => {
    const client = makeFakeClient({ insertResult: { data: { id: 'c1' }, error: null } });
    const { addContribution } = await import('../src/lib/rings.js');

    await addContribution(client, 'ring-1');

    expect(client.from).toHaveBeenCalledWith('sin_ring_contributions');
    expect(client.__chains.insert).toHaveBeenCalledWith({
      ring_id: 'ring-1',
      user_id: 'u1',
      amount: 1,
    });
  });

  it('amount parametresi verilirse onu kullanır', async () => {
    const client = makeFakeClient({ insertResult: { data: { id: 'c1' }, error: null } });
    const { addContribution } = await import('../src/lib/rings.js');

    await addContribution(client, 'ring-1', 5);

    expect(client.__chains.insert).toHaveBeenCalledWith({
      ring_id: 'ring-1',
      user_id: 'u1',
      amount: 5,
    });
  });

  it('giriş yapılmamışsa hata fırlatır', async () => {
    const client = makeFakeClient({ user: null });
    const { addContribution } = await import('../src/lib/rings.js');
    await expect(addContribution(client, 'ring-1')).rejects.toThrow(
      'Katkı eklemek için giriş yapmalısınız'
    );
  });
});

describe('listActiveRings', () => {
  it('sin_rings\'ten created_at\'e göre azalan sırayla, varsayılan limit 20 ile çeker', async () => {
    const rows = [{ id: 'ring-1' }, { id: 'ring-2' }];
    const client = makeFakeClient({ selectResult: { data: rows, error: null } });
    const { listActiveRings } = await import('../src/lib/rings.js');

    const result = await listActiveRings(client);

    expect(client.from).toHaveBeenCalledWith('sin_rings');
    expect(client.__chains.select).toHaveBeenCalledWith('*');
    expect(client.__chains.selectChain.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(client.__chains.selectChain.limit).toHaveBeenCalledWith(20);
    expect(result).toEqual(rows);
  });

  it('verilen limit parametresini kullanır', async () => {
    const client = makeFakeClient({ selectResult: { data: [], error: null } });
    const { listActiveRings } = await import('../src/lib/rings.js');

    await listActiveRings(client, 5);

    expect(client.__chains.selectChain.limit).toHaveBeenCalledWith(5);
  });

  it('hata dönerse fırlatır', async () => {
    const client = makeFakeClient({ selectResult: { data: null, error: new Error('db error') } });
    const { listActiveRings } = await import('../src/lib/rings.js');
    await expect(listActiveRings(client)).rejects.toThrow('db error');
  });
});
