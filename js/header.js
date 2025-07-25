// ヘッダー用JavaScript
(function() {
    // 現在のページを特定してナビゲーションをハイライト
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.remove('text-gray-500');
            link.classList.add('text-blue-600', 'font-medium');
        }
    });

    // モバイルメニュー用のリンクも同様に処理
    const mobileLinks = document.querySelectorAll('#mobileMenu a');
    mobileLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('bg-blue-50', 'text-blue-600');
            link.classList.remove('text-gray-600');
        }
    });

    // モバイルメニューの開閉
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.classList.toggle('hamburger-active');
        });
    }

    // 言語選択の同期
    const langSelect = document.getElementById('langSelect');
    const langSelectMobile = document.getElementById('langSelectMobile');
    
    if (langSelect && langSelectMobile) {
        // 保存された言語を読み込み
        const savedLang = localStorage.getItem('language') || 'ja';
        langSelect.value = savedLang;
        langSelectMobile.value = savedLang;
        
        langSelect.addEventListener('change', (e) => {
            langSelectMobile.value = e.target.value;
            localStorage.setItem('language', e.target.value);
            // 言語変更処理をここに追加（i18n.jsがある場合）
            if (window.i18n && window.i18n.changeLanguage) {
                window.i18n.changeLanguage(e.target.value);
            }
        });
        
        langSelectMobile.addEventListener('change', (e) => {
            langSelect.value = e.target.value;
            localStorage.setItem('language', e.target.value);
            // 言語変更処理をここに追加（i18n.jsがある場合）
            if (window.i18n && window.i18n.changeLanguage) {
                window.i18n.changeLanguage(e.target.value);
            }
        });
    }

    // フォントサイズ選択の同期
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const fontSizeSelectMobile = document.getElementById('fontSizeSelectMobile');
    
    if (fontSizeSelect && fontSizeSelectMobile) {
        // 保存されたフォントサイズを読み込み
        const savedFontSize = localStorage.getItem('fontSize') || 'base';
        fontSizeSelect.value = savedFontSize;
        fontSizeSelectMobile.value = savedFontSize;
        document.body.classList.add('text-' + savedFontSize + '-size');
        
        fontSizeSelect.addEventListener('change', (e) => {
            fontSizeSelectMobile.value = e.target.value;
            document.body.className = document.body.className.replace(/text-\w+-size/g, '') + ' text-' + e.target.value + '-size';
            localStorage.setItem('fontSize', e.target.value);
        });
        
        fontSizeSelectMobile.addEventListener('change', (e) => {
            fontSizeSelect.value = e.target.value;
            document.body.className = document.body.className.replace(/text-\w+-size/g, '') + ' text-' + e.target.value + '-size';
            localStorage.setItem('fontSize', e.target.value);
        });
    }

    // ダークモード切り替え
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
    
    function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        
        if (darkModeToggle) {
            darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun text-yellow-500"></i>' : '<i class="fas fa-moon text-gray-600"></i>';
        }
        if (darkModeToggleMobile) {
            darkModeToggleMobile.innerHTML = isDark ? '<i class="fas fa-sun text-yellow-500"></i>' : '<i class="fas fa-moon text-gray-600"></i>';
        }
        
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', toggleDarkMode);
    }

    // 保存された設定の読み込み
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-sun text-yellow-500"></i>';
        if (darkModeToggleMobile) darkModeToggleMobile.innerHTML = '<i class="fas fa-sun text-yellow-500"></i>';
    }
})();