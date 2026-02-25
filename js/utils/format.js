// ── Formatting Utilities (i18n-aware) ─────────────────────────

function formatCurrency(amount, currency = 'SAR') {
    if (amount === 0 || amount === null || amount === undefined) return I18n.t('general.free');
    const locale = I18n.isAr() ? 'ar-SA' : 'en-SA';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateStr) {
    const locale = I18n.isAr() ? 'ar-SA' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(dateStr));
}

function formatRelativeDate(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);

    if (I18n.isAr()) {
        if (diff < 60) return 'الآن';
        if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
        if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
        if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
    } else {
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    }
    return formatDate(dateStr);
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0621-\u064A-]/g, '')
        .replace(/-+/g, '-')
        .trim();
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2);
}

const CATEGORY_ICONS = {
    clipboard: () => Icons.clipboard(18),
    users: () => Icons.users(18),
    calculator: () => Icons.barChart(18),
    megaphone: () => Icons.megaphone(18),
    briefcase: () => Icons.briefcase(18),
    chart: () => Icons.barChart(18),
    globe: () => Icons.globe(18),
    shield: () => Icons.shield(18),
    zap: () => Icons.zap(18),
    code: () => Icons.code(18),
    project: () => Icons.clipboard(18),
    finance: () => Icons.creditCard(18),
    analytics: () => Icons.barChart(18),
    security: () => Icons.shield(18),
    communication: () => Icons.messageCircle(18),
    default: () => Icons.package(18),
};

function getCategoryIcon(icon) {
    const fn = CATEGORY_ICONS[icon] || CATEGORY_ICONS.default;
    return fn();
}

function getPreviewLabel(type) {
    const key = `preview.${type === 'iframe' ? 'live' : type}`;
    const translated = I18n.t(key);
    return translated !== key ? translated : '';
}

const STATUS_LABELS = {
    draft: { text: '', class: 'badge-warning', key: 'general.status.draft' },
    published: { text: '', class: 'badge-success', key: 'general.status.published' },
    archived: { text: '', class: 'badge-error', key: 'general.status.archived' },
};

function getStatusLabel(status) {
    const s = STATUS_LABELS[status] || STATUS_LABELS.draft;
    return { text: I18n.t(s.key), class: s.class };
}
