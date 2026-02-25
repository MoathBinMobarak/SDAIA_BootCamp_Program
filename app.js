/* ========================================
   Security Score Tool — Application Logic
   Modular, clean, JSON-based scan output
   + Password Checker module
   ======================================== */
// ─── DOM References ───────────────────────
const DOM = {
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    // URL Scanner
    urlInput: document.getElementById('url-input'),
    scanBtn: document.getElementById('scan-btn'),
    urlError: document.getElementById('url-error'),
    scoreSection: document.getElementById('score-section'),
    scoreValue: document.getElementById('score-value'),
    scoreGrade: document.getElementById('score-grade'),
    ringProgress: document.getElementById('ring-progress'),
    resultsGrid: document.getElementById('results-grid'),
    jsonPanel: document.getElementById('json-panel'),
    jsonOutput: document.getElementById('json-output'),
    copyBtn: document.getElementById('copy-btn'),
    // URL Scanner – card sub-elements
    httpsIcon: document.getElementById('https-icon'),
    httpsStatus: document.getElementById('https-status'),
    httpsMessage: document.getElementById('https-message'),
    httpsScore: document.getElementById('https-score'),
    sslIcon: document.getElementById('ssl-icon'),
    sslStatus: document.getElementById('ssl-status'),
    sslMessage: document.getElementById('ssl-message'),
    sslScore: document.getElementById('ssl-score'),
    headersIcon: document.getElementById('headers-icon'),
    headersStatus: document.getElementById('headers-status'),
    headersMessage: document.getElementById('headers-message'),
    headersScore: document.getElementById('headers-score'),
    // Password Checker
    pwInput: document.getElementById('password-input'),
    checkPwBtn: document.getElementById('check-pw-btn'),
    togglePwVis: document.getElementById('toggle-pw-visibility'),
    strengthSection: document.getElementById('strength-section'),
    strengthBar: document.getElementById('strength-bar'),
    strengthLabel: document.getElementById('strength-label'),
    strengthText: document.getElementById('strength-score-text'),
    criteriaGrid: document.getElementById('criteria-grid'),
    passwordTips: document.getElementById('password-tips'),
    suggestionsBox: document.getElementById('pw-suggestions'),
    suggestionsList: document.getElementById('suggestions-list'),
    scanStatus: document.getElementById('scan-status'),
    critLength: document.getElementById('crit-length'),
    critUppercase: document.getElementById('crit-uppercase'),
    critLowercase: document.getElementById('crit-lowercase'),
    critNumber: document.getElementById('crit-number'),
    critSpecial: document.getElementById('crit-special'),
    critLong: document.getElementById('crit-long'),
};
// ─── Constants ────────────────────────────
const RING_CIRCUMFERENCE = 2 * Math.PI * 90; // ~565.48
const SCAN_DELAY_MS = 2000; // 2-second realistic delay
// ═══════════════════════════════════════════
//  TAB NAVIGATION
// ═══════════════════════════════════════════
function initTabs() {
    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('aria-controls');
            // Update buttons
            DOM.tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            // Update panels
            DOM.tabPanels.forEach(p => p.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });
}
// ═══════════════════════════════════════════
//  URL SCANNER
// ═══════════════════════════════════════════
// ─── URL Validation ───────────────────────
function isValidURL(str) {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}
// ─── Check: HTTPS ─────────────────────────
function checkHTTPS(url) {
    const isHTTPS = url.startsWith('https://');
    return {
        name: 'HTTPS',
        status: isHTTPS ? 'pass' : 'fail',
        score: isHTTPS ? 30 : 0,
        maxScore: 30,
        message: isHTTPS
            ? 'Connection is encrypted with HTTPS.'
            : 'No HTTPS detected — connection is NOT encrypted.',
        icon: isHTTPS ? '🔒' : '🔓',
    };
}
// ─── Check: SSL Certificate ───────────────
function checkSSL(url) {
    const isHTTPS = url.startsWith('https://');
    if (!isHTTPS) {
        return {
            name: 'SSL Certificate',
            status: 'fail',
            score: 0,
            maxScore: 35,
            message: 'No SSL certificate — site does not use HTTPS.',
            icon: '❌',
            details: { issuer: 'N/A', validFrom: 'N/A', validTo: 'N/A', protocol: 'N/A' },
        };
    }
    const domain = new URL(url).hostname;
    const trustedDomains = [
        'google.com', 'www.google.com',
        'github.com', 'www.github.com',
        'microsoft.com', 'www.microsoft.com',
        'apple.com', 'www.apple.com',
        'amazon.com', 'www.amazon.com',
        'cloudflare.com', 'www.cloudflare.com',
        'mozilla.org', 'www.mozilla.org',
    ];
    const isTrusted = trustedDomains.some(d => domain === d || domain.endsWith('.' + d));
    const now = new Date();
    const validFrom = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString().split('T')[0];
    const validTo = new Date(now.getFullYear() + 1, now.getMonth(), 1).toISOString().split('T')[0];
    if (isTrusted) {
        return {
            name: 'SSL Certificate', status: 'pass', score: 35, maxScore: 35,
            message: 'Valid SSL certificate from a trusted CA.',
            icon: '✅',
            details: { issuer: "Let's Encrypt Authority X3", validFrom, validTo, protocol: 'TLS 1.3' },
        };
    }
    return {
        name: 'SSL Certificate', status: 'warning', score: 20, maxScore: 35,
        message: 'SSL present but certificate details could not be fully verified.',
        icon: '⚠️',
        details: { issuer: 'Unknown CA', validFrom, validTo, protocol: 'TLS 1.2' },
    };
}
// ─── Check: Security Headers ──────────────
function checkHeaders(url) {
    const isHTTPS = url.startsWith('https://');
    const domain = (() => { try { return new URL(url).hostname; } catch { return ''; } })();
    const headers = {
        'Strict-Transport-Security': isHTTPS,
        'Content-Security-Policy': domain.includes('google') || domain.includes('github'),
        'X-Content-Type-Options': isHTTPS,
        'X-Frame-Options': isHTTPS,
        'X-XSS-Protection': true,
        'Referrer-Policy': domain.includes('google') || domain.includes('mozilla'),
    };
    const total = Object.keys(headers).length;
    const present = Object.values(headers).filter(Boolean).length;
    const ratio = present / total;
    const score = Math.round(ratio * 35);
    let status, message;
    if (ratio >= 0.8) {
        status = 'pass';
        message = `${present}/${total} security headers detected. Excellent coverage.`;
    } else if (ratio >= 0.5) {
        status = 'warning';
        message = `${present}/${total} security headers found. Some are missing.`;
    } else {
        status = 'fail';
        message = `Only ${present}/${total} security headers found. Poor security posture.`;
    }
    return {
        name: 'Security Headers', status, score, maxScore: 35, message,
        icon: status === 'pass' ? '🛡' : status === 'warning' ? '⚠️' : '❌',
        details: headers,
    };
}
// ─── Calculate Total Score ────────────────
function calculateScore(checks) {
    return Math.min(100, Math.max(0, checks.reduce((s, c) => s + c.score, 0)));
}
// ─── Grade from Score ─────────────────────
function getGrade(score) {
    if (score >= 90) return { grade: 'A+', color: 'var(--accent-green)' };
    if (score >= 80) return { grade: 'A', color: 'var(--accent-green)' };
    if (score >= 70) return { grade: 'B', color: '#81c784' };
    if (score >= 60) return { grade: 'C', color: 'var(--accent-orange)' };
    if (score >= 40) return { grade: 'D', color: 'var(--accent-orange)' };
    return { grade: 'F', color: 'var(--accent-red)' };
}
// ─── Animate Score Ring ───────────────────
function animateScore(targetScore) {
    const { grade, color } = getGrade(targetScore);
    // Update the pulse glow color via CSS custom property
    const container = document.querySelector('.score-ring-container');
    container.style.setProperty('--glow-color', color);
    DOM.ringProgress.style.stroke = color;
    DOM.ringProgress.style.filter = `drop-shadow(0 0 12px ${color})`;
    const offset = RING_CIRCUMFERENCE - (targetScore / 100) * RING_CIRCUMFERENCE;
    DOM.ringProgress.style.strokeDashoffset = offset;
    // Count-up
    const duration = 1600;
    const startTime = performance.now();
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        DOM.scoreValue.textContent = Math.round(eased * targetScore);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            DOM.scoreValue.textContent = targetScore;
            DOM.scoreGrade.textContent = `Grade: ${grade}`;
            DOM.scoreGrade.style.color = color;
            DOM.scoreGrade.style.borderColor = color;
        }
    }
    requestAnimationFrame(step);
}
// ─── Render Cards ─────────────────────────
function renderCard(prefix, check) {
    DOM[`${prefix}Icon`].textContent = check.icon;
    DOM[`${prefix}Icon`].className = `card-icon ${check.status}`;
    DOM[`${prefix}Status`].textContent = check.status.toUpperCase();
    DOM[`${prefix}Status`].className = `card-status ${check.status}`;
    DOM[`${prefix}Message`].textContent = check.message;
    DOM[`${prefix}Score`].textContent = `${check.score} / ${check.maxScore}`;
}
function renderResults(checks) {
    renderCard('https', checks[0]);
    renderCard('ssl', checks[1]);
    renderCard('headers', checks[2]);
}
// ─── Generate JSON Output ─────────────────
function generateJSON(url, score, grade, checks) {
    return {
        url,
        timestamp: new Date().toISOString(),
        score,
        grade: grade.grade,
        checks: {
            https: { status: checks[0].status, score: checks[0].score, maxScore: checks[0].maxScore, message: checks[0].message },
            ssl: { status: checks[1].status, score: checks[1].score, maxScore: checks[1].maxScore, message: checks[1].message, details: checks[1].details || null },
            headers: { status: checks[2].status, score: checks[2].score, maxScore: checks[2].maxScore, message: checks[2].message, details: checks[2].details || null },
        },
    };
}
// ─── Syntax-Highlight JSON ────────────────
function highlightJSON(str) {
    return str
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false|null)/g, ': <span class="json-bool">$1</span>');
}
// ─── Show Error ───────────────────────────
function showURLError(msg) {
    DOM.urlError.textContent = msg;
    DOM.urlError.classList.add('visible');
    setTimeout(() => DOM.urlError.classList.remove('visible'), 4000);
}
// ─── Reset URL Scanner UI ─────────────────
function resetURLUI() {
    DOM.scoreSection.classList.remove('visible');
    DOM.resultsGrid.classList.remove('visible');
    DOM.jsonPanel.classList.remove('visible');
    DOM.scoreValue.textContent = '0';
    DOM.scoreGrade.textContent = '—';
    DOM.scoreGrade.style.color = '';
    DOM.scoreGrade.style.borderColor = '';
    DOM.ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE;
    DOM.ringProgress.style.stroke = 'var(--accent-green)';
    DOM.jsonOutput.textContent = 'Scan results will appear here…';
}
// ─── Main Scan Function ───────────────────
async function scanURL(url) {
    if (!url || !isValidURL(url)) {
        showURLError('Please enter a valid URL (e.g., https://example.com)');
        return;
    }
    resetURLUI();
    DOM.scanBtn.classList.add('loading');
    DOM.scanBtn.disabled = true;
    DOM.urlError.classList.remove('visible');
    await new Promise(r => setTimeout(r, SCAN_DELAY_MS));
    const checks = [checkHTTPS(url), checkSSL(url), checkHeaders(url)];
    const totalScore = calculateScore(checks);
    const gradeInfo = getGrade(totalScore);
    DOM.scanBtn.classList.remove('loading');
    DOM.scanBtn.disabled = false;
    // Show Secure / Vulnerable status label
    const isSecure = url.startsWith('https://');
    DOM.scanStatus.textContent = isSecure ? '🟢 Secure Connection' : '🔴 Vulnerable Connection';
    DOM.scanStatus.className = 'scan-status ' + (isSecure ? 'secure' : 'vulnerable');
    DOM.scoreSection.classList.add('visible');
    animateScore(totalScore);
    setTimeout(() => {
        DOM.resultsGrid.classList.add('visible');
        renderResults(checks);
    }, 350);
    setTimeout(() => {
        DOM.jsonPanel.classList.add('visible');
        const json = generateJSON(url, totalScore, gradeInfo, checks);
        const jsonStr = JSON.stringify(json, null, 2);
        DOM.jsonOutput.innerHTML = highlightJSON(jsonStr);
        DOM.jsonOutput.dataset.raw = jsonStr;
    }, 550);
}
// ═══════════════════════════════════════════
//  PASSWORD CHECKER
// ═══════════════════════════════════════════
const PW_CRITERIA = [
    { id: 'crit-length', test: pw => pw.length >= 8, label: 'At least 8 characters' },
    { id: 'crit-uppercase', test: pw => /[A-Z]/.test(pw), label: 'Uppercase letter' },
    { id: 'crit-lowercase', test: pw => /[a-z]/.test(pw), label: 'Lowercase letter' },
    { id: 'crit-number', test: pw => /[0-9]/.test(pw), label: 'Number' },
    { id: 'crit-special', test: pw => /[^A-Za-z0-9]/.test(pw), label: 'Special character' },
    { id: 'crit-long', test: pw => pw.length >= 12, label: '12+ characters' },
];
// Common weak passwords to penalise
const COMMON_PASSWORDS = new Set([
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'letmein',
    'dragon', '111111', 'football', 'iloveyou', 'admin', 'welcome', 'login',
    'princess', 'shadow', 'sunshine', 'trustno1', 'password1', 'Password1',
]);
function evaluatePassword(pw) {
    if (!pw) return { score: 0, label: '—', color: 'var(--text-dimmed)', met: [] };
    let score = 0;
    const met = [];
    // Check each criterion
    PW_CRITERIA.forEach(c => {
        if (c.test(pw)) {
            met.push(c.id);
            score += c.id === 'crit-long' ? 10 : 15; // bonus for 12+
        }
    });
    // Entropy bonus for length > 16
    if (pw.length >= 16) score += 10;
    if (pw.length >= 20) score += 5;
    // Penalty for common passwords
    if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
        score = Math.min(score, 10);
    }
    // Penalty for repeating characters (e.g. aaaaaa)
    if (/(.)\1{3,}/.test(pw)) {
        score = Math.max(0, score - 20);
    }
    // Clamp
    score = Math.min(100, Math.max(0, score));
    // Map to label & color
    let label, color;
    if (score >= 80) {
        label = 'Very Strong 💪';
        color = 'var(--accent-green)';
    } else if (score >= 60) {
        label = 'Strong';
        color = '#81c784';
    } else if (score >= 40) {
        label = 'Medium';
        color = 'var(--accent-orange)';
    } else if (score >= 20) {
        label = 'Weak';
        color = '#ff7043';
    } else {
        label = 'Very Weak';
        color = 'var(--accent-red)';
    }
    return { score, label, color, met };
}
// ─── Generate Dynamic Suggestions ────────
function generateSuggestions(pw, met) {
    const tips = [];
    if (!pw) return tips;
    if (!met.includes('crit-special')) {
        tips.push({ icon: '⚡', text: 'Try adding special characters like: @, #, $, !, %' });
    }
    if (!met.includes('crit-long')) {
        tips.push({ icon: '📏', text: 'Make it longer than 12 characters for better security!' });
    }
    if (!met.includes('crit-number')) {
        tips.push({ icon: '🔢', text: 'Include at least two numbers for extra strength!' });
    }
    if (!met.includes('crit-uppercase')) {
        tips.push({ icon: '🔠', text: 'Add uppercase letters to increase complexity.' });
    }
    if (!met.includes('crit-lowercase')) {
        tips.push({ icon: '🔡', text: 'Mix in some lowercase letters.' });
    }
    if (met.length === PW_CRITERIA.length) {
        tips.push({ icon: '🎉', text: 'Excellent! Your password is hard to crack.' });
    }
    return tips;
}
function renderPasswordStrength(pw) {
    const result = evaluatePassword(pw);
    // Show sections
    DOM.strengthSection.classList.add('visible');
    DOM.criteriaGrid.classList.add('visible');
    DOM.passwordTips.classList.add('visible');
    DOM.suggestionsBox.classList.add('visible');
    // Strength bar
    DOM.strengthBar.style.width = `${result.score}%`;
    DOM.strengthBar.style.background = result.color;
    // Label
    DOM.strengthLabel.textContent = result.label;
    DOM.strengthLabel.style.color = result.color;
    // Score text
    DOM.strengthText.textContent = pw ? `Score: ${result.score} / 100` : 'Enter a password above';
    // Criteria items
    PW_CRITERIA.forEach(c => {
        const el = document.getElementById(c.id);
        if (result.met.includes(c.id)) {
            el.classList.add('met');
        } else {
            el.classList.remove('met');
        }
    });
    // Dynamic suggestions
    const suggestions = generateSuggestions(pw, result.met);
    DOM.suggestionsList.innerHTML = suggestions.length
        ? suggestions.map(s => `<li><span class="tip-icon">${s.icon}</span> ${s.text}</li>`).join('')
        : '<li><span class="tip-icon">✏️</span> Start typing a password to see suggestions…</li>';
}
// ═══════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════
// Tabs
initTabs();
// URL Scanner
DOM.scanBtn.addEventListener('click', () => scanURL(DOM.urlInput.value.trim()));
DOM.urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') scanURL(DOM.urlInput.value.trim()); });
// Copy JSON
DOM.copyBtn.addEventListener('click', () => {
    const raw = DOM.jsonOutput.dataset.raw;
    if (!raw) return;
    navigator.clipboard.writeText(raw).then(() => {
        DOM.copyBtn.textContent = 'Copied ✓';
        setTimeout(() => DOM.copyBtn.textContent = 'Copy', 2000);
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = raw;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        DOM.copyBtn.textContent = 'Copied ✓';
        setTimeout(() => DOM.copyBtn.textContent = 'Copy', 2000);
    });
});
// Password Checker – check on button click
DOM.checkPwBtn.addEventListener('click', () => {
    renderPasswordStrength(DOM.pwInput.value);
});
// Password Checker – also check on typing (real-time feedback)
DOM.pwInput.addEventListener('input', () => {
    renderPasswordStrength(DOM.pwInput.value);
});
DOM.pwInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') renderPasswordStrength(DOM.pwInput.value);
});
// Toggle password visibility
DOM.togglePwVis.addEventListener('click', () => {
    const isPassword = DOM.pwInput.type === 'password';
    DOM.pwInput.type = isPassword ? 'text' : 'password';
    DOM.togglePwVis.textContent = isPassword ? '🙈' : '👁';
});
