import { createRing, addContribution, listActiveRings } from '../../lib/rings.js';

function formHtml() {
  return `
    <form class="dua-form">
      <input class="dua-form__title" type="text" placeholder="Dua isteğin (ör. Mehmet'in sınavı)" required />
      <input class="dua-form__deadline" type="date" />
      <button type="submit" class="dua-form__submit">Dua İsteği Oluştur</button>
      <p class="dua-form__error" hidden></p>
    </form>
  `;
}

function duaCardHtml(ring) {
  return `
    <div class="dua-card" data-ring-id="${ring.id}">
      <h3 class="dua-card__title">${ring.title}</h3>
      <span class="dua-card__participants">${ring.participant_count} kişi dua etti</span>
      <button class="dua-card__button" type="button" data-ring-id="${ring.id}">🤲 Dua ettim</button>
    </div>
  `;
}

export async function renderDuaScreen(container, { state, client }) {
  const canCreate = Boolean(state.session);

  container.innerHTML = `
    <div class="dua-screen">
      <h2 class="dua-screen__title">Dua İstekleri</h2>
      ${canCreate ? formHtml() : '<p class="dua-screen__guest-note">Dua isteği oluşturmak için giriş yap.</p>'}
      <div class="dua-list screen-loading">Yükleniyor…</div>
    </div>
  `;

  async function loadList() {
    const listEl = container.querySelector('.dua-list');
    listEl.classList.add('screen-loading');
    listEl.textContent = 'Yükleniyor…';

    let rings;
    try {
      rings = await listActiveRings(client);
    } catch {
      listEl.textContent = 'Dua istekleri yüklenemedi.';
      listEl.classList.remove('screen-loading');
      return;
    }

    rings = rings.filter((ring) => ring.type === 'dua');
    listEl.classList.remove('screen-loading');

    if (rings.length === 0) {
      listEl.innerHTML = '<p class="dua-list__empty">Henüz bir dua isteği yok.</p>';
      return;
    }

    listEl.innerHTML = rings.map(duaCardHtml).join('');

    listEl.querySelectorAll('.dua-card__button').forEach((button) => {
      button.addEventListener('click', async () => {
        button.disabled = true;
        button.textContent = 'Dua ettim ✓';
        try {
          await addContribution(client, button.dataset.ringId, 1);
        } catch {
          button.disabled = false;
          button.textContent = '🤲 Dua ettim';
        }
      });
    });
  }

  if (canCreate) {
    const form = container.querySelector('.dua-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const errorEl = form.querySelector('.dua-form__error');
      errorEl.hidden = true;
      const title = form.querySelector('.dua-form__title').value.trim();
      const deadlineValue = form.querySelector('.dua-form__deadline').value;
      if (!title) return;

      try {
        await createRing(client, { title, type: 'dua', deadline: deadlineValue || null });
        form.reset();
        await loadList();
      } catch (error) {
        errorEl.textContent = error.message;
        errorEl.hidden = false;
      }
    });
  }

  await loadList();
}
