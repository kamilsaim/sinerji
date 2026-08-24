// src/ui/screens/ring-card.js
import { RING_TYPE_LABELS } from '../../lib/rings.js';

export function renderRingCardHtml(ring) {
  const typeLabel = RING_TYPE_LABELS[ring.type] ?? ring.type;
  const progress = ring.goal
    ? `
      <div class="ring-card__progress">
        <div class="ring-card__progress-bar" style="width:${Math.min(
          100,
          Math.round((ring.total_count / ring.goal) * 100)
        )}%"></div>
      </div>
    `
    : '';

  return `
    <div class="ring-card" data-ring-id="${ring.id}" role="button" tabindex="0">
      <span class="ring-card__type">${typeLabel}</span>
      <h3 class="ring-card__title">${ring.title}</h3>
      ${progress}
      <div class="ring-card__meta">
        <span class="ring-card__total">${ring.total_count.toLocaleString('tr-TR')}</span>
        <span class="ring-card__participants">${ring.participant_count} kişi</span>
      </div>
    </div>
  `;
}

export function wireRingCardClicks(container, onSelectRing) {
  container.querySelectorAll('.ring-card').forEach((card) => {
    card.addEventListener('click', () => onSelectRing(card.dataset.ringId));
  });
}
