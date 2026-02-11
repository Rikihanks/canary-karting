import React, { createContext, useContext, useState, useEffect } from 'react';
import { getConfigData, getNewsData } from '../services/data';

const ConfigContext = createContext();

export const useConfig = () => {
    return useContext(ConfigContext);
};

const getInitialConfig = () => {
    return {
        teams: true,
        races: true,
        inscripcion: true,
        sorteo: true,
        login: true,
        clasi_arrows: true,
        mantenimiento: false,
        loading: true,
        hasUpdate: false,
        remoteVersion: null,
        hasNewNews: false
    };
};

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(getInitialConfig);

    const acknowledgeUpdate = () => {
        if (config.remoteVersion) {
            localStorage.setItem('update_ver', config.remoteVersion);
            setConfig(prev => ({ ...prev, hasUpdate: false }));
        }
    };

    const markNewsAsRead = (count) => {
        console.log("Marking news as read:", count);
        localStorage.setItem('last_news_count', count.toString());
        setConfig(prev => ({ ...prev, hasNewNews: false }));
    };

    const fetchConfigAndNews = async () => {
        console.log(`Fetching config (Strict Live) & news...`);
        try {
            const [configData, newsData] = await Promise.all([
                getConfigData(), // getConfigData now forces skipCache and no persistence
                getNewsData(false) // News can still be cached
            ]);

            const remoteVer = configData.update_ver || '1.0.0';
            const localVer = localStorage.getItem('update_ver');
            let hasUpdate = false;

            if (!localVer) {
                localStorage.setItem('update_ver', remoteVer);
            } else if (localVer !== remoteVer) {
                hasUpdate = true;
            }

            const today = new Date();
            today.setHours(23, 59, 59, 999);
            const publishedNews = newsData.filter(item => new Date(item.date) <= today);

            const lastNewsCount = parseInt(localStorage.getItem('last_news_count') || '0');
            const currentNewsCount = publishedNews.length;
            const hasNewNews = currentNewsCount > lastNewsCount;

            const newConfig = {
                ...config,
                ...configData,
                loading: false,
                hasUpdate,
                remoteVersion: remoteVer,
                hasNewNews
            };

            setConfig(newConfig);

        } catch (error) {
            console.error("Failed to load generic data:", error);
            setConfig(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchConfigAndNews();

        const interval = setInterval(fetchConfigAndNews, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ConfigContext.Provider value={{ ...config, acknowledgeUpdate, markNewsAsRead }}>
            {children}
        </ConfigContext.Provider>
    );
};
