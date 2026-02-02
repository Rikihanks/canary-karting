import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from '../services/telemetry';

/**
 * Component that tracks page views automatically
 * Place this inside your HashRouter/BrowserRouter
 */
const TelemetryTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Log page view whenever location changes
        logEvent('page_view', {
            path: location.pathname,
            search: location.search,
            full_path: location.pathname + location.search
        });
    }, [location]);

    return null; // This component doesn't render anything
};

export default TelemetryTracker;
