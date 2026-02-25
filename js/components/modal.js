// ── Modal Component ───────────────────────────────────────────

const Modal = (() => {
    function open(content, sizeClass = '') {
        close(); // remove any existing
        const backdrop = createElement('div', { className: 'modal-backdrop', id: 'modal-backdrop' });
        const modal = createElement('div', { className: `modal ${sizeClass}`, id: 'modal', innerHTML: content });

        backdrop.addEventListener('click', close);
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    function close() {
        const backdrop = $('#modal-backdrop');
        const modal = $('#modal');
        if (backdrop) backdrop.remove();
        if (modal) modal.remove();
        document.body.style.overflow = '';
    }

    return { open, close };
})();
