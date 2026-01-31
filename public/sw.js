
// Configuración de Caché (¡No tocar!)

const CACHE_VERSION = 'v1.92';
const CACHE_NAME = 'clasificacion-ck-cache-v1.92';
// OneSignal se encarga automáticamente de los eventos 'push' y 'notificationclick'.
// Si necesitas lógica personalizada aquí, OneSignal permite extender el SW, 
// pero por ahora dejamos que el SDK lo gestione todo para simplificar el "Enviar a todos".


const urlsToCache = [
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

// 2. Servir recursos desde la caché si están disponibles
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorar peticiones a APIs externas de datos para que siempre vayan a la red
  if (url.href.includes('corsproxy.io') || url.href.includes('docs.google.com')) {
    return;
  }

  // Estrategia Stale-While-Revalidate para IMÁGENES
  if (event.request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            // Guardar solo si la respuesta es válida (200) u opaca (0)
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(err => {
            console.error('Fetch failed for image:', url.href, err);
          });

          // Devolver el de la caché si existe, si no, esperar al de la red
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Estrategia Cache-First para otros recursos (CSS, fuentes, etc.)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
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