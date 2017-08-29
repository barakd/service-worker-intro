const CACHE_KEY = 'chezzy-cache-v-1';
const urlsToCache = [
    '/',
    '/index.html',
    '/scripts/main.js',

];

// Installtion Phase
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

// Handling Resource updates
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(
            keys => (
                keys
                .filter(key => key !== CACHE_KEY)
                .map(key => caches.delete(key))
            )
        )
    );
});

// Intercepting Incoming requests and cache them
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            // we must clone the requests, as a stream can only be opened once, we want to open the stream twice, for response & cache
            const fetchRequest = event.request.clone();
            return fetch(fetchRequest)
                .then(response => {
                    if (!response || response.status !== 200 || response.type != 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_KEY)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
        })
    );
});

