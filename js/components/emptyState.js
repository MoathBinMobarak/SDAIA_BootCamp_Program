// ── Empty State Component ─────────────────────────────────────

function renderEmptyState(title, text, icon = '📭', actionText = '', actionRoute = '') {
    return `
    <div class="empty-state">
      <div class="empty-state__icon">${icon}</div>
      <div class="empty-state__title">${title}</div>
      <div class="empty-state__text">${text}</div>
      ${actionText ? `<a href="#${actionRoute}" class="btn btn-primary">${actionText}</a>` : ''}
    </div>
  `;
}
