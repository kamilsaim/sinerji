// src/ui/screens/feed-screen.js
import { getTodayInfo } from '../../lib/hijri.js';
import { MOCK_RINGS, RING_TYPE_LABELS } from '../../lib/mock-data.js';

function greetingName(state) {
  const fullName = state.session?.user?.user_metadata?.full_name;
  return fullName ? fullName.split(' ')[0] : 'Kardeşim';
}

function ringCardHtml(ring) {
  const typeLabel = RING_TYPE_LABELS[ring.type];
  const progress = ring.goal
    ? `
      <div class="ring-card__progress">
        <div class="ring-card__progress-bar" style="width:${Math.min(
          100,
          Math.round((ring.total / ring.goal) * 100)
        )}%"></div>
      </div>
    `
    : '';

  return `
    <div class="ring-card">
      <span class="ring-card__type">${typeLabel}</span>
      <h3 class="ring-card__title">${ring.title}</h3>
      ${progress}
      <div class="ring-card__meta">
        ${ring.total != null ? `<span class="ring-card__total">${ring.total.toLocaleString('tr-TR')}</span>` : ''}
        <span class="ring-card__participants">${ring.participants} kişi</span>
      </div>
    </div>
  `;
}

export function renderFeedScreen(container, state) {
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
      <div class="ring-list">
        ${MOCK_RINGS.map(ringCardHtml).join('')}
      </div>
    </div>
  `;
}
