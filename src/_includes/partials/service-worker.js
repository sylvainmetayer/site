const CACHE_KEYS = {
  PRE_CACHE: `precache-${VERSION}`,
  RUNTIME: `runtime-${VERSION}`
};

// Pages and assets kept in the runtime cache, oldest dropped first
const MAX_RUNTIME_ENTRIES = 80;

// URLS that we don’t want to end up in the cache
const EXCLUDED_URLS = [
  '/admin/',
  '/.11ty/'
];

const OFFLINE_PAGE = '/offline/index.html';

// URLS that we want to be cached when the worker is installed
const PRE_CACHE_URLS = [
  OFFLINE_PAGE,
  '/',
  '/fonts/jetbrains-mono-latin-wght-normal.woff2',
  '/fonts/ibm-plex-sans-latin-wght-normal.woff2'
];

// Optimised images have hashed file names: a cached copy never goes stale
const IMMUTABLE_PATH = '/img/';

const trimCache = async (cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map(key => cache.delete(key)));
};

// Only complete, same-origin responses: no 404, redirect or partial content
const putInCache = async (request, response) => {
  if (!response.ok || response.status !== 200 || response.type !== 'basic') {
    return;
  }
  const cache = await caches.open(CACHE_KEYS.RUNTIME);
  await cache.put(request, response);
  await trimCache(CACHE_KEYS.RUNTIME, MAX_RUNTIME_ENTRIES);
};

// Pages: the network first, so a deployment shows up right away, then the
// cached copy, then the offline page
const networkFirst = async evt => {
  try {
    const response = await fetch(evt.request);
    evt.waitUntil(putInCache(evt.request, response.clone()));
    return response;
  } catch {
    // Offline or network error: fall back to the cache
    const cached = await caches.match(evt.request);
    return cached || (await caches.match(OFFLINE_PAGE)) || Response.error();
  }
};

const cacheFirst = async evt => {
  const cached = await caches.match(evt.request);
  if (cached) {
    return cached;
  }
  const response = await fetch(evt.request);
  evt.waitUntil(putInCache(evt.request, response.clone()));
  return response;
};

// Other assets (scripts, fonts, original images): the cached copy right away,
// refreshed in the background for the next visit
const staleWhileRevalidate = async evt => {
  const cached = await caches.match(evt.request);
  const network = fetch(evt.request).then(response => {
    evt.waitUntil(putInCache(evt.request, response.clone()));
    return response;
  });
  if (cached) {
    evt.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
};

self.addEventListener('install', evt => {
  self.skipWaiting();

  evt.waitUntil(
    caches.open(CACHE_KEYS.PRE_CACHE).then(cache => cache.addAll(PRE_CACHE_URLS))
  );
});

self.addEventListener('activate', evt => {
  // Look for any old caches that don't match our set and clear them out
  evt.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(item => !Object.values(CACHE_KEYS).includes(item));
      })
      .then(itemsToDelete => {
        return Promise.all(
          itemsToDelete.map(item => {
            return caches.delete(item);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
  const { request } = evt;

  // Only GET requests can be cached
  if (request.method !== 'GET') {
    return;
  }

  // Third parties (analytics, GitHub API for the CMS) always go to the network.
  // The dev server must always serve fresh files
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.hostname === 'localhost') {
    return;
  }

  if (EXCLUDED_URLS.some(page => url.pathname.startsWith(page))) {
    return;
  }

  // Videos are streamed in ranges (206 responses), which the cache cannot store
  if (request.headers.has('range') || request.destination === 'video' || request.destination === 'audio') {
    return;
  }

  if (request.mode === 'navigate') {
    evt.respondWith(networkFirst(evt));
  } else if (url.pathname.startsWith(IMMUTABLE_PATH)) {
    evt.respondWith(cacheFirst(evt));
  } else {
    evt.respondWith(staleWhileRevalidate(evt));
  }
});
