// ── API Wrapper ───────────────────────────────────────────────

const API = (() => {
    const BASE = '/api/v1';

    async function request(path, options = {}) {
        const headers = { 'Content-Type': 'application/json' };
        const token = Store.get('accessToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...options.headers } });

            // Handle token refresh on 401
            if (res.status === 401 && Store.get('refreshToken')) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    headers['Authorization'] = `Bearer ${Store.get('accessToken')}`;
                    const retry = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...options.headers } });
                    return handleResponse(retry);
                } else {
                    Store.logout();
                    Router.navigate('/auth/login');
                    throw new Error('الجلسة منتهية');
                }
            }

            return handleResponse(res);
        } catch (err) {
            if (err.message === 'Failed to fetch') {
                throw new Error('تعذر الاتصال بالخادم');
            }
            throw err;
        }
    }

    async function handleResponse(res) {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            throw new Error(data?.error || 'حدث خطأ غير متوقع');
        }
        return data;
    }

    async function refreshToken() {
        try {
            const res = await fetch(`${BASE}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: Store.get('refreshToken') }),
            });
            if (!res.ok) return false;
            const data = await res.json();
            Store.set('accessToken', data.accessToken);
            Store.set('refreshToken', data.refreshToken);
            return true;
        } catch {
            return false;
        }
    }

    // ── Public API ────────────────────────────
    const get = (path) => request(path);
    const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
    const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
    const del = (path) => request(path, { method: 'DELETE' });

    return { get, post, put, del };
})();
