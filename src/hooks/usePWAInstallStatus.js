import { useState, useEffect } from 'react';

export const usePWAInstallStatus = () => {
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const checkInstallStatus = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true;
            setIsInstalled(isStandalone);
        };

        checkInstallStatus();

        const mediaQuery = window.matchMedia('(display-mode: standalone)');

        // Listen for changes (e.g., if user installs while app is open)
        // Some browsers might not fire this immediately but it's good practice
        const handleChange = (e) => {
            setIsInstalled(e.matches);
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // Deprecated fallback
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    return isInstalled;
};
