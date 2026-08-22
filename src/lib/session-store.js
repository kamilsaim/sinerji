export function createSessionStore() {
  let state = { session: null, loading: true };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setSession(session) {
    state = { session, loading: false };
    for (const listener of listeners) listener(state);
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setSession, subscribe };
}
