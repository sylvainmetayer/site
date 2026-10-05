// Retires the service worker that sylvain.dev (apex) installed while it was
// hosted on Netlify. The apex now answers every request with a 301 to www,
// and browsers refuse to update a service worker through a redirect, so the
// old cache-first worker would keep serving stale pages forever. Pangolin
// (homelab, pangolin_domain_redirects) serves this file in place of
// /service-worker.js on the apex only: it empties the caches, unregisters
// itself and reloads the open tabs, which then follow the redirect to www.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    windows.forEach(client => client.navigate(client.url));
  })());
});
