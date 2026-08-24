// src/ui/screens/feed-screen.js
import { getTodayInfo } from '../../lib/hijri.js';
import { listActiveRings } from '../../lib/rings.js';
import { renderRingCardHtml, wireRingCardClicks } from './ring-card.js';

function greetingName(state) {
  const fullName = state.session?.user?.user_metadata?.full_name;
  return fullName ? fullName.split(' ')[0] : 'Kardeşim';
}

export async function renderFeedScreen(container, { state, client, onSelectRing }) {
  const { hijriLabel, specialNote } = getTodayInfo();

  container.innerHTML = `
    <div class="feed-screen">
      <div class="kandil-strip">
        <span class="kandil-strip__date">${hijriLabel}</span>
        ${specialNote ? `<span class="kandil-strip__note">${specialNote}</span>` : ''}
      </div>
      <p class="feed-screen__greeting">Selamünaleyküm, ${greetingName(state)}</p>
      <div class="intention-card">
        <span class="intention-card__label">✦ Bugünün Niyeti</span>
        <p class="intention-card__text">Bugün bir Fatiha, bir salavat eksik olmasın.</p>
      </div>
      <h2 class="feed-screen__section-title">Canlı Halkalar</h2>
      <div class="ring-list screen-loading">Yükleniyor…</div>
    </div>
  `;

  const listEl = container.querySelector('.ring-list');

  let rings;
  try {
    rings = await listActiveRings(client);
  } catch {
    listEl.textContent = 'Halkalar yüklenemedi. Lütfen tekrar dene.';
    listEl.classList.remove('screen-loading');
    return;
  }

  rings = rings.filter((ring) => ring.type !== 'dua');
  listEl.classList.remove('screen-loading');

  if (rings.length === 0) {
    listEl.innerHTML = '<p class="ring-list__empty">Henüz bir halka yok — Halkalar sekmesinden ilk halkayı sen aç.</p>';
    return;
  }

  listEl.innerHTML = rings.map(renderRingCardHtml).join('');
  wireRingCardClicks(listEl, onSelectRing);
}
