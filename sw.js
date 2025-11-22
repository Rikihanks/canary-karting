const CACHE_VERSION = 'v1.0';
const CACHE_NAME = 'clasificacion-ck-cache-v1';
const urlsToCache = [
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Russo+One&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Servir recursos desde la caché si están disponibles (Estrategia Cache-First)
self.addEventListener('fetch', event => {
  // Ignorar peticiones a APIs externas (como el proxy de Google Sheets) para que siempre vayan a la red
  if (event.request.url.includes('api.allorigins.win') || event.request.url.includes('docs.google.com')) {
    return; // Dejar que la red maneje la petición de datos
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso de la caché si existe
        if (response) {
          return response;
        }
        // Si no está en caché, va a la red
        return fetch(event.request);
      })
  );
});

// 3. Eliminar cachés antiguas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
