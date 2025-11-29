import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeamsData } from '../services/data';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDivision, setActiveDivision] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTeamsData();
                console.log(data);

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
        .filter(team => team.division === activeDivision)
        .sort((a, b) => b.points - a.points);

    const top3 = filteredTeams.slice(0, 3);
    const rest = filteredTeams.slice(3);
    const divisionName = activeDivision === 1 ? 'PRIMERA' : 'SEGUNDA';

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

    return (
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
                </select>
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
                                <Link key={team.name} to={`/team-profile?team=${encodeURIComponent(team.name)}`} className="podium-card-link">
                                    <div className={`list-item rank-${rank}`}>
                                        <i className="fa-solid fa-medal crown"></i>
                                        {team.logo ? (
                                            <img src={team.logo} alt={team.name} className="mini-avatar" />
                                        ) : (
                                            <div className="mini-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#334155', fontSize: '1.5em' }}>
                                                <i className="fa-solid fa-users"></i>
                                            </div>
                                        )}
                                        <div className="info">
                                            <div className="l-name">{team.name}</div>
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
                                <Link key={team.name} to={`/team-profile?team=${encodeURIComponent(team.name)}`} className="list-item-link">
                                    <div className="list-item">
                                        <div className="rank-num">{rank}</div>
                                        {team.logo ? (
                                            <img src={team.logo} alt={team.name} className="mini-avatar" />
                                        ) : (
                                            <div className="mini-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#334155', fontSize: '1.2em' }}>
                                                <i className="fa-solid fa-users"></i>
                                            </div>
                                        )}
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
    );
};

export default Teams;
