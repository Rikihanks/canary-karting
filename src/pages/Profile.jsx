import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
            title = 'Detalle de Victorias';
            filteredEvents = driverHistory.filter(r => r.position === 1);
            content = generateEventListHTML(filteredEvents);
        } else if (type === 'podiums') {
            title = 'Detalle de Podios (Top 3)';
            filteredEvents = driverHistory.filter(r => r.position > 0 && r.position <= 3);
            content = generateEventListHTML(filteredEvents);
        } else if (type === 'poles') {
            title = 'Detalle de Poles (P1 en Clasificación)';
            filteredEvents = driverHistory.filter(r => r.pole_pos === 1);
            content = generateEventListHTML(filteredEvents);
        } else if (type === 'fastLaps') {
            title = 'Historial de Vueltas Rápidas Personales';
            content = generateFastestLapHTML(driverHistory);
        }

        setModalTitle(title);
        setModalContent(content);
        setModalOpen(true);
    };

    const generateEventListHTML = (events) => {
        if (events.length === 0) return <div className="event-detail-empty">No hay registros.</div>;
        return (
            <ul className="event-list">
                {events.map((event, index) => (
                    <li key={index} className="event-item">
                        <div className="event-header">
                            <span className="event-race-name">{event.race} ({event.date})</span>
                            <span className="event-points">{event.points_gained} PTS</span>
                        </div>
                        <div className="event-body">
                            <p><strong>Posición Final:</strong> {event.position}º</p>
                            <p><strong>Posición de salida:</strong> P{event.pole_pos}</p>
                            <p><strong>Condición:</strong> {event.condition}</p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    const generateFastestLapHTML = (history) => {
        const validLaps = history.filter(event =>
            event.fastest_lap && event.fastest_lap !== 'N/A' && event.fastest_lap.trim() !== '-'
        );

        if (validLaps.length === 0) return <div className="event-detail-empty">No hay tiempos de vuelta rápida registrados.</div>;

        validLaps.sort((a, b) => a.fastest_lap.localeCompare(b.fastest_lap));

        return (
            <ul className="event-list">
                {validLaps.map((event, index) => {
                    const isBestOverall = index === 0;
                    return (
                        <li key={index} className={`event-item ${isBestOverall ? 'best-lap-overall' : ''}`}>
                            <div className="event-header">
                                <span className="event-race-name">{event.race} ({event.date})</span>
                            </div>
                            <div className="event-body">
                                <p><strong>Tiempo:</strong> <span style={{ fontWeight: 800, color: isBestOverall ? '#9728c5' : '#10b981' }}>{event.fastest_lap}</span></p>
                                <p><strong>Condición:</strong> {event.condition}</p>
                                <p>Posición Final: {event.position}º</p>
                            </div>
                            <div>
                                <span className="event-points">{isBestOverall ? 'MEJOR HISTÓRICA' : ''}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}><i className="fa-solid fa-spinner fa-spin"></i> Cargando perfil...</div>;
    if (error) return <div className="container"><div className="profile-card"><h1 style={{ color: '#ef4444' }}>{error}</h1></div></div>;

    const victories = driverHistory.filter(r => r.position === 1).length;
    const podiums = driverHistory.filter(r => r.position > 0 && r.position <= 3).length;
    const poles = driverHistory.filter(r => r.pole_pos === 1).length;
    const fastLaps = driverHistory.filter(r => r.fastest_lap && r.fastest_lap !== 'N/A' && r.fastest_lap.trim() !== '-').length;

    return (
        <div className="container">
            <div id="profile-content">
                <div className="profile-card">
                    <img src={driverStats.photo} alt={driverStats.name} className="avatar-lg" />
                    <div className="name-lg">{driverStats.name}</div>
                    <div className="team-lg">{driverStats.team}</div>
                    <div className="division-lg">
                        <i className="fa-solid fa-medal division-icon"></i> {driverStats.division} Division
                    </div>

                    <div className="stats-grid">
                        <div className="stat-item toggle-modal" onClick={() => openModal('victories')}>
                            <i className="fa-solid fa-trophy stat-icon"></i>
                            <div className="stat-value">{victories}</div>
                            <div className="stat-label">Victorias</div>
                        </div>
                        <div className="stat-item toggle-modal" onClick={() => openModal('podiums')}>
                            <i className="fa-solid fa-medal stat-icon"></i>
                            <div className="stat-value">{podiums}</div>
                            <div className="stat-label">Podios</div>
                        </div>
                        <div className="stat-item toggle-modal" onClick={() => openModal('poles')}>
                            <i className="fa-solid fa-stopwatch stat-icon"></i>
                            <div className="stat-value">{poles}</div>
                            <div className="stat-label">Poles</div>
                        </div>
                        <div className="stat-item toggle-modal" onClick={() => openModal('fastLaps')}>
                            <i className="fa-solid fa-bolt stat-icon"></i>
                            <div className="stat-value">{fastLaps}</div>
                            <div className="stat-label">Mejor Vuelta</div>
                        </div>
                    </div>

                    <div className="points-box">
                        <h2>PUNTOS TOTALES</h2>
                        <div className="points-lg">{driverStats.points}</div>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="modal" style={{ display: 'block' }} onClick={(e) => { if (e.target.className === 'modal') setModalOpen(false); }}>
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
                /* Profile Specific Styles */
                .event-item {
                    display:block;
                }
                .profile-card {
                    background: var(--card-bg);
                    border-radius: 20px;
                    padding: 2rem;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 20px;
                }

                .avatar-lg {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    border: 4px solid var(--accent);
                    margin-bottom: 1rem;
                    object-fit: cover;
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
                }

                .name-lg {
                    font-family: 'Russo One', sans-serif;
                    font-size: 2rem;
                }

                .team-lg {
                    color: var(--text-muted);
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                }

                .division-lg {
                    display: inline-block;
                    background: rgba(59, 130, 246, 0.2);
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    color: var(--accent);
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat-item {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    border-radius: 15px;
                    transition: transform 0.2s;
                    cursor: pointer;
                }

                .stat-item:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.1);
                }

                .stat-icon {
                    font-size: 1.5rem;
                    color: var(--accent);
                    margin-bottom: 0.5rem;
                }

                .stat-value {
                    font-family: 'Russo One';
                    font-size: 2rem;
                    margin-bottom: 0.2rem;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }

                .points-box {
                    background: linear-gradient(135deg, var(--accent) 0%, #1d4ed8 100%);
                    padding: 1.5rem;
                    border-radius: 15px;
                    color: white;
                }

                .points-box h2 {
                    color: white;
                    font-size: 1rem;
                    margin: 0 0 0.5rem 0;
                    opacity: 0.9;
                    text-shadow: none;
                }

                .points-lg {
                    font-family: 'Russo One';
                    font-size: 3rem;
                    line-height: 1;
                }

                /* Modal Styles */
                .modal {
                    display: none; 
                    position: fixed; 
                    z-index: 200; 
                    left: 0;
                    top: 0;
                    width: 100%; 
                    height: 100%; 
                    overflow: auto; 
                    background-color: rgba(0,0,0,0.8); 
                    backdrop-filter: blur(5px);
                }

                .modal-content {
                    background-color: #1e293b;
                    margin: 15% auto; 
                    padding: 20px;
                    border: 1px solid #334155;
                    width: 90%; 
                    max-width: 500px;
                    border-radius: 15px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                    animation: modalSlideIn 0.3s ease-out;
                }

                @keyframes modalSlideIn {
                    from {transform: translateY(-50px); opacity: 0;}
                    to {transform: translateY(0); opacity: 1;}
                }

                .close-button {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .close-button:hover,
                .close-button:focus {
                    color: white;
                    text-decoration: none;
                    cursor: pointer;
                }

                #modal-title {
                    margin-top: 0;
                    color: var(--accent);
                    font-family: 'Russo One';
                    border-bottom: 1px solid #334155;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }

                .event-detail-empty {
                    text-align: center;
                    color: #94a3b8;
                    padding: 20px;
                }

                .event-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }

                .event-race-name {
                    font-weight: bold;
                    color: var(--text-main);
                }

                .event-points {
                    font-family: 'Russo One';
                    color: var(--accent);
                    font-size: 0.9em;
                }

                .event-body {
                    font-size: 0.9em;
                    color: #cbd5e1;
                }
                
                .best-lap-overall {
                    border-left-color: #9728c5; /* Purple for best overall */
                    background: linear-gradient(90deg, rgba(151, 40, 197, 0.1) 0%, rgba(22, 32, 57, 1) 100%);
                }
            `}</style>
        </div>
    );
};

export default Profile;
