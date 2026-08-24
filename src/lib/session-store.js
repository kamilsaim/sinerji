export function createSessionStore() {
  let state = { session: null, loading: true, guest: false };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function notify() {
    for (const listener of listeners) listener(state);
  }

  function setSession(session) {
    state = { session, loading: false, guest: session ? false : state.guest };
    notify();
  }

  function setGuest(guest) {
    state = { ...state, guest, loading: false };
    notify();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setSession, setGuest, subscribe };
}
