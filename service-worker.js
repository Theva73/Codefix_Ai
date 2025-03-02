// service-worker.js

// Give your cache a unique name and version
const CACHE_NAME = 'ai-code-fixer-v1';

// List the files you want cached for offline use
const FILES_TO_CACHE = [
  './',             // Represents index.html if the SW is in the same directory
  './index.html',
  './manifest.json',
  // Add other files you want offline, for example:
  // './styles.css',
  // './icons/icon-192.png',
  // './icons/icon-512.png'
];

// Install event: Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Make the new service worker take control immediately
  self.skipWaiting();
});

// Activate event: Clean up old caches if you deploy a new version
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
  // Start controlling all open clients without a refresh
  self.clients.claim();
});

// Fetch event: Serve cached files first, then fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});