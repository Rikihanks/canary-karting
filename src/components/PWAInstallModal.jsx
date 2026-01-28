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

        if (isIOS) {
            const isChromeIOS = userAgent.includes('crios');
            const isSafariIOS = userAgent.includes('safari') && !isChromeIOS && !userAgent.includes('fxios');

            if (isChromeIOS) {
                setPlatform('ios-chrome');
            } else if (isSafariIOS) {
                setPlatform('ios');
            } else {
                setPlatform('ios-other');
            }
        }
        else if (isAndroid) setPlatform('android');
        setPlatform('android');

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
    const styleClass = platform.includes('ios') ? 'ios' : 'android';

    return (
        <div className={`pwa-modal-overlay platform-${styleClass}`} onClick={handleClose}>
            <div className={`pwa-modal-content ${styleClass}-style`} onClick={(e) => e.stopPropagation()}>
                {platform.includes('ios') ? (
                    <>
                        <div className="ios-indicator"></div>
                        <div className="ios-header">
                            <h2>Instalar App</h2>
                            <p>Instala la aplicación en tu iPhone para una mejor experiencia.</p>
                        </div>
                        <div className="ios-steps">
                            {platform === 'ios-other' && (
                                <>
                                    <div className="step">
                                        <div className="step-icon">
                                            <i class="fa-brands fa-safari"></i>
                                        </div>
                                        <div className="step-text">
                                            Abre la app en <strong>Safari</strong>
                                        </div>
                                    </div>
                                </>
                            )}
                            {platform !== 'ios-chrome' && platform !== 'ios-other' && (
                                <>
                                    <div className="step">
                                        <div className="step-icon">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </div>
                                        <div className="step-text">
                                            Pulsa el menú de tres puntos.
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                                </div>
                                <div className="step-text">
                                    Pulsa el botón <strong>Compartir</strong>.
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-regular fa-square-plus"></i>
                                </div>
                                <div className="step-text">
                                    Desliza hacia abajo y selecciona <strong>Añadir a la pantalla de inicio</strong>.
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="step-text">
                                    Disfruta de la aplicación de <strong>Canary Karting</strong>.
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
