import React from 'react';
import './Maintenance.css';

const Maintenance = () => {
    return (
        <div className="maintenance-container">
            <div className="maintenance-content">
                <div className="maintenance-icon">
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                </div>
                <h1 className="maintenance-title">Mantenimiento en curso</h1>
                <p className="maintenance-text">
                    Estamos realizando algunas mejoras para que tu experiencia sea aún mejor.
                    Volveremos a estar en pista muy pronto.
                </p>
                <div className="maintenance-visual">
                    <div className="track">
                        <div className="kart">
                            <i className="kart-icon">🏎️</i>
                        </div>
                    </div>
                </div>
                <div className="maintenance-footer">
                    <p>Gracias por tu paciencia.</p>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
