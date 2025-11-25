// [START initialize_firebase_in_sw]
// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  // Re-copia tu configuración de Firebase aquí (al menos los campos necesarios)
  apiKey: "TU_API_KEY",
  projectId: "TU-PROJECT-ID",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
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
        icon: '/icons/192.png' // Usa un icono de tu app
    };

    // Muestra la notificación
    self.registration.showNotification(notificationTitle, notificationOptions);
});
// [END background_handler]
