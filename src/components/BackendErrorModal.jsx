import React, { useState, useEffect, useCallback } from 'react';
import { onBackendUnreachable } from '../services/backendService';
import './BackendErrorModal.css';

const DISMISS_COOLDOWN = 30000;

const BackendErrorModal = () => {
    const [show, setShow] = useState(false);
    const [dismissedUntil, setDismissedUntil] = useState(0);

    const handleError = useCallback(() => {
        const now = Date.now();
        if (now < dismissedUntil) return;
        setShow(true);
    }, [dismissedUntil]);

    useEffect(() => {
        const unsub = onBackendUnreachable(handleError);
        return unsub;
    }, [handleError]);

    const handleDismiss = () => {
        setShow(false);
        setDismissedUntil(Date.now() + DISMISS_COOLDOWN);
    };

    if (!show) return null;

    return (
        <div className="backend-error-overlay" onClick={handleDismiss}>
            <div className="backend-error-modal" onClick={(e) => e.stopPropagation()}>
                <div className="backend-error-icon">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h2>Problemas de conexión</h2>
                <p>No se puede conectar con el servidor. Es posible que algunas funciones no estén disponibles o veas datos desactualizados.</p>
                <div className="backend-error-actions">
                    <button className="backend-error-btn-primary" onClick={handleDismiss}>
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BackendErrorModal;
