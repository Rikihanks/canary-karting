import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getTeamsData, getLeaderboardData } from '../services/data';

const TeamProfile = () => {
    const [searchParams] = useSearchParams();
    const teamName = searchParams.get('team');

    const [teamStats, setTeamStats] = useState(null);
    const [pilotsData, setPilotsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!teamName) {
            setError("No se especificó un equipo.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [teams, leaderboard] = await Promise.all([
                    getTeamsData(),
                    getLeaderboardData()
                ]);

                const stats = teams.find(t => t.name === teamName);

                if (!stats) {
                    setError("Equipo no encontrado.");
                } else {
                    setTeamStats(stats);
                    // Find pilot data (photos) from leaderboard
                    const teamPilots = leaderboard.filter(d => stats.pilots.includes(d.name));
                    // Also include pilots that might be in the team list but not in leaderboard (fallback)
                    const allPilots = stats.pilots.map(name => {
                        const found = teamPilots.find(p => p.name === name);
                        return found || { name: name, photo: null };
                    });
                    setPilotsData(allPilots);
                }
            } catch (err) {
                console.error(err);
                setError("Error de conexión.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teamName]);

    if (loading) return <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}><i className="fa-solid fa-spinner fa-spin"></i> Cargando perfil de equipo...</div>;
    if (error) return <div className="container"><div className="profile-card"><h1 style={{ color: '#ef4444' }}>{error}</h1></div></div>;

    const handleRefresh = async () => {
        const { clearCache } = await import('../services/data');
        clearCache();
        try {
            const [teams, leaderboard] = await Promise.all([
                getTeamsData(),
                getLeaderboardData()
            ]);

            const stats = teams.find(t => t.name === teamName);

            if (!stats) {
                setError("Equipo no encontrado.");
            } else {
                setTeamStats(stats);
                // Find pilot data (photos) from leaderboard
                const teamPilots = leaderboard.filter(d => stats.pilots.includes(d.name));
                // Also include pilots that might be in the team list but not in leaderboard (fallback)
                const allPilots = stats.pilots.map(name => {
                    const found = teamPilots.find(p => p.name === name);
                    return found || { name: name, photo: null };
                });
                setPilotsData(allPilots);
            }
        } catch (err) {
            console.error(err);
            setError("Error de conexión.");
        }
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="container">
                {/* Hero Section */}
                <div className="team-hero fade-in">
                    <div className="hero-content">
                        {teamStats.logo ? (
                            <img src={teamStats.logo} alt={teamStats.name} className="team-logo-hero" />
                        ) : (
                            <div className="team-logo-placeholder">
                                <i className="fa-solid fa-users"></i>
                            </div>
                        )}
                        <h1 className="team-name-hero">{teamStats.name}</h1>
                        <div className="division-badge">
                            {teamStats.division}ª DIVISIÓN
                        </div>
                    </div>
                    <div className="total-points-hero">
                        <span className="points-val">{teamStats.points}</span>
                        <span className="points-label">PUNTOS</span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="stats-row fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card gold">
                        <div className="stat-icon-wrapper"><i className="fa-solid fa-trophy"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{teamStats.wins}</span>
                            <span className="stat-title">Victorias</span>
                        </div>
                    </div>
                    <div className="stat-card silver">
                        <div className="stat-icon-wrapper"><i className="fa-solid fa-medal"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{teamStats.podiums}</span>
                            <span className="stat-title">Podios</span>
                        </div>
                    </div>
                    <div className="stat-card purple">
                        <div className="stat-icon-wrapper"><i className="fa-solid fa-stopwatch"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{teamStats.poles}</span>
                            <span className="stat-title">Poles</span>
                        </div>
                    </div>
                </div>

                {/* Roster Section */}
                <div className="roster-section fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="section-title">PILOTOS</h2>
                    <div className="roster-grid">
                        {pilotsData.map((pilot, index) => (
                            <Link key={index} to={`/profile?driver=${encodeURIComponent(pilot.name)}`} className="pilot-card-link">
                                <div className="pilot-card">
                                    <div className="pilot-img-wrapper">
                                        {pilot.photo ? (
                                            <img src={pilot.photo} alt={pilot.name} className="pilot-img" />
                                        ) : (
                                            <div className="pilot-img-placeholder"><i className="fa-solid fa-helmet-safety"></i></div>
                                        )}
                                    </div>
                                    <div className="pilot-name">{pilot.name}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <style>{`
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 15px;
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
                    .team-hero {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
                        border-radius: 24px;
                        padding: 20px 15px;
                        text-align: center;
                        position: relative;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                        margin-bottom: 25px;
                        overflow: hidden;
                    }

                    .team-hero::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; height: 4px;
                        background: linear-gradient(90deg, var(--accent), #a855f7, var(--accent));
                    }

                    .team-logo-hero {
                        width: 90px;
                        height: 90px;
                        border-radius: 50%;
                        border: 4px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
                        margin-bottom: 12px;
                        object-fit: cover;
                    }

                    .team-logo-placeholder {
                        width: 90px;
                        height: 90px;
                        border-radius: 50%;
                        background: #334155;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2.5rem;
                        margin: 0 auto 12px auto;
                        border: 4px solid rgba(255, 255, 255, 0.1);
                    }

                    .team-name-hero {
                        font-family: 'Russo One', sans-serif;
                        font-size: 2rem;
                        margin: 0;
                        background: linear-gradient(180deg, #fff, #cbd5e1);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    .division-badge {
                        display: inline-block;
                        background: rgba(59, 130, 246, 0.15);
                        color: var(--accent);
                        padding: 6px 16px;
                        border-radius: 20px;
                        font-weight: 700;
                        font-size: 0.9rem;
                        margin-top: 10px;
                        border: 1px solid rgba(59, 130, 246, 0.3);
                    }

                    .total-points-hero {
                        margin-top: 15px;
                        display: inline-flex;
                        flex-direction: column;
                        background: rgba(0, 0, 0, 0.3);
                        padding: 8px 25px;
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

                    /* Stats Row */
                    .stats-row {
                        display: flex;
                        gap: 12px;
                        margin-bottom: 30px;
                    }

                    .stat-card {
                        flex: 1;
                        background: #1e293b;
                        border-radius: 16px;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: transform 0.2s, box-shadow 0.2s;
                    }

                    .stat-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                    }

                    .stat-card.gold { background: linear-gradient(145deg, #1e293b, rgba(251, 191, 36, 0.1)); border-bottom: 3px solid #fbbf24; }
                    .stat-card.silver { background: linear-gradient(145deg, #1e293b, rgba(148, 163, 184, 0.1)); border-bottom: 3px solid #94a3b8; }
                    .stat-card.purple { background: linear-gradient(145deg, #1e293b, rgba(168, 85, 247, 0.1)); border-bottom: 3px solid #a855f7; }

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

                    /* Roster Section */
                    .section-title {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.3rem;
                        margin-bottom: 15px;
                        color: var(--text-main);
                        border-left: 4px solid var(--accent);
                        padding-left: 15px;
                    }

                    .roster-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                        gap: 15px;
                    }

                    .pilot-card-link {
                        text-decoration: none;
                        color: inherit;
                    }

                    .pilot-card {
                        background: #1e293b;
                        border-radius: 16px;
                        padding: 15px;
                        text-align: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: all 0.3s ease;
                    }

                    .pilot-card:hover {
                        transform: translateY(-5px);
                        background: #253045;
                        border-color: var(--accent);
                        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
                    }

                    .pilot-img-wrapper {
                        width: 70px;
                        height: 70px;
                        margin: 0 auto 12px auto;
                        position: relative;
                    }

                    .pilot-img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 3px solid rgba(255, 255, 255, 0.1);
                    }

                    .pilot-img-placeholder {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #334155;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        color: #94a3b8;
                    }

                    .pilot-name {
                        font-weight: 700;
                        font-size: 1rem;
                        margin-bottom: 5px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .pilot-role {
                        font-size: 0.75rem;
                        color: var(--accent);
                        font-weight: 600;
                        letter-spacing: 1px;
                    }

                    @media (max-width: 600px) {
                        .team-name-hero { font-size: 1.8rem; }
                        .stats-row { flex-direction: column; gap: 10px; }
                        .stat-card { padding: 15px; }
                        .roster-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                `}</style>
            </div>
        </PullToRefresh>
    );
};

export default TeamProfile;
