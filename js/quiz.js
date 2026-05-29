// 過去問演習システム
class QuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.markedQuestions = new Set();
        this.startTime = null;
        this.endTime = null;
        this.timer = null;
        this.timeLimit = null;
        this.timeRemaining = 0;
        
        this.initializeEventListeners();
        this.loadQuizHistory();
    }

    // イベントリスナーの初期化
    initializeEventListeners() {
        // 全科目選択チェックボックス
        const allSubjectsCheckbox = document.getElementById('subject-all');
        const subjectCheckboxes = document.querySelectorAll('.subject-checkbox');
        
        if (allSubjectsCheckbox) {
            allSubjectsCheckbox.addEventListener('change', (e) => {
                subjectCheckboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
            });
        }

        // 個別科目チェックボックス
        subjectCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedCount = document.querySelectorAll('.subject-checkbox:checked').length;
                if (allSubjectsCheckbox) {
                    allSubjectsCheckbox.checked = checkedCount === subjectCheckboxes.length;
                }
            });
        });

        // クイズ開始ボタン
        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', () => this.startQuiz());
        }

        // 問題ナビゲーション
        const prevButton = document.getElementById('prev-question');
        const nextButton = document.getElementById('next-question');
        const submitButton = document.getElementById('submit-quiz');

        if (prevButton) {
            prevButton.addEventListener('click', () => this.previousQuestion());
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextQuestion());
        }
        if (submitButton) {
            submitButton.addEventListener('click', () => this.submitQuiz());
        }

        // 問題マーク機能
        const markButton = document.getElementById('mark-question');
        if (markButton) {
            markButton.addEventListener('click', () => this.toggleQuestionMark());
        }

        // 問題一覧モーダル
        const showListButton = document.getElementById('show-question-list');
        const closeModal = document.querySelector('.close-modal');

        if (showListButton) {
            showListButton.addEventListener('click', () => this.showQuestionList());
        }
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeQuestionList());
        }

        // 演習終了ボタン
        const quitButton = document.getElementById('quit-quiz');
        if (quitButton) {
            quitButton.addEventListener('click', () => {
                if (confirm('演習を終了しますか？進捗は失われます。')) {
                    this.resetQuiz();
                }
            });
        }

        // 新しいクイズ / 再挑戦ボタン
        const newQuizButton = document.getElementById('new-quiz');
        if (newQuizButton) {
            newQuizButton.addEventListener('click', () => this.resetQuiz());
        }
        const retryQuizButton = document.getElementById('retry-quiz');
        if (retryQuizButton) {
            retryQuizButton.addEventListener('click', () => {
                if (this.currentQuiz) {
                    // 同じ科目・設定で再度開始
                    const savedQuiz = this.currentQuiz;
                    this.currentQuestionIndex = 0;
                    this.userAnswers = {};
                    this.markedQuestions = new Set();
                    this.startTime = Date.now();
                    this.timeRemaining = savedQuiz.timeLimit * 60;
                    this.showQuizInterface();
                    this.displayCurrentQuestion();
                    this.startTimer();
                } else {
                    this.resetQuiz();
                }
            });
        }
    }

    // クイズ履歴の読み込み
    loadQuizHistory() {
        try {
            const history = localStorage.getItem('quizHistory');
            if (history) {
                this.quizHistory = JSON.parse(history);
                this.displayQuizHistory();
            } else {
                this.quizHistory = [];
            }
        } catch (error) {
            console.error('クイズ履歴の読み込みエラー:', error);
            this.quizHistory = [];
        }
    }

    // クイズ履歴の保存
    saveQuizHistory() {
        try {
            localStorage.setItem('quizHistory', JSON.stringify(this.quizHistory));
        } catch (error) {
            console.error('クイズ履歴の保存エラー:', error);
        }
    }

    // クイズ履歴の表示
    displayQuizHistory() {
        const historyContainer = document.getElementById('quiz-history');
        if (!historyContainer || this.quizHistory.length === 0) return;

        const recentHistory = this.quizHistory.slice(0, 5);
        historyContainer.innerHTML = recentHistory.map(record => `
            <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium">
                        ${record.subjects.map(s => QUIZ_DATA[s]?.[0]?.subjectName || s).join(', ')}
                    </span>
                    <span class="text-sm text-gray-500">
                        ${new Date(record.date).toLocaleDateString('ja-JP')}
                    </span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>問題数: ${record.totalQuestions}</span>
                    <span>正答率: ${Math.round((record.correctAnswers / record.totalQuestions) * 100)}%</span>
                    <span>時間: ${Math.floor(record.timeSpent / 60)}分${record.timeSpent % 60}秒</span>
                </div>
            </div>
        `).join('');
    }

    // クイズ開始
    startQuiz() {
        const selectedSubjects = this.getSelectedSubjects();
        if (selectedSubjects.length === 0) {
            alert('少なくとも1つの科目を選択してください。');
            return;
        }

        // ラジオボタンから問題数を取得
        const questionCountEl = document.querySelector('input[name="questionCount"]:checked');
        const rawCount = questionCountEl ? questionCountEl.value : '10';
        const questionCount = rawCount === 'all' ? Infinity : parseInt(rawCount);

        // ラジオボタンから出題モードを取得
        const questionModeEl = document.querySelector('input[name="quizMode"]:checked');
        const questionMode = questionModeEl ? questionModeEl.value : 'random';

        // 制限時間の取得（チェックボックス+セレクト）
        const timeLimitEnabled = document.getElementById('timeLimit') && document.getElementById('timeLimit').checked;
        const timeLimit = timeLimitEnabled ? parseInt(document.getElementById('timeLimitSelect')?.value || '60') : 0;

        // 選択された科目から問題を取得
        let allQuestions = this.getQuestionsFromSubjects(selectedSubjects);

        // 間違えた問題モードのフィルタリング
        if (questionMode === 'wrong') {
            const wrongIds = new Set(
                this.quizHistory.flatMap(h => (h.results?.wrongAnswers || []).map(w => w.question?.id))
            );
            allQuestions = allQuestions.filter(q => wrongIds.has(q.id));
            if (allQuestions.length === 0) {
                alert('間違えた問題の記録がありません。別のモードを選択してください。');
                return;
            }
        }

        if (allQuestions.length === 0) {
            alert('選択された科目に問題がありません。');
            return;
        }

        // 問題をシャッフルまたは順番に配列
        let questions;
        if (questionMode === 'random') {
            questions = this.shuffleArray([...allQuestions]);
        } else {
            questions = [...allQuestions];
        }

        // 指定された問題数に制限
        if (isFinite(questionCount) && questionCount < questions.length) {
            questions = questions.slice(0, questionCount);
        }

        // クイズオブジェクトを作成
        this.currentQuiz = {
            questions: questions,
            subjects: selectedSubjects,
            timeLimit: timeLimit,
            mode: questionMode
        };

        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.markedQuestions = new Set();
        this.startTime = Date.now();
        this.timeRemaining = timeLimit * 60; // 分を秒に変換

        // UIを更新
        this.showQuizInterface();
        this.displayCurrentQuestion();
        this.startTimer();
    }

    // 選択された科目を取得
    getSelectedSubjects() {
        const checkboxes = document.querySelectorAll('.subject-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // 科目から問題を取得
    getQuestionsFromSubjects(subjects) {
        let questions = [];
        subjects.forEach(subject => {
            if (QUIZ_DATA[subject]) {
                questions = questions.concat(QUIZ_DATA[subject]);
            }
        });
        return questions;
    }

    // 配列をシャッフル（Fisher-Yates アルゴリズム）
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // クイズインターフェースを表示
    showQuizInterface() {
        document.getElementById('quiz-setup').classList.add('hidden');
        document.getElementById('quiz-taking').classList.remove('hidden');
        document.getElementById('quiz-results').classList.add('hidden');
    }

    // 現在の問題を表示
    displayCurrentQuestion() {
        if (!this.currentQuiz || this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            return;
        }

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionContainer = document.getElementById('current-question');
        
        if (!questionContainer) return;

        // 問題番号と進捗
        document.getElementById('question-number').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.currentQuiz.questions.length;
        
        // 進捗バーの更新
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;

        // 問題の表示
        questionContainer.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-sm text-gray-600">${question.subjectName} (${question.year}年)</span>
                    <span class="text-sm text-gray-600 difficulty-${question.difficulty}">
                        ${this.getDifficultyText(question.difficulty)}
                    </span>
                </div>
                <h3 class="text-lg font-semibold mb-4">${question.question}</h3>
                <div class="space-y-3">
                    ${question.options.map((option, index) => `
                        <label class="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="answer" value="${index}" class="mt-1 mr-3" ${this.userAnswers[question.id] === index ? 'checked' : ''}>
                            <span>${String.fromCharCode(65 + index)}. ${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // ラジオボタンのイベントリスナー
        const radioButtons = questionContainer.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                this.userAnswers[question.id] = parseInt(radio.value);
            });
        });

        // マークボタンの更新
        const markButton = document.getElementById('mark-question');
        if (markButton) {
            const isMarked = this.markedQuestions.has(question.id);
            markButton.innerHTML = isMarked ? 
                '<i class="fas fa-bookmark text-yellow-500"></i> マーク済み' : 
                '<i class="far fa-bookmark"></i> マーク';
        }

        // ナビゲーションボタンの更新
        this.updateNavigationButtons();
    }

    // 難易度テキストを取得
    getDifficultyText(difficulty) {
        const texts = {
            'easy': '基礎',
            'medium': '標準',
            'hard': '発展'
        };
        return texts[difficulty] || '標準';
    }

    // ナビゲーションボタンの更新
    updateNavigationButtons() {
        const prevButton = document.getElementById('prev-question');
        const nextButton = document.getElementById('next-question');
        const submitButton = document.getElementById('submit-quiz');

        if (prevButton) {
            prevButton.disabled = this.currentQuestionIndex === 0;
        }

        if (nextButton && submitButton) {
            const isLastQuestion = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
            nextButton.style.display = isLastQuestion ? 'none' : 'inline-block';
            submitButton.style.display = isLastQuestion ? 'inline-block' : 'none';
        }
    }

    // 前の問題へ
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }

    // 次の問題へ
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        }
    }

    // 問題をマーク/マーク解除
    toggleQuestionMark() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        if (this.markedQuestions.has(question.id)) {
            this.markedQuestions.delete(question.id);
        } else {
            this.markedQuestions.add(question.id);
        }
        this.displayCurrentQuestion();
    }

    // 問題一覧を表示
    showQuestionList() {
        const modal = document.getElementById('question-list-modal');
        const listContainer = document.getElementById('question-list');
        
        if (!modal || !listContainer) return;

        listContainer.innerHTML = this.currentQuiz.questions.map((question, index) => {
            const isAnswered = this.userAnswers.hasOwnProperty(question.id);
            const isMarked = this.markedQuestions.has(question.id);
            const isCurrent = index === this.currentQuestionIndex;

            return `
                <button class="question-item p-3 border rounded-lg text-left w-full hover:bg-gray-50 ${isCurrent ? 'bg-blue-50 border-blue-300' : ''}" 
                        data-index="${index}">
                    <div class="flex justify-between items-center">
                        <span class="font-medium">問題 ${index + 1}</span>
                        <div class="flex space-x-2">
                            ${isAnswered ? '<span class="text-green-600"><i class="fas fa-check"></i></span>' : ''}
                            ${isMarked ? '<span class="text-yellow-500"><i class="fas fa-bookmark"></i></span>' : ''}
                        </div>
                    </div>
                    <div class="text-sm text-gray-600 mt-1">${question.subjectName}</div>
                </button>
            `;
        }).join('');

        // 問題選択のイベントリスナー
        listContainer.querySelectorAll('.question-item').forEach(item => {
            item.addEventListener('click', () => {
                this.currentQuestionIndex = parseInt(item.dataset.index);
                this.displayCurrentQuestion();
                this.closeQuestionList();
            });
        });

        modal.classList.remove('hidden');
    }

    // 問題一覧を閉じる
    closeQuestionList() {
        const modal = document.getElementById('question-list-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // タイマー開始
    startTimer() {
        if (this.timeRemaining <= 0) return;

        // タイマー表示を出す
        const timerWrapper = document.getElementById('timer-wrapper');
        if (timerWrapper) timerWrapper.classList.remove('hidden');

        this.updateTimerDisplay();
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.submitQuiz();
            }
        }, 1000);
    }

    // タイマー表示の更新
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;

        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timerElement.textContent = timeString;

        // 残り時間が少ない場合の警告表示
        if (this.timeRemaining <= 300) { // 5分以下
            timerElement.classList.add('text-red-600', 'font-bold');
        } else if (this.timeRemaining <= 600) { // 10分以下
            timerElement.classList.add('text-yellow-600', 'font-bold');
        }
    }

    // クイズ提出
    submitQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.endTime = Date.now();
        const timeSpent = Math.floor((this.endTime - this.startTime) / 1000);

        // 結果を計算
        const results = this.calculateResults();
        
        // 履歴に保存
        const quizRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            subjects: this.currentQuiz.subjects,
            totalQuestions: this.currentQuiz.questions.length,
            correctAnswers: results.correctCount,
            timeSpent: timeSpent,
            timeLimit: this.currentQuiz.timeLimit,
            results: results
        };

        this.quizHistory.unshift(quizRecord);
        if (this.quizHistory.length > 50) {
            this.quizHistory = this.quizHistory.slice(0, 50);
        }
        this.saveQuizHistory();

        // 結果画面を表示
        this.showResults(results, timeSpent);
    }

    // 結果計算
    calculateResults() {
        let correctCount = 0;
        let wrongAnswers = [];
        let subjectStats = {};

        // 科目別統計の初期化
        this.currentQuiz.subjects.forEach(subject => {
            if (QUIZ_DATA[subject] && QUIZ_DATA[subject][0]) {
                subjectStats[subject] = {
                    name: QUIZ_DATA[subject][0].subjectName,
                    total: 0,
                    correct: 0
                };
            }
        });

        this.currentQuiz.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) {
                correctCount++;
            } else {
                wrongAnswers.push({
                    question: question,
                    userAnswer: userAnswer,
                    correctAnswer: question.correctAnswer
                });
            }

            // 科目別統計を更新
            if (subjectStats[question.subject]) {
                subjectStats[question.subject].total++;
                if (isCorrect) {
                    subjectStats[question.subject].correct++;
                }
            }
        });

        return {
            correctCount,
            totalCount: this.currentQuiz.questions.length,
            wrongAnswers,
            subjectStats
        };
    }

    // 結果表示
    showResults(results, timeSpent) {
        document.getElementById('quiz-taking').classList.add('hidden');
        document.getElementById('quiz-results').classList.remove('hidden');

        const percentage = Math.round((results.correctCount / results.totalCount) * 100);

        // 基本統計
        document.getElementById('final-score').textContent = `${results.correctCount}/${results.totalCount}`;
        document.getElementById('final-percentage').textContent = `${percentage}%`;
        document.getElementById('time-spent').textContent = `${Math.floor(timeSpent / 60)}分${timeSpent % 60}秒`;

        // 科目別結果
        const subjectResultsContainer = document.getElementById('subject-results');
        if (subjectResultsContainer) {
            subjectResultsContainer.innerHTML = Object.entries(results.subjectStats).map(([key, stats]) => `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span class="font-medium">${stats.name}</span>
                    <span class="text-sm">
                        ${stats.correct}/${stats.total} 
                        (${stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)
                    </span>
                </div>
            `).join('');
        }

        // 間違えた問題
        const wrongAnswersContainer = document.getElementById('wrong-answers');
        if (wrongAnswersContainer && results.wrongAnswers.length > 0) {
            wrongAnswersContainer.innerHTML = results.wrongAnswers.map((item, index) => {
                const userAnswerText = item.userAnswer !== undefined ? 
                    item.question.options[item.userAnswer] : '未回答';
                const correctAnswerText = item.question.options[item.question.correctAnswer];

                return `
                    <div class="border border-red-200 rounded-lg p-4 mb-4">
                        <div class="mb-3">
                            <div class="text-sm text-gray-600 mb-2">${item.question.subjectName}</div>
                            <div class="font-medium">${item.question.question}</div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-red-600">
                                <strong>あなたの回答:</strong> ${userAnswerText}
                            </div>
                            <div class="text-green-600">
                                <strong>正解:</strong> ${correctAnswerText}
                            </div>
                            <div class="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                <strong>解説:</strong> ${item.question.explanation}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            wrongAnswersContainer.innerHTML = '<p class="text-green-600 text-center">全問正解です！</p>';
        }
    }

    // クイズリセット
    resetQuiz() {
        // タイマーをクリア
        if (this.timer) {
            clearInterval(this.timer);
        }

        // 状態をリセット
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.markedQuestions = new Set();
        this.startTime = null;
        this.endTime = null;
        this.timeRemaining = 0;

        // タイマー表示を隠す
        const timerWrapper = document.getElementById('timer-wrapper');
        if (timerWrapper) timerWrapper.classList.add('hidden');

        // UIをリセット
        document.getElementById('quiz-setup').classList.remove('hidden');
        document.getElementById('quiz-taking').classList.add('hidden');
        document.getElementById('quiz-results').classList.add('hidden');

        // 問題一覧モーダルを閉じる
        this.closeQuestionList();
    }
}

// DOMが読み込まれたらQuizSystemを初期化
document.addEventListener('DOMContentLoaded', () => {
    const quizSystem = new QuizSystem();
    
    // グローバルアクセス用（デバッグ用）
    window.quizSystem = quizSystem;
});