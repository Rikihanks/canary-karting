import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import { updateConfig, clearCache, getCalendarData, updateRaceStatus } from '../services/data';
import CollapsibleSection from '../components/CollapsibleSection';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const config = useConfig();
    // const { user } = useAuth(); // Don't use pilot auth
    const adminEmail = sessionStorage.getItem('canary_admin_email') || 'admin';
    const [localConfig, setLocalConfig] = useState({});
    const [loadingState, setLoadingState] = useState({}); // Track loading per key
    const [races, setRaces] = useState([]);
    const [loadingRaces, setLoadingRaces] = useState(true);

    useEffect(() => {
        if (config) {
            setLocalConfig(config);
        }

        // Fetch races
        const fetchRaces = async () => {
            try {
                const data = await getCalendarData();
                setRaces(data);
            } catch (err) {
                console.error("Error fetching races", err);
            } finally {
                setLoadingRaces(false);
            }
        };
        fetchRaces();
    }, [config]);

    const handleToggle = async (key, specificValue = undefined) => {
        const currentValue = localConfig[key];
        // If specificValue is provided, use it. Otherwise toggle boolean.
        const newValue = specificValue !== undefined ? specificValue : !currentValue;

        // Optimistic update
        setLocalConfig(prev => ({ ...prev, [key]: newValue }));
        setLoadingState(prev => ({ ...prev, [key]: true }));

        try {
            await updateConfig(key, newValue, adminEmail);
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

    const handleRaceToggle = async (raceName, raceDate, field) => {
        const raceIndex = races.findIndex(r => r.nombre === raceName && r.fecha === raceDate);
        if (raceIndex === -1) return;

        const currentRace = races[raceIndex];
        const currentValue = currentRace[field] === '1'; // '1' is true in CSV
        const newValue = !currentValue;
        const newValueString = newValue ? '1' : '0';

        // Optimistic Update
        const updatedRaces = [...races];
        updatedRaces[raceIndex] = { ...currentRace, [field]: newValueString };
        setRaces(updatedRaces);

        const loadingKey = `race-${raceName}-${raceDate}-${field}`;
        setLoadingState(prev => ({ ...prev, [loadingKey]: true }));

        try {
            await updateRaceStatus(raceName, raceDate, field, newValueString, adminEmail);
        } catch (error) {
            console.error("Failed to update race", error);
            // Revert
            const revertedRaces = [...races];
            revertedRaces[raceIndex] = { ...currentRace, [field]: currentValue ? '1' : '0' };
            setRaces(revertedRaces);
            alert("Error al actualizar la carrera");
        } finally {
            setLoadingState(prev => ({ ...prev, [loadingKey]: false }));
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
        { key: 'login', label: 'Inicio de Sesión', icon: '🔐' },
    ];

    const getArrowState = (division) => {
        if (!Array.isArray(localConfig.clasi_arrows)) return false;
        const conf = localConfig.clasi_arrows.find(d => d.división === division);
        return conf ? conf.active : false;
    };

    const handleArrowToggle = async (division) => {
        // Fallback default state in case it's badly formed
        const currentArr = Array.isArray(localConfig.clasi_arrows) ? [...localConfig.clasi_arrows] : [
            { división: 1, active: false },
            { división: 2, active: false },
            { división: 3, active: false }
        ];

        const index = currentArr.findIndex(d => d.división === division);
        if (index !== -1) {
            currentArr[index].active = !currentArr[index].active;
        } else {
            currentArr.push({ división: division, active: true });
        }

        // Optimistic update
        setLocalConfig(prev => ({ ...prev, clasi_arrows: currentArr }));
        setLoadingState(prev => ({ ...prev, [`arrow-${division}`]: true }));

        try {
            await updateConfig('clasi_arrows', JSON.stringify(currentArr), adminEmail);
        } catch (error) {
            console.error("Failed to update arrows", error);
            // Revert on error
            // (Revert logic simplified for brevity - in full app would restore prior state explicitly)
            alert("Error al actualizar la configuración de flechas");
        } finally {
            setLoadingState(prev => ({ ...prev, [`arrow-${division}`]: false }));
        }
    };

    const getDotdStateForDiv = (division) => {
        if (!Array.isArray(localConfig.dotd)) return 0;
        const conf = localConfig.dotd.find(d => d.división === division);
        return conf ? conf.active : 0;
    };

    const handleDotdChange = async (division, newValue) => {
        // Fallback default state in case it's badly formed
        const currentArr = Array.isArray(localConfig.dotd) ? [...localConfig.dotd] : [
            { división: 1, active: 0 },
            { división: 2, active: 0 },
            { división: 3, active: 0 }
        ];

        const index = currentArr.findIndex(d => d.división === division);
        if (index !== -1) {
            currentArr[index].active = parseInt(newValue);
        } else {
            currentArr.push({ división: division, active: parseInt(newValue) });
        }

        // Optimistic update
        setLocalConfig(prev => ({ ...prev, dotd: currentArr }));
        setLoadingState(prev => ({ ...prev, [`dotd-${division}`]: true }));

        try {
            await updateConfig('dotd', JSON.stringify(currentArr), adminEmail);
        } catch (error) {
            console.error("Failed to update dotd", error);
            alert("Error al actualizar la configuración de DOTD");
        } finally {
            setLoadingState(prev => ({ ...prev, [`dotd-${division}`]: false }));
        }
    };

    return (
        <div className="container push-top">
            <div className="admin-panel">
                <div className="panel-header">
                    <h2>Panel de Control</h2>
                    <button onClick={handleRefresh} className="refresh-btn">
                        <i className="fa-solid fa-rotate-right"></i> Actualizar Datos
                    </button>
                </div>

                <CollapsibleSection title="Herramientas Adicionales" icon="fa-solid fa-toolbox" defaultOpen={true}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px 0' }}>
                        <Link to="/sorteo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>
                            <i className="fa-solid fa-ticket"></i> Sorteo de Karts (Admin)
                        </Link>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Mensaje del Día (MOTD)" icon="fa-solid fa-bullhorn" defaultOpen={false}>
                    <div className="motd-container">
                        <input
                            type="text"
                            placeholder="Mensaje..."
                            value={localConfig.motd || ''}
                            onChange={(e) => setLocalConfig({ ...localConfig, motd: e.target.value })}
                            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: 'white' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setLocalConfig({ ...localConfig, motd: '' })}
                                className="refresh-btn btn btn-primary btn-save "
                                style={{ fontWeight: 'bold', minWidth: 'auto', padding: '10px' }}
                                title="Limpiar"
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                            <button
                                onClick={() => handleToggle('motd', localConfig.motd)}
                                disabled={loadingState['motd']}
                                className="refresh-btn btn btn-primary btn-save "
                            >
                                {loadingState['motd'] ? '...' : <><i className="fa-solid fa-floppy-disk"></i> Guardar</>}
                            </button>
                        </div>
                    </div>
                    <small style={{ color: '#94a3b8', marginTop: '5px', display: 'block' }}>Deja en blanco para ocultar el mensaje.</small>
                </CollapsibleSection>

                <CollapsibleSection title="Gestión de Carreras" icon="fa-solid fa-flag-checkered" defaultOpen={false}>
                    {loadingRaces ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}><i className="fa-solid fa-spinner fa-spin"></i> Cargando carreras...</div>
                    ) : (
                        <div className="races-grid">
                            {races.map((race) => (
                                <div key={`${race.nombre}-${race.fecha}`} className="race-card">
                                    <div className="race-info">
                                        <div style={{ fontWeight: 'bold' }}>{race.nombre}</div>
                                        <div style={{ fontSize: '0.8em', color: '#94a3b8' }}>{race.fecha}</div>
                                    </div>
                                    <div className="race-actions">
                                        <div className="race-toggle">
                                            <span className="mini-label">Activa</span>
                                            {loadingState[`race-${race.nombre}-${race.fecha}-activa`] ? <i className="fa-solid fa-spinner fa-spin"></i> : (
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={race.activa === '1'}
                                                        onChange={() => handleRaceToggle(race.nombre, race.fecha, 'activa')}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            )}
                                        </div>
                                        <div className="race-toggle">
                                            <span className="mini-label">Terminada</span>
                                            {loadingState[`race-${race.nombre}-${race.fecha}-terminada`] ? <i className="fa-solid fa-spinner fa-spin"></i> : (
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={race.terminada === '1'}
                                                        onChange={() => handleRaceToggle(race.nombre, race.fecha, 'terminada')}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CollapsibleSection>

                <CollapsibleSection title="Visibilidad de Páginas" icon="fa-solid fa-eye" defaultOpen={false}>
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
                </CollapsibleSection>

                <CollapsibleSection title="Flechas de Clasificación" icon="fa-solid fa-arrows-up-down" defaultOpen={false}>
                    <div className="toggles-grid">
                        {[1, 2, 3].map((division) => (
                            <div key={`arrow-${division}`} className="toggle-card">
                                <div className="toggle-info">
                                    <span className="toggle-icon">↕️</span>
                                    <span className="toggle-label">División {division}</span>
                                </div>
                                <div className="toggle-action">
                                    {loadingState[`arrow-${division}`] ? (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={getArrowState(division)}
                                                onChange={() => handleArrowToggle(division)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Piloto del Día (DOTD)" icon="fa-solid fa-star" defaultOpen={false}>
                    <div className="toggles-grid">
                        {[1, 2, 3].map((division) => (
                            <div key={`dotd-${division}`} className="toggle-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                <div className="toggle-info">
                                    <span className="toggle-icon">⭐</span>
                                    <span className="toggle-label">División {division}</span>
                                </div>
                                <div className="toggle-action" style={{ width: '100%' }}>
                                    {loadingState[`dotd-${division}`] ? (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                        <select
                                            value={getDotdStateForDiv(division)}
                                            onChange={(e) => handleDotdChange(division, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                background: '#1e293b',
                                                color: '#fff',
                                                border: '1px solid #334155'
                                            }}
                                        >
                                            <option value="0">0 - No Activas (Cerrado)</option>
                                            <option value="1">1 - Votación Activa</option>
                                            <option value="2">2 - Finalizadas (Oculto)</option>
                                            <option value="3">3 - Finalizadas (Resultados Visibles)</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>

                <div className="admin-note">
                    <p>⚠️ <strong>Nota:</strong> Los cambios pueden tardar unos segundos en propagarse a todos los usuarios debido al caché de Google Sheets.</p>
                </div>
            </div>

            <style>{`
                .push-top {
                    margin-top: 1rem;
                    max-width: 900px; /* Wider on desktop */
                    margin-left: auto;
                    margin-right: auto;
                }
                .admin-panel {
                    background-color: var(--card-bg);
                    padding: 1rem;
                    border-radius: 12px;
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between; /* Horizontal layout */
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .panel-header h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .refresh-btn {
                    background: none;
                    border: 1px solid var(--color-accent);
                    color: var(--color-accent);
                    padding: 4px 8px;
                    font-size: 0.85rem;
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
                    gap: 0.5rem; /* Tighter gap */
                }
                .toggle-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.75rem 1rem; /* Compact padding */
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .toggle-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .toggle-icon {
                    font-size: 1.2rem;
                }
                .toggle-label {
                    font-weight: 600;
                    font-size: 1rem;
                }
                .admin-note {
                    margin-top: 1rem;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                    text-align: center;
                    background: rgba(251, 191, 36, 0.1);
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(251, 191, 36, 0.2);
                }

                /* Compact MOTD Section */
                .motd-container {
                    display: flex;
                    gap: 8px;
                }
                /* Mobile tweaks */
                @media (max-width: 480px) {
                    .motd-container {
                        flex-direction: column;
                    }
                    .btn-save {
                        width: 100%;
                        padding: 10px;
                    }
                }

                /* Switch CSS */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px; /* Smaller switch */
                    height: 28px;
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
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 20px; /* Smaller knob */
                    width: 20px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--success);
                }
                input:focus + .slider {
                    box-shadow: 0 0 1px var(--success);
                }
                input:checked + .slider:before {
                    transform: translateX(22px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
                .races-grid {
                    display: grid;
                    gap: 0.5rem;
                }
                .race-card {
                    background: rgba(0,0,0,0.3);
                    padding: 0.8rem;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .race-info {
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 5px;
                }
                .race-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }
                .race-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.05);
                    padding: 5px 10px;
                    border-radius: 6px;
                    flex: 1;
                    justify-content: center;
                }
                .mini-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #cbd5e1;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
