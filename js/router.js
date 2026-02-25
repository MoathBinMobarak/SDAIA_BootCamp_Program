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
            <div class="empty-state__icon">🌌</div>
            <div class="empty-state__title">الصفحة غير موجودة</div>
            <div class="empty-state__text">الرابط الذي طلبته غير موجود في SoftMarket</div>
            <a href="#/" class="btn btn-primary">العودة للرئيسية</a>
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
