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
        loading: true
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await getConfigData();
                setConfig({ ...data, loading: false });
            } catch (error) {
                console.error("Failed to load config, using defaults", error);
                setConfig(prev => ({ ...prev, loading: false }));
            }
        };

        fetchConfig();

        // Optional: Poll every 5 minutes or so to update config without reload
        // const interval = setInterval(fetchConfig, 300000); 
        // return () => clearInterval(interval);

    }, []);

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};
