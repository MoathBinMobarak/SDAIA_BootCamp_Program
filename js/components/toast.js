// ── Toast Notifications ───────────────────────────────────────

const Toast = (() => {
    function show(message, type = 'info', duration = 4000) {
        const container = $('#toast-container');
        const toast = createElement('div', { className: `toast toast-${type}` }, [
            createElement('span', { textContent: message }),
        ]);
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 200);
        }, duration);
    }

    return {
        success: (msg) => show(msg, 'success'),
        error: (msg) => show(msg, 'error'),
        info: (msg) => show(msg, 'info'),
    };
})();
