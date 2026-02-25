// ── Loader / Skeleton Component ────────────────────────────────

function renderLoader(count = 6) {
  let skeletons = '';
  for (let i = 0; i < count; i++) {
    skeletons += `
      <div class="card" style="pointer-events:none;">
        <div class="flex gap-4 mb-4">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex:1;">
            <div class="skeleton skeleton-title mb-2"></div>
            <div class="skeleton skeleton-text-sm"></div>
          </div>
        </div>
        <div class="skeleton skeleton-text mb-2"></div>
        <div class="skeleton skeleton-text-sm"></div>
      </div>
    `;
  }
  return `<div class="grid grid-auto-fill">${skeletons}</div>`;
}

function renderPageLoader() {
  return `
    <div class="flex justify-center items-center" style="height:60vh;">
      <div style="text-align:center;">
        <div class="icon-spin" style="color:var(--color-primary);">${Icons.loader(32)}</div>
        <div class="text-muted mt-4">${I18n.t('general.loading')}</div>
      </div>
    </div>
  `;
}
