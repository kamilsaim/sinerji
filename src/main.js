import { getSupabaseClient } from './lib/supabase-client.js';
import { signInWithGoogle, signOut, getCurrentSession, onAuthStateChange } from './lib/auth.js';
import { createSessionStore } from './lib/session-store.js';
import { renderShell } from './ui/render-shell.js';

const root = document.getElementById('app');
const store = createSessionStore();
const client = getSupabaseClient();

store.subscribe((state) => {
  renderShell(root, state);
  const signInBtn = root.querySelector('[data-action="sign-in-google"]');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => signInWithGoogle(client));
  }
});

renderShell(root, store.getState());

getCurrentSession(client).then((session) => {
  store.setSession(session);
});

onAuthStateChange(client, (session) => {
  store.setSession(session);
});

window.__sinerjiSignOut = () => signOut(client);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/sw.js', { type: 'module' }).catch((err) => {
      console.error('Service worker kaydı başarısız:', err);
    });
  });
}
