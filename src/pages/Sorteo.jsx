import React, { useState, useRef } from 'react';
import { shuffle, parseHistory, findPerfectMatching, crearListaAnimada } from '../utils/sorteoLogic';

const Sorteo = () => {
    const [pilotos, setPilotos] = useState('');
    const [karts, setKarts] = useState('');
    const [historial, setHistorial] = useState('');
    const [results, setResults] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [copyBtnText, setCopyBtnText] = useState('Copiar al Historial');

    // To store the last assignments for copying to history
    const [lastAssignments, setLastAssignments] = useState([]);

    const handleSortear = () => {
        const nombres = pilotos.split(/[\n,]+/).map(n => n.trim()).filter(n => n);
        const kartsList = karts.split(",").map(k => k.trim()).filter(k => k);
        const { map: history, originals } = parseHistory(historial);

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

        let perfectMapping = findPerfectMatching(nombres, kartsList, history);

        if (!perfectMapping) {
            const cannotAvoidFor = [];
            nombres.forEach((nombre) => {
                const prevSet = history.get(nombre.toLowerCase().trim());
                if (prevSet && prevSet.size >= kartsList.length) {
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

            newResults.push({
                name: nombre,
                kart: kartAsignado,
                listaAnimada: listaAnimada,
                delay: i * fadeUpDelayPerItem,
                animationDuration: 2500 + (Math.random() * 1000)
            });
        });

        setLastAssignments(assignments);
        setResults(newResults);

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

    const handleClearHistory = () => {
        if (!historial) return;
        if (window.confirm('¿Estás seguro de borrar todo el historial?')) {
            setHistorial('');
        }
    };

    return (
        <div className="container">
            <div className="panel">
                <div className="inputs-row">
                    <div>
                        <label><i className="fa-solid fa-users"></i> Pilotos</label>
                        <textarea
                            id="corredores"
                            placeholder="Ej: Alonso&#10;Sainz&#10;Verstappen"
                            value={pilotos}
                            onChange={(e) => setPilotos(e.target.value)}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label><i className="fa-solid fa-car-side"></i> Karts Disponibles</label>
                        <input
                            type="text"
                            id="karts"
                            placeholder="Ej: 1, 2, 3, 4, 5, 6"
                            value={karts}
                            onChange={(e) => setKarts(e.target.value)}
                        />

                        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                            <label><i className="fa-solid fa-clipboard-list"></i> Historial / Restricciones</label>
                            <textarea
                                id="historial"
                                placeholder="Nombre: kart1, kart2 (evita repetir)"
                                value={historial}
                                onChange={(e) => setHistorial(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <small><i className="fa-solid fa-circle-info"></i> El sistema asignará karts intentando no repetir los que estén en el historial.</small>

                <div className="btn-group">
                    <button id="copyHistBtn" className="btn-secondary" title="Guardar resultado actual en historial" onClick={handleCopyHistory}>
                        <i className={`fa-regular ${copyBtnText === 'Copiado' ? 'fa-check' : 'fa-copy'}`}></i> {copyBtnText}
                    </button>
                    <button id="clearHistBtn" className="btn-danger" title="Borrar todo el historial" onClick={handleClearHistory}>
                        <i className="fa-solid fa-trash-can"></i> Limpiar
                    </button>
                    <button id="sortearBtn" className="btn-primary" onClick={handleSortear} disabled={isSorting}>
                        {isSorting ? <><i className="fa-solid fa-spinner fa-spin"></i> Sorteando...</> : <><i className="fa-solid fa-shuffle"></i> INICIAR SORTEO</>}
                    </button>
                </div>
            </div>

            <div className="grid" id="grid">
                {results.map((item, index) => (
                    <SlotMachineCard key={index} item={item} />
                ))}
            </div>
            <br />

            <style>{`
                /* Sorteo Specific Styles */
                .panel {
                    background-color: var(--card-bg);
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 30px;
                }

                .inputs-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .container {
                    padding-top: 30px;
                    padding-bottom: 50px;
                }

                @media (max-width: 600px) {
                    .inputs-row {
                        grid-template-columns: 1fr;
                    }
                }
                
                label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                textarea,
                input[type="text"] {
                    width: 100%;
                    height: 150px;
                    background-color: #111827;
                    border: 1px solid #374151;
                    color: white;
                    padding: 10px;
                    border-radius: 8px;
                    resize: vertical;
                    font-family: monospace;
                }

                .btn-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }

                .btn-primary, .btn-secondary, .btn-danger {
                    padding: 12px 20px;
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
