// src/ui/screens/rings-screen.js
import { createRing, listActiveRings } from '../../lib/rings.js';
import { renderRingCardHtml, wireRingCardClicks } from './ring-card.js';

function formHtml() {
  return `
    <form class="ring-form">
      <input class="ring-form__title" type="text" placeholder="Halka başlığı" required />
      <select class="ring-form__type">
        <option value="süresiz">Süresiz</option>
        <option value="hedefli">Hedefli</option>
        <option value="süreli">Süreli</option>
      </select>
      <input class="ring-form__goal" type="number" min="1" placeholder="Hedef sayı" style="display:none" />
      <input class="ring-form__deadline" type="date" style="display:none" />
      <button type="submit" class="ring-form__submit">Oluştur</button>
      <p class="ring-form__error" hidden></p>
    </form>
  `;
}

function wireForm(container, { client, onCreated }) {
  const form = container.querySelector('.ring-form');
  const typeSelect = form.querySelector('.ring-form__type');
  const goalInput = form.querySelector('.ring-form__goal');
  const deadlineInput = form.querySelector('.ring-form__deadline');
  const errorEl = form.querySelector('.ring-form__error');

  typeSelect.addEventListener('change', () => {
    goalInput.style.display = typeSelect.value === 'hedefli' ? '' : 'none';
    deadlineInput.style.display = typeSelect.value === 'süreli' ? '' : 'none';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.hidden = true;

    const title = form.querySelector('.ring-form__title').value.trim();
    const type = typeSelect.value;
    const goal = type === 'hedefli' ? Number(goalInput.value) || null : null;
    const deadline = type === 'süreli' && deadlineInput.value ? deadlineInput.value : null;

    if (!title) return;

    try {
      await createRing(client, { title, type, goal, deadline });
      form.reset();
      goalInput.style.display = 'none';
      deadlineInput.style.display = 'none';
      await onCreated();
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.hidden = false;
    }
  });
}

export async function renderRingsScreen(container, { state, client, onSelectRing }) {
  const canCreate = Boolean(state.session);

  container.innerHTML = `
    <div class="rings-screen">
      <h2 class="rings-screen__title">Halkalar</h2>
      ${canCreate ? formHtml() : '<p class="rings-screen__guest-note">Halka oluşturmak için giriş yap.</p>'}
      <div class="ring-list screen-loading">Yükleniyor…</div>
    </div>
  `;

  async function loadList() {
    const listEl = container.querySelector('.ring-list');
    listEl.classList.add('screen-loading');
    listEl.textContent = 'Yükleniyor…';

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
      listEl.innerHTML = '<p class="ring-list__empty">Henüz bir halka yok.</p>';
      return;
    }

    listEl.innerHTML = rings.map(renderRingCardHtml).join('');
    wireRingCardClicks(listEl, onSelectRing);
  }

  if (canCreate) {
    wireForm(container, { client, onCreated: loadList });
  }

  await loadList();
}
