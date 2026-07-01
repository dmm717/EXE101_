/* ============================================
   NEXORA - NAV RENDERER (FE-only auth state)
   ============================================ */

(function () {
    'use strict';

    const AUTH_KEY = 'nexora_auth';

    function getAuth() {
        try {
            const raw = localStorage.getItem(AUTH_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setAuth(user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        renderNav();
    }

    function logout() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem('nexora_avatar');
        renderNav();
    }

    function guestNavHtml() {
        return `
            <a class="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
                href="login.html">Đăng nhập</a>
            <a class="hidden md:block bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-[12px] hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(53,37,205,0.2)] active:scale-95"
                href="register.html">Đăng ký</a>
            <button id="mobile-menu-btn" class="lg:hidden text-on-surface p-2 min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors"
                type="button" aria-label="Mở menu" aria-controls="mobile-menu" aria-expanded="false">
                <span class="material-symbols-outlined">menu</span>
            </button>
        `;
    }

    function mobileMenuHtml(isAuth, user) {
        const homeLink = isAuth
            ? '<a href="dashboard.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Trang chủ</a>'
            : '<a href="index.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Tổng quan</a>';
        const account = isAuth ? `
                    <div class="flex items-center gap-3 rounded-2xl bg-surface-container-low p-4 mb-2">
                        <div class="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">${(user?.name || 'U').charAt(0).toUpperCase()}</div>
                        <div class="min-w-0">
                            <p class="font-label-md text-on-surface font-bold truncate">${user?.name || 'Người dùng'}</p>
                            <p class="text-label-sm text-on-surface-variant">Gói ${user?.plan || 'Miễn phí'}</p>
                        </div>
                    </div>` : `
                    <div class="grid grid-cols-2 gap-3 mb-2">
                    <a href="login.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Đăng nhập</a>
                    <a href="register.html" class="bg-primary text-on-primary font-label-md text-label-md px-5 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md text-center">Đăng ký</a>
                    </div>`;
        const logoutAction = isAuth ? `
                <hr class="my-2 border-outline-variant/30">
                <a href="account.html" class="text-on-surface block px-4 py-3 text-label-md hover:bg-surface-container-low transition-colors">Quản lý tài khoản</a>
                <button id="mobile-logout-btn" class="text-left text-error px-4 py-3 font-label-md text-label-md rounded-xl hover:bg-error-container">Đăng xuất</button>` : '';
        return `
                <div id="mobile-menu" class="lg:hidden hidden fixed inset-0 top-16 bg-surface/98 backdrop-blur-md z-50 flex flex-col p-margin-mobile gap-1 pt-5 overflow-y-auto" aria-label="Menu di động">
                    ${account}
                    ${homeLink}
                    <a href="cv.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Phân tích CV</a>
                    <a href="interview.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Phỏng vấn AI</a>
                    <a href="scenarios.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Tình huống</a>
                    <a href="star.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">STAR</a>
                    <a href="report.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Báo cáo</a>
                    <a href="pricing.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Bảng giá</a>
                    ${logoutAction}
                </div>
            `;
    }

    function authNavHtml(user) {
        const initials = (user.name || 'U')
            .split(' ')
            .map(s => s[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        const plan = user.plan || 'Miễn phí';

        // Read avatar from dedicated storage key (separate from user JSON to support large images)
        let storedAvatar = null;
        try { storedAvatar = localStorage.getItem('nexora_avatar') || null; } catch (e) {}
        const avatarStyle = storedAvatar
            ? `background-image:url('${storedAvatar}');background-size:cover;background-position:center;`
            : '';
        const avatarContent = storedAvatar ? '' : initials;

        return `
            <div class="hidden md:flex items-center gap-3 group relative">
                <button id="user-menu-btn" class="flex items-center gap-3 hover:bg-surface-container-low rounded-xl px-2 py-1 transition-colors">
                    <div class="flex flex-col items-end">
                        <span class="font-label-md text-label-md text-on-surface font-bold">${user.name}</span>
                        <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">${plan}</span>
                    </div>
                    <div id="nav-user-avatar" class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold border-2 border-surface-container-high shadow-sm overflow-hidden" style="${avatarStyle}">${avatarContent}</div>
                </button>
                <div id="user-menu" class="hidden absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50">
                    <a href="account.html" class="block px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Quản lý tài khoản</a>
                    <a href="report.html" class="block px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Báo cáo của tôi</a>
                    <a href="pricing.html" class="block px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Nâng cấp gói</a>
                    <hr class="my-1 border-outline-variant/30">
                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-label-md text-error hover:bg-surface-container-low transition-colors">Đăng xuất</button>
                </div>
            </div>
            <button id="mobile-menu-btn" class="lg:hidden text-on-surface p-2 min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors"
                type="button" aria-label="Mở menu" aria-controls="mobile-menu" aria-expanded="false">
                <span class="material-symbols-outlined">menu</span>
            </button>
        `;
    }

    function applyContentVisibility(user) {
        const auth = !!user;
        document.querySelectorAll('.auth-only').forEach(el => {
            el.classList.toggle('hidden', !auth);
        });
        document.querySelectorAll('.guest-only').forEach(el => {
            el.classList.toggle('hidden', auth);
        });
    }

    function applyNavigationDestination(user) {
        const nav = document.querySelector('body > nav, body > header');
        if (!nav) return;

        const destination = user ? 'dashboard.html' : 'index.html';
        const label = user ? 'Trang chủ' : 'Tổng quan';
        const logoLink = Array.from(nav.querySelectorAll('a')).find(link => link.querySelector('img[alt="Nexora"]'));
        if (logoLink) logoLink.href = destination;

        const desktopRow = Array.from(nav.querySelectorAll('.hidden')).find(row =>
            row.querySelectorAll(':scope > a[href*=".html"]').length >= 6
        );
        if (!desktopRow) return;

        const homeLink = Array.from(desktopRow.querySelectorAll(':scope > a[href]')).find(link => {
            const file = new URL(link.href, location.href).pathname.split('/').pop();
            return file === 'index.html' || file === 'dashboard.html';
        });
        if (homeLink) {
            homeLink.href = destination;
            homeLink.textContent = label;
        }
    }

    function applyMobileNavigationState() {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;

        const currentFile = location.pathname.split('/').pop() || 'index.html';
        const activeFile = currentFile === 'case.html' ? 'scenarios.html' : currentFile;
        menu.querySelectorAll(':scope > a[href]').forEach(link => {
            const linkFile = new URL(link.href, location.href).pathname.split('/').pop() || 'index.html';
            const isCurrent = linkFile === activeFile;
            link.classList.toggle('nx-mobile-nav-current', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function renderNav() {
        try {
            const slot = document.getElementById('nav-slot');
            const user = getAuth();
            if (slot) {
                slot.innerHTML = user ? authNavHtml(user) : guestNavHtml();

                // Rebuild one mobile menu for both guest and authenticated states.
                document.getElementById('mobile-menu')?.remove();
                document.body.insertAdjacentHTML('beforeend', mobileMenuHtml(!!user, user));

                // Mobile menu button handler
                const mobileBtn = document.getElementById('mobile-menu-btn');
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileBtn && mobileMenu) {
                    const setMobileMenuOpen = (open) => {
                        mobileMenu.classList.toggle('hidden', !open);
                        mobileBtn.setAttribute('aria-expanded', String(open));
                        mobileBtn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
                        mobileBtn.querySelector('.material-symbols-outlined').textContent = open ? 'close' : 'menu';
                        document.body.classList.toggle('nx-menu-open', open);
                    };
                    mobileBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        setMobileMenuOpen(mobileMenu.classList.contains('hidden'));
                    });
                    mobileMenu.addEventListener('click', (e) => {
                        if (e.target === mobileMenu || e.target.tagName === 'A') {
                            setMobileMenuOpen(false);
                        }
                    });
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                            setMobileMenuOpen(false);
                            mobileBtn.focus();
                        }
                    });
                }

                applyMobileNavigationState();

                document.getElementById('mobile-logout-btn')?.addEventListener('click', () => {
                    logout();
                    window.location.href = 'index.html';
                });

                if (user) {
                    const btn = document.getElementById('user-menu-btn');
                    const menu = document.getElementById('user-menu');
                    const logoutBtn = document.getElementById('logout-btn');
                    if (btn && menu) {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            menu.classList.toggle('hidden');
                        });
                        document.addEventListener('click', () => menu.classList.add('hidden'));
                    }
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            logout();
                            window.location.href = 'index.html';
                        });
                    }
                }
            }
            applyNavigationDestination(user);
            applyContentVisibility(user);
        } catch (err) {
            console.warn('Nexora nav render skipped:', err);
        }
    }

    // Expose for login page
    window.NexoraAuth = { setAuth, logout, getAuth, renderNav };

    // Auto-render when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNav);
    } else {
        renderNav();
    }
})();

/* ============================================
   NEXORA - GLOBAL ANIMATIONS & SMOOTH UI
   ============================================ */
(function () {
    'use strict';

    // Inject animation stylesheet once
    if (document.getElementById('nexora-anim-css')) return;
    const style = document.createElement('style');
    style.id = 'nexora-anim-css';
    style.textContent = `
        /* Smooth scroll chỉ áp cho cuộn neo trong trang, không áp lúc load trang */
        @media (prefers-reduced-motion: no-preference) {
            html:focus-within { scroll-behavior: smooth; }
        }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        @keyframes nexora-fade-up {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nexora-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes nexora-scale-in {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes nexora-slide-right {
            from { opacity: 0; transform: translateX(-16px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes nexora-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        @keyframes nexora-pulse-soft {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
        }
        @keyframes nexora-bar-grow {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }

        /* Apply animations: duration rõ ràng, easing mượt */
        .nx-fade-up { animation: nexora-fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .nx-fade-in { animation: nexora-fade-in 0.6s ease-out both; }
        .nx-scale-in { animation: nexora-scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .nx-slide-right { animation: nexora-slide-right 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .nx-pulse-soft { animation: nexora-pulse-soft 2.4s ease-in-out infinite; }

        .nx-delay-1 { animation-delay: 0.08s; }
        .nx-delay-2 { animation-delay: 0.16s; }
        .nx-delay-3 { animation-delay: 0.24s; }
        .nx-delay-4 { animation-delay: 0.32s; }
        .nx-delay-5 { animation-delay: 0.40s; }
        .nx-delay-6 { animation-delay: 0.48s; }
        .nx-delay-7 { animation-delay: 0.56s; }
        .nx-delay-8 { animation-delay: 0.64s; }

        .nx-card {
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
        }
        .nx-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            will-change: transform;
        }
        .nx-btn {
            transition: transform 0.18s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .nx-btn:active { transform: scale(0.96); }

        .nx-nav-link {
            position: relative;
            transition: color 0.2s ease;
        }
        .nx-nav-link::after {
            content: '';
            position: absolute;
            left: 12px; right: 12px; bottom: 4px;
            height: 2px;
            background: currentColor;
            border-radius: 2px;
            transform: scaleX(0);
            transform-origin: center;
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nx-nav-link:hover::after { transform: scaleX(1); }

        /* Bar grow cho progress bar */
        .nx-bar-grow {
            transform-origin: left center;
            animation: nexora-bar-grow 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Skeleton loader */
        .nx-skeleton {
            background: linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%);
            background-size: 200% 100%;
            animation: nexora-shimmer 1.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.001ms !important;
                transition-duration: 0.001ms !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Reveal-on-scroll: animation chỉ HIỆN nội dung, không bao giờ để nội dung kẹt ẩn.
    // First-paint guard: nếu JS chậm hoặc thiếu IntersectionObserver, nội dung vẫn hiện đầy đủ.
    function initStagger() {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasIO = 'IntersectionObserver' in window;

        // Nếu không hỗ trợ IO hoặc người dùng tắt motion: bỏ qua animation, để nội dung hiện nguyên.
        if (!hasIO || reduceMotion) return;

        const revealOnce = (el) => {
            // Chỉ animate một lần; không re-hide phần tử đã hiện.
            if (el.dataset.nxRevealed) return;
            el.dataset.nxRevealed = '1';
            el.classList.add('nx-fade-up');
        };

        // 1. data-nx-stagger: cha chứa nhiều child animate tuần tự khi vào viewport
        const staggerObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                Array.from(e.target.children).forEach((child, i) => {
                    child.style.animationDelay = (i * 70) + 'ms';
                    revealOnce(child);
                });
                staggerObs.unobserve(e.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('[data-nx-stagger]').forEach(el => staggerObs.observe(el));

        // 2. data-nx-section + 3. data-nx-card: reveal khi vào viewport (animate một lần)
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                revealOnce(e.target);
                revealObs.unobserve(e.target);
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
        document.querySelectorAll('[data-nx-section], [data-nx-card]').forEach(el => revealObs.observe(el));

        // 4. Bar grow: progress bar chạy animation khi vào viewport
        const barObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.classList.add('nx-bar-grow');
                barObs.unobserve(e.target);
            });
        }, { threshold: 0.4 });
        document.querySelectorAll('[data-nx-bar]').forEach(el => barObs.observe(el));
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStagger);
    } else {
        initStagger();
    }
})();

/* ============================================
   NEXORA - MVP INTERACTIONS & FEEDBACK
   ============================================ */
(function () {
    'use strict';

    const cleanText = (el) => {
        if (!el) return '';
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.material-symbols-outlined, .material-icons').forEach(i => i.remove());
        return (clone.textContent || '').replace(/\s+/g, ' ').trim();
    };

    function toast(message, tone = 'default') {
        document.querySelector('.nx-toast')?.remove();
        const el = document.createElement('div');
        el.className = `nx-toast ${tone === 'error' ? 'nx-toast-error' : ''}`;
        el.setAttribute('role', 'status');
        el.innerHTML = `<span class="material-symbols-outlined">${tone === 'error' ? 'error' : 'check_circle'}</span><span>${message}</span>`;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('is-visible'));
        setTimeout(() => {
            el.classList.remove('is-visible');
            setTimeout(() => el.remove(), 240);
        }, 2600);
    }

    function showDialog(title, body, action) {
        document.querySelector('.nx-dialog-backdrop')?.remove();
        const wrap = document.createElement('div');
        wrap.className = 'nx-dialog-backdrop';
        wrap.innerHTML = `
            <section class="nx-dialog" role="dialog" aria-modal="true" aria-labelledby="nx-dialog-title">
                <button class="nx-dialog-close" type="button" aria-label="Đóng"><span class="material-symbols-outlined">close</span></button>
                <div class="nx-dialog-icon"><span class="material-symbols-outlined">auto_awesome</span></div>
                <h2 id="nx-dialog-title">${title}</h2>
                <p>${body}</p>
                ${action ? `<a class="nx-dialog-action" href="${action.href}">${action.label}</a>` : '<button class="nx-dialog-action" type="button" data-dialog-ok>Đã hiểu</button>'}
            </section>`;
        document.body.appendChild(wrap);
        const close = () => wrap.remove();
        wrap.querySelector('.nx-dialog-close').addEventListener('click', close);
        wrap.querySelector('[data-dialog-ok]')?.addEventListener('click', close);
        wrap.addEventListener('click', (event) => { if (event.target === wrap) close(); });
        wrap.querySelector('.nx-dialog-close').focus();
    }

    const PROTECTED_ROUTES = new Set([
        'account.html',
        'case.html',
        'cv.html',
        'dashboard.html',
        'interview.html',
        'report.html',
        'roadmap.html',
        'scenarios.html',
        'star.html'
    ]);

    function normalizeInternalDestination(href, fallback = 'dashboard.html') {
        try {
            const url = new URL(href || fallback, location.href);
            if (url.origin !== location.origin) return fallback;
            const file = url.pathname.split('/').pop() || 'index.html';
            if (!file.endsWith('.html')) return fallback;
            return `${file}${url.search}${url.hash}`;
        } catch (error) {
            return fallback;
        }
    }

    function getSavedAuthDestination(fallback = 'dashboard.html') {
        const params = new URLSearchParams(location.search);
        const next = params.get('next') || sessionStorage.getItem('nexora_auth_next') || fallback;
        return normalizeInternalDestination(next, fallback);
    }

    function saveAuthDestination(href) {
        const next = normalizeInternalDestination(href, 'dashboard.html');
        try {
            sessionStorage.setItem('nexora_auth_next', next);
        } catch (error) {}
        return next;
    }

    function isProtectedHref(href) {
        try {
            const url = new URL(href, location.href);
            if (url.origin !== location.origin) return false;
            const file = url.pathname.split('/').pop() || 'index.html';
            return PROTECTED_ROUTES.has(file);
        } catch (error) {
            return false;
        }
    }

    function normalizeLabel(value) {
        return (value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
    }

    function showLoginRequiredModal(nextHref = 'dashboard.html') {
        const next = saveAuthDestination(nextHref);
        document.querySelector('.nx-auth-modal-backdrop')?.remove();
        const wrap = document.createElement('div');
        wrap.className = 'nx-auth-modal-backdrop';
        wrap.innerHTML = `
            <section class="nx-auth-modal" role="dialog" aria-modal="true" aria-labelledby="nx-auth-modal-title">
                <button class="nx-auth-modal-close" type="button" aria-label="&#272;&#243;ng">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="nx-auth-modal-icon" aria-hidden="true">
                    <span class="material-symbols-outlined">lock</span>
                </div>
                <h2 id="nx-auth-modal-title">&#272;&#259;ng nh&#7853;p &#273;&#7875; ti&#7871;p t&#7909;c</h2>
                <p>&#272;&#259;ng nh&#7853;p &#273;&#7875; l&#432;u ti&#7871;n &#273;&#7897; luy&#7879;n t&#7853;p v&#224; nh&#7853;n feedback chi ti&#7871;t t&#7915; AI.</p>
                <a class="nx-auth-modal-primary" href="login.html?next=${encodeURIComponent(next)}">&#272;&#259;ng nh&#7853;p</a>
                <button class="nx-auth-modal-google" type="button" data-auth-google-mvp>
                    <svg class="nx-google-mark" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.42-.23-2.04H12v3.86h6.62c-.13.96-.85 2.42-2.45 3.39l-.02.13 3.56 2.39.25.02c2.28-1.83 3.54-4.52 3.54-7.75Z"/>
                        <path fill="#34A853" d="M12 23c3.26 0 5.99-.93 7.99-2.54l-3.81-2.98c-1.02.61-2.39 1.04-4.18 1.04-3.19 0-5.89-1.83-6.86-4.36l-.14.01-3.7 2.48-.05.12C3.24 20.48 7.3 23 12 23Z"/>
                        <path fill="#FBBC05" d="M5.14 14.16A6.03 6.03 0 0 1 4.79 12c0-.75.13-1.48.34-2.16l-.01-.14-3.74-2.52-.12.05A10.2 10.2 0 0 0 .17 12c0 1.72.42 3.35 1.15 4.77l3.82-2.61Z"/>
                        <path fill="#EA4335" d="M12 5.48c2.27 0 3.8.85 4.67 1.56l3.41-2.89C17.98 2.46 15.26 1.42 12 1.42c-4.7 0-8.76 2.52-10.75 6.17l3.82 2.62C6.03 7.68 8.81 5.48 12 5.48Z"/>
                    </svg>
                    <span>Ti&#7871;p t&#7909;c v&#7899;i Google</span>
                </button>
                <div class="nx-auth-modal-foot">
                    <span>Ch&#432;a c&#243; t&#224;i kho&#7843;n?</span>
                    <a href="register.html?next=${encodeURIComponent(next)}">&#272;&#259;ng k&#253; mi&#7877;n ph&#237;</a>
                </div>
            </section>`;
        document.body.appendChild(wrap);
        document.body.classList.add('nx-modal-open');

        const close = () => {
            wrap.remove();
            document.body.classList.remove('nx-modal-open');
            document.removeEventListener('keydown', onKeydown);
        };
        const onKeydown = (event) => {
            if (event.key === 'Escape') close();
        };

        wrap.querySelector('.nx-auth-modal-close')?.addEventListener('click', close);
        wrap.addEventListener('click', (event) => {
            if (event.target === wrap) close();
        });
        document.addEventListener('keydown', onKeydown);
        wrap.querySelector('.nx-auth-modal-close')?.focus();
    }

    function initAccessControl() {
        document.addEventListener('click', (event) => {
            if (window.NexoraAuth?.getAuth()) return;

            const link = event.target.closest?.('a[href]');
            if (link && isProtectedHref(link.getAttribute('href'))) {
                event.preventDefault();
                event.stopImmediatePropagation();
                showLoginRequiredModal(link.getAttribute('href'));
                return;
            }

            const button = event.target.closest?.('button');
            if (!button) return;
            const label = cleanText(button);
            const normalizedLabel = normalizeLabel(label);
            const shouldProtectStart =
                normalizedLabel.includes('bat dau phong van mien phi') ||
                normalizedLabel === 'bat dau mien phi' ||
                normalizedLabel.includes('tiep tuc hoc');
            if (!shouldProtectStart) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            showLoginRequiredModal(normalizedLabel.includes('tiep tuc hoc') ? 'star.html?demo=1' : 'interview.html');
        }, true);

        const params = new URLSearchParams(location.search);
        const nextParam = params.get('next');
        if (nextParam) {
            const safeNext = encodeURIComponent(normalizeInternalDestination(nextParam, 'dashboard.html'));
            document.querySelectorAll('a[href="login.html"]').forEach(link => {
                link.href = `login.html?next=${safeNext}`;
            });
            document.querySelectorAll('a[href="register.html"]').forEach(link => {
                link.href = `register.html?next=${safeNext}`;
            });
        }
        if (!window.NexoraAuth?.getAuth() && params.get('loginRequired') === '1') {
            showLoginRequiredModal(params.get('next') || 'dashboard.html');
            params.delete('loginRequired');
            params.delete('next');
            const cleanUrl = `${location.pathname}${params.toString() ? `?${params}` : ''}${location.hash}`;
            history.replaceState(null, '', cleanUrl);
        }
    }

    window.NexoraUI = {
        toast,
        showDialog,
        showLoginRequiredModal,
        getSavedAuthDestination,
        saveAuthDestination
    };

    function initCvUpload() {
        const zone = document.getElementById('drop-zone');
        const analyze = document.getElementById('analyze-btn');
        if (!zone || !analyze) return;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileInput.className = 'sr-only';
        fileInput.id = 'cv-file-input';
        zone.appendChild(fileInput);
        zone.setAttribute('role', 'button');
        zone.setAttribute('tabindex', '0');
        zone.setAttribute('aria-label', 'Chọn CV từ máy');

        let selectedFile = null;
        const uploaded = document.getElementById('uploaded-file');
        const fileName = uploaded?.querySelector('p');
        const fileMeta = uploaded?.querySelectorAll('p')[1];
        const jd = document.querySelector('#upload-section textarea');

        const updateState = () => {
            const ready = !!selectedFile && !!jd?.value.trim();
            analyze.classList.toggle('opacity-50', !ready);
            analyze.classList.toggle('cursor-not-allowed', !ready);
            analyze.setAttribute('aria-disabled', String(!ready));
        };

        const useFile = (file) => {
            if (!file) return;
            const allowed = /\.(pdf|doc|docx)$/i.test(file.name);
            if (!allowed) return toast('Chỉ hỗ trợ file PDF, DOC hoặc DOCX.', 'error');
            if (file.size > 5 * 1024 * 1024) return toast('CV cần nhỏ hơn 5MB nhen.', 'error');
            selectedFile = file;
            localStorage.setItem('nexora_cv_name', file.name);
            if (fileName) fileName.textContent = file.name;
            if (fileMeta) fileMeta.textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
            uploaded?.classList.remove('hidden');
            zone.classList.add('nx-upload-ready');
            updateState();
            toast('Đã thêm CV. Giờ dán JD để phân tích.');
        };

        zone.addEventListener('click', () => fileInput.click());
        zone.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileInput.click();
            }
        });
        fileInput.addEventListener('change', () => useFile(fileInput.files[0]));
        ['dragenter', 'dragover'].forEach(name => zone.addEventListener(name, () => zone.classList.add('drop-zone-active')));
        ['dragleave', 'drop'].forEach(name => zone.addEventListener(name, () => zone.classList.remove('drop-zone-active')));
        zone.addEventListener('dragover', event => event.preventDefault());
        zone.addEventListener('drop', event => {
            event.preventDefault();
            useFile(event.dataTransfer.files[0]);
        });
        jd?.addEventListener('input', updateState);
        uploaded?.querySelector('button')?.addEventListener('click', () => {
            selectedFile = null;
            fileInput.value = '';
            zone.classList.remove('nx-upload-ready');
            updateState();
        });
        analyze.addEventListener('click', (event) => {
            if (!selectedFile || !jd?.value.trim()) {
                event.preventDefault();
                event.stopImmediatePropagation();
                toast(!selectedFile ? 'Bạn vui lòng chọn CV trước nhé.' : 'Bạn vui lòng dán mô tả công việc trước nhé.', 'error');
            }
        }, true);
        updateState();
    }

    function initInterviewCv() {
        const candidateInitial = document.querySelector('[data-candidate-initial]');
        const currentUser = window.NexoraAuth?.getAuth();
        if (candidateInitial) candidateInitial.textContent = (currentUser?.name || 'U').charAt(0).toUpperCase();
        const input = document.getElementById('step-cv');
        const changeBtn = document.getElementById('step-cv-change');
        const nameEl = document.getElementById('step-cv-name');
        const metaEl = document.getElementById('step-cv-meta');
        if (!input || !changeBtn || !nameEl) return;

        const savedName = localStorage.getItem('nexora_cv_name');
        if (savedName) nameEl.textContent = savedName;

        changeBtn.addEventListener('click', () => input.click());
        input.addEventListener('change', () => {
            const file = input.files?.[0];
            if (!file) return;
            if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
                input.value = '';
                return toast('Chỉ hỗ trợ file PDF, DOC hoặc DOCX.', 'error');
            }
            if (file.size > 5 * 1024 * 1024) {
                input.value = '';
                return toast('CV cần nhỏ hơn 5MB nhen.', 'error');
            }
            nameEl.textContent = file.name;
            if (metaEl) metaEl.textContent = 'CV mới, sẵn sàng sử dụng';
            localStorage.setItem('nexora_cv_name', file.name);
            toast('Đã đổi CV cho buổi phỏng vấn này.');
        });
    }

    function initPricingPlan() {
        const cards = Array.from(document.querySelectorAll('[data-plan-card]'));
        if (!cards.length) return;
        const user = window.NexoraAuth?.getAuth();
        if (!user) return;
        const aliases = { 'Miễn phí': 'Free', Free: 'Free', Basic: 'Basic', Weekly: 'Weekly', 'Cá nhân': 'Pro', Pro: 'Pro', Business: 'Business', 'Doanh nghiệp': 'Business' };
        const current = aliases[user.plan] || 'Free';

        cards.forEach(card => {
            const plan = card.dataset.planCard;
            const action = card.querySelector('[data-plan-action]');
            if (plan === current) {
                card.classList.add('nx-current-plan');
                let badge = card.querySelector('[data-plan-badge]');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.dataset.planBadge = '';
                    badge.className = 'nx-current-plan-badge';
                    card.appendChild(badge);
                }
                badge.className = 'nx-current-plan-badge';
                badge.innerHTML = `<span class="material-symbols-outlined text-[17px]">verified</span> Gói hiện tại: ${user.plan}`;
                if (action) {
                    action.textContent = 'Đang sử dụng';
                    action.removeAttribute('href');
                    action.setAttribute('aria-disabled', 'true');
                    action.classList.add('nx-plan-disabled');
                    action.addEventListener('click', event => event.preventDefault());
                }
            }
        });
    }

    function initPricingMotion() {
        const grid = document.querySelector('[data-pricing-motion]');
        if (!grid || !('IntersectionObserver' in window)) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const cards = Array.from(grid.querySelectorAll('.nx-price-card'));
        if (reduceMotion || !cards.length) return;

        cards.forEach((card, index) => card.style.setProperty('--nx-card-index', index));
        grid.classList.add('nx-pricing-motion-ready');

        const observer = new IntersectionObserver((entries) => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            grid.classList.add('nx-pricing-in-view');
            observer.disconnect();
        }, { threshold: 0.12, rootMargin: '0px 0px -24px' });
        observer.observe(grid);

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            cards.forEach(card => {
                card.addEventListener('pointermove', event => {
                    const rect = card.getBoundingClientRect();
                    const x = (event.clientX - rect.left) / rect.width - 0.5;
                    const y = (event.clientY - rect.top) / rect.height - 0.5;
                    card.style.setProperty('--nx-tilt-x', `${(-y * 2.2).toFixed(2)}deg`);
                    card.style.setProperty('--nx-tilt-y', `${(x * 2.2).toFixed(2)}deg`);
                    card.style.setProperty('--nx-glow-x', `${((x + 0.5) * 100).toFixed(1)}%`);
                    card.style.setProperty('--nx-glow-y', `${((y + 0.5) * 100).toFixed(1)}%`);
                });
                card.addEventListener('pointerleave', () => {
                    card.style.removeProperty('--nx-tilt-x');
                    card.style.removeProperty('--nx-tilt-y');
                    card.style.removeProperty('--nx-glow-x');
                    card.style.removeProperty('--nx-glow-y');
                });
            });
        }
    }

    function initScenarioFilters() {
        if (!/scenarios\.html$/.test(location.pathname)) return;
        const filterWrap = document.querySelector('.no-scrollbar');
        const grid = filterWrap?.nextElementSibling;
        if (!filterWrap || !grid) return;
        const cards = Array.from(grid.querySelectorAll('[data-case-card]'));
        const empty = document.createElement('div');
        empty.className = 'hidden col-span-full rounded-2xl border border-outline-variant/30 bg-surface p-8 text-center';
        empty.innerHTML = '<span class="material-symbols-outlined text-primary text-[32px]">search_off</span><h3 class="font-headline-md text-on-surface mt-3">Chưa có case phù hợp</h3><p class="text-on-surface-variant mt-2">Thử một nhóm khác hoặc quay lại sau nhen.</p>';
        grid.appendChild(empty);
        filterWrap.querySelectorAll('[data-scenario-filter]').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.scenarioFilter;
                filterWrap.querySelectorAll('[data-scenario-filter]').forEach(item => {
                    const active = item === button;
                    item.classList.toggle('bg-primary', active);
                    item.classList.toggle('text-on-primary', active);
                    item.classList.toggle('bg-surface-container', !active);
                });
                cards.forEach(card => {
                    const cardCategory = card.dataset.caseCategory;
                    card.hidden = category !== 'all' && cardCategory !== category;
                });
                empty.classList.toggle('hidden', cards.some(card => !card.hidden));
            });
        });
        grid.querySelector('[data-upgrade-case]')?.addEventListener('click', () => location.href = 'pricing.html');
    }

    function initPageActions() {
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                showDialog(cleanText(link), 'Nội dung này đang được hoàn thiện cho bản MVP. Các luồng chính vẫn hoạt động bình thường.');
            });
        });

        document.querySelectorAll('button').forEach(button => {
            const label = cleanText(button);
            if (label.includes('Bắt đầu phỏng vấn miễn phí') || label === 'Bắt đầu miễn phí') {
                button.addEventListener('click', () => location.href = 'interview.html');
            } else if (label.includes('Xem cách hoạt động')) {
                button.addEventListener('click', () => showDialog('Nexora hoạt động thế nào?', 'Tải CV, dán JD, luyện phỏng vấn và nhận báo cáo cải thiện theo phương pháp STAR.', { href: 'cv.html', label: 'Thử phân tích CV' }));
            } else if (label === 'Đăng ký ngay') {
                button.addEventListener('click', () => location.href = 'register.html');
            } else if (label.includes('Liên hệ tư vấn') || label.includes('Liên hệ bộ phận Sales')) {
                button.addEventListener('click', () => showDialog('Tư vấn doanh nghiệp', 'Để lại nhu cầu qua email, đội ngũ Nexora sẽ phản hồi trong bản demo.', { href: 'mailto:hello@nexora.vn?subject=Tu%20van%20Nexora', label: 'Gửi email tư vấn' }));
            } else if (label.includes('Tải báo cáo PDF') || label === 'download Tải PDF') {
                button.addEventListener('click', () => window.print());
            } else if (label.includes('Tiếp tục học')) {
                button.addEventListener('click', () => location.href = 'star.html?demo=1');
            } else if (label === 'Đăng ký') {
                button.addEventListener('click', () => location.href = 'pricing.html');
            } else if (label === 'Đăng nhập bằng Google' || label === 'Đăng ký bằng Google') {
                button.type = 'button';
                button.addEventListener('click', () => {
                    window.NexoraAuth?.setAuth({ name: 'Người dùng Demo', email: 'demo@nexora.vn', plan: 'Pro' });
                    location.href = getSavedAuthDestination('dashboard.html');
                });
            }
        });
    }

    function initRegisterValidation() {
        const form = document.getElementById('register-form');
        if (!form) return;
        form.addEventListener('submit', (event) => {
            const terms = document.getElementById('terms');
            const password = document.getElementById('password');
            if (!terms?.checked) {
                event.preventDefault();
                event.stopImmediatePropagation();
                toast('Bạn cần đồng ý với điều khoản để tiếp tục.', 'error');
                terms?.focus();
            } else if ((password?.value || '').length < 6) {
                event.preventDefault();
                event.stopImmediatePropagation();
                toast('Mật khẩu cần ít nhất 6 ký tự.', 'error');
                password?.focus();
            }
        }, true);
    }

    function initNavigationPerformance() {
        const internalLinks = Array.from(document.querySelectorAll('a[href]')).filter(link => {
            const href = link.getAttribute('href') || '';
            return href.endsWith('.html') || href.includes('.html?');
        });
        const prefetched = new Set();

        const prefetch = (href) => {
            const url = new URL(href, location.href);
            if (url.origin !== location.origin || url.pathname === location.pathname || prefetched.has(url.href)) return;
            prefetched.add(url.href);
            const hint = document.createElement('link');
            hint.rel = 'prefetch';
            hint.href = url.href;
            hint.as = 'document';
            document.head.appendChild(hint);
        };

        internalLinks.forEach(link => {
            link.addEventListener('pointerenter', () => prefetch(link.href), { once: true });
            link.addEventListener('focus', () => prefetch(link.href), { once: true });
        });

        const warmMainRoutes = () => {
            const homeRoute = window.NexoraAuth?.getAuth() ? 'dashboard.html' : 'index.html';
            const warmRoutes = window.NexoraAuth?.getAuth()
                ? [homeRoute, 'cv.html', 'interview.html', 'scenarios.html', 'star.html', 'report.html', 'pricing.html']
                : [homeRoute, 'pricing.html'];
            warmRoutes.forEach(prefetch);
        };
        if ('requestIdleCallback' in window) requestIdleCallback(warmMainRoutes, { timeout: 1500 });
        else setTimeout(warmMainRoutes, 600);
    }

    function initSharedNavStyle() {
        const nav = document.querySelector('body > nav, body > header');
        if (!nav) return;
        nav.classList.add('nx-top-nav');
        const container = nav.querySelector(':scope > div');
        container?.classList.add('nx-nav-container');
        const rows = Array.from(nav.querySelectorAll('.hidden'));
        const desktopRow = rows.find(row => row.querySelectorAll(':scope > a[href*=".html"]').length >= 6);
        if (!desktopRow) return;
        desktopRow.classList.remove('md:flex');
        desktopRow.classList.add('lg:flex');
        desktopRow.classList.add('nx-desktop-nav');
        const currentFile = location.pathname.split('/').pop() || 'index.html';
        const activeFile = currentFile === 'case.html' ? 'scenarios.html' : currentFile;
        desktopRow.querySelectorAll(':scope > a[href]').forEach(link => {
            const linkFile = new URL(link.href, location.href).pathname.split('/').pop() || 'index.html';
            link.classList.add('nx-desktop-nav-link');
            link.classList.toggle('nx-desktop-nav-current', linkFile === activeFile);
            if (linkFile === activeFile) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function init() {
        initAccessControl();
        initCvUpload();
        initInterviewCv();
        initPricingPlan();
        initPricingMotion();
        initScenarioFilters();
        initPageActions();
        initRegisterValidation();
        initNavigationPerformance();
        initSharedNavStyle();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
