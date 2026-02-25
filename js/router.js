// ── SPA Hash Router ───────────────────────────────────────────

const Router = (() => {
    const routes = [];

    function add(pattern, handler) {
        routes.push({ pattern, handler });
    }

    function navigate(path) {
        window.location.hash = path;
    }

    function resolve() {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0]; // strip query params

        for (const route of routes) {
            const match = matchRoute(route.pattern, path);
            if (match) {
                route.handler(match);
                highlightActiveLink();
                // Close mobile menu
                const links = document.getElementById('navbar-links');
                if (links) links.classList.remove('open');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        // 404 fallback
        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon" style="color:var(--color-primary);">${Icons.compass(48)}</div>
            <div class="empty-state__title">${I18n.isAr() ? '\u0627\u0644\u0635\u0641\u062d\u0629 \u063a\u064a\u0631 \u0645\u0648\u062c\u0648\u062f\u0629' : 'Page Not Found'}</div>
            <div class="empty-state__text">${I18n.isAr() ? '\u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0630\u064a \u0637\u0644\u0628\u062a\u0647 \u063a\u064a\u0631 \u0645\u0648\u062c\u0648\u062f \u0641\u064a SoftMarket' : 'The link you requested was not found on SoftMarket'}</div>
            <a href="#/" class="btn btn-primary">${I18n.isAr() ? '\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0631\u0626\u064a\u0633\u064a\u0629' : 'Back to Home'}</a>
          </div>
        </div>
      </div>
    `;
    }

    function matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) return null;

        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
            } else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }
        return params;
    }

    function init() {
        window.addEventListener('hashchange', resolve);
        resolve();
    }

    return { add, navigate, resolve, init };
})();
