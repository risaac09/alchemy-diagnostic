/* Alchemy Diagnostic — service worker
 * Cache-first for app shell + Google Fonts. Network-first for everything else.
 */
const CACHE_NAME = 'alchemy-diagnostic-v1';
const SHELL = [
  'index.html',
  'embed.html',
  'app.css',
  'app.js',
  'manifest.json',
  'icon.svg'
];

const FONT_ORIGIN = 'https://fonts.googleapis.com';
const FONT_STATIC = 'https://fonts.gstatic.com';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Google Fonts: cache-first
  if (url.origin === FONT_ORIGIN || url.origin === FONT_STATIC) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // App shell: cache-first
  if (url.origin === self.location.origin && SHELL.some(s => url.pathname.endsWith(s))) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
    return;
  }

  // Everything else: network-first, fall back to cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
