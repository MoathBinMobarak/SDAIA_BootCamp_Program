// ── Register Page (i18n) ──────────────────────────────────────

function renderRegisterPage() {
  const app = $('#app');
  app.innerHTML = `
    <div class="auth-page page-enter">
      <div class="auth-card scale-in">
        <div class="text-center mb-6" style="color:var(--color-primary);">${Icons.shoppingCart(48)}</div>
        <h1 class="auth-card__title">${I18n.t('auth.register')}</h1>
        <p class="auth-card__subtitle">${I18n.t('auth.registerSubtitle')}</p>
        <form id="register-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="reg-name">${I18n.t('auth.name')}</label>
            <input type="text" id="reg-name" name="name" required placeholder="${I18n.isAr() ? 'الاسم الكامل' : 'Full name'}" minlength="2" autocomplete="name">
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-email">${I18n.t('auth.email')}</label>
            <input type="email" id="reg-email" name="email" required placeholder="example@company.com" dir="ltr" autocomplete="email" spellcheck="false">
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-password">${I18n.t('auth.password')}</label>
            <input type="password" id="reg-password" name="password" required placeholder="${I18n.isAr() ? '6 أحرف على الأقل' : 'At least 6 characters'}" minlength="6" dir="ltr" autocomplete="new-password">
          </div>
          <div id="register-error" class="form-error mb-4" style="display:none;" role="alert" aria-live="assertive"></div>
          <button type="submit" class="btn btn-primary btn-lg btn-ripple" style="width:100%;" id="register-submit">${I18n.t('auth.register')}</button>
        </form>
        <p class="text-center text-sm text-muted mt-6">
          ${I18n.t('auth.hasAccount')} <a href="#/auth/login">${I18n.t('auth.login')}</a>
        </p>
      </div>
    </div>
  `;

  $('#register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#register-submit');
    const errorEl = $('#register-error');
    errorEl.style.display = 'none';
    btn.innerHTML = `${Icons.loader(14)} ${I18n.t('auth.creating')}`;
    btn.disabled = true;

    try {
      const data = await API.post('/auth/register', {
        name: $('#reg-name').value,
        email: $('#reg-email').value,
        password: $('#reg-password').value,
      });
      Store.set('user', data.user);
      Store.set('accessToken', data.accessToken);
      Store.set('refreshToken', data.refreshToken);
      renderNavbar();
      Toast.success(I18n.t('auth.accountCreated'));
      Router.navigate('/');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      errorEl.focus();
      btn.textContent = I18n.t('auth.register');
      btn.disabled = false;
    }
  });
}
