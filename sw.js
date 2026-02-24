const CACHE_NAME = 'bingo-cache-v5'; // Subimos para v4 para forçar essa nova regra
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icone.jpg' // Certifique-se de que o nome da sua imagem está exato aqui
];

// 1. INSTALA E FORÇA A ATUALIZAÇÃO IMEDIATA (O Reboot)
self.addEventListener('install', event => {
  self.skipWaiting(); // Diz para o celular: "Não espere, atualize AGORA!"
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 2. ATIVA E APAGA O LIXO ANTIGO (O Faxineiro)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se o nome do cache salvo for diferente do atual (v4), ele apaga
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando versão antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Garante que a página atual já seja controlada por essa nova versão
  return self.clients.claim(); 
});

// 3. BUSCA OS ARQUIVOS (Modo Offline normal)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
