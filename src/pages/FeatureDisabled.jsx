import React from 'react';
import { Link } from 'react-router-dom';

const FeatureDisabled = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', color: 'var(--text-primary)' }}>⛔</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Función No Disponible</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Esta sección no está habilitada actualmente. <br />
                Por favor, verifica de nuevo más tarde o contacta con el administrador.
            </p>
            <Link to="/" className="action-button">
                Volver al Inicio
            </Link>
        </div>
    );
};

export default FeatureDisabled;
