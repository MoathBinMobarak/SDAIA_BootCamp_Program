// ── Company Profile Page (i18n) ───────────────────────────────

async function renderCompanyProfilePage(slug) {
  const app = $('#app');
  app.innerHTML = `<div class="page-content"><div class="container">${renderPageLoader()}</div></div>`;

  try {
    const company = await API.get(`/companies/${slug}`);
    const name = I18n.isAr() ? company.nameAr : (company.nameEn || company.nameAr);

    app.innerHTML = `
      <div class="page-content page-enter">
        <div class="container">
          <div class="company-header slide-up">
            <div class="company-header__logo glow-pulse">
              ${company.logoUrl ? `<img src="${company.logoUrl}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-xl);">` : getInitials(name)}
            </div>
            <div class="company-header__info">
              <h1>
                ${name}
                ${company.isVerified ? `<span class="badge badge-verified" style="margin-inline-start:8px;">✓ ${I18n.t('general.verified')}</span>` : ''}
              </h1>
              ${(I18n.isAr() && company.nameEn) ? `<div class="text-muted text-sm mb-2">${company.nameEn}</div>` : ''}
              ${(!I18n.isAr() && company.nameAr) ? `<div class="text-muted text-sm mb-2">${company.nameAr}</div>` : ''}
              <div class="company-header__meta">
                ${company.country ? `<span>📍 ${company.country}</span>` : ''}
                ${company.foundedYear ? `<span>📅 ${I18n.t('company.founded')} ${company.foundedYear}</span>` : ''}
                ${company.website ? `<a href="${company.website}" target="_blank" rel="noopener">🌐 ${I18n.t('company.website')}</a>` : ''}
                <span>📦 ${company.products?.length || 0} ${I18n.t('categories.product')}</span>
              </div>
            </div>
          </div>

          ${company.descriptionAr ? `<p class="text-secondary mb-8" style="line-height:1.8;">${company.descriptionAr}</p>` : ''}

          <div class="section-header">
            <h2 class="section-title">${I18n.t('company.products')}</h2>
          </div>
          ${company.products?.length > 0
        ? renderProductGrid(company.products)
        : renderEmptyState(I18n.t('company.noProducts'), '', '📦')
      }
        </div>
      </div>
    `;
  } catch (err) {
    app.innerHTML = `<div class="page-content"><div class="container">${renderEmptyState(I18n.t('company.notFound'), err.message, '🏢', I18n.t('general.backHome'), '/')}</div></div>`;
  }
}
