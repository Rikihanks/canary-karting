importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const CACHE_VERSION = 'v1.5';
const CACHE_NAME = 'clasificacion-ck-cache-v1.5';
const firebaseConfig = {
  // Re-copia tu configuración de Firebase aquí (al menos los campos necesarios)
  apiKey: "AIzaSyAaz08Re-HOLnPYllQBSVq9hfIbfRKeV2Y",
  projectId: "TU-canary-karting-ID",
  messagingSenderId: "16614182534",
  appId: "1:16614182534:web:b2221350da181d88a50b07"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]


// [START background_handler]
// El código aquí se ejecuta cuando el navegador recibe un mensaje en segundo plano.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icons/50.png' // Usa un icono de tu app
  };

  // Muestra la notificación
  self.registration.showNotification(notificationTitle, notificationOptions);
});

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

// 2. Servir recursos desde la caché si están disponibles (Estrategia Cache-First)
self.addEventListener('fetch', event => {
  // Ignorar peticiones a APIs externas (como el proxy de Google Sheets) para que siempre vayan a la red
  if (event.request.url.includes('corsproxy.io') || event.request.url.includes('docs.google.com')) {
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
