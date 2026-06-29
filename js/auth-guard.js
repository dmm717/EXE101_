/* ============================================
   NEXORA - EARLY AUTH PAGE GUARD
   ============================================ */

(function () {
    'use strict';

    const AUTH_KEY = 'nexora_auth';
    const mode = document.currentScript?.dataset.authPage;
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    } catch (error) {
        user = null;
    }

    function normalizeNext(value, fallback) {
        try {
            const url = new URL(value || fallback, window.location.href);
            if (url.origin !== window.location.origin) return fallback;
            const file = url.pathname.split('/').pop() || fallback;
            if (!file.endsWith('.html')) return fallback;
            return `${file}${url.search}${url.hash}`;
        } catch (error) {
            return fallback;
        }
    }

    if (mode === 'guest' && user) {
        const next = new URLSearchParams(window.location.search).get('next');
        window.location.replace(normalizeNext(next, 'dashboard.html'));
    } else if (mode === 'protected' && !user) {
        const current = `${window.location.pathname.split('/').pop() || 'dashboard.html'}${window.location.search}${window.location.hash}`;
        try {
            sessionStorage.setItem('nexora_auth_next', normalizeNext(current, 'dashboard.html'));
        } catch (error) {}
        window.location.replace(`index.html?loginRequired=1&next=${encodeURIComponent(normalizeNext(current, 'dashboard.html'))}`);
    }
})();
