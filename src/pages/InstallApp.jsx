import React, { useState, useEffect } from 'react';
import icon512 from '../assets/512.png';
import '../components/PWAInstallModal.css';

const InstallApp = () => {
    const [platform, setPlatform] = useState('android');

    useEffect(() => {
        // Detect OS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        const isInstagramInApp = /Instagram\/?\s?\d+/i.test(navigator.userAgent);

        if (isIOS) {
            const isChromeIOS = userAgent.includes('crios');
            const isSafariIOS = userAgent.includes('safari') && !isChromeIOS && !userAgent.includes('fxios');

            if (isInstagramInApp) {
                setPlatform('instagram-iphone');
            } else if (isChromeIOS) {
                setPlatform('ios-chrome');
            } else if (isSafariIOS) {
                setPlatform('ios');
            } else {
                setPlatform('ios-other');
            }
        }
        else if (isAndroid) {
            if (isInstagramInApp) {
                setPlatform('android-instagram');
            } else {
                setPlatform('android');
            }
        };
    }, []);

    const styleClass = () => {
        if (platform.includes('ios')) {
            return 'ios';
        }
        else if (platform === 'android-instagram') {
            return 'ios';
        }
        else if (platform.includes('android')) {
            return 'android';
        } else if (platform.includes('instagram')) {
            return 'ios';
        } else {
            return 'ios';
        }
    };

    return (
        <div className={`pwa-install-page platform-${styleClass()}`} style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div className={`pwa-modal-content ${styleClass()}-style`} style={{ animation: 'none' }}>
                {platform.includes('instagram') ? (
                    /* BLOQUE INSTAGRAM (iOS y Android) */
                    <>
                        <div className="ios-indicator"></div>
                        <div className="ios-header">
                            <h2>Instalar App</h2>
                            <p>Para instalar la app, abre este enlace en el navegador de tu sistema.</p>
                        </div>
                        <div className="ios-steps">
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-solid fa-ellipsis"></i>
                                </div>
                                <div className="step-text">
                                    Pulsa el menú de <strong>tres puntos</strong>.
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa-regular fa-window-maximize"></i>
                                </div>
                                <div className="step-text">
                                    Selecciona <strong> abrir en navegador externo </strong>
                                </div>
                            </div>
                        </div>
                    </>
                ) : platform.includes('ios') ? (
                    /* BLOQUE IOS REGULAR */
                    <>
                        <div className="ios-indicator"></div>
                        <div className="ios-header">
                            <h2>Instalar App</h2>
                            <p>Instala la aplicación en tu iPhone para una mejor experiencia.</p>
                        </div>
                        <div className="ios-steps">
                            {platform === 'ios-other' && (
                                <div className="step">
                                    <div className="step-icon">
                                        <i className="fa-brands fa-safari"></i>
                                    </div>
                                    <div className="step-text">
                                        Abre la app en <strong>Safari</strong>
                                    </div>
                                </div>
                            )}
                            {platform !== 'ios-chrome' && platform !== 'ios-other' && (
                                <div className="step">
                                    <div className="step-icon">
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </div>
                                    <div className="step-text">
                                        Pulsa el menú de tres puntos.
                                    </div>
                                </div>
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
                    </>
                ) : (
                    /* BLOQUE ANDROID REGULAR */
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
                    </>
                )}
            </div>
        </div>
    );
};

export default InstallApp;
