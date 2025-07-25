/**
 * Centralized Application State Management
 * Provides reactive state management for the learning management system
 */
class AppState {
    constructor() {
        this.state = {
            studyData: null,
            quizHistory: [],
            preferences: {
                language: 'ja',
                fontSize: 'base',
                theme: 'light'
            },
            ui: {
                currentView: 'dashboard',
                loading: false,
                error: null
            }
        };
        
        this.listeners = new Map();
        this.initialized = false;
    }

    /**
     * Initialize application state
     */
    async init() {
        if (this.initialized) return;
        
        try {
            await this.loadState();
            this.initialized = true;
            this.notify('app:initialized', this.state);
        } catch (error) {
            console.error('Failed to initialize app state:', error);
            this.setState('ui.error', error.message);
        }
    }

    /**
     * Load state from localStorage
     */
    async loadState() {
        try {
            const studyData = localStorage.getItem('study_data');
            const quizHistory = localStorage.getItem('quizHistory');
            const language = localStorage.getItem('app_language');
            const fontSize = localStorage.getItem('app_font_size');

            this.state.studyData = studyData ? JSON.parse(studyData) : this.getDefaultStudyData();
            this.state.quizHistory = quizHistory ? JSON.parse(quizHistory) : [];
            this.state.preferences.language = language || 'ja';
            this.state.preferences.fontSize = fontSize || 'base';
        } catch (error) {
            console.error('Error loading state:', error);
            throw new Error('Failed to load application data');
        }
    }

    /**
     * Get default study data structure
     */
    getDefaultStudyData() {
        return {
            examDate: '',
            dailyHours: 2,
            subjects: {
                economics: { name: '経済学・経済政策', progress: 0, totalHours: 0, lastStudied: null },
                finance: { name: '財務・会計', progress: 0, totalHours: 0, lastStudied: null },
                management: { name: '企業経営理論', progress: 0, totalHours: 0, lastStudied: null },
                operations: { name: '運営管理', progress: 0, totalHours: 0, lastStudied: null },
                legal: { name: '経営法務', progress: 0, totalHours: 0, lastStudied: null },
                it: { name: '経営情報システム', progress: 0, totalHours: 0, lastStudied: null },
                policy: { name: '中小企業経営・政策', progress: 0, totalHours: 0, lastStudied: null }
            },
            studyRecords: []
        };
    }

    /**
     * Subscribe to state changes
     */
    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }

    /**
     * Notify listeners of state changes
     */
    notify(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event callback for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Get current state or specific path
     */
    getState(path = null) {
        if (!path) return this.state;
        
        return path.split('.').reduce((obj, key) => obj?.[key], this.state);
    }

    /**
     * Set state value and notify listeners
     */
    setState(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.state);
        
        if (target && lastKey) {
            target[lastKey] = value;
            this.notify(`state:${path}`, value);
            this.notify('state:changed', { path, value });
            this.saveState();
        }
    }

    /**
     * Update study data
     */
    updateStudyData(updates) {
        this.state.studyData = { ...this.state.studyData, ...updates };
        this.notify('studyData:updated', this.state.studyData);
        this.saveState();
    }

    /**
     * Add study record
     */
    addStudyRecord(record) {
        const newRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...record
        };
        
        this.state.studyData.studyRecords.push(newRecord);
        this.notify('studyRecord:added', newRecord);
        this.saveState();
    }

    /**
     * Add quiz result
     */
    addQuizResult(result) {
        const newResult = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...result
        };
        
        this.state.quizHistory.unshift(newResult);
        
        // Keep only last 50 results
        if (this.state.quizHistory.length > 50) {
            this.state.quizHistory = this.state.quizHistory.slice(0, 50);
        }
        
        this.notify('quizResult:added', newResult);
        this.saveState();
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem('study_data', JSON.stringify(this.state.studyData));
            localStorage.setItem('quizHistory', JSON.stringify(this.state.quizHistory));
            localStorage.setItem('app_language', this.state.preferences.language);
            localStorage.setItem('app_font_size', this.state.preferences.fontSize);
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    /**
     * Clear all data
     */
    clearData() {
        this.state.studyData = this.getDefaultStudyData();
        this.state.quizHistory = [];
        this.saveState();
        this.notify('data:cleared', null);
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppState;
} else {
    window.AppState = AppState;
}