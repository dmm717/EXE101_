(function () {
    'use strict';

    /* ── Helpers ─────────────────────────────────────────── */
    function q(sel, ctx)    { return (ctx || document).querySelector(sel); }
    function qAll(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

    /* ── Pending avatar (set when user picks a file) ─────── */
    var pendingAvatar = null; // base64 data URL or null

    /* ── Avatar storage key (separate from user auth JSON) ─ */
    var AVATAR_KEY = 'nexora_avatar';

    function getStoredAvatar() {
        try { return localStorage.getItem(AVATAR_KEY) || null; } catch (e) { return null; }
    }
    function saveStoredAvatar(dataUrl) {
        try { localStorage.setItem(AVATAR_KEY, dataUrl); return true; }
        catch (e) { console.warn('Avatar too large for localStorage:', e); return false; }
    }

    /* ── Avatar helpers ──────────────────────────────────── */
    function applyAvatar(el, avatarUrl, name) {
        if (!el) return;
        if (avatarUrl) {
            el.style.backgroundImage = 'url(' + avatarUrl + ')';
            el.style.backgroundSize  = 'cover';
            el.style.backgroundPosition = 'center';
            el.textContent = '';
        } else {
            el.style.backgroundImage = '';
            var initials = (name || 'U')
                .split(' ').map(function (s) { return s[0] || ''; })
                .filter(Boolean).slice(0, 2).join('').toUpperCase();
            el.textContent = initials || 'U';
        }
    }

    /* ── Load profile data ───────────────────────────────── */
    function loadProfile() {
        var user = (window.NexoraAuth && window.NexoraAuth.getAuth()) || {};

        /* Restore avatar: check separate storage key */
        var storedAvatar = getStoredAvatar();
        applyAvatar(q('#profile-avatar'), storedAvatar, user.name);

        setVal('#input-name',  user.name  || '');
        setVal('#input-email', user.email || '');
        setVal('#input-phone', user.phone || '');
        setVal('#input-dob',   user.dob   || '');
        setVal('#input-bio',   user.bio   || '');

        var langEl = q('#select-language');
        if (langEl) langEl.value = user.lang || 'vi';
    }

    function setVal(sel, val) {
        var el = q(sel);
        if (el) el.value = val;
    }

    /* ── Save profile ────────────────────────────────────── */
    function saveProfile() {
        var user    = (window.NexoraAuth && window.NexoraAuth.getAuth()) || {};
        var updated = Object.assign({}, user, {
            name:  ((q('#input-name')  || {}).value || user.name  || '').trim(),
            email: (q('#input-email') || {}).value || user.email || '',
            phone: (q('#input-phone') || {}).value || user.phone || '',
            dob:   (q('#input-dob')   || {}).value || user.dob   || '',
            bio:   ((q('#input-bio')   || {}).value || user.bio   || '').trim(),
            lang:  (q('#select-language') || {}).value || user.lang || 'vi'
        });

        /* Save pending avatar to SEPARATE key (keeps user JSON small) */
        var avatarUrl = getStoredAvatar(); // current saved avatar
        if (pendingAvatar !== null) {
            var saved = saveStoredAvatar(pendingAvatar);
            if (saved) {
                avatarUrl = pendingAvatar;
            } else {
                if (window.NexoraUI && window.NexoraUI.toast)
                    window.NexoraUI.toast('Ảnh quá lớn, không thể lưu', 'error');
            }
        }

        /* Save user profile (without avatar blob to keep JSON lean) */
        if (window.NexoraAuth && window.NexoraAuth.setAuth) window.NexoraAuth.setAuth(updated);
        if (window.NexoraUI  && window.NexoraUI.toast)     window.NexoraUI.toast('Đã lưu thông tin tài khoản');

        /* Update profile card avatar immediately */
        applyAvatar(q('#profile-avatar'), avatarUrl, updated.name);

        /* Update navbar avatar immediately (direct DOM, not waiting for re-render) */
        var navAv = document.getElementById('nav-user-avatar');
        if (navAv) {
            applyAvatar(navAv, avatarUrl, updated.name);
        } else {
            /* Fallback: re-render whole nav if element not found */
            if (window.NexoraAuth && window.NexoraAuth.renderNav) window.NexoraAuth.renderNav();
        }

        /* Reset pending */
        pendingAvatar = null;
    }

    /* ── Change password ─────────────────────────────────── */
    function changePassword() {
        var nw   = (q('#new-password')     || {}).value || '';
        var conf = (q('#confirm-password') || {}).value || '';

        if (nw.length < 6) {
            if (window.NexoraUI && window.NexoraUI.toast) window.NexoraUI.toast('Mật khẩu mới cần ít nhất 6 ký tự', 'error');
            return;
        }
        if (nw !== conf) {
            if (window.NexoraUI && window.NexoraUI.toast) window.NexoraUI.toast('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        var fields = ['#current-password', '#new-password', '#confirm-password'];
        fields.forEach(function (sel) { var el = q(sel); if (el) el.value = ''; });

        if (window.NexoraUI && window.NexoraUI.toast) window.NexoraUI.toast('Đã đổi mật khẩu (demo)');
    }

    /* ── Logout ──────────────────────────────────────────── */
    function doLogout() {
        if (window.NexoraAuth && window.NexoraAuth.logout) window.NexoraAuth.logout();
        window.location.href = 'index.html';
    }

    /* ── Wire events ─────────────────────────────────────── */
    function initActions() {
        q('#save-profile')?.addEventListener('click', saveProfile);
        q('#change-password-btn')?.addEventListener('click', changePassword);

        /* Avatar file picker — preview + store as pending */
        var avatarInput = q('#avatar-input');
        var avatarEl    = q('#profile-avatar');
        if (avatarInput) {
            avatarInput.addEventListener('change', function (e) {
                var file = e.target.files && e.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                    if (window.NexoraUI && window.NexoraUI.toast)
                        window.NexoraUI.toast('Ảnh vượt quá 2MB', 'error');
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (ev) {
                    pendingAvatar = ev.target.result;   /* store for saveProfile */
                    applyAvatar(avatarEl, pendingAvatar, null);
                    if (window.NexoraUI && window.NexoraUI.toast)
                        window.NexoraUI.toast('Ảnh đã chọn — nhấn Lưu thay đổi để xác nhận');
                };
                reader.readAsDataURL(file);
            });
        }

        /* Logout */
        q('#account-logout')?.addEventListener('click', doLogout);

        /* Delete: open modal */
        q('#account-delete')?.addEventListener('click', function () {
            if (typeof acOpenModal  === 'function') acOpenModal();
            else if (typeof nxOpenModal === 'function') nxOpenModal();
        });

        /* data-account-action compat */
        qAll('[data-account-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var key = btn.dataset.accountAction;
                if (key === 'language') {
                    if (typeof acTab === 'function') acTab('profile');
                    if (typeof acAccToggle === 'function') acAccToggle('acc-lang');
                    setTimeout(function () { var el = q('#select-language'); if (el) el.focus(); }, 320);
                } else if (key === 'password') {
                    if (typeof acTab === 'function') acTab('profile');
                    if (typeof acAccToggle === 'function') acAccToggle('acc-pwd');
                    setTimeout(function () { var el = q('#current-password'); if (el) el.focus(); }, 320);
                } else if (key === 'notifications') {
                    if (typeof acTab === 'function') acTab('profile');
                    if (typeof acAccToggle === 'function') acAccToggle('acc-notif');
                }
            });
        });
    }

    /* ── Bootstrap ───────────────────────────────────────── */
    function init() {
        loadProfile();
        initActions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();