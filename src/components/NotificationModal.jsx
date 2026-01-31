import React, { useState, useEffect } from 'react';
import './NotificationModal.css';

const NotificationModal = ({ isOpen, onClose, onConfirm }) => {
    const [platform, setPlatform] = useState('android');

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else {
            setPlatform('android');
        }
    }, []);

    const handleDoNotPromptAgain = () => {
        localStorage.setItem('notifications_dismissed', 'true');
        onClose();
    };

    if (!isOpen) return null;

    const isIOS = platform === 'ios';

    return (
        <div className={`notif-modal-overlay platform-${platform}`} onClick={onClose}>
            <div className={isIOS ? 'ios-notif-style' : 'android-notif-style'} onClick={(e) => e.stopPropagation()}>
                <div className={isIOS ? 'ios-header' : 'android-header'}>
                    {!isIOS && <i className="fa-solid fa-bell android-notif-icon"></i>}
                    <h2>Activar Notificaciones</h2>
                    <p>Infórmate sobre las próximas carreras, resultados y noticias importantes para pilotos.</p>
                </div>

                <div className={isIOS ? 'ios-actions' : 'android-body'}>
                    <div className={isIOS ? 'ios-actions' : 'android-actions'}>
                        <button
                            className={isIOS ? 'ios-btn ios-btn-primary' : 'android-btn-primary'}
                            onClick={onConfirm}
                        >
                            Activar
                        </button>
                        <button
                            className={isIOS ? 'ios-btn ios-btn-secondary' : 'android-btn-secondary'}
                            onClick={onClose}
                        >
                            Ahora no
                        </button>
                        <button
                            className={isIOS ? 'ios-btn ios-btn-text' : 'android-btn-text'}
                            onClick={handleDoNotPromptAgain}
                        >
                            No volver a preguntar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
