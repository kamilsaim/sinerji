// src/ui/render-shell.js
import { renderFeedScreen } from './screens/feed-screen.js';
import { renderPlaceholderScreen } from './screens/placeholder-screen.js';

const TABS = [
  { label: 'Akış', icon: '◉' },
  { label: 'Halkalar', icon: '✦' },
  { label: 'Zikir', icon: '◍' },
  { label: 'Dua', icon: '🤲' },
  { label: 'Günlüğüm', icon: '▤' },
];

const SCREEN_RENDERERS = {
  Akış: renderFeedScreen,
  Halkalar: (container) => renderPlaceholderScreen(container, 'Halkalar'),
  Zikir: (container) => renderPlaceholderScreen(container, 'Zikir'),
  Dua: (container) => renderPlaceholderScreen(container, 'Dua'),
  Günlüğüm: (container) => renderPlaceholderScreen(container, 'Günlüğüm'),
};

const GOOGLE_ICON = `
  <svg class="login-screen__google-icon" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>
`;

function renderLoginScreen() {
  return `
    <div class="login-screen">
      <div class="login-screen__logo-wrap">
        <img class="login-screen__logo" src="/logo.png" alt="Sinerji" />
        <span class="login-screen__logo-twinkle" aria-hidden="true"></span>
      </div>
      <p class="login-screen__tagline">Aynı anda, aynı niyetle okuyan bir topluluk.</p>
      <button class="login-screen__button" data-action="sign-in-google">
        ${GOOGLE_ICON}
        Google ile Giriş Yap
      </button>
      <button class="login-screen__guest-link" data-action="continue-as-guest">
        Misafir olarak devam et
      </button>
    </div>
  `;
}

function renderAppShell({ guest }) {
  return `
    <div class="app-shell">
      ${guest ? `
        <div class="guest-banner">
          <span>✦ Misafir modundasın — katılmak ve saymak için giriş yap</span>
          <button data-action="sign-in-google">Giriş Yap</button>
        </div>
      ` : ''}
      <main id="screen-content"></main>
      <nav class="tabbar">
        ${TABS.map(({ label, icon }) => `
          <div class="tab" data-label="${label}">
            <span class="tab__ico">${icon}</span>
            <span class="tab__label">${label}</span>
          </div>
        `).join('')}
      </nav>
    </div>
  `;
}

function wireAppShell(root, state) {
  const content = root.querySelector('#screen-content');
  const tabs = root.querySelectorAll('.tab');

  function activate(label) {
    tabs.forEach((tab) => tab.classList.toggle('on', tab.dataset.label === label));
    const renderScreen = SCREEN_RENDERERS[label] ?? renderFeedScreen;
    renderScreen(content, state);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.label));
  });

  activate(TABS[0].label);
}

export function renderShell(root, state) {
  if (state.loading) {
    root.innerHTML = '<div class="loading-screen"><p class="loading">Yükleniyor…</p></div>';
    return;
  }

  if (!state.session && !state.guest) {
    root.innerHTML = renderLoginScreen();
    return;
  }

  root.innerHTML = renderAppShell({ guest: state.guest });
  wireAppShell(root, state);
}
