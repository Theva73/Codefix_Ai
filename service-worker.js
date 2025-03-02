// service-worker.js

// Give your cache a name and version
const CACHE_NAME = 'ai-code-fixer-v1';

// List all the files you want to cache for offline use
const FILES_TO_CACHE = [
  './',             // Represents index.html if your SW is in the same directory
  './index.html',
  './manifest.json',
  // Add other files you need offline, for example:
  // './styles.css',
  // './icons/icon-192.png',
  // './icons/icon-512.png'
];

// Install event: Cache the listed files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Make the new service worker active immediately
  self.skipWaiting();
});

// Activate event: Clear out old caches if the name/version changes
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Respond with cache first, then network if not in cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // If a matching cache entry is found, return it; otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});