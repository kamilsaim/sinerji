export async function signInWithGoogle(client) {
  return client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
}

export async function signOut(client) {
  return client.auth.signOut();
}

export async function getCurrentSession(client) {
  const { data } = await client.auth.getSession();
  return data.session ?? null;
}

export function onAuthStateChange(client, callback) {
  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}
