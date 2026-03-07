import React, { useState, useEffect } from 'react';
import { getBackendData, getTableSchemaV3, saveItemV3 } from '../services/backendService';
import './AdminResults.css';
import './AdminResultsV3.css'; // Reuse premium styles

const TABLE_CONFIG = {
    pilots: { label: 'Pilotos', icon: 'fa-user-helmet', searchKey: 'name' },
    teams: { label: 'Equipos', icon: 'fa-users-gear', searchKey: 'name' },
    calendar: { label: 'Calendario', icon: 'fa-calendar-days', searchKey: 'nombre' }
};

const AdminEntityManagerV3 = () => {
    const [selectedTable, setSelectedTable] = useState('pilots');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, [selectedTable]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [backendRes, schemaRes] = await Promise.all([
                getBackendData(),
                getTableSchemaV3(selectedTable)
            ]);

            if (backendRes.success) {
                setData(backendRes.data[selectedTable] || []);
            }
            if (schemaRes.success) {
                setColumns(schemaRes.columns);
                resetForm(schemaRes.columns);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = (cols = columns) => {
        const initialForm = {};
        cols.forEach(col => {
            initialForm[col.name] = col.type === 'INTEGER' ? 0 : '';
        });
        setFormData(initialForm);
        setEditingItem(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ ...item });
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`¿Seguro que quieres borrar este registro?`)) return;
        setSubmitting(true);
        try {
            const res = await saveItemV3(selectedTable, {
                action: 'deleteItem',
                ...item
            });
            if (res.success) {
                fetchData();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingItem && !window.confirm(`¿Seguro que quieres actualizar este registro?`)) return;
        setSubmitting(true);
        try {
            const res = await saveItemV3(selectedTable, {
                action: editingItem ? 'updateItem' : 'addItem',
                ...formData
            });
            if (res.success) {
                alert("Guardado correctamente");
                resetForm();
                fetchData();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredData = data.filter(item =>
        String(item[TABLE_CONFIG[selectedTable].searchKey] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container push-top">
            <div className="admin-results-panel">
                <div className="v3-pro-header">
                    <div className="v3-title-container">
                        <h2>
                            <i className={`fa-solid ${TABLE_CONFIG[selectedTable].icon}`}></i>
                            GESTIÓN DE {TABLE_CONFIG[selectedTable].label.toUpperCase()}
                        </h2>
                        <span className="v3-subtitle">Administración de entidades V3 (SQLite)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {Object.keys(TABLE_CONFIG).map(key => (
                            <button
                                key={key}
                                onClick={() => setSelectedTable(key)}
                                className="v3-refresh-btn"
                                style={{
                                    background: selectedTable === key ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                    color: selectedTable === key ? '#fff' : 'var(--accent)',
                                    border: selectedTable === key ? 'none' : '1px solid rgba(59, 130, 246, 0.3)'
                                }}
                            >
                                <i className={`fa-solid ${TABLE_CONFIG[key].icon}`}></i> {TABLE_CONFIG[key].label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
                    {/* Form Section */}
                    <div className="admin-card form-section fade-in">
                        <h4>{editingItem ? 'Editar Registro' : 'Añadir Nuevo'}</h4>
                        <form onSubmit={handleSubmit} className="result-form">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {columns.filter(c => !['activa', 'terminada', 'investigating', 'es_vuelta_rapida', 'activo'].includes(c.name)).map(col => (
                                    <div className="form-group" key={col.name}>
                                        <label>{col.name} {col.pk ? '(PK)' : ''}</label>
                                        <input
                                            type={col.type === 'INTEGER' ? 'number' : 'text'}
                                            name={col.name}
                                            value={formData[col.name] ?? ''}
                                            onChange={handleInputChange}
                                            disabled={editingItem && col.pk}
                                            required={col.notnull === 1}
                                            placeholder={col.type}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '15px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                                {columns.filter(c => ['activa', 'terminada', 'investigating', 'es_vuelta_rapida', 'activo'].includes(c.name)).map(col => (
                                    <div className="form-group" key={col.name} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                                        <input
                                            type="checkbox"
                                            name={col.name}
                                            checked={formData[col.name] == 1}
                                            onChange={handleInputChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <label style={{ marginBottom: 0, textTransform: 'capitalize' }}>{col.name}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="form-actions" style={{ flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="save-btn" disabled={submitting} style={{ flex: 1 }}>
                                        {submitting ? 'Guardando...' : (editingItem ? 'Actualizar Registro' : 'Añadir Nuevo')}
                                    </button>
                                    {editingItem && (
                                        <button type="button" className="cancel-btn" onClick={() => resetForm()} style={{ flex: 1 }}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                                {editingItem && (
                                    <button type="button" className="delete-btn" onClick={() => handleDelete(editingItem)} disabled={submitting} style={{ width: '100%', padding: '12px' }}>
                                        <i className="fa-solid fa-trash"></i> Eliminar Registro Permanentemente
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="admin-card list-section fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4>Registros Actuales</h4>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div className="results-mini-list" style={{ maxHeight: '600px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            {loading ? <p style={{ padding: '20px' }}>Cargando...</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                    <thead style={{ position: 'sticky', top: 0, background: '#1e293b', zIndex: 1 }}>
                                        <tr>
                                            {/* Dynamic columns based on table */}
                                            {selectedTable === 'pilots' ? (
                                                <>
                                                    <th style={{ width: '40%' }}>Piloto</th>
                                                    <th style={{ width: '30%' }}>Equipo</th>
                                                    <th style={{ width: '15%' }}>Div</th>
                                                </>
                                            ) : selectedTable === 'teams' ? (
                                                <>
                                                    <th style={{ width: '70%' }}>Equipo</th>
                                                    <th style={{ width: '15%' }}>Logo (URL)</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th style={{ width: '40%' }}>Circuito</th>
                                                    <th style={{ width: '30%' }}>Fecha</th>
                                                    <th style={{ width: '15%' }}>Div</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, idx) => (
                                            <tr key={idx} className="clickable-row" onClick={() => handleEdit(item)}>
                                                {selectedTable === 'pilots' ? (
                                                    <>
                                                        <td style={{ fontWeight: '600' }}>{item.name}</td>
                                                        <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.team}</td>
                                                        <td style={{ textAlign: 'center' }}><span className="div-badge-v3" style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px' }}>{item.division}</span></td>
                                                    </>
                                                ) : selectedTable === 'teams' ? (
                                                    <>
                                                        <td style={{ fontWeight: '600' }}>{item.name}</td>
                                                        <td style={{ fontSize: '0.7rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.logo}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td style={{ fontWeight: '600' }}>{item.nombre}</td>
                                                        <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.fecha}</td>
                                                        <td style={{ textAlign: 'center' }}><span className="div-badge-v3" style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px' }}>{item.division}</span></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEntityManagerV3;
