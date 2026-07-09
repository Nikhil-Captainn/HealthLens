// sw.js - HealthLens Service Worker
const CACHE_NAME = 'healthlens-v1';

const urlsToCache = [
    '/',
    '/global.css',
    '/global.js',
    '/assets/Favicon_HealthLens.png',
    '/assets/light_mode_health_lens_favicon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

// REQUIRED BY CHROME TO TRIGGER PWA INSTALL
self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
});