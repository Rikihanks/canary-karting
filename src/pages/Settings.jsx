import { requestPermission } from '../services/firebase';
import { useConfig } from '../context/ConfigContext';
import { useEffect, useState } from 'react';
import './Settings.css';

const Settings = () => {
    const config = useConfig();
    const [permissionStatus, setPermissionStatus] = useState(Notification.permission);
    const [isAppDisabled, setIsAppDisabled] = useState(localStorage.getItem('app_notifications_disabled') === 'true');
    const [isDismissed, setIsDismissed] = useState(localStorage.getItem('notifications_dismissed') === 'true');
    const [isMotdDisabled, setIsMotdDisabled] = useState(localStorage.getItem('motd_disabled') === 'true');
    const [platform, setPlatform] = useState('android');
    const [version, setVersion] = useState(localStorage.getItem('update_ver'));

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else {
            setPlatform('android');
        }

        const interval = setInterval(() => {
            if (Notification.permission !== permissionStatus) {
                setPermissionStatus(Notification.permission);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [permissionStatus]);

    const handleToggleNotifications = async () => {
        if (permissionStatus === 'default' || permissionStatus === 'prompt') {
            const granted = await requestPermission();
            setPermissionStatus(Notification.permission);
            if (granted) {
                localStorage.removeItem('notifications_dismissed');
                localStorage.removeItem('app_notifications_disabled');
                setIsAppDisabled(false);
                setIsDismissed(false);
            }
        } else if (permissionStatus === 'granted') {
            const newValue = !isAppDisabled;
            setIsAppDisabled(newValue);
            if (newValue) {
                localStorage.setItem('app_notifications_disabled', 'true');
            } else {
                localStorage.removeItem('app_notifications_disabled');
            }
        } else if (permissionStatus === 'denied') {
            // Already handled by disabled toggle, but just in case
            return;
        }
    };

    const handleToggleMotd = () => {
        const newValue = !isMotdDisabled;
        setIsMotdDisabled(newValue);
        if (newValue) {
            localStorage.setItem('motd_disabled', 'true');
        } else {
            localStorage.removeItem('motd_disabled');
        }

        window.location.reload();
    };

    const handleResetDismissed = () => {
        localStorage.removeItem('notifications_dismissed');
        localStorage.removeItem('app_notifications_disabled');
        localStorage.removeItem('notifications_granted');
        setIsDismissed(false);
        setIsAppDisabled(false);
        window.location.reload();
    };

    const handleUpdate = () => {
        if (config?.acknowledgeUpdate) {
            config.acknowledgeUpdate();
        }
        window.location.reload();
    };

    const renderInstructions = () => {
        if (platform === 'ios') {
            return (
                <div className="instructions-card">
                    <h3><i className="fa-brands fa-apple"></i> Instrucciones para iOS</h3>
                    <ol>
                        <li>Ve a la aplicación de <strong>Ajustes</strong>.</li>
                        <li>Busca y pulsa en <strong>Notificaciones</strong>.</li>
                        <li>Encuentra <strong>Canary Karting</strong> en la lista.</li>
                        <li>Activa el interruptor de <strong>Permitir notificaciones</strong>.</li>
                    </ol>
                </div>
            );
        } else {
            return (
                <div className="instructions-card">
                    <h3><i className="fa-brands fa-android"></i> Instrucciones para Android</h3>
                    <ol>
                        <li>Mantén pulsado el icono de la app <strong>Canary Karting</strong> en tu pantalla de inicio.</li>
                        <li>Pulsa en el icono de <strong>Información (i)</strong>.</li>
                        <li>Ve al apartado de <strong>Notificaciones</strong>.</li>
                        <li>Asegúrate de que las notificaciones estén <strong>Activadas</strong>.</li>
                    </ol>
                </div>
            );
        }
    };

    const isToggleOn = permissionStatus === 'granted' && !isAppDisabled;
    const isToggleDisabled = permissionStatus === 'denied';

    return (
        <div className="container fade-in">
            <h1>Configuración</h1>

            <section className="settings-section">
                <div className="settings-header-row">
                    <h3><i className="fa-solid fa-bell"></i> Notificaciones</h3>
                    <label className={`switch ${isToggleDisabled ? 'disabled' : ''}`}>
                        <input
                            type="checkbox"
                            checked={isToggleOn}
                            onChange={handleToggleNotifications}
                            disabled={isToggleDisabled}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div className="status-card">
                    <div className="status-header">
                        <span className="status-label">Estado del permiso:</span>
                        <span className={`status-badge ${permissionStatus}`}>
                            {permissionStatus === 'granted' ? 'Concedido' :
                                permissionStatus === 'denied' ? 'Bloqueado' : 'No solicitado'}
                        </span>
                    </div>

                    {permissionStatus === 'granted' ? (
                        <p className="status-desc">
                            {isAppDisabled
                                ? 'Has pausado las notificaciones en esta aplicación.'
                                : '¡Todo listo! Recibirás notificaciones sobre carreras y novedades.'}
                        </p>
                    ) : permissionStatus === 'denied' ? (
                        <>
                            <p className="status-desc danger">Las notificaciones están bloqueadas en los ajustes de tu dispositivo.</p>
                            {renderInstructions()}
                        </>
                    ) : (
                        <p className="status-desc">Usa el interruptor de arriba para activar las notificaciones y estar al día.</p>
                    )}
                </div>

                {(isDismissed || isAppDisabled) && (
                    <div className="settings-option">
                        <p>Opciones de recuperación:</p>
                        <button className="btn-secondary-settings" onClick={handleResetDismissed}>
                            Restablecer todos los avisos
                        </button>
                    </div>
                )}
            </section>

            <section className="settings-section">
                <div className="settings-header-row">
                    <h3><i className="fa-solid fa-newspaper"></i> Mensajes de la organización</h3>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={!isMotdDisabled}
                            onChange={handleToggleMotd}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="status-card">
                    <p className="status-desc">
                        {isMotdDisabled
                            ? 'Has desactivado los Mensajes de la organización.'
                            : 'Los Mensajes de la organización ocurren dentro de la app y mostrarán noticias importantes.'}
                    </p>
                </div>
            </section>

            {config?.hasUpdate && (
                <div className="update-alert-card fade-in">
                    <div className="update-alert-icon">
                        <i className="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <div className="update-alert-content">
                        <h4>¡Actualización disponible!</h4>
                        <p>Hay una nueva versión de la configuración. Pulsa el botón de abajo para aplicarla.</p>
                    </div>
                </div>
            )}

            <section className="settings-section info-section">
                <h3>Sobre la App</h3>
                <div className="info-card">
                    <p><strong>Canary Karting</strong></p>
                    <p>Versión: {version}</p>
                    <button className="btn-primary-settings update-btn" onClick={handleUpdate}>
                        Buscar actualizaciones
                    </button>
                    <p>Si encuentras algún error o tienes alguna sugerencia, por favor, comunícalo a la organización para que pueda ser corregido.</p>
                </div>
            </section>
        </div>
    );
};

export default Settings;
