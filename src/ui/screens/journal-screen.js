import { getMyContributions } from '../../lib/rings.js';

export async function renderJournalScreen(container, { state, client }) {
  if (!state.session) {
    container.innerHTML = '<p class="journal-screen__guest-note">Günlüğün için giriş yap.</p>';
    return;
  }

  container.innerHTML = '<p class="journal-screen__loading screen-loading">Yükleniyor…</p>';

  let contributions;
  try {
    contributions = await getMyContributions(client);
  } catch {
    container.innerHTML = '<p class="journal-screen__error">Günlüğün yüklenemedi.</p>';
    return;
  }

  if (contributions.length === 0) {
    container.innerHTML = '<p class="journal-screen__empty">Henüz bir okuman yok — bir halkaya katıl.</p>';
    return;
  }

  const total = contributions.reduce((sum, contribution) => sum + contribution.myTotal, 0);

  container.innerHTML = `
    <div class="journal-screen">
      <p class="journal-screen__summary">Toplam ${total.toLocaleString('tr-TR')} okuma, ${contributions.length} halkada</p>
      <div class="journal-list">
        ${contributions
          .map(
            (contribution) => `
              <div class="journal-item">
                <span class="journal-item__title">${contribution.ringTitle}</span>
                <span class="journal-item__total">${contribution.myTotal.toLocaleString('tr-TR')}</span>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}
