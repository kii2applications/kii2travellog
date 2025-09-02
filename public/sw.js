const CACHE_NAME = 'county-day-tracker-v3';
const ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(ASSETS);
      } catch (e) {
        // no-op
      } finally {
        // Ensure new SW activates immediately
        self.skipWaiting();
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        );
      } catch (e) {
        // no-op
      } finally {
        // Take control of open pages
        clients.claim();
      }
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests
  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin)) return;

  // Navigation requests: network-first, fallback to cache or offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResp.clone());
          return networkResp;
        } catch (err) {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/');
          return fallback || new Response('You are offline.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        }
      })()
    );
    return;
  }

  // Static assets: cache-first, update in background
  event.respondWith(
    (async () => {
      try {
        const cached = await caches.match(request);
        if (cached) {
          // Update cache in background
          fetch(request)
            .then((resp) => {
              if (resp && resp.ok) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, resp.clone()));
              }
            })
            .catch(() => {});
          return cached;
        }
        const networkResp = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResp.clone());
        return networkResp;
      } catch (err) {
        // As a last resort, return an empty 504 to avoid uncaught rejections
        return new Response('', { status: 504 });
      }
    })()
  );
});
