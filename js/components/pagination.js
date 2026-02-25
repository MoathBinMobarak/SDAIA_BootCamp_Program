// ── Pagination Component (i18n) ───────────────────────────────

function renderPagination(meta, onPageChange) {
    if (!meta || meta.totalPages <= 1) return '';

    const { page, totalPages } = meta;
    let buttons = '';

    buttons += `<button class="pagination__btn" ${page <= 1 ? 'disabled' : ''} data-page="${page - 1}">${I18n.t('general.prev')}</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            buttons += `<button class="pagination__btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === page - 2 || i === page + 2) {
            buttons += `<span class="text-muted">...</span>`;
        }
    }

    buttons += `<button class="pagination__btn" ${page >= totalPages ? 'disabled' : ''} data-page="${page + 1}">${I18n.t('general.next')}</button>`;

    return `<div class="pagination" id="pagination">${buttons}</div>`;
}

function attachPaginationHandlers(callback) {
    const wrapper = $('#pagination');
    if (!wrapper) return;
    wrapper.querySelectorAll('.pagination__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && !btn.disabled) callback(page);
        });
    });
}
