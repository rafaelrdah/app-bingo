const CACHE_NAME = 'bingo-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icone.png'
];

// Instala o Service Worker e guarda os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Quando o app pedir um arquivo, tenta pegar da internet, se não tiver, pega do cache (offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
