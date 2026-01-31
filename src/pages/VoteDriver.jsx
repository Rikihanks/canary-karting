import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useConfig } from '../context/ConfigContext';
import { getLeaderboardData, submitVote, getDOTDResults } from '../services/data';
import { useAuth } from '../context/AuthContext';

const VoteDriver = () => {
    const config = useConfig();
    const { user, logout } = useAuth();
    const [drivers, setDrivers] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDivision, setActiveDivision] = useState(1);
    const [activeSeason, setActiveSeason] = useState("2026");
    const [votedDriver, setVotedDriver] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);
    const [submittingDriver, setSubmittingDriver] = useState(null);

    const [revealedDivs, setRevealedDivs] = useState([]);

    // dotd state: 0 (disabled), 1 (active), 2 (finished)
    const dotdState = parseInt(config?.dotd) || 0;

    const getTodayStr = () => new Date().toISOString().split('T')[0];

    // Load revealed state from localStorage on mount
    useEffect(() => {
        const today = getTodayStr();
        const savedReveals = JSON.parse(localStorage.getItem('ck_reveals') || '{}');
        if (savedReveals[today]) {
            setRevealedDivs(savedReveals[today]);
        }
    }, []);

    useEffect(() => {
        const checkVoteStatus = () => {
            const today = getTodayStr();
            const savedVotes = JSON.parse(localStorage.getItem('ck_votes') || '{}');
            const voteData = savedVotes[today] ? savedVotes[today][activeDivision] : null;

            if (voteData && voteData.hasVoted) {
                setHasAlreadyVoted(true);
                // Try to find the driver in the current list to show who they voted for
                if (drivers.length > 0) {
                    const driver = drivers.find(d => d.name === voteData.votedFor);
                    if (driver) setVotedDriver(driver);
                }
            } else {
                setHasAlreadyVoted(false);
                setVotedDriver(null);
            }
        };

        checkVoteStatus();
    }, [activeDivision, drivers]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [driversData, resultsData] = await Promise.all([
                    getLeaderboardData(),
                    [2, 3].includes(dotdState) ? getDOTDResults() : Promise.resolve([])
                ]);
                setDrivers(driversData);
                setResults(resultsData);
                setLoading(false);
            } catch (err) {
                setError("No se pudieron cargar los datos de la votación.");
                setLoading(false);
            }
        };

        fetchData();
    }, [dotdState]);

    const handleRefresh = async () => {
        const { clearCache } = await import('../services/data');
        clearCache();
        try {
            const [driversData, resultsData] = await Promise.all([
                getLeaderboardData(),
                [2, 3].includes(dotdState) ? getDOTDResults() : Promise.resolve([])
            ]);
            setDrivers(driversData);
            setResults(resultsData);
        } catch (err) {
            setError("Error al refrescar la lista.");
        }
    };

    const handleVote = async (driver) => {
        setSubmittingDriver(driver.name);
        const today = getTodayStr();

        try {
            // First call backend
            const result = await submitVote(driver.name, activeDivision, user?.nombre);

            if (result.success) {
                const savedVotes = JSON.parse(localStorage.getItem('ck_votes') || '{}');

                if (!savedVotes[today]) savedVotes[today] = {};

                savedVotes[today][activeDivision] = {
                    hasVoted: true,
                    date: today,
                    division: activeDivision,
                    votedFor: driver.name
                };

                localStorage.setItem('ck_votes', JSON.stringify(savedVotes));
                setVotedDriver(driver);
                setHasAlreadyVoted(true);
                setShowSuccess(true);
            } else {
                alert("Hubo un problema al registrar tu voto. Por favor, inténtalo de nuevo.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión al votar.");
        } finally {
            setSubmittingDriver(null);
        }

        // Success modal disappears after 5 seconds
        setTimeout(() => {
            setShowSuccess(false);
        }, 5000);
    };

    const handleReveal = (divId) => {
        // Find latest date results for reveal logic consistency
        const latestDate = results.length > 0
            ? results.reduce((max, r) => r.date > max ? r.date : max, results[0].date)
            : null;
        const currentResults = latestDate ? results.filter(r => r.date === latestDate) : [];

        // Sequential check: 3 -> 2 -> 1
        if (divId === 2) {
            const hasDiv3Results = currentResults.some(r => r.division === 3);
            if (hasDiv3Results && !revealedDivs.includes(3)) return;
        }
        if (divId === 1) {
            const hasDiv2Results = currentResults.some(r => r.division === 2);
            if (hasDiv2Results && !revealedDivs.includes(2)) return;
            const hasDiv3Results = currentResults.some(r => r.division === 3);
            if (hasDiv3Results && !revealedDivs.includes(3) && !hasDiv2Results) return;
        }

        if (!revealedDivs.includes(divId)) {
            const updatedReveals = [...revealedDivs, divId];
            setRevealedDivs(updatedReveals);

            // Persist to localStorage
            const today = getTodayStr();
            const savedReveals = JSON.parse(localStorage.getItem('ck_reveals') || '{}');
            savedReveals[today] = updatedReveals;
            localStorage.setItem('ck_reveals', JSON.stringify(savedReveals));
        }
    };

    const filteredDrivers = drivers
        .filter(driver => driver.division === activeDivision)
        .filter(driver => driver.season === activeSeason)
        .sort((a, b) => a.name.localeCompare(b.name));

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em' }}></i>
                <p>Cargando pilotos...</p>
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

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''} className="ptr">
            <div className="container">


                {dotdState === 0 ? (
                    <div className="disabled-state fade-in">
                        <i className="fa-solid fa-lock" style={{ fontSize: '3rem', marginBottom: '20px', color: '#94a3b8' }}></i>
                        <h2>Votaciones Cerradas</h2>
                        <p>Las votaciones para el Piloto del Día no están activas en este momento.</p>
                    </div>
                ) : (dotdState === 2 || dotdState === 3) ? (
                    <>
                        <div className="winner-announcement fade-in">
                            <i className="fa-solid fa-crown winner-crown"></i>
                            <h2 className="dotd-results-title">PILOTO DEL DÍA</h2>
                        </div>

                        <div className="winners-container fade-in">
                            {(() => {
                                const latestDate = results.length > 0
                                    ? results.reduce((max, r) => r.date > max ? r.date : max, results[0].date)
                                    : null;
                                const currentResults = latestDate ? results.filter(r => r.date === latestDate) : [];

                                return [1, 2, 3].sort((a, b) => b - a).map(divId => {
                                    const divResults = currentResults.filter(r => r.division === divId);
                                    if (divResults.length === 0) return null;

                                    const maxVotes = Math.max(...divResults.map(r => r.votes));
                                    const winners = divResults.filter(r => r.votes === maxVotes);
                                    const isTie = winners.length > 1;

                                    // In dotdState 3, everything is already revealed
                                    const isRevealed = dotdState === 3 || revealedDivs.includes(divId);

                                    // Sequential Reveal Logic: 3 -> 2 -> 1
                                    let canReveal = dotdState === 3 || revealsPrevious(divId, currentResults, revealedDivs);

                                    function revealsPrevious(id, res, reveals) {
                                        if (id === 3) return true;
                                        if (id === 2) {
                                            const has3 = res.some(r => r.division === 3);
                                            return !has3 || reveals.includes(3);
                                        }
                                        if (id === 1) {
                                            const has2 = res.some(r => r.division === 2);
                                            const has3 = res.some(r => r.division === 3);
                                            if (has2) return reveals.includes(2);
                                            if (has3) return reveals.includes(3);
                                            return true;
                                        }
                                        return true;
                                    }

                                    const lockMessage = divId === 2 ? 'REVELA 3ª DIV PRIMERO' : 'REVELA DIV ANTERIOR';

                                    return (
                                        <div key={divId} className={`division-results-section fade-in ${!canReveal ? 'is-locked' : ''}`}>
                                            <h3 className="division-result-header">
                                                {divId}ª División
                                            </h3>

                                            <div className="winners-reveal-grid">
                                                <div
                                                    className={`reveal-card-container ${isRevealed ? 'is-revealed' : ''} ${!isRevealed && !canReveal ? 'cant-tap' : ''}`}
                                                    onClick={() => !isRevealed && canReveal && handleReveal(divId)}
                                                >
                                                    <div className="reveal-card-inner">
                                                        {/* FRONT: SPOILER MASK */}
                                                        <div className="reveal-card-face face-front">
                                                            <div className="spoiler-content">
                                                                <div className="mystery-icon">
                                                                    <i className="fa-solid fa-user-secret"></i>
                                                                </div>
                                                                <span className="tap-hint">
                                                                    {!canReveal ? lockMessage : 'TOCAR PARA REVELAR'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* BACK: ACTUAL WINNERS (LIST) */}
                                                        <div className="reveal-card-face face-back">
                                                            <div className="winners-list-back">
                                                                {isTie && (
                                                                    <div className="tie-indicator-mini">
                                                                        <i className="fa-solid fa-scale-balanced"></i>
                                                                        <span>¡EMPATE!</span>
                                                                    </div>
                                                                )}
                                                                {winners.map((winner, idx) => {
                                                                    const driverInfo = drivers.find(d => d.name === winner.driver);
                                                                    return (
                                                                        <Link
                                                                            key={winner.driver}
                                                                            to={`/profile?driver=${encodeURIComponent(winner.driver)}&season=${activeSeason}`}
                                                                            className="winner-card-mini-link fade-in"
                                                                            style={{ animationDelay: `${idx * 0.2}s` }}
                                                                        >
                                                                            <div className="winner-img-container">
                                                                                <img src={driverInfo?.photo || 'https://www.w3schools.com/howto/img_avatar.png'} alt={winner.driver} />
                                                                                <div className="winner-trophy"><i className="fa-solid fa-trophy"></i></div>
                                                                            </div>
                                                                            <div className="winner-info">
                                                                                <div className="winner-name">{winner.driver}</div>
                                                                                <div className="winner-team">{driverInfo?.team || 'INDEPENDIENTE'}</div>
                                                                                <div className="winner-votes">{winner.votes} votos</div>
                                                                            </div>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            })()}

                            {results.length === 0 && (
                                <p className="no-data-msg">No hay votos registrados.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="voting-main fade-in">
                        <div className="division-select-container">
                            <p>Vota por el piloto que mejor rendimiento ha tenido hoy.</p>
                            <select
                                className="division-dropdown"
                                value={activeDivision}
                                onChange={(e) => setActiveDivision(parseInt(e.target.value))}
                            >
                                <option value="1">1ª División</option>
                                <option value="2">2ª División</option>
                                <option value="3">3ª División</option>
                            </select>
                        </div>

                        {hasAlreadyVoted && (
                            <div className="already-voted-msg">
                                <i className="fa-solid fa-circle-info"></i> Tu voto para esta división ha sido para {votedDriver?.name}
                            </div>
                        )}

                        <div className="voting-grid">
                            {filteredDrivers.map((driver, index) => (
                                <div
                                    key={driver.name}
                                    className="vote-card fade-in"
                                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                                >
                                    <div className="vote-card-inner">
                                        <div className="driver-img-wrapper">
                                            <img src={driver.photo} alt={driver.name} className="driver-img" />
                                        </div>
                                        <div className="driver-info">
                                            <h3 className="driver-name">{driver.name}</h3>
                                            <span className="team-name">{driver.team}</span>
                                        </div>
                                        <button
                                            className={`vote-btn ${votedDriver?.name === driver.name ? 'voted' : ''}`}
                                            onClick={() => handleVote(driver)}
                                            disabled={showSuccess || hasAlreadyVoted || !!submittingDriver || votedDriver !== null}
                                        >
                                            {submittingDriver === driver.name ? (
                                                <><i className="fa-solid fa-spinner fa-spin"></i> Enviando...</>
                                            ) : votedDriver?.name === driver.name ? (
                                                <><i className="fa-solid fa-check"></i> Votado</>
                                            ) : hasAlreadyVoted ? (
                                                <><i className="fa-solid fa-xmark"></i> </>
                                            ) : (
                                                <><i className="fa-solid fa-thumbs-up"></i> Votar</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showSuccess && (
                    <div className="success-overlay" onClick={() => setShowSuccess(false)}>
                        <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="success-icon">
                                <i className="fa-solid fa-trophy"></i>
                            </div>
                            <h2>¡Voto Registrado!</h2>
                            <p>Has votado por <strong>{votedDriver?.name}</strong> como Piloto del Día.</p>
                            <div className="driver-mini-stats">
                                <img className='driver-img' src={votedDriver?.photo} alt={votedDriver?.name} />
                                <div>
                                    <div className="mini-name">{votedDriver?.name}</div>
                                    <div className="mini-team">{votedDriver?.team}</div>
                                </div>
                            </div>
                            <button className="close-success-btn" onClick={() => setShowSuccess(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

                <style>{`
                    .division-dropdown {
                        margin-top: 20px;
                    }
                    .disabled-state {
                        text-align: center;
                        padding: 60px 20px;
                        background: var(--card-bg);
                        border-radius: 30px;
                        border: 1px solid rgba(255,255,255,0.05);
                        margin-top: 20px;
                    }

                    .winners-container {
                        text-align: center;
                        padding: 20px 0;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                    }

                    /* Ensure PullToRefresh and its children fill the height */
                    .ptr, 
                    .ptr__children {
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                        min-height: 100%;
                    }

                    .container {
                        padding: 1rem;
                        max-width: 800px;
                        margin: 0 auto;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                    }

                    .no-data-msg {
                        color: var(--text-muted);
                        margin-top: 20px;
                    }

                    .winner-announcement {
                        margin-bottom: 20px;
                        text-align: center;
                    }

                    .division-results-section {
                        margin-bottom: 30px;
                    }

                    .division-results-section:last-child {
                        margin-bottom: 0;
                    }

                    .division-result-header {
                        font-family: 'Russo One', sans-serif;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        font-size: 1rem;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 15px;
                    }

                    .division-result-header::before,
                    .division-result-header::after {
                        content: '';
                        flex-grow: 1;
                        height: 1px;
                        background: rgba(255,255,255,0.1);
                    }

                    .winner-crown {
                        font-size: 3rem;
                        color: #fbbf24;
                        margin-bottom: 20px;
                        filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));
                    }

                    .winners-list {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        max-width: 400px;
                        margin: 0 auto;
                    }

                    .winner-card {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
                        border: 2px solid #fbbf24;
                        border-radius: 25px;
                        padding: 25px;
                        display: flex;
                        align-items: center;
                        gap: 25px;
                        text-align: left;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(251, 191, 36, 0.2);
                        animation: winnerFloat 3s ease-in-out infinite;
                    }

                    @keyframes winnerFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }

                    .winner-img-container {
                        position: relative;
                        width: 100px;
                        height: 100px;
                        flex-shrink: 0;
                    }

                    .winner-img-container img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                        object-position: top;
                        border: 3px solid #fbbf24;
                    }

                    .winner-trophy {
                        position: absolute;
                        bottom: -5px;
                        right: -5px;
                        background: #fbbf24;
                        color: #0f172a;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1rem;
                        border: 2px solid #0f172a;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                    }

                    .winner-info {
                        flex-grow: 1;
                    }

                    .winner-name {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.5rem;
                        color: #fbbf24;
                        line-height: 1.2;
                        margin-bottom: 5px;
                    }

                    .winner-team {
                        font-size: 0.9rem;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                    }

                    .winner-votes {
                        font-weight: 700;
                        color: white;
                        background: rgba(255,255,255,0.1);
                        padding: 4px 12px;
                        border-radius: 10px;
                        display: inline-block;
                        font-size: 0.9rem;
                    }

                    .tie-indicator-mini {
                        background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
                        color: #0f172a;
                        padding: 6px 15px;
                        border-radius: 50px;
                        font-family: 'Russo One', sans-serif;
                        font-size: 0.9rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        margin: 0 auto 10px;
                        width: fit-content;
                        box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
                        letter-spacing: 1px;
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.4); }
                        50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(251, 191, 36, 0.6); }
                        100% { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.4); }
                    }

                    .fade-in {
                        animation: fadeIn 0.5s ease-out forwards;
                    }

                    .already-voted-msg {
                        background: rgba(59, 130, 246, 0.1);
                        border: 1px solid rgba(59, 130, 246, 0.3);
                        color: var(--accent);
                        padding: 12px 20px;
                        border-radius: 12px;
                        text-align: center;
                        margin-bottom: 20px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    }

                    .dotd-results-title {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.8rem;
                        margin-top: 10px;
                        background: linear-gradient(180deg, #fff 0%, #aaa 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }

                    .winners-reveal-grid {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        max-width: 400px;
                        margin: 0 auto;
                    }

                    .reveal-card-container {
                        perspective: 1200px;
                        width: 100%;
                        cursor: pointer;
                        transition: transform 0.3s;
                    }

                    .reveal-card-container:active {
                        transform: scale(0.98);
                    }

                    .reveal-card-container.cant-tap {
                        cursor: not-allowed;
                        opacity: 0.7;
                    }

                    .reveal-card-inner {
                        position: relative;
                        width: 100%;
                        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        transform-style: preserve-3d;
                    }

                    .reveal-card-container.is-revealed .reveal-card-inner {
                        transform: rotateY(180deg);
                    }

                    .reveal-card-face {
                        position: relative;
                        width: 100%;
                        backface-visibility: hidden;
                        border-radius: 25px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 120px;
                    }

                    .face-back {
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform: rotateY(180deg);
                        justify-content: flex-start;
                        min-height: 180px;
                    }

                    /* Spoiler Face Styling */
                    .face-front {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        border: 2px dashed rgba(251, 191, 36, 0.3);
                        padding: 30px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                        transition: all 0.3s;
                    }

                    .reveal-card-container:hover .face-front:not(.is-locked .face-front) {
                        border-color: #fbbf24;
                        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
                        box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
                    }

                    .spoiler-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 15px;
                    }

                    .mystery-icon {
                        font-size: 2.5rem;
                        color: #fbbf24;
                        opacity: 0.6;
                        animation: pulseIcon 2s infinite;
                    }

                    .tap-hint {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1rem;
                        color: #94a3b8;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }

                    .is-locked .face-front {
                        background: #0f172a;
                        border-color: rgba(255,255,255,0.05);
                        opacity: 0.5;
                    }

                    .is-locked .mystery-icon {
                        color: #475569;
                        animation: none;
                    }

                    @keyframes pulseIcon {
                        0%, 100% { transform: scale(1); opacity: 0.6; }
                        50% { transform: scale(1.1); opacity: 0.9; }
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .winners-list-back {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        width: 100%;
                    }

                    .winner-card-mini {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
                        border: 2px solid #fbbf24;
                        border-radius: 20px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    }

                    .winner-card-mini .winner-img-container {
                        width: 60px;
                        height: 60px;
                    }

                    .winner-card-mini .winner-name {
                        font-size: 1.1rem;
                    }

                    .winner-card-mini .winner-info {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }

                    .division-results-section.is-locked {
                        filter: grayscale(1);
                        pointer-events: none;
                    }

                    .vote-header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-top: 20px;
                    }
                    .vote-header h1 {
                        margin-bottom: 10px;
                    }
                    .vote-header p {
                        color: var(--text-muted);
                        font-size: 1.1rem;
                    }

                    .voting-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 20px;
                        margin-top: 30px;
                        padding-bottom: 100px;
                    }

                    .vote-card {
                        perspective: 1000px;
                    }

                    .vote-card-inner {
                        background: var(--card-bg);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 20px;
                        padding: 15px;
                        text-align: center;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }

                    .vote-card-inner:hover {
                        transform: translateY(-8px);
                        border-color: var(--accent);
                        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(59, 130, 246, 0.2);
                    }

                    .driver-img-wrapper {
                        position: relative;
                        width: 100px;
                        height: 100px;
                        margin: 0 auto 15px;
                    }

                    .driver-img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                        object-position: top;
                        border: 3px solid #334155;
                        transition: border-color 0.3s;
                    }

                    .vote-card-inner:hover .driver-img {
                        border-color: var(--accent);
                    }

                    .winner-card-mini-link {
                        text-decoration: none;
                        color: inherit;
                        background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
                        border: 2px solid #fbbf24;
                        border-radius: 20px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                        transition: transform 0.2s, box-shadow 0.2s;
                    }

                    .winner-card-mini-link:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 15px rgba(251, 191, 36, 0.3);
                        border-color: #fff;
                    }

                    .division-tag {
                        position: absolute;
                        bottom: -5px;
                        right: -5px;
                        background: var(--accent);
                        color: white;
                        font-family: 'Russo One', sans-serif;
                        font-size: 0.8rem;
                        padding: 2px 8px;
                        border-radius: 10px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                    }

                    .driver-info {
                        flex-grow: 1;
                        margin-bottom: 15px;
                    }

                    .driver-name {
                        font-size: 1.1rem;
                        font-weight: 700;
                        margin-bottom: 4px;
                        color: var(--text-main);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .team-name {
                        font-size: 0.8rem;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .vote-btn {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid var(--accent);
                        background: transparent;
                        color: var(--accent);
                        border-radius: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    }

                    .vote-btn:hover:not(:disabled) {
                        background: var(--accent);
                        color: white;
                        box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
                    }

                    .vote-btn.voted {
                        background: var(--success);
                        border-color: var(--success);
                        color: white;
                    }

                    /* Success Overlay */
                    .success-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0, 0, 0, 0.8);
                        backdrop-filter: blur(10px);
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        animation: fadeIn 0.3s ease-out;
                    }

                    .success-modal {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 30px;
                        padding: 40px;
                        max-width: 400px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                        animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }

                    @keyframes scaleIn {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }

                    .success-icon {
                        width: 80px;
                        height: 80px;
                        background: rgba(251, 191, 36, 0.1);
                        border: 2px solid #fbbf24;
                        color: #fbbf24;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2.5rem;
                        margin: 0 auto 20px;
                        animation: bounce 2s infinite;
                    }

                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                        40% {transform: translateY(-10px);}
                        60% {transform: translateY(-5px);}
                    }

                    .driver-mini-stats {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        background: rgba(255,255,255,0.05);
                        padding: 15px;
                        border-radius: 15px;
                        margin: 20px 0;
                        text-align: left;
                    }

                    .driver-mini-stats img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: 2px solid var(--accent);
                        object-fit: cover;
                    }

                    .mini-name {
                        font-weight: 700;
                        font-size: 1rem;
                    }

                    .mini-team {
                        font-size: 0.8rem;
                        color: var(--text-muted);
                    }

                    .close-success-btn {
                        width: 100%;
                        padding: 12px;
                        background: var(--accent);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        margin-top: 10px;
                    }

                    @media (max-width: 480px) {
                        .voting-grid {
                            gap: 12px;
                        }
                        .vote-card-inner {
                            padding: 12px;
                        }
                        .driver-img-wrapper {
                            width: 70px;
                            height: 70px;
                        }
                        .driver-name {
                            font-size: 0.95rem;
                        }
                    }
                `}</style>
            </div>
        </PullToRefresh>
    );
};

export default VoteDriver;
