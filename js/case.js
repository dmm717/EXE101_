/* ============================================
   NEXORA - CASE WORKSPACE CONTROLLER
   ============================================ */

(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('id');
    const library = window.NexoraCaseLibrary || {};
    const activeCase = caseId ? library[caseId] : null;

    const workspace = document.getElementById('case-workspace');
    const completeView = document.getElementById('case-complete');
    const errorView = document.getElementById('case-error');

    if (!workspace || !completeView || !errorView) return;

    if (!activeCase || !Array.isArray(activeCase.questions) || !activeCase.questions.length) {
        workspace.classList.add('hidden');
        errorView.classList.remove('hidden');
        return;
    }

    const elements = {
        title: document.getElementById('case-title'),
        description: document.getElementById('case-description'),
        category: document.getElementById('case-category'),
        difficulty: document.getElementById('case-difficulty'),
        duration: document.getElementById('case-duration'),
        progress: document.getElementById('case-progress'),
        progressLabel: document.getElementById('case-progress-label'),
        progressBar: document.getElementById('case-progress-bar'),
        questionNumber: document.getElementById('case-question-number'),
        questionTitle: document.getElementById('case-question-title'),
        questionHelper: document.getElementById('case-question-helper'),
        answer: document.getElementById('case-answer'),
        answerError: document.getElementById('case-answer-error'),
        characterCount: document.getElementById('case-character-count'),
        previous: document.getElementById('case-previous'),
        next: document.getElementById('case-next'),
        nextLabel: document.getElementById('case-next-label'),
        nextIcon: document.getElementById('case-next-icon'),
        saveStatus: document.getElementById('case-save-status'),
        completeTitle: document.getElementById('case-complete-title'),
        completeMessage: document.getElementById('case-complete-message'),
        restart: document.getElementById('case-restart')
    };

    const storageKey = `nexora_case_draft_v1:${activeCase.id}`;
    const totalQuestions = activeCase.questions.length;
    let currentIndex = 0;
    let answers = Array(totalQuestions).fill('');
    let saveTimer = null;
    let isCompleted = false;

    function readSavedProgress() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (!saved || saved.schema !== 1 || saved.caseId !== activeCase.id || !Array.isArray(saved.answers)) return false;
            answers = answers.map((_, index) => typeof saved.answers[index] === 'string' ? saved.answers[index].slice(0, 2000) : '');
            currentIndex = Math.min(Math.max(Number(saved.currentIndex) || 0, 0), totalQuestions - 1);
            return saved.completed === true;
        } catch (error) {
            return false;
        }
    }

    function setSaveStatus(message, icon = 'cloud_done') {
        const iconEl = elements.saveStatus?.querySelector('.material-symbols-outlined');
        const textEl = elements.saveStatus?.querySelector('span:last-child');
        if (iconEl) iconEl.textContent = icon;
        if (textEl) textEl.textContent = message;
    }

    function saveProgress(completed = isCompleted) {
        clearTimeout(saveTimer);
        answers[currentIndex] = elements.answer.value;
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                schema: 1,
                caseId: activeCase.id,
                currentIndex,
                answers,
                completed,
                updatedAt: new Date().toISOString()
            }));
            setSaveStatus('Đã lưu tự động');
            return true;
        } catch (error) {
            setSaveStatus('Không thể lưu trên thiết bị', 'cloud_off');
            return false;
        }
    }

    function refreshAnswerState() {
        const value = elements.answer.value;
        answers[currentIndex] = value;
        elements.characterCount.textContent = `${value.length}/2000`;
        elements.next.disabled = !value.trim();
        if (value.trim()) elements.answerError.classList.add('hidden');
    }

    function renderQuestion(options = {}) {
        const question = activeCase.questions[currentIndex];
        const number = currentIndex + 1;
        const progress = (number / totalQuestions) * 100;
        const isLastQuestion = number === totalQuestions;

        elements.progressLabel.textContent = `Câu hỏi ${number}/${totalQuestions}`;
        elements.progress.setAttribute('aria-valuenow', String(number));
        elements.progress.setAttribute('aria-valuemax', String(totalQuestions));
        elements.progressBar.style.width = `${progress}%`;
        elements.questionNumber.textContent = `Câu ${number}`;
        elements.questionTitle.textContent = question.title;
        elements.questionHelper.textContent = question.helper;
        elements.answer.value = answers[currentIndex];
        elements.previous.disabled = currentIndex === 0;
        elements.nextLabel.textContent = isLastQuestion ? 'Kết thúc case' : 'Câu tiếp theo';
        elements.nextIcon.textContent = isLastQuestion ? 'task_alt' : 'arrow_forward';
        elements.answerError.classList.add('hidden');
        refreshAnswerState();

        if (options.focusQuestion) {
            elements.questionTitle.focus({ preventScroll: true });
            const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            elements.questionTitle.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
    }

    function showComplete() {
        isCompleted = true;
        workspace.classList.add('hidden');
        completeView.classList.remove('hidden');
        elements.completeMessage.textContent = `Bạn đã trả lời ${totalQuestions} câu hỏi của case “${activeCase.title}”. Câu trả lời vẫn được lưu trên thiết bị này.`;
        document.title = `Hoàn thành ${activeCase.title} - Nexora AI`;
        elements.completeTitle.focus();
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    function goToQuestion(nextIndex) {
        saveProgress(false);
        currentIndex = Math.min(Math.max(nextIndex, 0), totalQuestions - 1);
        renderQuestion({ focusQuestion: true });
    }

    elements.answer.addEventListener('input', () => {
        refreshAnswerState();
        setSaveStatus('Đang lưu...', 'cloud_sync');
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => saveProgress(false), 350);
    });

    elements.answer.addEventListener('blur', () => saveProgress(false));

    elements.previous.addEventListener('click', () => {
        if (currentIndex > 0) goToQuestion(currentIndex - 1);
    });

    elements.next.addEventListener('click', () => {
        if (!elements.answer.value.trim()) {
            elements.answerError.classList.remove('hidden');
            elements.answer.setAttribute('aria-invalid', 'true');
            elements.answer.focus();
            return;
        }

        elements.answer.removeAttribute('aria-invalid');
        answers[currentIndex] = elements.answer.value;

        if (currentIndex === totalQuestions - 1) {
            saveProgress(true);
            showComplete();
            return;
        }

        goToQuestion(currentIndex + 1);
    });

    elements.restart.addEventListener('click', () => {
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            // The case can still restart in memory when storage is unavailable.
        }
        answers = Array(totalQuestions).fill('');
        currentIndex = 0;
        isCompleted = false;
        completeView.classList.add('hidden');
        workspace.classList.remove('hidden');
        document.title = `${activeCase.title} - Nexora AI`;
        renderQuestion({ focusQuestion: true });
    });

    window.addEventListener('beforeunload', () => saveProgress(isCompleted));

    elements.title.textContent = activeCase.title;
    elements.description.textContent = activeCase.description;
    elements.category.textContent = activeCase.category;
    elements.difficulty.textContent = activeCase.difficulty;
    elements.duration.textContent = activeCase.duration;
    document.title = `${activeCase.title} - Nexora AI`;

    const wasCompleted = readSavedProgress();
    isCompleted = wasCompleted;
    if (wasCompleted) showComplete();
    else renderQuestion();
})();
