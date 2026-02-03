import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getRaceDetails } from '../services/data';

const RaceDetail = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const date = searchParams.get('date');
    const circuitName = searchParams.get('circuitName');

    const [clasiData, setClasiData] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isQualyOpen, setIsQualyOpen] = useState(false); // Start closed for animation
    const [isResultOpen, setIsResultOpen] = useState(false); // Default closed

    // Animate Qualy open when data finishes loading
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setIsQualyOpen(true);
            }, 300); // Slight delay to allow render before animating
            return () => clearTimeout(timer);
        }
    }, [loading]);

    useEffect(() => {
        if (!id || !date) {
            setError('Error: Faltan parámetros de circuito o fecha.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const { clasi, results } = await getRaceDetails();

                const filteredClasi = clasi.filter(r => r.id_circuito === id && r.fecha === date);
                const filteredResults = results.filter(r => r.id_circuito === id && r.fecha === date);

                setClasiData(filteredClasi);
                setResultData(filteredResults);
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos de la carrera.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, date]);

    const renderGrid = (data, type) => {
        if (data.length === 0) return <p className="empty-message" style={{ textAlign: 'center', color: '#94a3b8' }}>No hay datos de {type} para esta carrera.</p>;

        const sortedData = [...data].sort((a, b) => a.posicion - b.posicion);

        return (
            <div className="grid-container">
                {sortedData.map((item, index) => {
                    let posClass = item.posicion === 1 ? 'pos-1' : '';
                    if (type === 'resultados' && item.posicion > 1 && item.posicion <= 3) {
                        posClass += ' pos-podium';
                    }

                    return (
                        <div key={index} className={`grid-item ${posClass}`} data-pos={item.posicion}>
                            <div className="grid-piloto-container">
                                <span className="grid-pos">{item.posicion}.</span>
                                <Link to={`/profile?driver=${encodeURIComponent(item.piloto)}`} className="grid-piloto-link">
                                    <span className="grid-piloto">{item.piloto}</span>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}><i className="fa-solid fa-spinner fa-spin"></i> Cargando resultados...</div>;
    if (error) return <div className="container"><div className="error-message" style={{ textAlign: 'center', color: '#ef4444', padding: '20px' }}>{error}</div></div>;

    const handleRefresh = async () => {
        const { clearCache } = await import('../services/data');
        clearCache();
        try {
            const { clasi, results } = await getRaceDetails();

            const filteredClasi = clasi.filter(r => r.id_circuito === id && r.fecha === date);
            const filteredResults = results.filter(r => r.id_circuito === id && r.fecha === date);

            setClasiData(filteredClasi);
            setResultData(filteredResults);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los datos de la carrera.');
        }
    };

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''}>
            <div className="container">
                <div id="race-info" className="glass-header">
                    <div className="header-chips">
                        {(clasiData[0]?.temporada || resultData[0]?.temporada) && (
                            <span className="chip chip-season">Temporada {clasiData[0]?.temporada || resultData[0]?.temporada}</span>
                        )}
                        {(clasiData[0]?.division || resultData[0]?.division) && (
                            <span className="chip chip-division"> {clasiData[0]?.division || resultData[0]?.division} División</span>
                        )}
                    </div>
                    <h1 className="header-title">{circuitName}</h1>
                    <p className="header-date">
                        <i className="fa-regular fa-calendar-days"></i> {date}
                    </p>
                </div>

                <section id="clasificacion-section">
                    <h2
                        onClick={() => setIsQualyOpen(!isQualyOpen)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            userSelect: 'none'
                        }}
                    >
                        <span>⏱️ Qualy</span>
                        <i className={`fa-solid fa-chevron-${isQualyOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8em', transition: 'transform 0.3s' }}></i>
                    </h2>
                    <div className={`collapsible-content ${isQualyOpen ? 'open' : ''}`}>
                        <div id="clasificacion-table" className="results-table-container">
                            {renderGrid(clasiData, 'clasificacion')}
                        </div>
                    </div>
                </section>

                <section id="resultado-section">
                    <h2
                        onClick={() => setIsResultOpen(!isResultOpen)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            userSelect: 'none'
                        }}
                    >
                        <span>🏁 Resultado Final</span>
                        <i className={`fa-solid fa-chevron-${isResultOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8em', transition: 'transform 0.3s' }}></i>
                    </h2>
                    <div className={`collapsible-content ${isResultOpen ? 'open' : ''}`}>
                        <div id="resultado-table" className="results-table-container">
                            {renderGrid(resultData, 'resultados')}
                        </div>
                    </div>
                </section>

                <style>{`
                    /* GLASS HEADER */
                    .glass-header {
                        background: rgba(30, 41, 59, 0.7);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        padding: 24px 20px;
                        border-radius: 20px;
                        margin-bottom: 24px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    }

                    .header-chips {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        margin-bottom: 12px;
                    }

                    .chip {
                        padding: 4px 12px;
                        border-radius: 99px;
                        font-size: 0.7rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .chip-season { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
                    .chip-division { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

                    .header-title {
                        font-size: 1.75rem;
                        font-weight: 900;
                        color: #f8fafc;
                        margin: 0 0 10px 0;
                        letter-spacing: -0.02em;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }

                    .header-date {
                        display: flex;
                        justify-content: center;
                        gap: 16px;
                        color: #94a3b8;
                        font-size: 0.85rem;
                        margin: 0;
                    }

                    .header-date i {
                        margin-right: 6px;
                        color: #3b82f6;
                    }

                    .collapsible-content {
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
                        opacity: 0;
                    }
                    
                    .collapsible-content.open {
                        max-height: 2000px; /* Large enough value to fit content */
                        opacity: 1;
                    }

                    .results-table-container {
                        padding-top: 10px;
                        padding-bottom: 20px;
                    }
                `}</style>
            </div>
        </PullToRefresh>
    );
};

export default RaceDetail;
