import React, { useState, useEffect } from 'react';
import icon512 from '../assets/512.png';
import './PWAInstallModal.css';

const PWAInstallModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [platform, setPlatform] = useState('android'); // 'ios' or 'android'

    useEffect(() => {
        // Detect OS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        // Detect if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (isIOS) setPlatform('ios');
        else if (isAndroid) setPlatform('android');

        // Only show if not installed and not seen recently
        const hasSeenModal = localStorage.getItem('pwa_modal_seen');
        if (!isStandalone && !hasSeenModal && (isIOS || isAndroid)) {
            // Delay showing to not overwhelm the user immediately
            const timer = setTimeout(() => setShowModal(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShowModal(false);
        localStorage.setItem('pwa_modal_seen', 'true');
    };

    if (!showModal) return null;

    return (
        <div className={`pwa-modal-overlay platform-${platform}`} onClick={handleClose}>
            <div className={`pwa-modal-content ${platform}-style`} onClick={(e) => e.stopPropagation()}>
                {platform === 'ios' ? (
                    <>
                        <div className="ios-indicator"></div>
                        <div className="ios-header">
                            <h2>Instalar App</h2>
                            <p>Instala la aplicación en tu iPhone para una mejor experiencia.</p>
                        </div>
                        <div className="ios-steps">
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                                </div>
                                <div className="step-text">
                                    1. Pulsa el botón <strong>Compartir</strong> en la barra inferior.
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-regular fa-square-plus"></i>
                                </div>
                                <div className="step-text">
                                    2. Desliza hacia abajo y selecciona <strong>Añadir a la pantalla de inicio</strong>.
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="step-text">
                                    3. Disfruta de la aplicación de <strong>Canary Karting</strong>.
                                </div>
                            </div>
                        </div>
                        <button className="ios-close-btn" onClick={handleClose}>Entendido</button>
                    </>
                ) : (
                    <>
                        <div className="android-header">
                            <div className="android-app-icon">
                                <img src={icon512} alt="App Icon" />
                            </div>
                            <div className="android-title-group">
                                <h2>Instalar aplicación</h2>
                                <p>Canary Karting</p>
                            </div>
                        </div>
                        <div className="android-body">
                            <p>Instala nuestra app para acceso rápido y notificaciones en tiempo real.</p>
                            <div className="android-steps">
                                <div className="android-step">
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                    <span>Pulsa en el menú del explorador</span>
                                </div>
                                <div className="android-step">
                                    <i className="fa-solid fa-download"></i>
                                    <span>Selecciona "Instalar aplicación"</span>
                                </div>
                                <div className="android-step">
                                    <i className="fa-solid fa-check"></i>
                                    <span>Disfruta de la aplicación de Canary Karting</span>
                                </div>
                            </div>
                        </div>
                        <div className="android-actions">
                            <button className="android-install-btn" onClick={handleClose}>Entendido</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PWAInstallModal;
