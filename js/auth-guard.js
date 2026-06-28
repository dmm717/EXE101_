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

    if (mode === 'guest' && user) {
        window.location.replace('dashboard.html');
    } else if (mode === 'protected' && !user) {
        window.location.replace('index.html');
    }
})();
