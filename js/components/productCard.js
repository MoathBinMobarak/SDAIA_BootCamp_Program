// ── Product Card Component (i18n + Animations) ───────────────

function renderProductCard(product) {
  const name = I18n.isAr() ? product.nameAr : (product.nameEn || product.nameAr);
  const companyName = I18n.isAr() ? product.company?.nameAr : (product.company?.nameEn || product.company?.nameAr || '');
  const tagline = I18n.isAr() ? (product.taglineAr || '') : (product.taglineAr || '');
  const previewLabel = getPreviewLabel(product.previewType);
  const catName = I18n.isAr() ? product.category?.nameAr : (product.category?.nameEn || product.category?.nameAr || '');
  const lowestPrice = product.productPlans?.length > 0
    ? Math.min(...product.productPlans.map(pp => pp.priceMonthly || 0))
    : null;

  return `
    <div class="card card-3d product-card" data-slug="${product.slug}" onclick="Router.navigate('/product/${product.slug}')">
      <div class="product-card__header">
        <div class="product-card__logo">${product.logoUrl ? `<img src="${product.logoUrl}" alt="${name}">` : getInitials(name)}</div>
        <div class="product-card__info">
          <div class="product-card__name">${name}</div>
          <div class="product-card__company">
            ${companyName}
            ${product.company?.isVerified ? '<span class="badge badge-verified" title="✓">✓</span>' : ''}
          </div>
        </div>
      </div>
      <div class="product-card__tagline">${tagline}</div>
      <div class="product-card__footer">
        <div class="product-card__meta">
          ${product.category ? `<span class="chip" style="pointer-events:none;padding:2px 8px;font-size:0.7rem;">${getCategoryIcon(product.category.icon)} ${catName}</span>` : ''}
          ${previewLabel ? `<span class="badge badge-preview">${previewLabel}</span>` : ''}
        </div>
        <div>
          ${lowestPrice !== null
      ? `<span class="font-semibold text-sm">${lowestPrice === 0 ? I18n.t('general.free') : formatCurrency(lowestPrice) + I18n.t('product.monthlyPrice')}</span>`
      : ''}
        </div>
      </div>
    </div>
  `;
}

function renderProductGrid(products) {
  if (!products || products.length === 0) {
    return renderEmptyState(I18n.t('general.noResults'), I18n.t('search.tryDifferent'), '📦');
  }
  return `<div class="grid grid-auto-fill stagger-in">${products.map(renderProductCard).join('')}</div>`;
}
