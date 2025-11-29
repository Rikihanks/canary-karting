import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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

    const [isQualyOpen, setIsQualyOpen] = useState(true);
    const [isResultOpen, setIsResultOpen] = useState(true);

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

    return (
        <div className="container">
            <div id="race-info" style={{ backgroundColor: '#1a233a', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', color: '#93c5fd' }}>
                <p className="race-info-date">Fecha: <strong>{date}</strong> <br /> Circuito: {circuitName}</p>
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
                    <i className={`fa-solid fa-chevron-${isQualyOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8em' }}></i>
                </h2>
                {isQualyOpen && (
                    <div id="clasificacion-table" className="results-table-container">
                        {renderGrid(clasiData, 'clasificacion')}
                    </div>
                )}
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
                    <i className={`fa-solid fa-chevron-${isResultOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8em' }}></i>
                </h2>
                {isResultOpen && (
                    <div id="resultado-table" className="results-table-container">
                        {renderGrid(resultData, 'resultados')}
                    </div>
                )}
            </section>
        </div>
    );
};

export default RaceDetail;
