import { getRing, addContribution, subscribeToRing } from '../../lib/rings.js';

const FLUSH_INTERVAL_MS = 2000;

export async function renderZikirScreen(container, { state, client, selectedRingId }) {
  if (!selectedRingId) {
    container.innerHTML = '<p class="zikir-screen__empty">Saymak için önce Halkalar sekmesinden bir halka seç.</p>';
    return;
  }

  container.innerHTML = '<p class="zikir-screen__loading screen-loading">Yükleniyor…</p>';

  let ring;
  try {
    ring = await getRing(client, selectedRingId);
  } catch {
    container.innerHTML = '<p class="zikir-screen__error">Halka yüklenemedi.</p>';
    return;
  }

  container.innerHTML = `
    <div class="zikir-screen">
      <h2 class="zikir-screen__title">${ring.title}</h2>
      <div class="zikir-screen__badge">● CANLI · <span class="zikir-screen__participants">${ring.participant_count}</span> kişi</div>
      <div class="zikir-screen__text">Sübhânallahi ve bihamdihî, sübhânallahil azîm.</div>
      <div class="zikir-screen__footer">
        <div class="zikir-screen__mine">
          <span class="zikir-screen__mine-count">0</span>
          <span class="zikir-screen__label">senin</span>
        </div>
        <div class="zikir-screen__ring-total">
          <span class="zikir-screen__ring-total-count">${ring.total_count.toLocaleString('tr-TR')}</span>
          <span class="zikir-screen__label">toplam</span>
        </div>
      </div>
      ${
        state.session
          ? '<button class="zikir-screen__button" type="button">✦ +1</button>'
          : '<p class="zikir-screen__guest-note">Saymak için giriş yap.</p>'
      }
    </div>
  `;

  const participantsEl = container.querySelector('.zikir-screen__participants');
  const ringTotalEl = container.querySelector('.zikir-screen__ring-total-count');
  const mineEl = container.querySelector('.zikir-screen__mine-count');
  const button = container.querySelector('.zikir-screen__button');

  let mineCount = 0;
  let pendingAmount = 0;

  function applyRingUpdate(updated) {
    ringTotalEl.textContent = updated.total_count.toLocaleString('tr-TR');
    participantsEl.textContent = updated.participant_count;
  }

  async function flush() {
    if (pendingAmount === 0) return;
    const amount = pendingAmount;
    pendingAmount = 0;
    try {
      await addContribution(client, selectedRingId, amount);
    } catch {
      pendingAmount += amount;
    }
  }

  const unsubscribe = subscribeToRing(client, selectedRingId, applyRingUpdate);
  const intervalId = setInterval(flush, FLUSH_INTERVAL_MS);

  container._zikirCleanup = () => {
    clearInterval(intervalId);
    unsubscribe();
    return flush();
  };

  if (button) {
    button.addEventListener('click', () => {
      mineCount += 1;
      pendingAmount += 1;
      mineEl.textContent = mineCount;
    });
  }
}
