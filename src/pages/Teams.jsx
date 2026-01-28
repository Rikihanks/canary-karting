import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getTeamsData } from '../services/data';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDivision, setActiveDivision] = useState(1);
    const [searchParams] = useSearchParams();
    const season = searchParams.get('season') || '2025';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTeamsData();
                setTeams(data);
                setLoading(false);
            } catch (err) {
                setError("Error al obtener los datos de la clasificación de equipos, recarga la web.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredTeams = teams
        .filter(team => team.division === activeDivision && (team.season === season))
        .sort((a, b) => b.points - a.points);

    const top3 = filteredTeams.slice(0, 3);
    const rest = filteredTeams.slice(3);

    const getDivisionName = (div) => {
        if (div === 1) return 'PRIMERA';
        if (div === 2) return 'SEGUNDA';
        if (div === 3) return 'TERCERA';
    };

    const divisionName = getDivisionName(activeDivision);

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em' }}></i>
                <p>Cargando datos de equipos...</p>
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
        try {
            const data = await getTeamsData();
            setTeams(data);
        } catch (err) {
            setError("Error al obtener los datos de la clasificación de equipos, recarga la web.");
        }
    };

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''}>
            <div className="container">
                <div className="division-select-container">
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
                    </select>
                    <div className="season-badge-container">
                        <span className="season-badge">Temporada {season}</span>
                    </div>
                </div>

                {filteredTeams.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '30px' }}>
                        No hay equipos registrados o datos disponibles en la {divisionName} División.
                    </div>
                ) : (
                    <>
                        <div id="podium-container" className="podium fade-in">
                            {top3.map((team, index) => {
                                const rank = index + 1;
                                return (
                                    <Link key={team.name} to={`/team-profile?team=${encodeURIComponent(team.name)}&season=${season}`} className="podium-card-link">
                                        <div className={`list-item rank-${rank} team-item`} style={{ '--item-bg': `url(${team.logo || 'https://www.w3schools.com/howto/img_avatar.png'})` }}>
                                            <i className="fa-solid fa-medal crown"></i>
                                            <div className="info">
                                                <div className="l-name">&nbsp;{team.name}</div>
                                            </div>
                                            <div className="l-points">{team.points} <span>PTS</span></div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div id="list-container" className="list fade-in" style={{ animationDelay: '0.1s' }}>
                            {rest.map((team, index) => {
                                const rank = index + 4;
                                return (
                                    <Link key={team.name} to={`/team-profile?team=${encodeURIComponent(team.name)}&season=${season}`} className="list-item-link">
                                        <div className="list-item team-item" style={{ '--item-bg': `url(${team.logo || 'https://www.w3schools.com/howto/img_avatar.png'})` }}>
                                            <div className="rank-num">{rank}</div>
                                            <div className="info">
                                                <div className="l-name">{team.name}</div>
                                            </div>
                                            <div className="l-points">{team.points} <span>PTS</span></div>
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

export default Teams;
