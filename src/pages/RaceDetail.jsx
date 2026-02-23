import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getRaceDetails } from '../services/data';
import { useAuth } from '../context/AuthContext';

const RaceDetail = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const date = searchParams.get('date');
    const circuitName = searchParams.get('circuitName');
    const division = searchParams.get('division');

    const [clasiData, setClasiData] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [raceStatus, setRaceStatus] = useState(null); // '0' or '1' (terminada)
    const [isRaceActive, setIsRaceActive] = useState(null); // '0' or '1'
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [error, setError] = useState(null);

    const [isQualyOpen, setIsQualyOpen] = useState(false); // Start closed for animation
    const [isResultOpen, setIsResultOpen] = useState(false); // Default closed
    const resultsRef = useRef(null);

    // Auto-scroll to results when opened
    useEffect(() => {
        if (isResultOpen && resultsRef.current) {
            setTimeout(() => {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300); // Wait for transition
        }
    }, [isResultOpen]);

    // Animate Qualy open when data finishes loading
    useEffect(() => {
        if (!loading && (raceStatus === '1' || window.location.hostname === 'localhost')) {
            const timer = setTimeout(() => {
                setIsQualyOpen(true);
            }, 300); // Slight delay to allow render before animating
            return () => clearTimeout(timer);
        }
    }, [loading, raceStatus]);

    useEffect(() => {
        if (!id || !date) {
            setError('Error: Faltan parámetros de circuito o fecha.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const { clasi, results, raceInfo } = await getRaceDetails(id, date, division);

                const filteredClasi = clasi.filter(r => r.id_circuito === id && r.fecha === date && (!division || r.division == division));
                const filteredResults = results.filter(r => r.id_circuito === id && r.fecha === date && (!division || r.division == division));

                setClasiData(filteredClasi);
                setResultData(filteredResults);
                setRaceStatus(raceInfo?.terminada || '0');
                setIsRaceActive(raceInfo?.activa || '0');
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos de la carrera.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, date, division]);

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
                                <Link to={`/profile?driver=${encodeURIComponent(item.piloto)}&season=${item.temporada}`} className="grid-piloto-link">
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
            const { clasi, results } = await getRaceDetails(id, date, division);

            const filteredClasi = clasi.filter(r => r.id_circuito === id && r.fecha === date && (!division || r.division == division));
            const filteredResults = results.filter(r => r.id_circuito === id && r.fecha === date && (!division || r.division == division));

            setClasiData(filteredClasi);
            setResultData(filteredResults);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los datos de la carrera.');
        }
    };

    const circuitImages = {
        '1': 'https://iili.io/ftKPX2e.png',
        '2': 'https://iili.io/ftKPwpj.png'
    };
    const headerBackgroundImage = circuitImages[id] || 'https://wikikarting.com/wp-content/uploads/2021/03/Instalaciones-Karting-Canarias.webp';

    const getFastestLapDriver = (results) => {
        if (!results || results.length === 0) return null;
        let fastestDriver = null;
        let bestTime = Infinity;

        for (const r of results) {
            if (r.vuelta_rapida && typeof r.vuelta_rapida === 'string' && r.vuelta_rapida.trim() !== '' && r.vuelta_rapida.toLowerCase() !== 'n/a') {
                const timeStr = r.vuelta_rapida.replace(',', '.');
                let seconds = Infinity;
                if (timeStr.includes(':')) {
                    const parts = timeStr.split(':');
                    seconds = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
                } else {
                    seconds = parseFloat(timeStr);
                }

                if (!isNaN(seconds) && seconds > 0 && seconds < bestTime) {
                    bestTime = seconds;
                    fastestDriver = r;
                }
            }
        }
        return fastestDriver;
    };

    const fastestLapDriver = getFastestLapDriver(resultData);

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''}>
            <div className="container">
                <div
                    id="race-info"
                    className="glass-header"
                    style={{ '--header-bg': `url(${headerBackgroundImage})` }}
                >
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

                {raceStatus === '1' || window.location.hostname === 'localhost' ? (
                    <>
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

                        <section id="resultado-section" ref={resultsRef}>
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
                                {fastestLapDriver && (
                                    <div className="fastest-lap-banner fade-in">
                                        <div className="fl-content">
                                            <div className="fl-label">
                                                <i className="fa-solid fa-stopwatch-20"></i> VUELTA RÁPIDA
                                            </div>
                                            <div className="fl-driver">
                                                {fastestLapDriver.piloto}
                                            </div>
                                            <div className="fl-time">
                                                ⏱️ {fastestLapDriver.vuelta_rapida}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="unfinished-race-container fade-in">
                        <div className="unfinished-card">
                            <i className="fa-solid fa-flag-checkered unfinished-icon"></i>
                            <h3>Próxima carrera</h3>
                            <p>Esta carrera aún no ha finalizado. Te avisaremos cuando se publiquen los resultados.</p>

                            {user && isRaceActive === '1' && (
                                <div className="assistance-action">
                                    <div className="divider"></div>
                                    <p className="assistance-note">Si eres piloto recuerda que debes confirmar tu asistencia</p>
                                    <Link
                                        to="/assistance-confirmation"
                                        state={{ raceName: circuitName, raceDate: date }}
                                        className="btn-assistance"
                                    >
                                        <i className="fa-solid fa-check-to-slot"></i> Confirmar Asistencia
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <style>{`
                    .fastest-lap-banner {
                        margin: 15px 10px 10px;
                        background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(217, 70, 239, 0.15));
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-radius: 20px;
                        padding: 20px;
                        text-align: center;
                        border: 1px solid rgba(168, 85, 247, 0.4);
                        box-shadow: 0 0 25px rgba(168, 85, 247, 0.25);
                        position: relative;
                        overflow: hidden;
                    }

                    .fastest-lap-banner::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(217, 70, 239, 0.1) 0%, transparent 70%);
                        animation: rotateGlow 10s linear infinite;
                    }

                    @keyframes rotateGlow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .fl-content { position: relative; z-index: 1; }

                    .fl-label {
                        font-size: 0.7rem;
                        font-weight: 800;
                        color: #d946ef;
                        letter-spacing: 0.25em;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        text-shadow: 0 0 10px rgba(217, 70, 239, 0.3);
                    }

                    .fl-driver {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.6rem;
                        color: #f8fafc;
                        margin-bottom: 4px;
                        text-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
                    }

                    .fl-time {
                        font-size: 1.1rem;
                        color: #e2e8f0;
                        font-weight: 700;
                        letter-spacing: 0.05em;
                    }

                    /* UNFINISHED RACE PLACEHOLDER */
                    .unfinished-race-container {
                        margin-top: 20px;
                    }

                    .unfinished-card {
                        background: rgba(30, 41, 59, 0.4);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        padding: 40px 20px;
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        text-align: center;
                        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                    }

                    .unfinished-icon {
                        font-size: 3rem;
                        color: #64748b;
                        margin-bottom: 20px;
                        opacity: 0.5;
                    }

                    .unfinished-card h3 {
                        font-family: 'Russo One', sans-serif;
                        color: #f1f5f9;
                        margin-bottom: 10px;
                        font-size: 1.4rem;
                    }

                    .unfinished-card p {
                        color: #94a3b8;
                        font-size: 1rem;
                        max-width: 250px;
                        margin: 0 auto;
                    }

                    .assistance-action {
                        margin-top: 30px;
                        padding-top: 10px;
                    }

                    .assistance-action .divider {
                        height: 1px;
                        background: rgba(255, 255, 255, 0.1);
                        width: 80%;
                        margin: 0 auto 25px;
                    }

                    .assistance-note {
                        margin-bottom: 15px !important;
                        font-weight: 500;
                        color: #f1f5f9 !important;
                    }

                    .btn-assistance {
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        background: var(--accent);
                        color: white;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-weight: 700;
                        font-size: 0.95rem;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                        transition: all 0.3s ease;
                    }

                    .btn-assistance:hover {
                        background: var(--accent-hover);
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                    }

                    .btn-assistance i {
                        font-size: 1.1rem;
                    }

                    /* GLASS HEADER */
                    .glass-header {
                        position: relative;
                        background: rgba(15, 23, 42, 0.4);
                        padding: 30px 20px;
                        border-radius: 24px;
                        margin-bottom: 24px;
                        text-align: center;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        overflow: hidden;
                    }

                    .glass-header::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-image: var(--header-bg);
                        background-size: cover;
                        background-position: center;
                        filter: blur(2.5px) brightness(0.8);
                        z-index: -1;
                        transform: scale(1.1); /* Prevent blur edges */
                    }

                    .header-chips, .header-title, .header-date {
                        position: relative;
                        z-index: 1;
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

                    /* SUBTLE GLASS SECTIONS */
                    #clasificacion-section, #resultado-section {
                        background: rgba(30, 41, 59, 0.4);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        border-radius: 16px;
                        margin-bottom: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.04);
                        overflow: hidden;
                    }

                    #clasificacion-section h2, #resultado-section h2 {
                        padding: 16px 20px !important;
                        margin: 0 !important;
                        font-size: 1.1rem !important;
                        transition: background 0.2s;
                    }

                    #clasificacion-section h2:active, #resultado-section h2:active {
                        background: rgba(255, 255, 255, 0.02);
                    }

                    .grid-container {
                        background: rgba(15, 23, 42, 0.3) !important;
                        backdrop-filter: blur(6px);
                        -webkit-backdrop-filter: blur(6px);
                        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                        padding: 15px !important;
                        margin-top: 10px !important;
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
