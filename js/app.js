/**
 * Main Application Entry Point
 * Coordinates all components and services
 */
class App {
    constructor() {
        this.appState = null;
        this.studyDataService = null;
        this.dashboardComponent = null;
        this.initialized = false;
    }

    /**
     * Initialize application
     */
    async init() {
        if (this.initialized) return;

        try {
            console.log('🚀 中小企業診断士合格ロードマップ - 初期化開始');

            // Initialize core services
            this.appState = new AppState();
            this.studyDataService = new StudyDataService();
            
            // Initialize app state
            await this.appState.init();
            
            // Initialize dashboard if we're on the main page
            if (document.getElementById('dashboard')) {
                this.dashboardComponent = new DashboardComponent(
                    this.appState, 
                    this.studyDataService
                );
            }

            // Setup global event listeners
            this.setupGlobalListeners();
            
            this.initialized = true;
            console.log('✅ アプリケーション初期化完了');
            
        } catch (error) {
            console.error('❌ アプリケーション初期化エラー:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Service Worker registration
        this.registerServiceWorker();
        
        // Global error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        // Handle app state changes
        this.appState.subscribe('app:initialized', () => {
            console.log('App state initialized');
        });

        this.appState.subscribe('studyData:updated', (data) => {
            console.log('Study data updated');
        });
    }

    /**
     * Register Service Worker for PWA functionality
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('✅ Service Worker registered:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    console.log('Service Worker update found');
                });
                
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        // Show user-friendly error message
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>初期化エラー:</strong> アプリケーションの読み込みに失敗しました。
                    ページを再読み込みしてください。
                </div>
            `;
            errorContainer.classList.remove('hidden');
        }
    }

    /**
     * Get app instance (singleton pattern)
     */
    static getInstance() {
        if (!App._instance) {
            App._instance = new App();
        }
        return App._instance;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = App.getInstance();
    await app.init();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}