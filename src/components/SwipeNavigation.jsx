import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SwipeNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;
        const SWIPE_THRESHOLD = 100; // Min distance to be considered a swipe
        const EDGE_THRESHOLD = 40;   // Max distance from the edge to start the swipe
        const HORIZONTAL_RATIO = 2;  // Must be more horizontal than vertical

        // Routes where we don't want to go back from
        const rootRoutes = ['/', '/clasificacion'];

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);

            // Special case for HashRouter: location.pathname might be the actual path
            const currentPath = location.pathname;

            // Swipe from left to right
            if (
                touchStartX <= EDGE_THRESHOLD && // Must start near the left edge
                deltaX > SWIPE_THRESHOLD &&      // Must be long enough
                deltaX > deltaY * HORIZONTAL_RATIO && // Must be primarily horizontal
                !rootRoutes.includes(currentPath) // Don't go back if already on Home
            ) {
                navigate(-1);
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [navigate, location]);

    return null;
};

export default SwipeNavigation;
