import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestPermission = async () => {
    console.log('Solicitando permiso de notificación...');
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Permiso de notificación concedido.');

            // We need the service worker registration to get the token
            const registration = await navigator.serviceWorker.ready;

            const currentToken = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (currentToken) {
                console.log('Token de FCM:', currentToken);
                localStorage.setItem('notifications_granted', 'true');
                return true;
            } else {
                console.log('No se pudo obtener el token.');
            }
        } else {
            console.log('Permiso de notificación denegado.');
        }
    } catch (error) {
        console.error('Error al solicitar el permiso:', error);
    }
    return false;
};
