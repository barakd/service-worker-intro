const CACHE_KEY = 'chezzy-cache-7';
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

// Intercepting Incoming requests and cache them
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

// Handling Push Notfication
self.addEventListener('push', function (event) {
    const message = event.data.json();
    message.actions = [{
            action: "book_room",
            title: 'Book Now!',
            icon: 'assets/icons/ok.png'
    },
    {
        action: "no",
        title: 'Cancel',
        icon: 'assets/icons/close.png'
    }
    ];

    event.waitUntil(self.registration.showNotification("New Room Avialable!", message));
});

// Handlling a notifcation action
self.addEventListener('notificationclick', function (event) {
    const data = event.notification.data;

    event.notification.close();
    if (event.action === "book_room") {
        clients.openWindow("/?roomId=" + data.roomId);          
    }
    
})

// Handling background sync
self.addEventListener('sync', function(event) {
    if (event.tag == 'myFirstSync') {
      event.waitUntil(doSomeStuff());
    }
  });