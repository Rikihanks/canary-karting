import { useEffect } from 'react';

/**
 * AppUpdater Component
 * 
 * A simple, non-intrusive component that registers the Service Worker
 * and checks for updates periodically.
 */
const AppUpdater = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // Using the path configured in index.html/sw.js
            const swUrl = '/canary-karting-app/sw.js';
            const swScope = '/canary-karting-app/';

            const registerSW = async () => {
                try {
                    const registration = await navigator.serviceWorker.register(swUrl, { scope: swScope });
                    console.log('[Updater] Service Worker registrado. Scope:', registration.scope);

                    // Check for updates every 5 minutes
                    const interval = setInterval(() => {
                        console.log('[Updater] Comprobando actualizaciones del servidor...');
                        registration.update().catch(err => console.error('[Updater] Error al comprobar actualización:', err));
                    }, 60000); // 5 minutes

                    return () => clearInterval(interval);
                } catch (error) {
                    console.error('[Updater] Error al registrar el Service Worker:', error);
                }
            };

            registerSW();

            // Auto-reload when a new Service Worker takes control
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                console.log('[Updater] Nueva versión detectada y activada. Recargando aplicación...');
                window.location.reload();
            });
        }
    }, []);

    return null;
};

export default AppUpdater;
