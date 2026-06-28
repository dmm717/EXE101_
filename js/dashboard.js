/* ============================================
   NEXORA - AUTHENTICATED DASHBOARD
   ============================================ */

(function () {
    'use strict';

    function initDashboard() {
        const user = window.NexoraAuth?.getAuth();
        if (!user) return;

        const name = document.getElementById('dashboard-user-name');
        const search = document.getElementById('dashboard-search');
        const category = document.getElementById('dashboard-category');
        const difficulty = document.getElementById('dashboard-difficulty');
        const status = document.getElementById('dashboard-filter-status');
        const emptyIcon = document.getElementById('dashboard-empty-icon');
        const emptyTitle = document.getElementById('dashboard-empty-title');
        const emptyDescription = document.getElementById('dashboard-empty-description');
        const emptyAction = document.getElementById('dashboard-empty-action');
        if (name) name.textContent = user.name || 'bạn';

        function refreshEmptyState() {
            const hasQuery = !!search?.value.trim();
            const hasCategoryFilter = category?.value !== 'all';
            const hasDifficultyFilter = difficulty?.value !== 'all';
            const isFiltering = hasQuery || hasCategoryFilter || hasDifficultyFilter;

            if (isFiltering) {
                emptyIcon.textContent = 'search_off';
                emptyTitle.textContent = 'Không tìm thấy hoạt động phù hợp';
                emptyDescription.textContent = 'Thử thay đổi từ khóa hoặc bộ lọc. Hoạt động mới sẽ xuất hiện sau khi bạn hoàn thành một buổi luyện tập.';
                emptyAction.classList.add('hidden');
                status.textContent = 'Không có hoạt động phù hợp với bộ lọc hiện tại.';
            } else {
                emptyIcon.textContent = 'assignment_turned_in';
                emptyTitle.textContent = 'Chưa có hoạt động nào';
                emptyDescription.textContent = 'Các cuộc phỏng vấn và case tình huống bạn hoàn thành sẽ xuất hiện tại đây.';
                emptyAction.classList.remove('hidden');
                status.textContent = 'Đang hiển thị trạng thái chưa có hoạt động.';
            }
        }

        search?.addEventListener('input', refreshEmptyState);
        category?.addEventListener('change', refreshEmptyState);
        difficulty?.addEventListener('change', refreshEmptyState);
        refreshEmptyState();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDashboard);
    else initDashboard();
})();
