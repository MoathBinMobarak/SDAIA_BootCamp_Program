// ── Login Page (i18n) ─────────────────────────────────────────

function renderLoginPage() {
  const app = $('#app');
  app.innerHTML = `
    <div class="auth-page page-enter">
      <div class="auth-card scale-in">
        <div class="text-center mb-6" style="font-size:3rem;">🛒</div>
        <h1 class="auth-card__title">${I18n.t('auth.login')}</h1>
        <p class="auth-card__subtitle">${I18n.t('auth.loginSubtitle')}</p>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">${I18n.t('auth.email')}</label>
            <input type="email" id="login-email" required placeholder="example@company.com" dir="ltr">
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">${I18n.t('auth.password')}</label>
            <input type="password" id="login-password" required placeholder="••••••" dir="ltr">
          </div>
          <div id="login-error" class="form-error mb-4" style="display:none;"></div>
          <button type="submit" class="btn btn-primary btn-lg btn-ripple" style="width:100%;" id="login-submit">${I18n.t('auth.login')}</button>
        </form>
        <p class="text-center text-sm text-muted mt-6">
          ${I18n.t('auth.noAccount')} <a href="#/auth/register">${I18n.t('auth.register')}</a>
        </p>
      </div>
    </div>
  `;

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#login-submit');
    const errorEl = $('#login-error');
    errorEl.style.display = 'none';
    btn.textContent = I18n.t('auth.verifying');
    btn.disabled = true;

    try {
      const data = await API.post('/auth/login', {
        email: $('#login-email').value,
        password: $('#login-password').value,
      });
      Store.set('user', data.user);
      Store.set('accessToken', data.accessToken);
      Store.set('refreshToken', data.refreshToken);
      renderNavbar();

      try { const bookmarks = await API.get('/me/bookmarks'); Store.set('bookmarks', bookmarks); } catch { }

      Toast.success(`${I18n.t('auth.welcome')} ${data.user.name}!`);
      Router.navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      btn.textContent = I18n.t('auth.login');
      btn.disabled = false;
    }
  });
}
