const CACHE_NAME = 'fanfanqiang-cache-v1';
const urlsToCache = [
  '/index.html',
  '/style.css',
  '/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Stale-while-revalidate strategy for the content
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Fetch the new version in the background
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Ignore fetch errors
        });
        
        // Return cached version if exists, otherwise wait for network
        return response || fetchPromise;
      })
  );
});
