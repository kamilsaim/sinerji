import { getSupabaseClient } from './lib/supabase-client.js';
import { signInWithGoogle, signOut, getCurrentSession, onAuthStateChange } from './lib/auth.js';
import { createSessionStore } from './lib/session-store.js';
import { renderShell } from './ui/render-shell.js';

const root = document.getElementById('app');
const store = createSessionStore();
const client = getSupabaseClient();

store.subscribe((state) => {
  renderShell(root, state);
  root.querySelectorAll('[data-action="sign-in-google"]').forEach((btn) => {
    btn.addEventListener('click', () => signInWithGoogle(client));
  });
  const guestBtn = root.querySelector('[data-action="continue-as-guest"]');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => store.setGuest(true));
  }
  root.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.tab').forEach((t) => t.classList.remove('on'));
      void tab.offsetWidth;
      tab.classList.add('on');
    });
  });
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
