/* ============================================
   NEXORA - CV ANALYSIS PAGE JAVASCRIPT
   ============================================ */

(function () {
    'use strict';

    // Simple simulation for button click to show results
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function () {
            const btn = this;
            const originalText = btn.innerHTML;

            // Loading state
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span> Đang phân tích...';
            btn.classList.add('opacity-80', 'cursor-not-allowed');

            setTimeout(() => {
                // Restore button
                btn.innerHTML = originalText;
                btn.classList.remove('opacity-80', 'cursor-not-allowed');

                // Show results
                const resultsPanel = document.getElementById('results-panel');
                if (resultsPanel) {
                    resultsPanel.classList.remove('hidden');
                    // Trigger reflow for transition
                    void resultsPanel.offsetWidth;
                    resultsPanel.classList.add('flex');
                    resultsPanel.classList.remove('opacity-0');
                }
            }, 1500);
        });
    }

    // Simple Drag and drop visual feedback
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('drop-zone-active'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('drop-zone-active'), false);
        });
    }
})();