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

describe('getRing', () => {
  it('sin_rings\'ten tek bir halkayı id ile çeker', async () => {
    const singleResult = { data: { id: 'r1', title: 'Fatiha okuyalım', total_count: 10, participant_count: 2 }, error: null };
    const selectChain = { eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue(singleResult) };
    const from = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue(selectChain) });
    const client = { from };

    const { getRing } = await import('../src/lib/rings.js');
    const result = await getRing(client, 'r1');

    expect(from).toHaveBeenCalledWith('sin_rings');
    expect(selectChain.eq).toHaveBeenCalledWith('id', 'r1');
    expect(result).toEqual(singleResult.data);
  });

  it('hata dönerse fırlatır', async () => {
    const selectChain = { eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: null, error: new Error('not found') }) };
    const from = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue(selectChain) });
    const client = { from };

    const { getRing } = await import('../src/lib/rings.js');
    await expect(getRing(client, 'r1')).rejects.toThrow('not found');
  });
});

function makeThenable(result) {
  return { then: (resolve, reject) => Promise.resolve(result).then(resolve, reject) };
}

function makeChainableSelect(result) {
  const builder = makeThenable(result);
  builder.in = vi.fn(() => makeThenable(result));
  return builder;
}

function makeFakeClientForContributions({ user = { id: 'u1' }, contributionsResult, ringsResult } = {}) {
  const contributionsSelect = vi.fn(() => makeChainableSelect(contributionsResult));
  const ringsSelect = vi.fn(() => makeChainableSelect(ringsResult));
  const from = vi.fn((table) => {
    if (table === 'sin_ring_contributions') return { select: contributionsSelect };
    if (table === 'sin_rings') return { select: ringsSelect };
    throw new Error(`unexpected table ${table}`);
  });
  return { auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) }, from };
}

describe('getMyContributions', () => {
  it('kendi katkılarını halka başına toplayıp halka başlıklarıyla birlikte döner', async () => {
    const client = makeFakeClientForContributions({
      contributionsResult: {
        data: [
          { ring_id: 'r1', amount: 3 },
          { ring_id: 'r1', amount: 2 },
          { ring_id: 'r2', amount: 1 },
        ],
        error: null,
      },
      ringsResult: {
        data: [
          { id: 'r1', title: 'Fatiha okuyalım' },
          { id: 'r2', title: '1.000.000 Salavat' },
        ],
        error: null,
      },
    });
    const { getMyContributions } = await import('../src/lib/rings.js');

    const result = await getMyContributions(client);

    expect(result).toEqual([
      { ringId: 'r1', ringTitle: 'Fatiha okuyalım', myTotal: 5 },
      { ringId: 'r2', ringTitle: '1.000.000 Salavat', myTotal: 1 },
    ]);
  });

  it('giriş yapılmamışsa boş dizi döner ve sorgu yapmaz', async () => {
    const client = makeFakeClientForContributions({ user: null });
    const { getMyContributions } = await import('../src/lib/rings.js');
    const result = await getMyContributions(client);
    expect(result).toEqual([]);
    expect(client.from).not.toHaveBeenCalled();
  });

  it('hiç katkı yoksa boş dizi döner (halka sorgusu atlanır)', async () => {
    const client = makeFakeClientForContributions({ contributionsResult: { data: [], error: null } });
    const { getMyContributions } = await import('../src/lib/rings.js');
    const result = await getMyContributions(client);
    expect(result).toEqual([]);
  });
});

describe('subscribeToRing', () => {
  it('sin_rings için postgres_changes kanalı açar ve UPDATE geldiğinde onUpdate çağırır', async () => {
    let changeHandler;
    const channel = {
      on: vi.fn((_event, _filterConfig, handler) => {
        changeHandler = handler;
        return channel;
      }),
      subscribe: vi.fn(() => channel),
    };
    const client = { channel: vi.fn(() => channel), removeChannel: vi.fn() };
    const onUpdate = vi.fn();
    const { subscribeToRing } = await import('../src/lib/rings.js');

    subscribeToRing(client, 'ring-1', onUpdate);

    expect(client.channel).toHaveBeenCalledWith('sin_rings_ring-1');
    expect(channel.on).toHaveBeenCalledWith(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'sin_rings', filter: 'id=eq.ring-1' },
      expect.any(Function)
    );
    expect(channel.subscribe).toHaveBeenCalled();

    changeHandler({ new: { total_count: 5, participant_count: 2 } });
    expect(onUpdate).toHaveBeenCalledWith({ total_count: 5, participant_count: 2 });
  });

  it('döndürülen fonksiyon çağrılınca kanalı kapatır', async () => {
    const channel = { on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() };
    const client = { channel: vi.fn(() => channel), removeChannel: vi.fn() };
    const { subscribeToRing } = await import('../src/lib/rings.js');

    const unsubscribe = subscribeToRing(client, 'ring-1', () => {});
    unsubscribe();

    expect(client.removeChannel).toHaveBeenCalledWith(channel);
  });
});

describe('RING_TYPE_LABELS', () => {
  it('4 halka tipi için Türkçe etiket tanımlar', async () => {
    const { RING_TYPE_LABELS } = await import('../src/lib/rings.js');
    expect(RING_TYPE_LABELS).toEqual({
      süresiz: 'Süresiz',
      hedefli: 'Hedefli',
      süreli: 'Süreli',
      dua: 'Dua isteği',
    });
  });
});
