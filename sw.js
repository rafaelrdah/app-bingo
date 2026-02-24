const CACHE_NAME = 'bingo-cache-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icone.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// A GRANDE MUDANÇA: "Network First" (Internet Primeiro)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a internet tá pegando, baixa a versão mais recente e atualiza o cache escondido
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Se o fetch falhar (sem internet), puxa a versão salva offline
        return caches.match(event.request);
      })
  );
});
