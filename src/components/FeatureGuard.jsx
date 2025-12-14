import React from 'react';
import { Navigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

const FeatureGuard = ({ feature, children }) => {
    const config = useConfig();

    if (config.loading) {
        // You might want a better loading spinner here
        return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando configuración...</div>;
    }

    if (feature && config[feature] === false) {
        return <Navigate to="/disabled" replace />;
    }

    return children;
};

export default FeatureGuard;
