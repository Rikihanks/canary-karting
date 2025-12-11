import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getLeaderboardData, getDriverResults } from '../services/data';

const Profile = () => {
    const [searchParams] = useSearchParams();
    const driverName = searchParams.get('driver');

    const [driverStats, setDriverStats] = useState(null);
    const [driverHistory, setDriverHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        if (!driverName) {
            setError("No se especificó un piloto.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [leaderboard, results] = await Promise.all([
                    getLeaderboardData(),
                    getDriverResults()
                ]);

                const stats = leaderboard.find(d => d.name === driverName);
                const history = results.filter(r => r.name === driverName);

                if (!stats) {
                    setError("Piloto no encontrado.");
                } else {
                    setDriverStats(stats);
                    setDriverHistory(history);
                }
            } catch (err) {
                console.error(err);
                setError("Error de conexión.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [driverName]);

    const openModal = (type) => {
        let title = '';
        let content = null;
        let filteredEvents = [];

        if (type === 'victories') {
            title = 'Victorias';
            filteredEvents = driverHistory.filter(r => r.position === 1);
            content = generateEventListHTML(filteredEvents);
        } else if (type === 'podiums') {
            title = 'Podios';
            filteredEvents = driverHistory.filter(r => r.position > 0 && r.position <= 3);
            content = generateEventListHTML(filteredEvents);
        } else if (type === 'poles') {
            title = 'Poles';
            filteredEvents = driverHistory.filter(r => r.pole_pos === 1);
            content = generateEventListHTML(filteredEvents);
        } else if (type === 'fastLaps') {
            title = 'Vueltas Rápidas';
            content = generateFastestLapHTML(driverHistory);
        }

        setModalTitle(title);
        setModalContent(content);
        setModalOpen(true);
    };

    const generateEventListHTML = (events) => {
        if (events.length === 0) return <div className="event-detail-empty">No hay registros.</div>;
        return (
            <div className="events-grid">
                {events.map((event, index) => (
                    <div key={index} className="event-card">
                        <div className="event-card-header">
                            <div className="event-race-info">
                                <i className="fa-solid fa-flag-checkered event-icon"></i>
                                <span className="race-name">{event.race}</span>
                            </div>
                            <span className="race-date">{event.date}</span>
                        </div>
                        <div className="event-stats-grid">
                            <div className="stat-box">
                                <i className="fa-solid fa-trophy stat-icon"></i>
                                <div className="stat-content">
                                    <span className="stat-label">Posición</span>
                                    <span className="stat-value">P{event.position}</span>
                                </div>
                            </div>
                            <div className="stat-box">
                                <i className="fa-solid fa-gauge-high stat-icon"></i>
                                <div className="stat-content">
                                    <span className="stat-label">Salida</span>
                                    <span className="stat-value">P{event.pole_pos}</span>
                                </div>
                            </div>
                            <div className="stat-box">
                                <i className="fa-solid fa-cloud-sun stat-icon"></i>
                                <div className="stat-content">
                                    <span className="stat-label">Condición</span>
                                    <span className="stat-value">{event.condition}</span>
                                </div>
                            </div>
                            <div className="stat-box points-box">
                                <i className="fa-solid fa-star stat-icon"></i>
                                <div className="stat-content">
                                    <span className="stat-label">Puntos</span>
                                    <span className="stat-value">{event.points_gained}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const generateFastestLapHTML = (history) => {
        const validLaps = history.filter(event =>
            event.fastest_lap && event.fastest_lap !== 'N/A' && event.fastest_lap.trim() !== '-'
        );

        if (validLaps.length === 0) return <div className="event-detail-empty">No hay tiempos de vuelta rápida registrados.</div>;

        validLaps.sort((a, b) => a.fastest_lap.localeCompare(b.fastest_lap));

        return (
            <div className="events-grid">
                {validLaps.map((event, index) => {
                    const isBestOverall = index === 0;
                    return (
                        <div key={index} className={`event-card ${isBestOverall ? 'best-lap-card' : ''}`}>
                            <div className="event-card-header">
                                <div className="event-race-info">
                                    <i className="fa-solid fa-flag-checkered event-icon"></i>
                                    <span className="race-name">{event.race}</span>
                                </div>
                                <span className="race-date">{event.date}</span>
                            </div>
                            {isBestOverall && (
                                <div className="best-lap-badge">
                                    <i className="fa-solid fa-crown"></i> MEJOR HISTÓRICA
                                </div>
                            )}
                            <br />
                            <div className="lap-time-display">
                                <i className="fa-solid fa-stopwatch lap-icon"></i>
                                <span className="lap-time" style={{ color: isBestOverall ? '#a855f7' : '#10b981' }}>
                                    {event.fastest_lap}
                                </span>
                            </div>

                            <div className="event-stats-grid">
                                <div className="stat-box">
                                    <i className="fa-solid fa-trophy stat-icon"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Posición</span>
                                        <span className="stat-value">P{event.position}</span>
                                    </div>
                                </div>
                                <div className="stat-box">
                                    <i className="fa-solid fa-cloud-sun stat-icon"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Condición</span>
                                        <span className="stat-value">{event.condition}</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}><i className="fa-solid fa-spinner fa-spin"></i> Cargando perfil...</div>;
    if (error) return <div className="container"><div className="profile-card"><h1 style={{ color: '#ef4444' }}>{error}</h1></div></div>;

    const victories = driverHistory.filter(r => r.position === 1).length;
    const podiums = driverHistory.filter(r => r.position > 0 && r.position <= 3).length;
    const poles = driverHistory.filter(r => r.pole_pos === 1).length;
    const fastLaps = driverHistory.filter(r => r.fastest_lap && r.fastest_lap !== 'N/A' && r.fastest_lap.trim() !== '-').length;

    // TODO: Connect to real data when available.
    const mockChampionships = 1; // MOCKUP DATA



    const handleRefresh = async () => {
        const { clearCache } = await import('../services/data');
        clearCache();
        try {
            const [leaderboard, results] = await Promise.all([
                getLeaderboardData(),
                getDriverResults()
            ]);

            const stats = leaderboard.find(d => d.name === driverName);
            const history = results.filter(r => r.name === driverName);

            if (!stats) {
                setError("Piloto no encontrado.");
            } else {
                setDriverStats(stats);
                setDriverHistory(history);
            }
        } catch (err) {
            console.error(err);
            setError("Error de conexión.");
        }
    };

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''}>
            <div className="container">
                {/* Hero Section */}
                <div className="driver-hero fade-in">
                    <div className="hero-bg" style={{ backgroundImage: `url(${driverStats.photo})` }}></div>
                    <div className="hero-content">
                        <img src={driverStats.photo} alt={driverStats.name} className="driver-photo-hero" />
                        <div className="driver-info-wrapper">
                            <h1 className="driver-name-hero">{driverStats.name}</h1>
                            <div className="team-name-badge">{driverStats.team}</div>
                            <div className="division-badge">
                                {driverStats.division}ª DIVISIÓN
                            </div>
                        </div>
                    </div>
                    <div className="total-points-hero">
                        <span className="points-val">{driverStats.points}</span>
                        <span className="points-label">PUNTOS</span>
                    </div>
                </div>

                {/* Championships Section (Most Important) */}
                <div className="fade-in" style={{ animationDelay: '0.05s' }}>
                    <div className={`championship-section ${mockChampionships > 0 ? 'gold-tier' : 'gray-tier'}`}>
                        <div className="champ-icon-wrapper">
                            <i className="fa-solid fa-trophy champ-icon"></i>
                        </div>
                        <div className="champ-info">
                            <span className="champ-count">{mockChampionships}</span>
                            <span className="champ-label">CAMPEONATOS GANADOS</span>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="stats-row fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card gold toggle-modal" onClick={() => openModal('victories')}>
                        <div className="stat-icon-wrapper"><i className="fa-solid fa-trophy"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{victories}</span>
                            <span className="stat-title">Victorias</span>
                        </div>
                    </div>
                    <div className="stat-card silver toggle-modal" onClick={() => openModal('podiums')}>
                        <div className="stat-icon-wrapper"><i className="fa-solid fa-medal"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{podiums}</span>
                            <span className="stat-title">Podios</span>
                        </div>
                    </div>
                    <div className="stat-card purple toggle-modal" onClick={() => openModal('poles')}>
                        <div className="stat-icon-wrapper"><i className="fa-solid fa-stopwatch"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{poles}</span>
                            <span className="stat-title">Poles</span>
                        </div>
                    </div>
                    <div className="stat-card orange toggle-modal" onClick={() => openModal('fastLaps')}>
                        <div className="stat-icon-wrapper"><i className="fa-solid fa-bolt"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{fastLaps}</span>
                            <span className="stat-title">Mejor Vuelta</span>
                        </div>
                    </div>
                </div>

                {modalOpen && (
                    <div className="modal" style={{ display: 'flex' }} onClick={(e) => { if (e.target.className === 'modal') setModalOpen(false); }}>
                        <div className="modal-content">
                            <span className="close-button" onClick={() => setModalOpen(false)}>&times;</span>
                            <h3 id="modal-title">{modalTitle}</h3>
                            <div id="modal-body-content">
                                {modalContent}
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 20px;
                    }

                    /* Animations */
                    .fade-in {
                        opacity: 0;
                        animation: fadeIn 0.6s ease-out forwards;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    /* Hero Section */
                    .driver-hero {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
                        border-radius: 24px;
                        padding: 30px 20px;
                        text-align: center;
                        position: relative;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                        margin-bottom: 30px;
                        overflow: hidden;
                    }

                    .hero-bg {
                        position: absolute;
                        top: 0; left: 0; width: 100%; height: 100%;
                        background-size: cover;
                        background-position: center 20%;
                        filter: blur(15px) brightness(0.25);
                        transform: scale(1.1);
                        z-index: 0;
                    }

                    .driver-hero::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; height: 4px;
                        background: linear-gradient(90deg, var(--accent), #a855f7, var(--accent));
                        z-index: 2;
                    }

                    .hero-content {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .driver-photo-hero {
                        width: 160px;
                        height: 160px;
                        border-radius: 20px;
                        border: 4px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                        margin-bottom: 15px;
                        object-fit: cover;
                        object-position: top;
                    }

                    .driver-info-wrapper {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .driver-name-hero {
                        font-family: 'Russo One', sans-serif;
                        font-size: 2.2rem;
                        margin: 0;
                        background: linear-gradient(180deg, #fff, #cbd5e1);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        line-height: 1.1;
                    }

                    .team-name-badge {
                        color: #94a3b8;
                        font-size: 1.1rem;
                        margin-top: 6px;
                        font-weight: 600;
                    }

                    .division-badge {
                        display: inline-block;
                        background: rgba(59, 130, 246, 0.15);
                        color: var(--accent);
                        padding: 6px 16px;
                        border-radius: 20px;
                        font-weight: 700;
                        font-size: 0.9rem;
                        margin-top: 8px;
                        border: 1px solid rgba(59, 130, 246, 0.3);
                    }

                    .total-points-hero {
                        margin-top: 18px;
                        display: inline-flex;
                        flex-direction: column;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(5px);
                        position: relative;
                        z-index: 1;
                        padding: 10px 30px;
                        border-radius: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .points-val {
                        font-family: 'Russo One', sans-serif;
                        font-size: 2.5rem;
                        color: #fbbf24;
                        line-height: 1;
                    }

                    .points-label {
                        font-size: 0.8rem;
                        color: #94a3b8;
                        letter-spacing: 2px;
                        font-weight: 600;
                    }

                    /* Championship Section */
                    .championship-section {
                        border-radius: 20px;
                        padding: 25px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 25px;
                        margin-bottom: 30px;
                        position: relative;
                        overflow: hidden;
                        transform-style: preserve-3d;
                        transition: all 0.3s ease;
                    }

                    .championship-section.gold-tier {
                        background: linear-gradient(135deg, #F59E0B 0%, #B45309 100%);
                        box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
                        border: 2px solid rgba(255, 255, 255, 0.2);
                        animation: pulseGlow 3s infinite ease-in-out;
                    }

                    .championship-section.gray-tier {
                        background: rgba(30, 41, 59, 0.4);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .championship-section.gray-tier .champ-icon {
                        color: #64748b;
                        filter: none;
                    }

                    .championship-section.gray-tier .champ-count {
                        color: #94a3b8;
                        text-shadow: none;
                    }

                    .championship-section.gray-tier .champ-label {
                        color: #64748b;
                    }

                    @keyframes pulseGlow {
                        0% { box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4); }
                        50% { box-shadow: 0 10px 40px rgba(245, 158, 11, 0.7); }
                        100% { box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4); }
                    }

                    .championship-section.gold-tier::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
                        animation: rotateShine 10s linear infinite;
                    }

                    @keyframes rotateShine {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .champ-icon-wrapper {
                        background: rgba(255, 255, 255, 0.2);
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        backdrop-filter: blur(5px);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                        z-index: 1;
                    }

                    .champ-icon {
                        font-size: 2.5rem;
                        color: #FFF;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                    }

                    .champ-info {
                        display: flex;
                        flex-direction: column;
                        z-index: 1;
                    }

                    .champ-count {
                        font-family: 'Russo One', sans-serif;
                        font-size: 3.5rem;
                        color: white;
                        line-height: 1;
                        text-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    }

                    .champ-label {
                        font-size: 1rem;
                        color: rgba(255, 255, 255, 0.9);
                        font-weight: 700;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }


                    /* Stats Row */
                    .stats-row {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                        margin-bottom: 35px;
                    }

                    .stat-card {
                        background: #1e293b;
                        border-radius: 16px;
                        padding: 22px;
                        display: flex;
                        align-items: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: transform 0.2s, box-shadow 0.2s;
                        cursor: pointer;
                    }

                    .stat-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                    }

                    .stat-card.gold { background: linear-gradient(145deg, #1e293b, rgba(251, 191, 36, 0.1)); border-bottom: 3px solid #fbbf24; }
                    .stat-card.silver { background: linear-gradient(145deg, #1e293b, rgba(148, 163, 184, 0.1)); border-bottom: 3px solid #94a3b8; }
                    .stat-card.purple { background: linear-gradient(145deg, #1e293b, rgba(168, 85, 247, 0.1)); border-bottom: 3px solid #a855f7; }
                    .stat-card.orange { background: linear-gradient(145deg, #1e293b, rgba(249, 115, 22, 0.1)); border-bottom: 3px solid #f97316; }

                    .stat-icon-wrapper {
                        width: 45px;
                        height: 45px;
                        border-radius: 12px;
                        background: rgba(255, 255, 255, 0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        margin-right: 15px;
                    }

                    .gold .stat-icon-wrapper { color: #fbbf24; }
                    .silver .stat-icon-wrapper { color: #94a3b8; }
                    .purple .stat-icon-wrapper { color: #a855f7; }
                    .orange .stat-icon-wrapper { color: #f97316; }

                    .stat-info {
                        display: flex;
                        flex-direction: column;
                    }

                    .stat-number {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.8rem;
                        line-height: 1;
                    }

                    .stat-title {
                        font-size: 0.85rem;
                        color: #94a3b8;
                        text-transform: uppercase;
                        font-weight: 600;
                    }

                    /* Modal Styles */
                    .modal {
                        position: fixed;
                        z-index: 1000;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        background-color: rgba(0,0,0,0.85);
                        backdrop-filter: blur(8px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }

                    .modal-content {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        padding: 2rem;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 24px;
                        width: 100%;
                        max-width: 650px;
                        max-height: 85vh;
                        overflow-y: auto;
                        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
                        position: relative;
                        animation: modalSlideIn 0.3s ease-out;
                    }

                    @keyframes modalSlideIn {
                        from { opacity: 0; transform: scale(0.95) translateY(-20px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }

                    .close-button {
                        color: #94a3b8;
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        font-size: 2rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 8px;
                        background: rgba(255, 255, 255, 0.03);
                    }

                    .close-button:hover {
                        color: var(--accent);
                        background: rgba(59, 130, 246, 0.1);
                        transform: rotate(90deg);
                    }

                    #modal-title {
                        font-family: 'Russo One', sans-serif;
                        color: var(--accent);
                        margin-bottom: 1.5rem;
                        font-size: 1.6rem;
                        padding-right: 40px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    /* Event Grid and Cards */
                    .events-grid {
                        display: grid;
                        gap: 1.25rem;
                    }

                    .event-card {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
                        border-radius: 20px;
                        padding: 1.5rem;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }

                    .event-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background: linear-gradient(90deg, var(--accent), #a855f7);
                    }

                    .event-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
                        border-color: rgba(59, 130, 246, 0.3);
                    }

                    .best-lap-card {
                        border-color: #a855f7;
                        background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(15, 23, 42, 0.9));
                    }

                    .best-lap-card::before {
                        background: linear-gradient(90deg, #a855f7, #d946ef);
                    }

                    .best-lap-badge {
                        margin: 0 auto 0.5rem auto;
                        width: fit-content;
                        background: linear-gradient(135deg, #a855f7, #d946ef);
                        color: white;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 0.7rem;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 4px;
                        box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
                    }

                    .event-card-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 1.25rem;
                        gap: 10px;
                    }

                    .event-race-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex: 1;
                    }

                    .event-icon {
                        color: var(--accent);
                        font-size: 1.1rem;
                    }

                    .race-name {
                        font-weight: 700;
                        font-size: 1.05rem;
                        color: var(--text-main);
                    }

                    .race-date {
                        color: #94a3b8;
                        font-size: 0.85rem;
                        white-space: nowrap;
                    }

                    .lap-time-display {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        padding: 1.25rem;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 16px;
                        margin-bottom: 1rem;
                    }

                    .lap-icon {
                        font-size: 1.5rem;
                        color: var(--accent);
                    }

                    .lap-time {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.8rem;
                        font-weight: 700;
                    }

                    .event-stats-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.75rem;
                    }

                    .stat-box {
                        background: rgba(255, 255, 255, 0.04);
                        border-radius: 12px;
                        padding: 0.85rem;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border: 1px solid rgba(255, 255, 255, 0.06);
                        transition: all 0.2s;
                    }

                    .stat-box:hover {
                        background: rgba(255, 255, 255, 0.08);
                        border-color: rgba(255, 255, 255, 0.12);
                    }

                    .stat-box.points-box {
                        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1));
                        border-color: rgba(59, 130, 246, 0.3);
                    }

                    .stat-icon {
                        color: var(--accent);
                        font-size: 1.1rem;
                        width: 24px;
                        text-align: center;
                    }

                    .stat-content {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        flex: 1;
                    }

                    .stat-label {
                        font-size: 0.7rem;
                        color: #94a3b8;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }

                    .stat-value {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.1rem;
                        color: var(--text-main);
                        line-height: 1;
                    }

                    .event-detail-empty {
                        text-align: center;
                        padding: 3rem 2rem;
                        color: #64748b;
                        font-style: italic;
                        font-size: 1rem;
                    }

                    @media (max-width: 600px) {
                        .driver-name-hero { font-size: 1.6rem; }
                        .stat-card { padding: 15px; }
                        .modal { padding: 10px; }
                        .modal-content { 
                            width: 100%; 
                            max-height: 90vh; 
                            padding: 1.5rem; 
                        }
                        #modal-title { font-size: 1.3rem; }
                        .event-card { padding: 1.25rem; }
                        .race-name { font-size: 0.95rem; }
                        .lap-time { font-size: 1.5rem; }
                    }
                `}</style>
            </div>
        </PullToRefresh>
    );
};

export default Profile;
