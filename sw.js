// Service Worker for -m:≠Î<Ì¸…ﬁ√◊
const CACHE_NAME = 'shindanshi-roadmap-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/usage.html',
    '/function.html',
    '/css/common.css',
    '/css/style.css',
    '/css/responsive.css',
    '/css/themes.css',
    '/js/header.js',
    '/js/app.js',
    '/js/storage.js',
    '/js/calendar.js',
    '/js/i18n.js',
    '/js/pwa.js',
    '/assets/icons/favicon.ico',
    '/assets/icons/apple-touch-icon.png',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('=' Service Worker: §Ûπ»¸Î-...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('=Ê Service Worker: ≠„√∑Âí\-...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log(' Service Worker: §Ûπ»¸ÎåÜ');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('L Service Worker: §Ûπ»¸Î1W', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('=Ä Service Worker: ¢Ø∆£Ÿ¸»-...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('=— Service Worker: ‰D≠„√∑ÂíJd', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log(' Service Worker: ¢Ø∆£Ÿ¸»åÜ');
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
                    console.log('=æ ≠„√∑ÂKâ–õ:', event.request.url);
                    return response;
                }

                // Otherwise, fetch from network
                console.log('< Õ√»Ô¸ØKâ÷ó:', event.request.url);
                return fetch(event.request).then(
                    response => {
                        // Don't cache if not ok or not basic response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
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
                console.error('L Service Worker: Fetch1W', error);
                // Return a fallback response for navigation requests
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'study-data-sync') {
        console.log('= Service Worker: f“«¸øí-...');
        // Here you could implement background sync for study data
        // For now, just log the event
    }
});

// Push notifications (for future implementation)
self.addEventListener('push', event => {
    console.log('=È Service Worker: ◊√∑ÂÂ◊·');
    // Future implementation for study reminders
});

// Handle messages from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});