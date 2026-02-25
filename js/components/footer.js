// ── Footer Component ──────────────────────────────────────────

function renderFooter() {
  const footer = $('#footer');
  footer.innerHTML = `
    <div class="footer">
      <div class="footer__inner container">
        <div class="footer__grid">
          <div class="footer__brand">
            <div class="footer__logo gradient-text">SoftMarket</div>
            <p class="footer__desc">${I18n.t('footer.aboutText')}</p>
            <div class="footer__social">
              <a href="#" class="footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#" class="footer__social-link" aria-label="LinkedIn">in</a>
              <a href="#" class="footer__social-link" aria-label="GitHub">GH</a>
            </div>
          </div>
          <div>
            <h4 class="footer__heading">${I18n.t('footer.links')}</h4>
            <ul class="footer__links">
              <li><a href="#/explore" class="hover-underline">${I18n.t('nav.explore')}</a></li>
              <li><a href="#/categories" class="hover-underline">${I18n.t('nav.categories')}</a></li>
              <li><a href="#/auth/register" class="hover-underline">${I18n.t('auth.register')}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer__heading">${I18n.t('footer.support')}</h4>
            <ul class="footer__links">
              <li><a href="#" class="hover-underline">${I18n.t('footer.contact')}</a></li>
              <li><a href="#" class="hover-underline">${I18n.t('footer.faq')}</a></li>
              <li><a href="#" class="hover-underline">${I18n.t('footer.privacy')}</a></li>
              <li><a href="#" class="hover-underline">${I18n.t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>${I18n.t('footer.copyright')}</span>
          <span>${I18n.t('footer.madeWith')}</span>
        </div>
      </div>
    </div>
  `;
}
