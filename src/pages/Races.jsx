import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCalendarData } from '../services/data';

const Races = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCalendarData();
                setEvents(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const goToEventDetail = (id, date, name) => {
        navigate(`/race-detail?id=${id}&date=${encodeURIComponent(date)}&circuitName=${encodeURIComponent(name)}`);
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}><i className="fa-solid fa-spinner fa-spin"></i> Cargando calendario...</div>;

    return (
        <div className="container">
            <br />
            <div id="calendar-list">
                {events.length === 0 ? (
                    <p className="empty-message" style={{ textAlign: 'center', color: '#94a3b8' }}>No hay eventos programados.</p>
                ) : (
                    <ul className="event-list">
                        {events.map((event, index) => (
                            <li
                                key={index}
                                disabled={event.activa == 0}
                                className={`event-item ${event.activa == 0 ? 'disabled' : ''}`}
                                onClick={() => event.activa != 0 && goToEventDetail(event.id_circuito, event.fecha, event.nombre)}
                                style={{
                                    cursor: event.activa != 0 ? 'pointer' : 'default',
                                    opacity: event.activa != 0 ? 1 : 0.6
                                }}
                            >
                                <div className="event-info">
                                    <span className="event-date" style={{ display: 'block', fontWeight: 'bold', color: 'var(--accent)' }}>{event.fecha}</span>
                                    <span className="event-name" style={{ display: 'block', fontSize: '1.1em' }}>{event.nombre}</span>
                                </div>
                                <i className="fa-solid fa-chevron-right event-icon" style={{ color: '#64748b' }}></i>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Races;
