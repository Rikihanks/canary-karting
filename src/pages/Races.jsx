import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getCalendarData } from '../services/data';
import { useAuth } from '../context/AuthContext';

const Races = () => {
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem('races_calendar_cache');
        return savedEvents ? JSON.parse(savedEvents) : [];
    });
    const [loading, setLoading] = useState(events.length === 0);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Background revalidation: always fetch fresh data after initial mount
                const data = await getCalendarData(true);
                setEvents(data);
                localStorage.setItem('races_calendar_cache', JSON.stringify(data));
                setLoading(false);
            } catch (error) {
                console.error(error);
                if (events.length === 0) {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, []);

    // Set the first division as default when events are loaded
    useEffect(() => {
        if (events.length > 0 && selectedDivision === null) {
            const firstDivision = [...new Set(
                events
                    .filter(event => event.temporada == 2026)
                    .map(event => event.division)
                    .filter(div => div !== undefined && div !== null)
            )].sort((a, b) => a - b)[0];

            if (firstDivision !== undefined) {
                setSelectedDivision(firstDivision);
            }
        }
    }, [events, selectedDivision]);

    const handleEventClick = (event) => {
        navigate(`/race-detail?id=${event.id_circuito}&date=${encodeURIComponent(event.fecha)}&circuitName=${encodeURIComponent(event.nombre)}&division=${event.division}`);
    };

    const getDivisionClass = (division) => {
        switch (parseInt(division)) {
            case 1:
                return 'primera';
            case 2:
                return 'segunda';
            case 3:
                return 'tercera';
            default:
                return '';
        }
    };

    // Filter events by temporada 2026 and selected division
    const filteredEvents = events.filter(event => {
        const isTemporada2026 = event.temporada == 2026;
        const matchesDivision = event.division == selectedDivision;
        return isTemporada2026 && matchesDivision;
    });

    // Get unique divisions from temporada 2026 events
    const divisions = [1, 2, 3];

    if (loading) return <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}><i className="fa-solid fa-spinner fa-spin"></i> Cargando calendario...</div>;

    const handleRefresh = async () => {
        const { clearCache } = await import('../services/data');
        clearCache();
        try {
            // Force network request
            const data = await getCalendarData(true);
            setEvents(data);
            localStorage.setItem('races_calendar_cache', JSON.stringify(data));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''}>
            <div className="container">
                <br />

                {/* Division filter dropdown */}
                <div className="division-select-container">
                    <label htmlFor="division-filter" className="visually-hidden">
                        Filtrar por División:
                    </label>
                    <select
                        id="division-filter"
                        className="division-dropdown"
                        value={selectedDivision}
                        onChange={(e) => setSelectedDivision(e.target.value)}
                    >
                        {divisions.map(div => (
                            <option key={div} value={div}>{div}º División </option>
                        ))}
                    </select>
                    <div className="division-description">Consulta el calendario de la temporada 2026, confirma tu asistencia a la carrera y comprueba los resultados en este mismo sitio.</div>
                </div>

                <div id="calendar-list">
                    {filteredEvents.length === 0 ? (
                        <p className="empty-message" style={{ textAlign: 'center', color: '#94a3b8' }}>No hay eventos programados para esta división.</p>
                    ) : (
                        <ul className="event-list">
                            {filteredEvents.map((event, index) => (
                                <li
                                    key={index}
                                    className={`event-item ${event.activa == 0 ? 'disabled' : ''} ${getDivisionClass(event.division)}`}
                                    onClick={() => (event.activa != 0 || window.location.hostname === 'localhost') && handleEventClick(event)}
                                    style={{
                                        cursor: (event.activa != 0 || window.location.hostname === 'localhost') ? 'pointer' : 'default',
                                        opacity: (event.activa != 0 || window.location.hostname === 'localhost') ? 1 : 0.6
                                    }}
                                >
                                    <div className="event-info">
                                        <span className={`event-date ${getDivisionClass(event.division)}`} >Fecha: {event.fecha}</span>
                                        <span className="event-name" style={{ display: 'block', fontSize: '1.1em' }}>Circuito: {event.nombre}</span>
                                    </div>
                                    <i className="fa-solid fa-chevron-right event-icon" style={{ color: '#64748b' }}></i>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </PullToRefresh>
    );
};

export default Races;
