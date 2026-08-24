export function renderPlaceholderScreen(container, label) {
  container.innerHTML = `
    <div class="placeholder-screen">
      <p class="placeholder-screen__label">${label}</p>
      <p class="placeholder-screen__text">Bu ekran yakında burada olacak ✦</p>
    </div>
  `;
}
