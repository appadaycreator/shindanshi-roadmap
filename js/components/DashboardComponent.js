/**
 * Main Dashboard Component
 * Manages the learning dashboard UI and interactions
 */
class DashboardComponent {
    constructor(appState, studyDataService) {
        this.appState = appState;
        this.studyDataService = studyDataService;
        this.progressChart = null;
        this.currentLang = 'ja';
        this.currentFontSize = 'base';
        
        this.init();
    }

    /**
     * Initialize dashboard component
     */
    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateCurrentDate();
        this.renderSubjectProgress();
        this.createProgressChart();
        
        console.log('✅ Dashboard component initialized');
    }

    /**
     * Load user data and preferences
     */
    loadUserData() {
        const studyData = this.studyDataService.loadStudyData();
        this.appState.updateStudyData(studyData);
        
        // Load preferences
        this.currentLang = localStorage.getItem('app_language') || 'ja';
        this.currentFontSize = localStorage.getItem('app_font_size') || 'base';
        
        this.setLanguage(this.currentLang);
        this.setFontSize(this.currentFontSize);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Exam date input
        const examDateInput = document.getElementById('examDate');
        if (examDateInput) {
            examDateInput.addEventListener('change', (e) => {
                this.updateExamDate(e.target.value);
            });
        }

        // Daily hours input
        const dailyHoursInput = document.getElementById('dailyHours');
        if (dailyHoursInput) {
            dailyHoursInput.addEventListener('input', (e) => {
                this.updateDailyHours(parseFloat(e.target.value));
            });
        }

        // Study record form
        const studyForm = document.getElementById('studyForm');
        if (studyForm) {
            studyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudyRecord();
            });
        }

        // Subject progress sliders
        const progressSliders = document.querySelectorAll('.progress-slider');
        progressSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateSubjectProgress(
                    e.target.dataset.subject,
                    parseInt(e.target.value)
                );
            });
        });

        // Language and font size controls
        this.setupPreferenceListeners();
    }

    /**
     * Setup preference control listeners
     */
    setupPreferenceListeners() {
        // Language selection
        const langButtons = document.querySelectorAll('[data-lang]');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.setLanguage(e.target.dataset.lang);
            });
        });

        // Font size controls
        const fontSizeButtons = document.querySelectorAll('[data-font-size]');
        fontSizeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.setFontSize(e.target.dataset.fontSize);
            });
        });
    }

    /**
     * Update exam date
     */
    updateExamDate(date) {
        const studyData = this.appState.getState('studyData');
        studyData.examDate = date;
        this.appState.updateStudyData(studyData);
        this.studyDataService.saveStudyData(studyData);
        
        this.updateRemainingDays();
    }

    /**
     * Update daily hours
     */
    updateDailyHours(hours) {
        const studyData = this.appState.getState('studyData');
        studyData.dailyHours = hours;
        this.appState.updateStudyData(studyData);
        this.studyDataService.saveStudyData(studyData);
    }

    /**
     * Add study record
     */
    addStudyRecord() {
        const subject = document.getElementById('studySubject').value;
        const hours = parseFloat(document.getElementById('studyHours').value);
        const memo = document.getElementById('studyMemo').value;

        if (!subject || !hours || hours <= 0) {
            alert('科目と学習時間を正しく入力してください。');
            return;
        }

        const studyData = this.appState.getState('studyData');
        const record = this.studyDataService.addStudyRecord(studyData, {
            subject,
            hours,
            memo
        });

        this.appState.updateStudyData(studyData);
        
        // Update UI
        this.renderSubjectProgress();
        this.updateProgressChart();
        this.renderStudyHistory();
        
        // Reset form
        document.getElementById('studyForm').reset();
        
        // Show success message
        this.showMessage('学習記録を追加しました！', 'success');
    }

    /**
     * Update subject progress
     */
    updateSubjectProgress(subjectCode, progress) {
        const studyData = this.appState.getState('studyData');
        this.studyDataService.updateSubjectProgress(studyData, subjectCode, progress);
        this.appState.updateStudyData(studyData);
        
        this.updateProgressChart();
        this.renderSubjectProgress();
    }

    /**
     * Render subject progress
     */
    renderSubjectProgress() {
        const studyData = this.appState.getState('studyData');
        const container = document.getElementById('subjectProgress');
        
        if (!container) return;

        const subjects = Object.entries(studyData.subjects);
        container.innerHTML = subjects.map(([code, subject]) => `
            <div class="bg-white p-4 rounded-lg shadow-sm border">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-semibold text-gray-800">${subject.name}</h3>
                    <span class="text-sm text-gray-600">${subject.progress}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                         style="width: ${subject.progress}%"></div>
                </div>
                <input type="range" 
                       class="progress-slider w-full" 
                       data-subject="${code}"
                       min="0" 
                       max="100" 
                       value="${subject.progress}">
                <div class="text-xs text-gray-500 mt-1">
                    学習時間: ${subject.hours.toFixed(1)}h
                    ${subject.lastStudied ? `| 最終学習: ${new Date(subject.lastStudied).toLocaleDateString('ja-JP')}` : ''}
                </div>
            </div>
        `).join('');

        // Re-attach event listeners for new sliders
        const newSliders = container.querySelectorAll('.progress-slider');
        newSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateSubjectProgress(
                    e.target.dataset.subject,
                    parseInt(e.target.value)
                );
            });
        });
    }

    /**
     * Create progress chart
     */
    createProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        const studyData = this.appState.getState('studyData');
        const subjects = Object.values(studyData.subjects);
        
        if (this.progressChart) {
            this.progressChart.destroy();
        }

        this.progressChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: subjects.map(s => s.name),
                datasets: [{
                    label: '進捗率',
                    data: subjects.map(s => s.progress),
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    /**
     * Update progress chart
     */
    updateProgressChart() {
        if (!this.progressChart) return;

        const studyData = this.appState.getState('studyData');
        const subjects = Object.values(studyData.subjects);
        
        this.progressChart.data.datasets[0].data = subjects.map(s => s.progress);
        this.progressChart.update();
    }

    /**
     * Update current date display
     */
    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            dateElement.textContent = now.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        }
        
        this.updateRemainingDays();
    }

    /**
     * Update remaining days to exam
     */
    updateRemainingDays() {
        const studyData = this.appState.getState('studyData');
        const remainingElement = document.getElementById('remainingDays');
        
        if (!remainingElement || !studyData.examDate) return;

        const today = new Date();
        const examDate = new Date(studyData.examDate);
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        remainingElement.textContent = diffDays > 0 ? `${diffDays}日` : '試験日を過ぎています';
    }

    /**
     * Set language
     */
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('app_language', lang);
        document.documentElement.lang = lang;
        
        // Update active button
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    /**
     * Set font size
     */
    setFontSize(size) {
        this.currentFontSize = size;
        localStorage.setItem('app_font_size', size);
        
        // Update body class
        document.body.className = document.body.className
            .replace(/text-\w+-size/g, '')
            .trim() + ` text-${size}-size`;
        
        // Update active button
        document.querySelectorAll('[data-font-size]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.fontSize === size);
        });
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type} fade-in`;
        messageElement.textContent = message;
        
        messageContainer.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    /**
     * Render study history
     */
    renderStudyHistory() {
        const studyData = this.appState.getState('studyData');
        const historyContainer = document.getElementById('studyHistory');
        
        if (!historyContainer) return;

        const recentRecords = this.studyDataService.getRecentStudyRecords(studyData, 5);
        
        historyContainer.innerHTML = recentRecords.length > 0 
            ? recentRecords.map(record => `
                <div class="bg-gray-50 p-3 rounded-lg">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="font-medium">${studyData.subjects[record.subject]?.name || record.subject}</span>
                            <span class="text-sm text-gray-600 ml-2">${record.hours}時間</span>
                        </div>
                        <span class="text-xs text-gray-500">
                            ${new Date(record.date).toLocaleDateString('ja-JP')}
                        </span>
                    </div>
                    ${record.memo ? `<p class="text-sm text-gray-600 mt-1">${record.memo}</p>` : ''}
                </div>
            `).join('')
            : '<p class="text-gray-500 text-center">学習記録がありません</p>';
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardComponent;
} else {
    window.DashboardComponent = DashboardComponent;
}