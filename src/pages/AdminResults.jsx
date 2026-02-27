import React, { useState, useEffect } from 'react';
import { getCalendarData, fetchWithRetry, RESULTS_V2_EXEC } from '../services/data';
import { getLeaderboardDataV2, getResultsDataV2 } from '../services/dataAggregation';
import { saveResultToBackend, USE_V3 } from '../services/backendService';
import './AdminResults.css';

const AdminResults = () => {
    const adminEmail = sessionStorage.getItem('canary_admin_email') || 'admin';
    const [races, setRaces] = useState([]);
    const [pilots, setPilots] = useState([]);
    const [selectedRace, setSelectedRace] = useState(null);
    const [raceResults, setRaceResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [editingRecord, setEditingRecord] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        pilot: '',
        pos_clasificacion: '',
        pos_final: '',
        tiempo_vuelta: '',
        es_vuelta_rapida: false,
        condicion: 'Seco',
        investigating: 0,
        sancion: 0,
        amonestacion: 0,
        replaces: '',
        tiempo_qualy: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [calendar, allPilots] = await Promise.all([
                    getCalendarData(),
                    getLeaderboardDataV2()
                ]);
                setRaces(calendar.filter(r => r.terminada === '1' || r.activa === '1'));
                setPilots(allPilots.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (err) {
                console.error("Error fetching admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const fetchResultsForRace = async (race) => {
        setLoading(true);
        try {
            const allResults = await getResultsDataV2(true); // skip cache
            const filtered = allResults.filter(r =>
                r.id_circuito === race.id_circuito &&
                r.date === race.fecha &&
                r.division == race.division
            );
            setRaceResults(filtered.sort((a, b) => a.pos_final - b.pos_final));
        } catch (err) {
            console.error("Error fetching results", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRaceSelect = (race) => {
        setSelectedRace(race);
        setEditingRecord(null);
        resetForm();
        fetchResultsForRace(race);
    };

    const resetForm = () => {
        setFormData({
            pilot: '',
            pos_clasificacion: '',
            pos_final: '',
            tiempo_vuelta: '',
            es_vuelta_rapida: false,
            condicion: 'Seco',
            investigating: 0,
            sancion: 0,
            amonestacion: 0,
            replaces: '',
            tiempo_qualy: ''
        });
        setEditingRecord(null);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            pilot: record.pilot,
            pos_clasificacion: record.pos_clasificacion,
            pos_final: record.pos_final,
            tiempo_vuelta: record.tiempo_vuelta,
            es_vuelta_rapida: record.es_vuelta_rapida,
            condicion: record.condicion || 'Seco',
            investigating: record.investigating || 0,
            sancion: record.sancion || 0,
            amonestacion: record.amonestacion || 0,
            replaces: record.replaces || '',
            tiempo_qualy: record.tiempo_qualy || ''
        });
        // Scroll to form if needed - Removed as per user request
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!editingRecord || !window.confirm(`¿Seguro que quieres borrar el resultado de ${editingRecord.pilot}?`)) return;

        let success = false;
        try {
            if (USE_V3) {
                try {
                    await saveResultToBackend({
                        action: 'deleteResult',
                        pilot: editingRecord.pilot,
                        id_circuito: selectedRace.id_circuito,
                        fecha: selectedRace.fecha,
                        division: selectedRace.division,
                        email: adminEmail
                    });
                    success = true;
                    console.log("V3 Delete successful");
                } catch (v3Err) {
                    console.warn("V3 Delete failed, attempting V2 fallback", v3Err);
                }
            }

            if (!success) {
                await fetch(RESULTS_V2_EXEC, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({
                        action: 'deleteResult',
                        pilot: editingRecord.pilot,
                        id_circuito: selectedRace.id_circuito,
                        fecha: selectedRace.fecha,
                        division: selectedRace.division,
                        email: adminEmail
                    })
                });
                success = true;
                console.log("V2 Delete successful");
            }

            alert("Resultado borrado");
            resetForm();
            fetchResultsForRace(selectedRace);
        } catch (err) {
            console.error(err);
            alert("Error al borrar en ambos backends (V3/V2)");
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRace || !formData.pilot) return;

        let success = false;
        try {
            const payload = {
                action: editingRecord ? 'updateResult' : 'addResult',
                ...formData,
                id_circuito: selectedRace.id_circuito,
                fecha: selectedRace.fecha,
                division: selectedRace.division,
                email: adminEmail
            };

            if (USE_V3) {
                try {
                    await saveResultToBackend(payload);
                    success = true;
                    console.log("V3 Save successful");
                } catch (v3Err) {
                    console.warn("V3 Save failed, attempting V2 fallback", v3Err);
                }
            }

            if (!success) {
                await fetch(RESULTS_V2_EXEC, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload)
                });
                success = true;
                console.log("V2 Save successful");
            }

            alert(editingRecord ? "Resultado actualizado" : "Resultado guardado");
            resetForm();
            fetchResultsForRace(selectedRace);
        } catch (err) {
            console.error(err);
            alert("Error al guardar en ambos backends (V3/V2)");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && races.length === 0) {
        return <div className="container push-top"><div className="panel-loading">Cargando...</div></div>;
    }

    return (
        <div className="container push-top">
            <div className="admin-results-panel">
                <div className="panel-header">
                    <h2>Gestión de Resultados V2</h2>
                    <button onClick={() => window.location.reload()} className="refresh-btn">
                        <i className="fa-solid fa-rotate-right"></i> Refrescar
                    </button>
                </div>

                {!selectedRace ? (
                    <div className="race-selector">
                        <h3>Selecciona una Carrera</h3>
                        <div className="races-list">
                            {races.map(race => (
                                <div key={`${race.id_circuito}-${race.fecha}-${race.division}`}
                                    className="race-select-card"
                                    onClick={() => handleRaceSelect(race)}>
                                    <div className="race-main-info">
                                        <strong>{race.nombre}</strong>
                                        <span>Div {race.division}</span>
                                    </div>
                                    <div className="race-sub-info">{race.fecha}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="results-editor fade-in">
                        <button className="back-btn" onClick={() => setSelectedRace(null)}>
                            <i className="fa-solid fa-chevron-left"></i> Volver al listado
                        </button>

                        <div className="current-race-banner">
                            <h3>{selectedRace.nombre}</h3>
                            <p>División {selectedRace.division} | {selectedRace.fecha}</p>
                        </div>

                        <div className="admin-grid">
                            {/* Form Section */}
                            <div className="admin-card form-section">
                                <h4>{editingRecord ? 'Editar Resultado' : 'Añadir Resultado'}</h4>
                                <form onSubmit={handleSubmit} className="result-form">
                                    <div className="form-group">
                                        <label>Piloto</label>
                                        <select name="pilot" value={formData.pilot} onChange={handleInputChange} required disabled={!!editingRecord}>
                                            <option value="">-- Seleccionar --</option>
                                            {pilots.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Posición Qualy</label>
                                            <input type="number" name="pos_clasificacion" value={formData.pos_clasificacion} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Posición Final</label>
                                            <input type="number" name="pos_final" value={formData.pos_final} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Tiempo Vuelta Rápida (Carrera)</label>
                                        <input type="text" name="tiempo_vuelta" placeholder="33.723" value={formData.tiempo_vuelta} onChange={handleInputChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Tiempo Qualy (V3)</label>
                                        <input type="text" name="tiempo_qualy" placeholder="32.145" value={formData.tiempo_qualy} onChange={handleInputChange} />
                                    </div>

                                    <div className="form-row checkbox-row">
                                        <label className="checkbox-container">
                                            <input type="checkbox" name="es_vuelta_rapida" checked={formData.es_vuelta_rapida} onChange={handleInputChange} />
                                            Es Vuelta Rápida
                                        </label>
                                        <label className="checkbox-container">
                                            <input type="checkbox" name="investigating" checked={formData.investigating == 1} onChange={handleInputChange} />
                                            Investigado (⚠️)
                                        </label>
                                        <label className="checkbox-container">
                                            <input type="checkbox" name="sancion" checked={formData.sancion == 1} onChange={handleInputChange} />
                                            Sanción (🟥)
                                        </label>
                                        <label className="checkbox-container">
                                            <input type="checkbox" name="amonestacion" checked={formData.amonestacion == 1} onChange={handleInputChange} />
                                            Amonest. (🟨)
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Sustituye a (Opcional)</label>
                                        <select name="replaces" value={formData.replaces} onChange={handleInputChange}>
                                            <option value="">-- Ninguno --</option>
                                            {pilots.map(p => <option key={`rep-${p.name}`} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="save-btn" disabled={submitting}>
                                            {submitting ? 'Guardando...' : (editingRecord ? 'Actualizar Resultado' : 'Guardar Resultado')}
                                        </button>
                                        <small>Los resultados se guardan sobre la marcha pero pueden tardar un poco en verse reflejados, es normal ver datos anteriores durante uno o dos minutos despues de haberlos guardado. No hace falta guardarlos dos veces.</small>
                                        {editingRecord && (
                                            <>
                                                <button type="button" className="delete-btn" onClick={handleDelete} disabled={submitting}>
                                                    Eliminar
                                                </button>
                                                <button type="button" className="cancel-btn" onClick={resetForm}>
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Current Results Section */}
                            <div className="admin-card list-section">
                                <h4>Entradas en esta carrera</h4>
                                <div className="results-mini-list">
                                    {raceResults.length === 0 ? (
                                        <p className="empty-msg">No hay resultados registrados aún.</p>
                                    ) : (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Piloto</th>
                                                    <th>Pos. Qualy</th>
                                                    <th>Pos. Final</th>
                                                    <th>VR</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {raceResults.map((r, i) => (
                                                    <tr key={i} onClick={() => handleEdit(r)} className="clickable-row">
                                                        <td>
                                                            {r.pilot}
                                                            {r.replaces && <small title={`Sustituye a ${r.replaces}`}> 🔁</small>}
                                                            {r.investigating == 1 && <small title="Bajo Investigación"> ⚠️</small>}
                                                            {r.sancion == 1 && <small title="Sanción"> 🟥</small>}
                                                            {r.amonestacion == 1 && <small title="Amonestación"> 🟨</small>}
                                                        </td>
                                                        <td>{r.pos_clasificacion}</td>
                                                        <td>{r.pos_final}</td>
                                                        <td>{r.es_vuelta_rapida ? '⭐' : ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminResults;
