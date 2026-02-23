import React, { useState, useRef, useEffect } from 'react';
import { shuffle, parseHistory, findPerfectMatching, crearListaAnimada } from '../utils/sorteoLogic';
import html2canvas from 'html2canvas';
import { logEvent } from '../services/telemetry';
import { getLeaderboardData } from '../services/data';

const Sorteo = () => {
    const resultadoRef = useRef(null);
    const [karts, setKarts] = useState('');
    const [historial, setHistorial] = useState('');
    const [results, setResults] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [isOscuroMode, setIsOscuroMode] = useState(false);
    const [copyBtnText, setCopyBtnText] = useState('Copiar al Historial');

    // To store the last assignments for copying to history
    const [lastAssignments, setLastAssignments] = useState([]);

    const [allDrivers, setAllDrivers] = useState([]);
    const [activeDivision, setActiveDivision] = useState(1);
    const [activeSeason, setActiveSeason] = useState("2026");
    const [pilotosRows, setPilotosRows] = useState([]);
    const [savedSessions, setSavedSessions] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('sorteo_saves') || '[]');
        } catch {
            return [];
        }
    });

    // -- AUTO FILL HELPER --
    const loadDefaultPilots = (division, drivers = allDrivers) => {
        if (!drivers || drivers.length === 0) return;
        const divDrivers = drivers
            .filter(d => d.division === division && d.season === activeSeason)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(d => ({ name: d.name, weight: '' }));
        setPilotosRows(divDrivers);
    };

    // -- FETCH DRIVERS ON MOUNT --
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const data = await getLeaderboardData();
                setAllDrivers(data);
                // Pre-fill on first load if we don't have pilots
                if (pilotosRows.length === 0) {
                    loadDefaultPilots(activeDivision, data);
                }
            } catch (err) {
                console.error("Error fetching drivers", err);
            }
        };
        fetchDrivers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaveSession = () => {
        const name = window.prompt("Introduce un nombre para guardar esta sesión:", `Carrera - Div ${activeDivision} - ${new Date().toLocaleDateString()}`);
        if (!name) return; // User cancelled or left empty

        const stateToSave = {
            id: Date.now().toString(),
            name,
            karts,
            historial,
            activeDivision,
            pilotosRows,
            results,
            lastAssignments
        };

        const existingSaveIndex = savedSessions.findIndex(s => s.name === name);
        let updatedSaves;

        if (existingSaveIndex !== -1) {
            if (window.confirm(`Ya existe una sesión llamada "${name}". ¿Deseas sobreescribirla?`)) {
                updatedSaves = [...savedSessions];
                updatedSaves[existingSaveIndex] = { ...stateToSave, id: savedSessions[existingSaveIndex].id }; // Keep old ID
            } else {
                return; // User declined overwrite
            }
        } else {
            updatedSaves = [...savedSessions, stateToSave];
        }

        setSavedSessions(updatedSaves);
        localStorage.setItem('sorteo_saves', JSON.stringify(updatedSaves));
    };

    const handleLoadSession = (e) => {
        const id = e.target.value;
        if (!id) return;

        const session = savedSessions.find(s => s.id === id);
        if (session && window.confirm(`¿Cargar la sesión "${session.name}"? Se sobrescribirán los datos actuales en pantalla.`)) {
            setKarts(session.karts || '');
            setHistorial(session.historial || '');
            setActiveDivision(session.activeDivision || 1);
            setPilotosRows(session.pilotosRows || []);
            setResults(session.results || []);
            setLastAssignments(session.lastAssignments || []);
        }
        e.target.value = ''; // reset select to default
    };

    const handleDeleteSessions = () => {
        if (window.confirm('¿Seguro que quieres borrar todas las sesiones guardadas de este navegador?')) {
            setSavedSessions([]);
            localStorage.removeItem('sorteo_saves');
        }
    };

    const handleDivisionChange = (e) => {
        const newDiv = parseInt(e.target.value);
        setActiveDivision(newDiv);
        loadDefaultPilots(newDiv);
    };

    const handlePilotChange = (index, field, value) => {
        const newRows = [...pilotosRows];
        newRows[index][field] = value;
        setPilotosRows(newRows);
    };

    const handleAddPilotRow = () => {
        setPilotosRows([...pilotosRows, { name: '', weight: '' }]);
    };

    const handleRemovePilotRow = (index) => {
        const newRows = [...pilotosRows];
        newRows.splice(index, 1);
        setPilotosRows(newRows);
    };

    const exportarAImagen = async () => {
        if (resultadoRef.current) {
            try {
                const canvas = await html2canvas(resultadoRef.current, {
                    scale: 2, // Mayor calidad
                    logging: false,
                    useCORS: true, // Para imágenes externas,
                    imageTimeout: 65000
                });

                // Descargar la imagen
                const link = document.createElement('a');
                link.download = `sorteo-karts-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();

                // O mostrar la imagen
                // const imgData = canvas.toDataURL('image/png');
            } catch (error) {
                console.error('Error al generar la imagen:', error);
            }
        }
    };

    const handleSortear = () => {
        const validPilotos = pilotosRows.filter(p => p.name.trim());
        const nombres = validPilotos.map(p => p.name.trim());
        const kartsList = karts.split(/[\n;]+/).map(k => k.trim()).filter(k => k);
        const { map: history, originals } = parseHistory(historial);

        // EXTRA RULE: Karts that cannot be ballasted: 51, 60, 61
        // If a pilot needs > 10kg ballast (difference > 10), they CANNOT get these karts.
        const unballastableKarts = ['51', '60', '61'];
        validPilotos.forEach(p => {
            const w = parseFloat(p.weight);
            if (!isNaN(w) && (75 - w) > 10) {
                const nameNorm = p.name.trim().toLowerCase();
                let prevSet = history.get(nameNorm);
                if (!prevSet) {
                    prevSet = new Set();
                    history.set(nameNorm, prevSet);
                }
                unballastableKarts.forEach(k => prevSet.add(k));

                if (!originals.has(nameNorm)) {
                    originals.set(nameNorm, p.name.trim());
                }
            }
        });

        setResults([]); // Clear previous results
        setLastAssignments([]);

        if (nombres.length === 0 || kartsList.length === 0) {
            alert("⚠️ Debes introducir al menos un corredor y un kart.");
            return;
        }

        if (nombres.length > kartsList.length) {
            alert("⚠️ Hay más corredores que karts disponibles.");
            return;
        }

        // --- MODO OSCURO ---
        let nombresParaSortear = [...nombres];
        let kartsParaSortear = [...kartsList];
        let forceMappings = {};

        if (isOscuroMode && activeDivision === 1) {
            const luisIndex = nombresParaSortear.findIndex(n => n.toLowerCase().includes('luis hidalgo'));
            const kartIndex = kartsParaSortear.findIndex(k => k === '60');
            if (luisIndex !== -1 && kartIndex !== -1) {
                forceMappings[nombresParaSortear[luisIndex]] = '60';
                nombresParaSortear.splice(luisIndex, 1);
                kartsParaSortear.splice(kartIndex, 1);
            }
        }

        // Run matching on the (potentially filtered) lists
        const subMapping = findPerfectMatching(nombresParaSortear, kartsParaSortear, history);

        if (!subMapping) {
            const cannotAvoidFor = [];
            nombresParaSortear.forEach((nombre) => {
                const prevSet = history.get(nombre.toLowerCase().trim());
                if (prevSet && prevSet.size >= kartsParaSortear.length) {
                    const displayName = originals.get(nombre.toLowerCase().trim()) || nombre;
                    cannotAvoidFor.push(displayName);
                }
            });

            let confirmMsg = "No ha sido posible encontrar una asignación perfecta sin repeticiones.";
            if (cannotAvoidFor.length > 0) {
                confirmMsg = `No hay suficientes karts distintos para evitar repetir con: ${cannotAvoidFor.join(", ")}. ¿Deseas continuar permitiendo repeticiones?`;
            } else {
                confirmMsg += " ¿Continuar?";
            }

            if (!window.confirm(confirmMsg)) return;
        }

        const perfectMapping = { ...(subMapping || {}), ...forceMappings };

        setIsSorting(true);
        let availableKarts = shuffle(kartsList.slice());



        const fadeUpDelayPerItem = 100;

        const newResults = [];
        const assignments = [];

        nombres.forEach((nombre, i) => {
            let kartAsignado = null;

            if (perfectMapping && perfectMapping.hasOwnProperty(nombre)) {
                kartAsignado = perfectMapping[nombre];
                const idx = availableKarts.indexOf(kartAsignado);
                if (idx !== -1) availableKarts.splice(idx, 1);
            } else {
                // Greedy fallback
                const prevSet = history.get(nombre.toLowerCase().trim());
                if (availableKarts.length > 0) {
                    for (let j = 0; j < availableKarts.length; j++) {
                        const candidate = availableKarts[j];
                        const candidateNorm = candidate.trim().toLowerCase();
                        if (!prevSet || !prevSet.has(candidateNorm)) {
                            kartAsignado = candidate;
                            availableKarts.splice(j, 1);
                            break;
                        }
                    }
                    if (!kartAsignado) {
                        kartAsignado = availableKarts.shift();
                    }
                }
            }

            assignments.push({ name: nombre, kart: kartAsignado });
            const listaAnimada = crearListaAnimada(kartsList, kartAsignado);

            const pilotRowEntry = validPilotos.find(p => p.name.trim() === nombre);
            const w = parseFloat(pilotRowEntry?.weight);
            let diffTxt = '';
            let diffColor = 'var(--text-muted)';
            if (!isNaN(w)) {
                const difVal = 75 - w;
                const lastre = difVal > 0 ? difVal.toFixed(1) : '0';
                diffTxt = difVal > 0 ? `+${lastre}kg` : '0kg';
                diffColor = difVal > 0 ? '#fbbf24' : '#22c55e';
            }

            newResults.push({
                name: nombre,
                kart: kartAsignado,
                diffTxt: diffTxt,
                diffColor: diffColor,
                listaAnimada: listaAnimada,
                delay: i * fadeUpDelayPerItem,
                animationDuration: 2500 + (Math.random() * 1000)
            });
        });

        setLastAssignments(assignments);
        setResults(newResults);

        logEvent('sorteo_karts', {
            pilotos_count: nombres.length,
            karts_count: kartsList.length,
            has_history: !!historial.trim()
        });

        // Reset sorting state after animation
        const totalDuration = (nombres.length * fadeUpDelayPerItem) + 3500; // rough estimate
        setTimeout(() => {
            setIsSorting(false);
        }, totalDuration);

        // Scroll to results
        setTimeout(() => {
            const grid = document.getElementById("grid");
            if (grid) {
                const gridTop = grid.offsetTop;
                window.scrollTo({ top: gridTop - 80, behavior: "smooth" });
            }
        }, 100);
    };

    const handleCopyHistory = () => {
        if (!lastAssignments || lastAssignments.length === 0) {
            alert('⚠️ No hay asignaciones recientes para copiar.');
            return;
        }
        const lines = lastAssignments.map(a => `${a.name}: ${a.kart}`);
        const separator = historial.trim() ? '\n' : '';
        setHistorial(historial.trim() + separator + lines.join('\n'));

        setCopyBtnText('Copiado');
        setTimeout(() => setCopyBtnText('Copiar al Historial'), 2000);
    };

    const handleClearAll = () => {
        if (window.confirm('¿Estás seguro de que quieres limpiar la pantalla (borrar Pilotos, Karts, Historial y Resultados actuales)? \nEsto NO borrará las sesiones guardadas.')) {
            loadDefaultPilots(activeDivision);
            setKarts('');
            setHistorial('');
            setResults([]);
            setLastAssignments([]);
            setCopyBtnText('Copiar al Historial');
        }
    };

    return (
        <div className="container">
            <div className="panel">
                <div className="division-select-wrapper" style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <label style={{ margin: 0 }}><i className="fa-solid fa-list-ol"></i> División:</label>
                    <select
                        value={activeDivision}
                        onChange={handleDivisionChange}
                        style={{ width: '50%', padding: '8px 12px', borderRadius: '8px', background: '#1f2937', color: 'white', border: '1px solid #374151', fontSize: '1rem' }}
                    >
                        <option value="1">1ª División</option>
                        <option value="2">2ª División</option>
                        <option value="3">3ª División</option>
                    </select>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                            onChange={handleLoadSession}
                            style={{ padding: '8px 12px', borderRadius: '8px', background: '#111827', color: 'white', border: '1px solid #374151', fontSize: '0.9rem', maxWidth: '180px' }}
                            defaultValue=""
                        >
                            <option value="" disabled>Cargar sesión...</option>
                            {savedSessions.map(session => (
                                <option key={session.id} value={session.id}>{session.name}</option>
                            ))}
                        </select>

                        <button onClick={handleSaveSession} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.9rem', width: 'auto' }} title="Guardar estado actual">
                            <i className="fa-solid fa-floppy-disk"></i> Guardar
                        </button>

                        {savedSessions.length > 0 && (
                            <button onClick={handleDeleteSessions} className="btn-danger" style={{ padding: '8px 12px', fontSize: '0.9rem', width: 'auto' }} title="Borrar todas las sesiones guardadas">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        )}
                    </div>
                </div>


                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: isOscuroMode ? '#fbbf24' : 'var(--text-muted)' }}>
                        <input type="checkbox" checked={isOscuroMode} onChange={(e) => setIsOscuroMode(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#fbbf24' }} />
                        <i className="fa-solid fa-moon"></i> Modo Oscuro
                    </label>
                </div>

                <br />

                <div className="inputs-container">
                    <div className="table-left">
                        <div className="row-header">
                            <div><i className="fa-solid fa-user"></i> Piloto</div>
                            <div><i className="fa-solid fa-weight-scale"></i> Peso</div>
                            <div><i className="fa-solid fa-scale-balanced"></i> Ajuste (75kg)</div>
                            <div></div>
                        </div>
                        {pilotosRows.map((pilot, idx) => {
                            const pWeight = parseFloat(pilot.weight);
                            const dif = !isNaN(pWeight) ? (75 - pWeight) : null;
                            const diffTxt = dif !== null ? (dif > 0 ? `+${dif.toFixed(1)}kg` : '0kg') : '-';
                            let diffColor = 'var(--color-secondary-accent)'; // Default
                            if (dif !== null) {
                                diffColor = dif > 0 ? '#fbbf24' : '#22c55e'; // Yellow if > 0, Green if <= 0
                            }
                            return (
                                <div key={idx} className="pilot-row">
                                    <input type="text" value={pilot.name} onChange={(e) => handlePilotChange(idx, 'name', e.target.value)} placeholder="Nombre del piloto" />
                                    <input type="number" step="0.1" value={pilot.weight} onChange={(e) => handlePilotChange(idx, 'weight', e.target.value)} placeholder="Ej: 65" />
                                    <div className="diff-display" style={{ color: diffColor }}>{diffTxt}</div>
                                    <button className="remove-btn" onClick={() => handleRemovePilotRow(idx)}><i className="fa-solid fa-xmark"></i></button>
                                </div>
                            );
                        })}
                        <button className="btn-secondary" style={{ marginTop: '10px', width: 'fit-content' }} onClick={handleAddPilotRow}>
                            <i className="fa-solid fa-plus"></i> Añadir Piloto Extra
                        </button>
                    </div>

                    <div className="table-right">
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span><i className="fa-solid fa-car-side"></i> Karts Disponibles</span>
                            <span style={{ fontSize: '0.85em', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '2px 8px', borderRadius: '12px' }}>
                                {karts.split(/[\n;]+/).map(k => k.trim()).filter(k => k).length} total
                            </span>
                        </label>
                        <textarea
                            id="karts"
                            placeholder="Separados por salto de línea&#10;33&#10;36&#10;37"
                            value={karts}
                            onChange={(e) => setKarts(e.target.value)}
                            style={{ height: 'calc(100% - 30px)', minHeight: '150px' }}
                        ></textarea>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label><i className="fa-solid fa-clipboard-list"></i> Historial / Restricciones</label>
                    <textarea
                        id="historial"
                        placeholder="Nombre: kart1, kart2 (evita repetir)"
                        value={historial}
                        onChange={(e) => setHistorial(e.target.value)}
                        style={{ height: '80px' }}
                    ></textarea>
                </div>

                <small style={{ marginTop: '15px', display: 'block', lineHeight: '1.5' }}>
                    <i className="fa-solid fa-circle-info"></i> El sistema asignará karts intentando no repetir los que estén en el historial. Mínimo 75kg.
                    <br />
                    <span style={{ color: '#fbbf24' }}>
                        <i className="fa-solid fa-triangle-exclamation"></i> Karts sin lastre ({`51, 60, 61`}) excluidos para pilotos con ajuste &gt; 10kg.
                    </span>
                </small>

                <div className="btn-group">
                    <button id="copyHistBtn" className="btn-secondary" title="Guardar resultado actual en historial" onClick={handleCopyHistory}>
                        <i className={`fa-regular ${copyBtnText === 'Copiado' ? 'fa-check' : 'fa-copy'}`}></i> {copyBtnText}
                    </button>
                    <button id="clearHistBtn" className="btn-danger" title="Borrar todos los datos" onClick={handleClearAll}>
                        <i className="fa-solid fa-trash-can"></i> Limpiar Todo
                    </button>
                    <button id="sortearBtn" className="btn-primary" onClick={handleSortear} disabled={isSorting}>
                        {isSorting ? <><i className="fa-solid fa-spinner fa-spin"></i> Sorteando...</> : <><i className="fa-solid fa-shuffle"></i> INICIAR SORTEO</>}
                    </button>
                    <button className="btn-secondary" style={{ display: (!results.length || isSorting) ? 'none' : 'block' }} onClick={exportarAImagen}>
                        Exportar como Imagen
                    </button>
                </div>
            </div>

            <div className="grid" id="grid">
                {results.map((item, index) => (
                    <SlotMachineCard key={index} item={item} />
                ))}
            </div>
            <br />
            <div
                ref={resultadoRef}
                className="grid"
                style={{
                    display: 'grid',
                    position: 'absolute',
                    width: '93%',
                    left: '-9999px',
                    zIndex: -1
                }}
            >
                {results.map((item, index) => (
                    <div
                        key={`clon-${index}`}
                        className="card"
                        // Aseguramos que la tarjeta esté visible (opacidad y posición final)
                        style={{ opacity: 1, transform: 'translateY(0)', animation: 'none' }}
                    >
                        <div className="nombre">{item.name}</div>
                        {item.diffTxt && (
                            <div className="lastre-badge" style={{ color: item.diffColor }}>
                                <i className="fa-solid fa-weight-hanging"></i> Lastre: {item.diffTxt}
                            </div>
                        )}
                        <div className="kart-slot">
                            {/* Renderizamos solo el resultado final, no la lista animada */}
                            <div
                                className="kart-list"
                                // Estilos para forzar el resultado
                                style={{
                                    top: '0px',
                                    filter: 'none',
                                    transition: 'none',
                                    animation: 'none'
                                }}
                            >
                                {/* ⚠️ Esto asume que item.kart es el valor final. */}
                                <div>{item.kart}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                /* Sorteo Specific Styles */
                .inputs-container {
                    display: grid;
                    grid-template-columns: 3fr 1fr;
                    gap: 30px;
                }
                @media (max-width: 800px) {
                    .inputs-container {
                        grid-template-columns: 1fr;
                    }
                }
                .table-left {
                    display: flex;
                    flex-direction: column;
                }
                .table-right {
                    display: flex;
                    flex-direction: column;
                }
                .row-header, .pilot-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 40px;
                    gap: 15px;
                    align-items: center;
                }
                .row-header {
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                }
                .pilot-row {
                    margin-bottom: 10px;
                }
                .pilot-row input {
                    height: 42px;
                    padding: 8px 12px;
                    background-color: #111827;
                    border: 1px solid #374151;
                    color: white;
                    border-radius: 8px;
                    font-family: inherit;
                    width: 100%;
                }
                .diff-display {
                    background: #111827;
                    border: 1px solid #374151;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    font-weight: bold;
                    color: var(--color-secondary-accent);
                    font-size: 0.95rem;
                }
                .remove-btn {
                    background: transparent;
                    color: #ef4444;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 42px;
                    border-radius: 8px;
                    transition: background 0.2s;
                }
                .remove-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                }
                
                .lastre-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: rgba(30, 41, 59, 0.5);
                    color: #93c5fd;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.85em;
                    margin-bottom: 10px;
                    font-weight: bold;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    min-height: 28px;
                    min-width: 115px;
                    white-space: nowrap;
                }

                .panel {
                    background-color: var(--card-bg);
                    padding: 40px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 30px;
                }

                .container {
                    padding-top: 30px;
                    padding-bottom: 50px;
                    max-width: 1400px;
                    width: 95%;
                    margin: 0 auto;
                }

                @media (max-width: 600px) {
                    .panel {
                        padding: 15px;
                    }
                }
                
                label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-muted);
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                textarea {
                    width: 100%;
                    height: 150px;
                    background-color: #111827;
                    border: 1px solid #374151;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    resize: vertical;
                    font-family: monospace;
                    font-size: 1.1rem;
                }

                input[type="text"],
                input[type="tel"] {
                    width: 100%;
                    background-color: #111827;
                    border: 1px solid #374151;
                    color: white;
                    padding: 12px 15px;
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .btn-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }

                .btn-primary, .btn-secondary, .btn-danger {
                    font-size: 1.1rem;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.1s, opacity 0.2s;
                    flex-grow: 1;
                    justify-content: center;
                }
                
                .btn-primary { background-color: var(--accent); color: white; }
                .btn-secondary { background-color: #475569; color: white; }
                .btn-danger { background-color: #ef4444; color: white; }

                .btn-primary:hover { background-color: var(--accent-hover); }
                .btn-primary:disabled { opacity: 0.7; cursor: wait; }

                /* Grid de Resultados */
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 15px;
                    padding-bottom: 50px;
                }

                .card {
                    background-color: #1e293b;
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    opacity: 0; /* Start hidden for fade-up */
                    transform: translateY(20px);
                }
                
                .card.fade-up {
                    animation: fadeUp 0.5s forwards;
                }
                
                .card.name-up {
                    border-color: var(--accent);
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
                }

                @keyframes fadeUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                .nombre {
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #e2e8f0;
                    font-size: 1.1em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .kart-slot {
                    height: 60px;
                    background-color: #0f172a;
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                    border: 1px solid #334155;
                    font-family: 'Russo One', sans-serif;
                    font-size: 1.8em;
                    color: var(--color-secondary-accent);
                }

                .kart-list {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    /* Initial state handled by JS animation */
                }

                .kart-list div {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
};

const SlotMachineCard = ({ item }) => {
    const listRef = useRef(null);
    const [finished, setFinished] = useState(false);

    React.useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const itemHeight = 60;
        const itemsCount = item.listaAnimada.length;
        const finalTop = -itemHeight * (itemsCount - 1);

        // Delay start
        const timer = setTimeout(() => {
            list.animate(
                [
                    { top: "0px", filter: "blur(0px)" },
                    { top: `${finalTop * 0.8}px`, filter: "blur(2px)", offset: 0.6 },
                    { top: `${finalTop}px`, filter: "blur(0px)" }
                ],
                {
                    duration: item.animationDuration,
                    easing: "cubic-bezier(0.12, 0.8, 0.32, 1)",
                    fill: "forwards"
                }
            ).onfinish = () => {
                setFinished(true);
            };
        }, item.delay + 200); // Wait for fade up + a bit

        return () => clearTimeout(timer);
    }, [item]);

    return (
        <div className={`card fade-up ${finished ? 'name-up' : ''}`} style={{ animationDelay: `${item.delay}ms` }}>
            <div className="nombre">{item.name}</div>
            {item.diffTxt && (
                <div className="lastre-badge" style={{ color: item.diffColor }}>
                    <i className="fa-solid fa-weight-hanging"></i> Lastre: {item.diffTxt}
                </div>
            )}
            <div className="kart-slot">
                <div className="kart-list" ref={listRef}>
                    {item.listaAnimada.map((k, i) => (
                        <div key={i}>{k}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sorteo;
