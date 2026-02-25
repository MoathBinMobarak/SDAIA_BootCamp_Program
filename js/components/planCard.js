// ── Plan Card Component (i18n) ────────────────────────────────

function renderPlanCards(productPlans) {
  if (!productPlans || productPlans.length === 0) return '';

  const gridCols = productPlans.length <= 3 ? `grid-${productPlans.length}` : 'grid-3';

  return `
    <div class="plan-table grid ${gridCols} stagger-in">
      ${productPlans.map(pp => {
    const features = typeof pp.features === 'string' ? JSON.parse(pp.features) : (pp.features || []);
    const planName = I18n.isAr() ? pp.plan?.nameAr : (pp.plan?.nameEn || pp.plan?.nameAr || '');
    return `
          <div class="plan-card ${pp.isPopular ? 'popular glow-pulse' : ''}">
            ${pp.isPopular ? `<span style="position:absolute;top:0;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,var(--color-primary),var(--color-accent));color:white;padding:2px 14px;border-radius:var(--radius-full);font-size:0.75rem;font-weight:700;">${I18n.t('product.popular')}</span>` : ''}
            <div class="plan-card__name">${planName}</div>
            <div class="plan-card__price">
              ${pp.priceMonthly === 0 ? I18n.t('general.free') : formatCurrency(pp.priceMonthly)}
              ${pp.priceMonthly > 0 ? `<span>${I18n.t('product.monthlyPrice')}</span>` : ''}
            </div>
            ${pp.priceYearly > 0 ? `<div class="text-sm text-muted mb-4">${formatCurrency(pp.priceYearly)} ${I18n.t('product.yearly')}</div>` : '<div class="mb-4"></div>'}
            <div class="plan-card__features">
              ${features.map(f => `<div class="plan-card__feature">${f}</div>`).join('')}
            </div>
            <button class="btn ${pp.isPopular ? 'btn-primary' : 'btn-secondary'} btn-lg btn-ripple" style="width:100%">
              ${pp.priceMonthly === 0 ? I18n.t('product.startFree') : I18n.t('product.subscribe')}
            </button>
          </div>
        `;
  }).join('')}
    </div>
  `;
}
