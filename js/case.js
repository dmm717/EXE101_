/* ============================================
   NEXORA - CASE WORKSPACE CONTROLLER
   ============================================ */

(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('id');
    const library = window.NexoraCaseLibrary || {};
    const activeCase = caseId ? library[caseId] : null;
    const answerLetters = ['A', 'B', 'C', 'D'];

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
        options: document.getElementById('case-options'),
        answerError: document.getElementById('case-answer-error'),
        feedback: document.getElementById('case-feedback'),
        previous: document.getElementById('case-previous'),
        next: document.getElementById('case-next'),
        nextLabel: document.getElementById('case-next-label'),
        nextIcon: document.getElementById('case-next-icon'),
        saveStatus: document.getElementById('case-save-status'),
        completeTitle: document.getElementById('case-complete-title'),
        completeMessage: document.getElementById('case-complete-message'),
        scoreSummary: document.getElementById('case-score-summary'),
        restart: document.getElementById('case-restart')
    };

    const storageKey = `nexora_case_quiz_v1:${activeCase.id}`;
    const totalQuestions = activeCase.questions.length;
    let currentIndex = 0;
    let selectedAnswers = Array(totalQuestions).fill('');
    let checkedAnswers = Array(totalQuestions).fill(false);
    let isCompleted = false;

    function isValidAnswer(value) {
        return answerLetters.includes(value);
    }

    function getQuestion(index = currentIndex) {
        return activeCase.questions[index];
    }

    function getCorrectAnswer(question) {
        return isValidAnswer(question.correctAnswer) ? question.correctAnswer : 'A';
    }

    function getOptionText(question, letter) {
        const optionIndex = answerLetters.indexOf(letter);
        return question.options?.[optionIndex] || '';
    }

    function isCorrect(index) {
        const question = getQuestion(index);
        return selectedAnswers[index] === getCorrectAnswer(question);
    }

    function getResult() {
        const correct = selectedAnswers.reduce((count, answer, index) => {
            return count + (answer && answer === getCorrectAnswer(getQuestion(index)) ? 1 : 0);
        }, 0);
        const incorrect = totalQuestions - correct;
        const score = totalQuestions ? Math.round((correct / totalQuestions) * 100) / 10 : 0;
        return { correct, incorrect, score };
    }

    function setSaveStatus(message, icon = 'cloud_done') {
        const iconEl = elements.saveStatus?.querySelector('.material-symbols-outlined');
        const textEl = elements.saveStatus?.querySelector('span:last-child');
        if (iconEl) iconEl.textContent = icon;
        if (textEl) textEl.textContent = message;
    }

    function saveProgress(completed = isCompleted) {
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                schema: 1,
                caseId: activeCase.id,
                currentIndex,
                selectedAnswers,
                checkedAnswers,
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

    function readSavedProgress() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (!saved || saved.schema !== 1 || saved.caseId !== activeCase.id) return false;
            if (Array.isArray(saved.selectedAnswers)) {
                selectedAnswers = selectedAnswers.map((_, index) => {
                    const savedAnswer = saved.selectedAnswers[index];
                    return isValidAnswer(savedAnswer) ? savedAnswer : '';
                });
            }
            if (Array.isArray(saved.checkedAnswers)) {
                checkedAnswers = checkedAnswers.map((_, index) => saved.checkedAnswers[index] === true);
            }
            currentIndex = Math.min(Math.max(Number(saved.currentIndex) || 0, 0), totalQuestions - 1);
            return saved.completed === true;
        } catch (error) {
            return false;
        }
    }

    function renderOptions(question) {
        elements.options.querySelectorAll('.case-option').forEach((option) => option.remove());
        const selectedAnswer = selectedAnswers[currentIndex];
        const isLocked = checkedAnswers[currentIndex];

        answerLetters.forEach((letter, index) => {
            const label = document.createElement('label');
            label.className = 'case-option';
            if (selectedAnswer === letter) label.classList.add('is-selected');
            if (isLocked) label.classList.add('is-locked');

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'case-answer';
            input.value = letter;
            input.checked = selectedAnswer === letter;
            input.disabled = isLocked;
            input.setAttribute('aria-label', `Đáp án ${letter}`);

            const badge = document.createElement('span');
            badge.className = 'case-option-letter';
            badge.textContent = letter;
            badge.setAttribute('aria-hidden', 'true');

            const text = document.createElement('span');
            text.className = 'case-option-text';
            text.textContent = question.options[index];

            label.append(input, badge, text);
            elements.options.append(label);
        });
    }

    function updateSelectionState() {
        const selectedAnswer = selectedAnswers[currentIndex];
        elements.options.querySelectorAll('.case-option').forEach((option) => {
            const input = option.querySelector('input');
            option.classList.toggle('is-selected', input?.value === selectedAnswer);
        });
        elements.next.disabled = !selectedAnswer;
        if (selectedAnswer) elements.answerError.classList.add('hidden');
    }

    function showFeedback() {
        const question = getQuestion();
        const selectedAnswer = selectedAnswers[currentIndex];
        const correctAnswer = getCorrectAnswer(question);
        const correct = selectedAnswer === correctAnswer;
        const correctText = getOptionText(question, correctAnswer);

        elements.feedback.classList.remove('hidden', 'is-correct', 'is-incorrect');
        elements.feedback.classList.add(correct ? 'is-correct' : 'is-incorrect');
        elements.feedback.textContent = correct
            ? `Đúng. ${question.explanation}`
            : `Sai. Đáp án đúng là ${correctAnswer}: ${correctText}. ${question.explanation}`;
    }

    function hideFeedback() {
        elements.feedback.classList.add('hidden');
        elements.feedback.classList.remove('is-correct', 'is-incorrect');
        elements.feedback.textContent = '';
    }

    function updateNextButtonLabel() {
        const isLastQuestion = currentIndex === totalQuestions - 1;
        if (!checkedAnswers[currentIndex]) {
            elements.nextLabel.textContent = 'Kiểm tra đáp án';
            elements.nextIcon.textContent = 'fact_check';
            return;
        }

        elements.nextLabel.textContent = isLastQuestion ? 'Kết thúc case' : 'Câu tiếp theo';
        elements.nextIcon.textContent = isLastQuestion ? 'task_alt' : 'arrow_forward';
    }

    function renderQuestion(options = {}) {
        const question = getQuestion();
        const number = currentIndex + 1;
        const progress = (number / totalQuestions) * 100;

        elements.progressLabel.textContent = `Câu hỏi ${number}/${totalQuestions}`;
        elements.progress.setAttribute('aria-valuenow', String(number));
        elements.progress.setAttribute('aria-valuemax', String(totalQuestions));
        elements.progressBar.style.width = `${progress}%`;
        elements.questionNumber.textContent = `Câu ${number}`;
        elements.questionTitle.textContent = question.title;
        elements.questionHelper.textContent = question.helper;
        elements.previous.disabled = currentIndex === 0;
        elements.answerError.classList.add('hidden');

        renderOptions(question);
        updateSelectionState();
        updateNextButtonLabel();
        if (checkedAnswers[currentIndex]) showFeedback();
        else hideFeedback();

        if (options.focusQuestion) {
            elements.questionTitle.focus({ preventScroll: true });
            const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            elements.questionTitle.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
    }

    function renderScoreSummary() {
        const result = getResult();
        const scoreText = Number.isInteger(result.score) ? `${result.score}` : result.score.toFixed(1);
        elements.scoreSummary.innerHTML = `
            <div class="case-score-item">
                <span class="case-score-value">${result.correct}</span>
                <span class="case-score-label">Câu đúng</span>
            </div>
            <div class="case-score-item">
                <span class="case-score-value">${result.incorrect}</span>
                <span class="case-score-label">Câu sai</span>
            </div>
            <div class="case-score-item">
                <span class="case-score-value">${scoreText}/10</span>
                <span class="case-score-label">Tổng điểm</span>
            </div>
        `;
    }

    function showComplete() {
        isCompleted = true;
        const result = getResult();
        workspace.classList.add('hidden');
        completeView.classList.remove('hidden');
        elements.completeMessage.textContent = `Bạn đã hoàn thành ${totalQuestions} câu hỏi của case “${activeCase.title}”: đúng ${result.correct}, sai ${result.incorrect}.`;
        renderScoreSummary();
        document.title = `Hoàn thành ${activeCase.title} - Nexora AI`;
        elements.completeTitle.focus();
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    function goToQuestion(nextIndex) {
        saveProgress(false);
        currentIndex = Math.min(Math.max(nextIndex, 0), totalQuestions - 1);
        renderQuestion({ focusQuestion: true });
    }

    elements.options.addEventListener('change', (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || input.name !== 'case-answer') return;
        if (checkedAnswers[currentIndex]) {
            input.checked = selectedAnswers[currentIndex] === input.value;
            updateSelectionState();
            return;
        }
        selectedAnswers[currentIndex] = input.value;
        checkedAnswers[currentIndex] = false;
        isCompleted = false;
        hideFeedback();
        updateSelectionState();
        updateNextButtonLabel();
        setSaveStatus('Đang lưu...', 'cloud_sync');
        saveProgress(false);
    });

    elements.previous.addEventListener('click', () => {
        if (currentIndex > 0) goToQuestion(currentIndex - 1);
    });

    elements.next.addEventListener('click', () => {
        if (!selectedAnswers[currentIndex]) {
            elements.answerError.classList.remove('hidden');
            const firstOption = elements.options.querySelector('input');
            firstOption?.focus();
            return;
        }

        if (!checkedAnswers[currentIndex]) {
            checkedAnswers[currentIndex] = true;
            showFeedback();
            updateNextButtonLabel();
            saveProgress(false);
            return;
        }

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
        selectedAnswers = Array(totalQuestions).fill('');
        checkedAnswers = Array(totalQuestions).fill(false);
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
