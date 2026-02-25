import React, { useState, useEffect } from 'react';
import { getCalendarData } from '../services/data';
import { getLeaderboardDataV2 } from '../services/dataAggregation';
import { saveResultToBackend, getTableSchemaV3, getBackendData } from '../services/backendService';
import './AdminResults.css';

const AdminResultsV3 = () => {
    const adminEmail = sessionStorage.getItem('canary_admin_email') || 'admin';
    const [races, setRaces] = useState([]);
    const [pilots, setPilots] = useState([]);
    const [selectedRace, setSelectedRace] = useState(null);
    const [raceResults, setRaceResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [columns, setColumns] = useState([]);

    const [editingRecord, setEditingRecord] = useState(null);

    // Dynamic form state
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [calendar, allPilots, schema] = await Promise.all([
                    getCalendarData(),
                    getLeaderboardDataV2(),
                    getTableSchemaV3('results')
                ]);
                setRaces(calendar.filter(r => r.terminada === '1' || r.activa === '1'));
                setPilots(allPilots.sort((a, b) => a.name.localeCompare(b.name)));

                const cols = schema.columns || [];
                setColumns(cols);

                // Initialize form with dynamic columns
                const initialForm = {};
                cols.forEach(col => {
                    if (col.name !== 'id') {
                        initialForm[col.name] = (col.name === 'condicion') ? 'Seco' : (col.type === 'INTEGER' ? 0 : '');
                    }
                });
                setFormData(initialForm);

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
            const response = await getBackendData();
            if (response.success) {
                const filtered = response.data.results.filter(r =>
                    r.id_circuito === race.id_circuito &&
                    r.date === race.fecha &&
                    r.division == race.division
                );
                setRaceResults(filtered.sort((a, b) => a.pos_final - b.pos_final));
            }
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
        const initialForm = {};
        columns.forEach(col => {
            if (col.name !== 'id') {
                initialForm[col.name] = (col.name === 'condicion') ? 'Seco' : (col.type === 'INTEGER' ? 0 : '');
            }
        });
        setFormData(initialForm);
        setEditingRecord(null);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        const editData = {};
        columns.forEach(col => {
            if (col.name !== 'id') {
                editData[col.name] = record[col.name] ?? '';
            }
        });
        setFormData(editData);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!editingRecord || !window.confirm(`¿Seguro que quieres borrar el resultado de ${editingRecord.pilot}?`)) return;

        setSubmitting(true);
        try {
            await saveResultToBackend({
                action: 'deleteResult',
                pilot: editingRecord.pilot,
                id_circuito: selectedRace.id_circuito,
                fecha: selectedRace.fecha,
                division: selectedRace.division,
                email: adminEmail
            });

            alert("Resultado borrado");
            resetForm();
            fetchResultsForRace(selectedRace);
        } catch (err) {
            console.error(err);
            alert("Error al borrar");
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

        setSubmitting(true);
        try {
            const payload = {
                action: editingRecord ? 'updateResult' : 'addResult',
                ...formData,
                id_circuito: selectedRace.id_circuito,
                fecha: selectedRace.fecha,
                division: selectedRace.division,
                email: adminEmail
            };

            await saveResultToBackend(payload);
            alert(editingRecord ? "Resultado actualizado (V3)" : "Resultado guardado (V3)");
            resetForm();
            fetchResultsForRace(selectedRace);
        } catch (err) {
            console.error(err);
            alert("Error al guardar");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && races.length === 0) {
        return <div className="container push-top"><div className="panel-loading">Cargando...</div></div>;
    }

    // Identify standard vs custom columns
    const standardCols = ['pilot', 'pos_clasificacion', 'pos_final', 'tiempo_vuelta', 'es_vuelta_rapida', 'condicion', 'investigating', 'replaces', 'tiempo_qualy'];
    const customCols = columns.filter(c => !standardCols.includes(c.name) && c.name !== 'id' && !['id_circuito', 'date', 'division'].includes(c.name));

    return (
        <div className="container push-top">
            <div className="admin-results-panel">
                <div className="panel-header">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ color: 'var(--accent)' }}>Gestión V3 Pro</h2>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Edición directa en SQLite con columnas dinámicas</span>
                    </div>
                    <button onClick={() => fetchResultsForRace(selectedRace)} className="refresh-btn">
                        <i className="fa-solid fa-rotate-right"></i> Sincronizar
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

                        <div className="current-race-banner" style={{ borderLeft: '4px solid var(--accent)' }}>
                            <h3>{selectedRace.nombre}</h3>
                            <p>División {selectedRace.division} | {selectedRace.fecha}</p>
                        </div>

                        <div className="admin-grid">
                            {/* Form Section */}
                            <div className="admin-card form-section">
                                <h4>{editingRecord ? 'Editar Registro SQL' : 'Añadir Registro SQL'}</h4>
                                <form onSubmit={handleSubmit} className="result-form">
                                    <div className="form-group">
                                        <label>Piloto</label>
                                        <select name="pilot" value={formData.pilot || ''} onChange={handleInputChange} required disabled={!!editingRecord}>
                                            <option value="">-- Seleccionar --</option>
                                            {pilots.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Pos. Qualy</label>
                                            <input type="number" name="pos_clasificacion" value={formData.pos_clasificacion || ''} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Pos. Final</label>
                                            <input type="number" name="pos_final" value={formData.pos_final || ''} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>VR Carrera</label>
                                            <input type="text" name="tiempo_vuelta" placeholder="33.723" value={formData.tiempo_vuelta || ''} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>VR Qualy</label>
                                            <input type="text" name="tiempo_qualy" placeholder="32.145" value={formData.tiempo_qualy || ''} onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    {/* Custom Columns Section */}
                                    {customCols.length > 0 && (
                                        <div className="custom-fields-area" style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px dashed #475569' }}>
                                            <small style={{ color: 'var(--accent)', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>CAMPOS PERSONALIZADOS (SQL)</small>
                                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                {customCols.map(col => (
                                                    <div className="form-group" key={col.name}>
                                                        <label>{col.name}</label>
                                                        <input
                                                            type={col.type === 'INTEGER' ? 'number' : 'text'}
                                                            name={col.name}
                                                            value={formData[col.name] || ''}
                                                            onChange={handleInputChange}
                                                            placeholder={col.type}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-row checkbox-row" style={{ marginTop: '15px' }}>
                                        <label className="checkbox-container">
                                            <input type="checkbox" name="es_vuelta_rapida" checked={formData.es_vuelta_rapida == 1} onChange={handleInputChange} />
                                            Es Vuelta Rápida
                                        </label>
                                        <label className="checkbox-container">
                                            <input type="checkbox" name="investigating" checked={formData.investigating == 1} onChange={handleInputChange} />
                                            Investigado (⚠️)
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Sustituye a (Opcional)</label>
                                        <select name="replaces" value={formData.replaces || ''} onChange={handleInputChange}>
                                            <option value="">-- Ninguno --</option>
                                            {pilots.map(p => <option key={`rep-${p.name}`} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="save-btn" disabled={submitting} style={{ background: 'var(--accent)' }}>
                                            {submitting ? 'Guardando...' : (editingRecord ? 'Actualizar Registro' : 'Añadir Registro')}
                                        </button>
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
                                <h4>Registros Locales (SQLite)</h4>
                                <div className="results-mini-list">
                                    {raceResults.length === 0 ? (
                                        <p className="empty-msg">Sin datos en el backend V3.</p>
                                    ) : (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Piloto</th>
                                                    <th>P1/P2</th>
                                                    {customCols.slice(0, 2).map(c => <th key={c.name}>{c.name}</th>)}
                                                    <th>VR</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {raceResults.map((r, i) => (
                                                    <tr key={i} onClick={() => handleEdit(r)} className="clickable-row">
                                                        <td>
                                                            {r.pilot}
                                                            {r.replaces && <small> 🔁</small>}
                                                        </td>
                                                        <td>{r.pos_clasificacion}/{r.pos_final}</td>
                                                        {customCols.slice(0, 2).map(c => <td key={c.name}>{r[c.name] ?? '-'}</td>)}
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

export default AdminResultsV3;
