import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getLeaderboardData } from '../services/data';
import { requestPermission } from '../services/firebase';
import NotificationModal from '../components/NotificationModal';

const Home = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDivision, setActiveDivision] = useState(1);
    const [showNotificationButton, setShowNotificationButton] = useState(false);
    const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const season = searchParams.get('season') || '2026';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLeaderboardData();
                setDrivers(data);
                setLoading(false);
            } catch (err) {
                setError("Error al obtener los datos de la clasificación, recarga la web.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const checkNotificationPermission = () => {
            const isAPIGranted = ('Notification' in window && Notification.permission === 'granted');
            const isLocalStorageGranted = localStorage.getItem('notifications_granted') === 'true';
            const isDismissed = localStorage.getItem('notifications_dismissed') === 'true';
            const isAppDisabled = localStorage.getItem('app_notifications_disabled') === 'true';

            if (!isAPIGranted && !isLocalStorageGranted && !isDismissed && !isAppDisabled) {
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

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em' }}></i>
                <p>Cargando datos del campeonato...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#ef4444', paddingTop: '50px' }}>
                {error}
            </div>
        );
    }

    const handleRefresh = async () => {
        const { clearCache } = await import('../services/data');
        clearCache();
        // Re-fetch data
        try {
            const data = await getLeaderboardData();
            setDrivers(data);
            setLoading(false);
        } catch (err) {
            setError("Error al obtener los datos de la clasificación, recarga la web.");
            setLoading(false);
        }
    };

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
                        onChange={(e) => setActiveDivision(parseInt(e.target.value))}
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
                                        <div className={`list-item rank-${rank}`}>
                                            <i className="fa-solid fa-medal crown"></i>
                                            &nbsp;<img src={driver.photo} alt={driver.name} className="mini-avatar" />
                                            <div className="info">
                                                <div className="l-name">{driver.name}</div>
                                                <div className="l-team">{driver.team}</div>
                                            </div>
                                            <div className="l-points">{driver.points} <span>PTS</span></div>
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
                                        <div className="list-item">
                                            <div className="rank-num">{rank}</div>
                                            <img src={driver.photo} alt={driver.name} className="mini-avatar" />
                                            <div className="info">
                                                <div className="l-name">{driver.name}</div>
                                                <div className="l-team">{driver.team}</div>
                                            </div>
                                            <div className="l-points">{driver.points} <span>PTS</span></div>
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
