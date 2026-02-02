import React, { createContext, useContext, useState, useEffect } from 'react';
import { getConfigData } from '../services/data';

const ConfigContext = createContext();

export const useConfig = () => {
    return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        teams: true,
        races: true,
        inscripcion: true,
        sorteo: true,
        login: true,
        clasi_arrows: true,
        mantenimiento: false,
        loading: true,
        hasUpdate: false,
        remoteVersion: null
    });

    const acknowledgeUpdate = () => {
        if (config.remoteVersion) {
            localStorage.setItem('update_ver', config.remoteVersion);
            setConfig(prev => ({ ...prev, hasUpdate: false }));
        }
    };

    useEffect(() => {
        const fetchConfig = async () => {
            console.log("Fetching config...");

            try {
                const data = await getConfigData();
                const remoteVer = data.update_ver || '1.0.0';
                const localVer = localStorage.getItem('update_ver');

                let hasUpdate = false;
                if (!localVer) {
                    // First time, save it
                    localStorage.setItem('update_ver', remoteVer);
                } else if (localVer !== remoteVer) {
                    hasUpdate = true;
                }

                setConfig({
                    ...data,
                    loading: false,
                    hasUpdate,
                    remoteVersion: remoteVer,
                    acknowledgeUpdate // Expose it in the context if needed, but better as a separate value
                });
            } catch (error) {
                console.error("Failed to load config, using defaults", error);
                setConfig(prev => ({ ...prev, loading: false }));
            }
        };

        fetchConfig();

        // Check for updates every 5 minutes
        const interval = setInterval(fetchConfig, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ConfigContext.Provider value={{ ...config, acknowledgeUpdate }}>
            {children}
        </ConfigContext.Provider>
    );
};
