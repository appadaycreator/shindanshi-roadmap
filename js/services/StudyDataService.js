/**
 * Study Data Management Service
 * Handles all study-related data operations
 */
class StudyDataService {
    constructor() {
        this.defaultSubjects = {
            economics: { name: '経済学・経済政策', progress: 0, hours: 0, lastStudied: null },
            finance: { name: '財務・会計', progress: 0, hours: 0, lastStudied: null },
            management: { name: '企業経営理論', progress: 0, hours: 0, lastStudied: null },
            operations: { name: '運営管理', progress: 0, hours: 0, lastStudied: null },
            legal: { name: '経営法務', progress: 0, hours: 0, lastStudied: null },
            it: { name: '経営情報システム', progress: 0, hours: 0, lastStudied: null },
            policy: { name: '中小企業経営・政策', progress: 0, hours: 0, lastStudied: null }
        };
    }

    /**
     * Get default study data structure
     */
    getDefaultStudyData() {
        return {
            examDate: null,
            dailyHours: 2,
            subjects: { ...this.defaultSubjects },
            studyRecords: []
        };
    }

    /**
     * Load study data from localStorage
     */
    loadStudyData() {
        try {
            const saved = localStorage.getItem('study_data');
            if (saved) {
                const data = JSON.parse(saved);
                // Ensure all subjects exist
                return {
                    ...this.getDefaultStudyData(),
                    ...data,
                    subjects: { ...this.defaultSubjects, ...data.subjects }
                };
            }
            return this.getDefaultStudyData();
        } catch (error) {
            console.error('Error loading study data:', error);
            return this.getDefaultStudyData();
        }
    }

    /**
     * Save study data to localStorage
     */
    saveStudyData(data) {
        try {
            localStorage.setItem('study_data', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving study data:', error);
            return false;
        }
    }

    /**
     * Add study record
     */
    addStudyRecord(studyData, record) {
        const newRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...record
        };

        studyData.studyRecords.push(newRecord);
        
        // Update subject hours and last studied
        if (studyData.subjects[record.subject]) {
            studyData.subjects[record.subject].hours += record.hours;
            studyData.subjects[record.subject].lastStudied = newRecord.date;
        }

        this.saveStudyData(studyData);
        return newRecord;
    }

    /**
     * Update subject progress
     */
    updateSubjectProgress(studyData, subjectCode, progress) {
        if (studyData.subjects[subjectCode]) {
            studyData.subjects[subjectCode].progress = Math.max(0, Math.min(100, progress));
            this.saveStudyData(studyData);
            return true;
        }
        return false;
    }

    /**
     * Calculate total progress
     */
    getTotalProgress(studyData) {
        const subjects = Object.values(studyData.subjects);
        const totalProgress = subjects.reduce((sum, subject) => sum + subject.progress, 0);
        return Math.round(totalProgress / subjects.length);
    }

    /**
     * Get study statistics
     */
    getStudyStatistics(studyData) {
        const totalHours = Object.values(studyData.subjects)
            .reduce((sum, subject) => sum + subject.hours, 0);
        
        const totalDays = new Set(
            studyData.studyRecords.map(record => 
                new Date(record.date).toDateString()
            )
        ).size;

        const averageProgress = this.getTotalProgress(studyData);

        return {
            totalHours: Math.round(totalHours * 10) / 10,
            totalDays,
            averageProgress,
            recordCount: studyData.studyRecords.length
        };
    }

    /**
     * Get recent study records
     */
    getRecentStudyRecords(studyData, limit = 10) {
        return studyData.studyRecords
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    /**
     * Clear all study data
     */
    clearStudyData() {
        try {
            localStorage.removeItem('study_data');
            return true;
        } catch (error) {
            console.error('Error clearing study data:', error);
            return false;
        }
    }

    /**
     * Export study data
     */
    exportStudyData(studyData) {
        const exportData = {
            ...studyData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `study-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudyDataService;
} else {
    window.StudyDataService = StudyDataService;
}