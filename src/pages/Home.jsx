import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getLeaderboardData } from '../services/data';
import { requestPermission } from '../services/firebase';

const Home = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDivision, setActiveDivision] = useState(1);
    const [showNotificationButton, setShowNotificationButton] = useState(false);

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

            if (!isAPIGranted && !isLocalStorageGranted) {
                setShowNotificationButton(true);
            }
        };

        checkNotificationPermission();
    }, []);

    const handleSubscribe = async () => {
        const granted = await requestPermission();
        if (granted) {
            setShowNotificationButton(false);
        }
    };

    const filteredDrivers = drivers
        .filter(driver => driver.division === activeDivision)
        .sort((a, b) => b.points - a.points);

    const top3 = filteredDrivers.slice(0, 3);
    const rest = filteredDrivers.slice(3);
    const divisionName = activeDivision === 1 ? 'PRIMERA' : 'SEGUNDA';

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
                            onClick={handleSubscribe}
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
                    </select>
                </div>

                {filteredDrivers.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '30px' }}>
                        No hay pilotos registrados o datos disponibles en la {divisionName} División.
                    </div>
                ) : (
                    <>
                        <div id="podium-container" className="podium fade-in">
                            {top3.map((driver, index) => {
                                const rank = index + 1;
                                return (
                                    <Link
                                        key={driver.name}
                                        to={`/profile?driver=${encodeURIComponent(driver.name)}`}
                                        className="podium-card-link"
                                    >
                                        <div className={`list-item rank-${rank}`}>
                                            <i className="fa-solid fa-medal crown"></i>
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

                        <div id="list-container" className="list fade-in" style={{ animationDelay: '0.1s' }}>
                            {rest.map((driver, index) => {
                                const rank = index + 4;
                                return (
                                    <Link
                                        key={driver.name}
                                        to={`/profile?driver=${encodeURIComponent(driver.name)}`}
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
        </PullToRefresh>
    );
};

export default Home;
