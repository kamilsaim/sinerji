export const RING_TYPE_LABELS = {
  süresiz: 'Süresiz',
  hedefli: 'Hedefli',
  süreli: 'Süreli',
  dua: 'Dua isteği',
};

export async function createRing(client, { title, type, goal = null, deadline = null }) {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw new Error('Halka oluşturmak için giriş yapmalısınız');
  }

  const { data, error } = await client
    .from('sin_rings')
    .insert({ title, type, goal, deadline, created_by: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addContribution(client, ringId, amount = 1) {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw new Error('Katkı eklemek için giriş yapmalısınız');
  }

  const { data, error } = await client
    .from('sin_ring_contributions')
    .insert({ ring_id: ringId, user_id: user.id, amount })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listActiveRings(client, limit = 20) {
  const { data, error } = await client
    .from('sin_rings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getRing(client, ringId) {
  const { data, error } = await client.from('sin_rings').select('*').eq('id', ringId).single();
  if (error) throw error;
  return data;
}

export async function getMyContributions(client) {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return [];

  const { data: contributions, error } = await client.from('sin_ring_contributions').select('ring_id, amount');
  if (error) throw error;

  const totals = new Map();
  for (const contribution of contributions) {
    totals.set(contribution.ring_id, (totals.get(contribution.ring_id) ?? 0) + contribution.amount);
  }

  const ringIds = [...totals.keys()];
  if (ringIds.length === 0) return [];

  const { data: rings, error: ringsError } = await client.from('sin_rings').select('id, title').in('id', ringIds);
  if (ringsError) throw ringsError;

  return rings.map((ring) => ({
    ringId: ring.id,
    ringTitle: ring.title,
    myTotal: totals.get(ring.id),
  }));
}

export function subscribeToRing(client, ringId, onUpdate) {
  const channel = client
    .channel(`sin_rings_${ringId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'sin_rings', filter: `id=eq.${ringId}` },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();

  return () => client.removeChannel(channel);
}
