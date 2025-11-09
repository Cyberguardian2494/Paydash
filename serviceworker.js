const CACHE_NAME = 'paydash-cache-v2'; // Note: I changed this to 'v2'

// This list MUST exactly match your filenames.
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './icon-512.png',
  './manifest.json' // We should cache the manifest too
];

// The 'install' event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching all assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => console.error('Cache addAll failed:', err))
  );
});

// The 'fetch' event (cache-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If it's in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }
        // If not, fetch it from the network
        return fetch(event.request);
      })
  );
});

// The 'activate' event (cleans up old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});