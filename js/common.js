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
        renderNav();
    }

    function guestNavHtml() {
        return `
            <a class="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
                href="login.html">Đăng nhập</a>
            <a class="hidden md:block bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-[12px] hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(53,37,205,0.2)] active:scale-95"
                href="register.html">Đăng ký</a>
            <button id="mobile-menu-btn" class="md:hidden text-on-surface p-2">
                <span class="material-symbols-outlined">menu</span>
            </button>
        `;
    }

    function mobileMenuHtml(isAuth, user) {
        if (!isAuth) {
            return `
                <div id="mobile-menu" class="md:hidden hidden fixed inset-0 top-16 bg-surface/95 backdrop-blur-md z-50 flex flex-col p-margin-mobile gap-2 pt-6">
                    <a href="login.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Đăng nhập</a>
                    <a href="register.html" class="bg-primary text-on-primary font-label-md text-label-md px-5 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md text-center">Đăng ký</a>
                    <hr class="my-2 border-outline-variant/30">
                    <a href="index.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Tổng quan</a>
                    <a href="cv.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Phân tích CV</a>
                    <a href="interview.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Phỏng vấn AI</a>
                    <a href="scenarios.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Tình huống</a>
                    <a href="star.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">STAR</a>
                    <a href="report.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Báo cáo</a>
                    <a href="pricing.html" class="text-on-surface-variant hover:text-primary transition-colors px-4 py-3 font-label-md text-label-md">Bảng giá</a>
                </div>
            `;
        }
        return '';
    }

    function authNavHtml(user) {
        const initials = (user.name || 'U')
            .split(' ')
            .map(s => s[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        const plan = user.plan || 'Miễn phí';
        return `
            <div class="hidden md:flex items-center gap-3 group relative">
                <button id="user-menu-btn" class="flex items-center gap-3 hover:bg-surface-container-low rounded-xl px-2 py-1 transition-colors">
                    <div class="flex flex-col items-end">
                        <span class="font-label-md text-label-md text-on-surface font-bold">${user.name}</span>
                        <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">${plan}</span>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold border-2 border-surface-container-high shadow-sm">${initials}</div>
                </button>
                <div id="user-menu" class="hidden absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50">
                    <a href="report.html" class="block px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Báo cáo của tôi</a>
                    <a href="pricing.html" class="block px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors">Nâng cấp gói</a>
                    <hr class="my-1 border-outline-variant/30">
                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-label-md text-error hover:bg-surface-container-low transition-colors">Đăng xuất</button>
                </div>
            </div>
            <button id="mobile-menu-btn" class="md:hidden text-on-surface p-2">
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

    function renderNav() {
        try {
            const slot = document.getElementById('nav-slot');
            const user = getAuth();
            if (slot) {
                slot.innerHTML = user ? authNavHtml(user) : guestNavHtml();

                // Inject mobile menu overlay for guests
                if (!user) {
                    const menuDiv = document.createElement('div');
                    menuDiv.id = 'mobile-overlay';
                    document.body.appendChild(menuDiv);
                    menuDiv.outerHTML = mobileMenuHtml(false, user);
                }

                // Mobile menu button handler
                const mobileBtn = document.getElementById('mobile-menu-btn');
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileBtn && mobileMenu) {
                    mobileBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        mobileMenu.classList.toggle('hidden');
                    });
                    mobileMenu.addEventListener('click', (e) => {
                        if (e.target === mobileMenu || e.target.tagName === 'A') {
                            mobileMenu.classList.add('hidden');
                        }
                    });
                }

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
        html { scroll-behavior: smooth !important; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        @keyframes nexora-fade-up {
            from { opacity: 0; transform: translateY(24px); }
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
        .nx-fade-up { animation: nexora-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
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
            will-change: transform;
        }
        .nx-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
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

    // Auto-stagger: phần tử có [data-nx-stagger] sẽ fade-up lần lượt
    // Sections with [data-nx-section] fade-up khi vào viewport
    function initStagger() {
        // 1. data-nx-stagger: cha chứa nhiều child cần animate tuần tự
        document.querySelectorAll('[data-nx-stagger]').forEach((group, gi) => {
            Array.from(group.children).forEach((child, i) => {
                child.style.animationDelay = (i * 80 + gi * 60) + 'ms';
                child.classList.add('nx-fade-up');
            });
        });

        // 2. data-nx-section: section lớn fade-up khi vào viewport
        if ('IntersectionObserver' in window) {
            const sectionObs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('nx-fade-up');
                        sectionObs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
            document.querySelectorAll('[data-nx-section]').forEach(el => sectionObs.observe(el));

            // 3. data-nx-card: card trong viewport fade-up + stagger tự động
            const cardObs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('nx-fade-up');
                        cardObs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
            document.querySelectorAll('[data-nx-card]').forEach(el => cardObs.observe(el));
        }

        // 4. Bar grow: progress bar chạy animation khi vào viewport
        if ('IntersectionObserver' in window) {
            const barObs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('nx-bar-grow');
                        barObs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.4 });
            document.querySelectorAll('[data-nx-bar]').forEach(el => barObs.observe(el));
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStagger);
    } else {
        initStagger();
    }
})();