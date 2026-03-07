import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getLeaderboardData, DEFAULT_PILOT_PHOTO } from '../services/data';
import { requestPermission } from '../services/firebase';
import NotificationModal from '../components/NotificationModal';
import { useConfig } from '../context/ConfigContext';

const Home = () => {
    const [drivers, setDrivers] = useState(() => {
        const savedDrivers = localStorage.getItem('leaderboard_cache');
        return savedDrivers ? JSON.parse(savedDrivers) : [];
    });
    const [loading, setLoading] = useState(drivers.length === 0);
    const [error, setError] = useState(null);
    const [activeDivision, setActiveDivision] = useState(() => {
        localStorage.removeItem('ck_reveals');
        localStorage.removeItem('dotd_results_cache');
        const savedDivision = localStorage.getItem('active_division_leaderboard');
        return savedDivision ? parseInt(savedDivision) : 1;
    });
    const [showNotificationButton, setShowNotificationButton] = useState(false);
    const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const config = useConfig();
    const clasi_arrows = config?.clasi_arrows;

    const isPromotionRelegationActive = (division) => {
        if (!Array.isArray(clasi_arrows)) return false; // Fallback if data is malformed
        const arrowConfig = clasi_arrows.find(d => d.división === division);
        return arrowConfig ? arrowConfig.active : false;
    };

    const arrowsActive = isPromotionRelegationActive(activeDivision);
    const season = searchParams.get('season') || '2026';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Background revalidation: always fetch fresh data after initial mount
                // Even if we already have drivers from the initial localStorage state
                const data = await getLeaderboardData(true); // Always force fresh on background fetch
                setDrivers(data);
                localStorage.setItem('leaderboard_cache', JSON.stringify(data));
                setLoading(false);
            } catch (err) {
                if (drivers.length === 0) {
                    setError("Error al obtener los datos de la clasificación, recarga la web.");
                }
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const checkNotificationPermission = () => {
            const supportsNotifications = 'Notification' in window;
            const isAPIGranted = (supportsNotifications && Notification.permission === 'granted');
            const isLocalStorageGranted = localStorage.getItem('notifications_granted') === 'true';
            const isDismissed = localStorage.getItem('notifications_dismissed') === 'true';
            const isAppDisabled = localStorage.getItem('app_notifications_disabled') === 'true';

            if (supportsNotifications && !isAPIGranted && !isLocalStorageGranted && !isDismissed && !isAppDisabled) {
                setShowNotificationButton(true);
            }
        };

        checkNotificationPermission();
    }, []);

    const handleSubscribeClick = () => {
        setIsNotifModalOpen(true);
    };

    const handleConfirmSubscription = async () => {
        setIsNotifModalOpen(false);
        const granted = await requestPermission();
        if (granted) {
            setShowNotificationButton(false);
        }
    };

    const handleRefresh = async () => {
        // Clear memory cache
        const { clearCache } = await import('../services/data');
        clearCache();

        try {
            // Force network request
            const data = await getLeaderboardData(true);
            setDrivers(data);
            localStorage.setItem('leaderboard_cache', JSON.stringify(data));
        } catch (err) {
            setError("Error al actualizar la clasificación.");
        }
    };

    const filteredDrivers = drivers
        .filter(driver => driver.division === activeDivision && (driver.season === season))
        .sort((a, b) => b.points - a.points);

    const top3 = filteredDrivers.slice(0, 3);
    const rest = filteredDrivers.slice(3);

    const getDivisionName = (div) => {
        if (div === 1) return 'PRIMERA';
        if (div === 2) return 'SEGUNDA';
        if (div === 3) return 'TERCERA';
        return 'RESERVAS';
    };

    const divisionName = getDivisionName(activeDivision);

    const handleInvestigationClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert("⚠️ Piloto bajo investigación por parte de los comisarios.");
    };

    if (loading && drivers.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em' }}></i>
                <p>Cargando datos del campeonato...</p>
            </div>
        );
    }

    if (error && drivers.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#ef4444', paddingTop: '50px' }}>
                {error}
            </div>
        );
    }

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''}>
            <div className="container">
                <div className="division-select-container">
                    {showNotificationButton && (
                        <button
                            id="subscribe-button"
                            className="btn-subscribe"
                            onClick={handleSubscribeClick}
                            style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '6px',
                                marginBottom: '20px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'block',
                                margin: '20px auto'
                            }}
                        >
                            Activar Notificaciones
                        </button>
                    )}
                    <label htmlFor="division-select" className="visually-hidden">Seleccionar División:</label>
                    <select
                        id="division-select"
                        className="division-dropdown"
                        value={activeDivision}
                        onChange={(e) => {
                            const newDivision = parseInt(e.target.value);
                            setActiveDivision(newDivision);
                            localStorage.setItem('active_division_leaderboard', newDivision);
                        }}
                    >
                        <option value="1">1ª Division</option>
                        <option value="2">2ª Division</option>
                        <option value="3">3ª Division</option>
                        <option value="0">Reservas</option>
                    </select>
                    <div className="season-badge-container">
                        <span className="season-badge">Temporada {season}</span>
                    </div>
                </div>

                {filteredDrivers.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '30px' }}>
                        No hay pilotos registrados o datos disponibles en la División: {divisionName}.
                    </div>
                ) : (
                    <>
                        <div id="podium-container" className="podium fade-in">
                            {top3.map((driver, index) => {
                                const rank = index + 1;
                                return (
                                    <Link
                                        key={driver.name}
                                        to={`/profile?driver=${encodeURIComponent(driver.name)}&season=${season}`}
                                        className="podium-card-link"
                                    >
                                        <div className={`list-item rank-${rank}`} style={{ '--team-logo': `url(${driver.teamLogo})` }}>
                                            <div className="crown-wrapper">
                                                <i className="fa-solid fa-medal crown"></i>
                                            </div>
                                            <div className={`rank-indicator-area ${getDivisionName(driver.division)}`}>
                                                {arrowsActive && activeDivision !== 1 && rank <= 2 && (
                                                    <i className="fa-solid fa-circle-chevron-up promotion-arrow" title="Zona de ascenso"></i>
                                                )}
                                                {arrowsActive && activeDivision !== 3 && rank > filteredDrivers.length - 2 && filteredDrivers.length > 2 && (
                                                    <i className="fa-solid fa-circle-chevron-down relegation-arrow" title="Zona de descenso"></i>
                                                )}
                                            </div>
                                            <img
                                                src={driver.photo || DEFAULT_PILOT_PHOTO}
                                                alt={driver.name}
                                                className="mini-avatar"
                                                onError={(e) => { e.target.src = DEFAULT_PILOT_PHOTO; }}
                                            />
                                            <div className="info">
                                                <div className="l-name">
                                                    {driver.name}
                                                </div>
                                                <div className="l-team">
                                                    {driver.teamLogo && (
                                                        <img
                                                            src={driver.teamLogo}
                                                            alt=""
                                                            className="mini-team-logo"
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    )}
                                                    {driver.team}
                                                </div>
                                            </div>
                                            <div className="l-points">
                                                {driver.points} <span>PTS</span>
                                                {driver.investigating === 1 && (
                                                    <i
                                                        className="fa-solid fa-triangle-exclamation investigation-icon"
                                                        onClick={handleInvestigationClick}
                                                        title="Bajo investigación"
                                                    ></i>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div id="list-container" className="list fade-in" style={{ animationDelay: '0.1s' }}>
                            {rest.map((driver, index) => {
                                const rank = index + 4;
                                return (
                                    <Link
                                        key={driver.name}
                                        to={`/profile?driver=${encodeURIComponent(driver.name)}&season=${season}`}
                                        className="list-item-link"
                                    >
                                        <div className="list-item" style={{ '--team-logo': `url(${driver.teamLogo})` }}>
                                            <div className="rank-num">{rank}</div>
                                            <div className={`rank-indicator-area ${getDivisionName(driver.division)}`}>
                                                {arrowsActive && activeDivision !== 1 && rank <= 2 && (
                                                    <i className="fa-solid fa-circle-chevron-up promotion-arrow" title="Zona de ascenso"></i>
                                                )}
                                                {arrowsActive && activeDivision !== 3 && rank > filteredDrivers.length - 2 && filteredDrivers.length > 2 && (
                                                    <i className="fa-solid fa-circle-chevron-down relegation-arrow" title="Zona de descenso"></i>
                                                )}
                                            </div>
                                            <img
                                                src={driver.photo || DEFAULT_PILOT_PHOTO}
                                                alt={driver.name}
                                                className="mini-avatar"
                                                onError={(e) => { e.target.src = DEFAULT_PILOT_PHOTO; }}
                                            />
                                            <div className="info">
                                                <div className="l-name">
                                                    {driver.name}
                                                </div>
                                                <div className="l-team">
                                                    {driver.teamLogo && (
                                                        <img
                                                            src={driver.teamLogo}
                                                            alt=""
                                                            className="mini-team-logo"
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    )}
                                                    {driver.team}
                                                </div>
                                            </div>
                                            <div className="l-points">
                                                {driver.points} <span>PTS</span>
                                                {driver.investigating === 1 && (
                                                    <i
                                                        className="fa-solid fa-triangle-exclamation investigation-icon"
                                                        onClick={handleInvestigationClick}
                                                        title="Bajo investigación"
                                                    ></i>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
            <NotificationModal
                isOpen={isNotifModalOpen}
                onClose={() => setIsNotifModalOpen(false)}
                onConfirm={handleConfirmSubscription}
            />
        </PullToRefresh>
    );
};

export default Home;
