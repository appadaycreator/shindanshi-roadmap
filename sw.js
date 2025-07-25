// Service Worker for 中小企業診断士合格ロードマップ
const CACHE_NAME = 'shindanshi-roadmap-v1.1.0';

// Essential files to cache (using relative paths)
const urlsToCache = [
    './',
    './index.html',
    './quiz.html',
    './lp.html',
    './usage.html',
    './function.html',
    './css/common.css',
    './css/style.css',
    './css/responsive.css',
    './css/themes.css',
    './js/header.js',
    './js/app.js',
    './js/storage.js',
    './js/calendar.js',
    './js/quiz.js',
    './js/quiz-data.js',
    './js/i18n.js',
    './js/pwa.js',
    './assets/icons/favicon.ico',
    './assets/icons/apple-touch-icon.png'
];

// External resources to cache
const externalResources = [
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: インストール中...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: キャッシュ中...');
                
                // Cache local resources
                const localPromises = urlsToCache.map(url => {
                    return cache.add(url).catch(error => {
                        console.warn(`⚠️ Failed to cache local resource: ${url}`, error.message);
                        return Promise.resolve();
                    });
                });
                
                // Cache external resources
                const externalPromises = externalResources.map(url => {
                    return fetch(url, { mode: 'cors' })
                        .then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                            throw new Error(`Failed to fetch ${url}`);
                        })
                        .catch(error => {
                            console.warn(`⚠️ Failed to cache external resource: ${url}`, error.message);
                            return Promise.resolve();
                        });
                });
                
                return Promise.all([...localPromises, ...externalPromises]);
            })
            .then(() => {
                console.log('✅ Service Worker: インストール完了');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: インストールエラー', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: アクティベート中...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: 古いキャッシュ削除', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: アクティベート完了');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip Chrome extensions and other non-http requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Otherwise, fetch from network
                return fetch(event.request).then(
                    response => {
                        // Don't cache if not ok or opaque response (CORS)
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Don't cache non-basic responses unless they're from our external resources
                        if (response.type !== 'basic' && !externalResources.some(url => event.request.url.startsWith(url))) {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the response for future use
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
            .catch(error => {
                console.error('❌ Service Worker: Fetchエラー', error);
                // Return a fallback response for navigation requests
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'study-data-sync') {
        console.log('🔄 Service Worker: データ同期中...');
        // Here you could implement background sync for study data
        // For now, just log the event
    }
});

// Push notifications (for future implementation)
self.addEventListener('push', event => {
    console.log('📱 Service Worker: プッシュ通知受信');
    // Future implementation for study reminders
});

// Handle messages from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});