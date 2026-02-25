// ── Preview Panel Component (i18n) ────────────────────────────

function renderPreviewPanel(product) {
  if (!product || product.previewType === 'none') return '';

  const name = I18n.isAr() ? product.nameAr : (product.nameEn || product.nameAr);
  let body = '';
  switch (product.previewType) {
    case 'iframe':
      body = `
        <div class="preview-panel__body">
          <iframe class="preview-panel__iframe" src="${product.demoUrl}" sandbox="allow-scripts allow-same-origin allow-popups" loading="lazy" title="${name}"></iframe>
        </div>
      `;
      break;
    case 'video':
      body = `
        <div class="preview-panel__body">
          <iframe class="preview-panel__video" src="${product.demoVideoUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${name}"></iframe>
        </div>
      `;
      break;
    case 'screenshots':
      const screenshots = typeof product.screenshots === 'string' ? JSON.parse(product.screenshots) : (product.screenshots || []);
      body = `
        <div class="preview-panel__screenshots">
          ${screenshots.map((url, i) => `
            <div class="preview-panel__screenshot" onclick="Modal.open('<img src=\\'${url}\\' style=\\'width:100%;border-radius:8px;\\' />', 'modal-lg')">
              <img src="${url}" alt="${I18n.t('preview.screenshots')} ${i + 1}" loading="lazy">
            </div>
          `).join('')}
        </div>
      `;
      break;
    default:
      return '';
  }

  return `
    <div class="preview-panel slide-up">
      <div class="preview-panel__header">
        <div class="preview-panel__title">
          ${getPreviewLabel(product.previewType)} ${I18n.t('product.preview')}
        </div>
        ${product.previewType === 'iframe' && product.demoUrl ? `
          <a href="${product.demoUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">${I18n.t('product.openNew')}</a>
        ` : ''}
      </div>
      ${body}
    </div>
  `;
}
