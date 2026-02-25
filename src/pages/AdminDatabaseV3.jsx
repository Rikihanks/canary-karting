import React, { useState, useEffect } from 'react';
import { getTablesV3, getTableSchemaV3, modifySchemaV3 } from '../services/backendService';
import './Settings.css'; // Reuse some layout styles

const AdminDatabaseV3 = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modifying, setModifying] = useState(false);

    // New column form
    const [newCol, setNewCol] = useState({ name: '', type: 'TEXT' });

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await getTablesV3();
            if (res.success) {
                setTables(res.tables);
                if (res.tables.length > 0 && !selectedTable) {
                    handleTableSelect(res.tables[0]);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTableSelect = async (table) => {
        setLoading(true);
        setSelectedTable(table);
        try {
            const res = await getTableSchemaV3(table);
            if (res.success) {
                setColumns(res.columns);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddColumn = async (e) => {
        e.preventDefault();
        if (!newCol.name) return;
        setModifying(true);
        try {
            const res = await modifySchemaV3({
                table: selectedTable,
                action: 'addColumn',
                columnName: newCol.name,
                columnType: newCol.type
            });
            if (res.success) {
                alert("Columna añadida con éxito");
                setNewCol({ name: '', type: 'TEXT' });
                handleTableSelect(selectedTable);
            }
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setModifying(false);
        }
    };

    const handleRenameColumn = async (oldName) => {
        const newName = prompt(`Nuevo nombre para la columna '${oldName}':`, oldName);
        if (!newName || newName === oldName) return;

        setModifying(true);
        try {
            const res = await modifySchemaV3({
                table: selectedTable,
                action: 'renameColumn',
                columnName: oldName,
                newColumnName: newName
            });
            if (res.success) {
                handleTableSelect(selectedTable);
            }
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setModifying(false);
        }
    };

    const handleDropColumn = async (colName) => {
        if (!window.confirm(`¿ESTÁS SEGURO? Esto borrará permanentemente la columna '${colName}' y TODOS los datos que contiene en la tabla '${selectedTable}'.\n\nEsta operación requiere SQLite 3.35+`)) return;

        setModifying(true);
        try {
            const res = await modifySchemaV3({
                table: selectedTable,
                action: 'dropColumn',
                columnName: colName
            });
            if (res.success) {
                handleTableSelect(selectedTable);
            }
        } catch (err) {
            alert("Error: " + err.message + "\n\nNota: Si el error es 'syntax error near DROP', el servidor usa una versión antigua de SQLite que no soporta DROP COLUMN.");
        } finally {
            setModifying(false);
        }
    };

    return (
        <div className="container push-top">
            <div className="admin-panel" style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '20px' }}>
                <div className="panel-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: 'Russo One', color: '#fbbf24' }}>
                        <i className="fa-solid fa-database"></i> SQLite V3 Manager
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Gestión de esquema y tablas del backend V3</p>
                </div>

                <div className="db-manager-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
                    {/* Sidebar: Tables */}
                    <div className="table-list" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '10px' }}>Tablas</h4>
                        {tables.map(t => (
                            <button
                                key={t}
                                onClick={() => handleTableSelect(t)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px',
                                    marginBottom: '5px',
                                    background: selectedTable === t ? 'var(--accent)' : 'transparent',
                                    border: '1px solid ' + (selectedTable === t ? 'var(--accent)' : 'rgba(255,255,255,0.1)'),
                                    color: 'white',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: selectedTable === t ? 'bold' : 'normal'
                                }}
                            >
                                <i className="fa-solid fa-table" style={{ marginRight: '8px' }}></i> {t}
                            </button>
                        ))}
                    </div>

                    {/* Main: Schema Editor */}
                    <div className="schema-editor">
                        {selectedTable ? (
                            <div className="fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3>Esquema de: <code>{selectedTable}</code></h3>
                                    <span style={{ fontSize: '0.8rem', background: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#94a3b8' }}>
                                        {columns.length} Columnas
                                    </span>
                                </div>

                                <div className="columns-table" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            <tr style={{ textAlign: 'left' }}>
                                                <th style={{ padding: '12px' }}>Nombre</th>
                                                <th style={{ padding: '12px' }}>Tipo</th>
                                                <th style={{ padding: '12px' }}>PK</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {columns.map(col => (
                                                <tr key={col.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '12px' }}><strong>{col.name}</strong></td>
                                                    <td style={{ padding: '12px' }}><code style={{ color: '#34d399' }}>{col.type}</code></td>
                                                    <td style={{ padding: '12px' }}>{col.pk === 1 ? '✅' : ''}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                                        {col.pk !== 1 && (
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                <button onClick={() => handleRenameColumn(col.name)} disabled={modifying} style={{ background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </button>
                                                                <button onClick={() => handleDropColumn(col.name)} disabled={modifying} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Add Column Form */}
                                <div className="add-column-form" style={{ marginTop: '20px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}>
                                    <h4><i className="fa-solid fa-plus"></i> Añadir Nueva Columna</h4>
                                    <form onSubmit={handleAddColumn} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder="Nombre de columna..."
                                            value={newCol.name}
                                            onChange={(e) => setNewCol({ ...newCol, name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                                        />
                                        <select
                                            value={newCol.type}
                                            onChange={(e) => setNewCol({ ...newCol, type: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                                        >
                                            <option value="TEXT">TEXT</option>
                                            <option value="INTEGER">INTEGER</option>
                                            <option value="REAL">REAL</option>
                                            <option value="BLOB">BLOB</option>
                                        </select>
                                        <button
                                            type="submit"
                                            disabled={modifying || !newCol.name}
                                            style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            {modifying ? 'Procesando...' : 'Añadir'}
                                        </button>
                                    </form>
                                    <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                                        <i className="fa-solid fa-circle-info"></i> Una vez añadida la columna, aparecerá automáticamente en el formulario de Resultados V3.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                                <i className="fa-solid fa-mouse-pointer fa-3x" style={{ marginBottom: '15px', opacity: 0.5 }}></i>
                                <p>Selecciona una tabla para gestionar su esquema.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .db-manager-layout {
                    min-height: 500px;
                }
                @media (max-width: 768px) {
                    .db-manager-layout {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDatabaseV3;
