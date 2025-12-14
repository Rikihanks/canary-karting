import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import { updateConfig, clearCache } from '../services/data';

const AdminDashboard = () => {
    const config = useConfig();
    const { user } = useAuth();
    const [localConfig, setLocalConfig] = useState({});
    const [loadingState, setLoadingState] = useState({}); // Track loading per key

    useEffect(() => {
        if (config) {
            setLocalConfig(config);
        }
    }, [config]);

    const handleToggle = async (key) => {
        const currentValue = localConfig[key];
        const newValue = !currentValue;

        // Optimistic update
        setLocalConfig(prev => ({ ...prev, [key]: newValue }));
        setLoadingState(prev => ({ ...prev, [key]: true }));

        try {
            await updateConfig(key, newValue, user.email);
            // In a real app we might wait for confirmation, but with GAS no-cors we assume it worked
            // and maybe trigger a re-fetch after a delay
        } catch (error) {
            console.error("Failed to update", error);
            // Revert on error
            setLocalConfig(prev => ({ ...prev, [key]: currentValue }));
            alert("Error al actualizar la configuración");
        } finally {
            setLoadingState(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleRefresh = () => {
        clearCache();
        window.location.reload();
    };



    const features = [
        { key: 'teams', label: 'Clasificación de Equipos', icon: '🏆' },
        { key: 'races', label: 'Carreras', icon: '🏎️' },
        { key: 'inscripcion', label: 'Preincripción', icon: '📝' },
        { key: 'sorteo', label: 'Sorteo', icon: '🎲' },
        { key: 'login', label: 'Inicio de Sesión', icon: '🔐' },
    ];

    return (
        <div className="container push-top">
            <div className="admin-panel">
                <div className="panel-header">
                    <h2>Funciones activas</h2>
                    <button onClick={handleRefresh} className="refresh-btn">
                        <i className="fa-solid fa-rotate-right"></i> Actualizar Datos
                    </button>
                </div>

                <div className="toggles-grid">
                    {features.map((feature) => (
                        <div key={feature.key} className="toggle-card">
                            <div className="toggle-info">
                                <span className="toggle-icon">{feature.icon}</span>
                                <span className="toggle-label">{feature.label}</span>
                            </div>
                            <div className="toggle-action">
                                {loadingState[feature.key] ? (
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={localConfig[feature.key] === true}
                                            onChange={() => handleToggle(feature.key)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="admin-note">
                    <p>⚠️ <strong>Nota:</strong> Los cambios pueden tardar unos segundos en propagarse a todos los usuarios debido al caché de Google Sheets.</p>
                </div>
            </div>

            <style>{`
                .push-top {
                    margin-top: 2rem;
                }
                .admin-panel {
                    background-color: var(--card-bg);
                    padding: 0.7rem;
                    border-radius: 12px;
                }
                .panel-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 0.7rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .refresh-btn {
                    background: none;
                    border: 1px solid var(--color-accent);
                    color: var(--color-accent);
                    padding: 5px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .refresh-btn:hover {
                    background: var(--color-accent);
                    color: white;
                }
                .toggles-grid {
                    display: grid;
                    gap: 1rem;
                }
                .toggle-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .toggle-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .toggle-icon {
                    font-size: 1.5rem;
                }
                .toggle-label {
                    font-weight: 700;
                    font-size: 1.1rem;
                }
                .admin-note {
                    margin-top: 2rem;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    text-align: center;
                    background: rgba(251, 191, 36, 0.1);
                    padding: 10px;
                    border-radius: 6px;
                    border: 1px solid rgba(251, 191, 36, 0.2);
                }

                /* Switch CSS */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 34px;
                }
                .switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    -webkit-transition: .4s;
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 26px;
                    width: 26px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    -webkit-transition: .4s;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--success);
                }
                input:focus + .slider {
                    box-shadow: 0 0 1px var(--success);
                }
                input:checked + .slider:before {
                    -webkit-transform: translateX(26px);
                    -ms-transform: translateX(26px);
                    transform: translateX(26px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
