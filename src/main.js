import { getSupabaseClient, isSupabaseConfigured } from './lib/supabase-client.js';
import { signInWithGoogle, signOut, getCurrentSession, onAuthStateChange } from './lib/auth.js';
import { createSessionStore } from './lib/session-store.js';
import { renderShell } from './ui/render-shell.js';

const root = document.getElementById('app');
const store = createSessionStore();
const supabaseReady = isSupabaseConfigured();
const client = supabaseReady ? getSupabaseClient() : null;

function showComingSoonNotice(button) {
  const original = button.textContent;
  button.textContent = 'Google girişi yakında aktif olacak';
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 2500);
}

store.subscribe((state) => {
  renderShell(root, state, client);

  root.querySelectorAll('[data-action="sign-in-google"]').forEach((btn) => {
    if (supabaseReady) {
      btn.addEventListener('click', () => signInWithGoogle(client));
    } else {
      btn.addEventListener('click', () => showComingSoonNotice(btn));
    }
  });

  const guestBtn = root.querySelector('[data-action="continue-as-guest"]');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => store.setGuest(true));
  }
});

renderShell(root, store.getState(), client);

if (supabaseReady) {
  getCurrentSession(client).then((session) => {
    store.setSession(session);
  });

  onAuthStateChange(client, (session) => {
    store.setSession(session);
  });

  window.__sinerjiSignOut = () => signOut(client);
} else {
  store.setSession(null);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker kaydı başarısız:', err);
    });
  });
}
