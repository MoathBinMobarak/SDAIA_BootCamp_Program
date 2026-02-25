// ── Empty State Component ─────────────────────────────────────

function renderEmptyState(title, text, icon = '', actionText = '', actionRoute = '') {
  const iconHtml = icon || Icons.inbox(48);
  return `
    <div class="empty-state">
      <div class="empty-state__icon">${iconHtml}</div>
      <div class="empty-state__title">${title}</div>
      <div class="empty-state__text">${text}</div>
      ${actionText ? `<a href="#${actionRoute}" class="btn btn-primary">${actionText}</a>` : ''}
    </div>
  `;
}
