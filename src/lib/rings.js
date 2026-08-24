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
