const CACHE_KEY = 'chezzy-cache';
const urlsToCache = [
    '/',
    '/index.html',
    '/scripts/main.js',

];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_KEY)
        .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            const fetchRequest = event.request.clone();
            return fetch(fetchRequest)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    responseToCache = response.clone();
                    caches.open(CACHE_KEY)
                          .then(cache => cache.put(event.request, responseToCache));
                    return response;
                });
        })
    );
});