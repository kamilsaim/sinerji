const TABS = ['Akış', 'Halkalar', 'Zikir', 'Dua', 'Günlüğüm'];

export function renderShell(root, state) {
  if (state.loading) {
    root.innerHTML = '<p class="loading">Yükleniyor…</p>';
    return;
  }

  if (!state.session) {
    root.innerHTML = `
      <div class="login-screen">
        <h1>Sinerji</h1>
        <p>Aynı anda, aynı niyetle okuyan bir topluluk.</p>
        <button data-action="sign-in-google">Google ile Giriş Yap</button>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="app-shell">
      <main id="screen-content"></main>
      <nav class="tabbar">
        ${TABS.map((label, i) => `<div class="tab${i === 0 ? ' on' : ''}">${label}</div>`).join('')}
      </nav>
    </div>
  `;
}
