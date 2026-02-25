// ── State Store (Pub/Sub) ──────────────────────────────────────

const Store = (() => {
    const state = {
        user: JSON.parse(localStorage.getItem('gc_user') || 'null'),
        accessToken: localStorage.getItem('gc_accessToken') || null,
        refreshToken: localStorage.getItem('gc_refreshToken') || null,
        products: [],
        categories: [],
        companies: [],
        plans: [],
        bookmarks: [],
        searchQuery: '',
        currentPage: 1,
    };

    const listeners = {};

    function get(key) {
        return state[key];
    }

    function set(key, value) {
        state[key] = value;
        // Persist auth data
        if (['user', 'accessToken', 'refreshToken'].includes(key)) {
            if (value === null) localStorage.removeItem(`gc_${key}`);
            else localStorage.setItem(`gc_${key}`, typeof value === 'object' ? JSON.stringify(value) : value);
        }
        emit(key, value);
    }

    function on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
        return () => {
            listeners[event] = listeners[event].filter(cb => cb !== callback);
        };
    }

    function emit(event, data) {
        if (listeners[event]) {
            listeners[event].forEach(cb => cb(data));
        }
    }

    function isLoggedIn() {
        return !!state.accessToken && !!state.user;
    }

    function isAdmin() {
        return state.user?.role === 'admin';
    }

    function logout() {
        set('user', null);
        set('accessToken', null);
        set('refreshToken', null);
        set('bookmarks', []);
    }

    return { get, set, on, emit, isLoggedIn, isAdmin, logout };
})();
