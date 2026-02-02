import React from 'react';
import { useConfig } from '../context/ConfigContext';
import Maintenance from '../pages/Maintenance';

const MaintenanceGuard = ({ children }) => {
    const { mantenimiento, loading } = useConfig();

    if (loading) return null;

    const isMaintenanceBypass =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === 'rikihanks.github.io';

    if (mantenimiento && !isMaintenanceBypass) {
        return <Maintenance />;
    }

    return children;
};

export default MaintenanceGuard;
