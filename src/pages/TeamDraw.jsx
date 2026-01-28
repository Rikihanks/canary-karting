import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getLeaderboardData } from '../services/data';
import html2canvas from 'html2canvas';
import drumrollSound from '../assets/drumroll2.mp3';
import revealSound from '../assets/TA-DA.mp3';
import scapesSound from '../assets/silver-scapes.mp3';
import './TeamDraw.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://julian-scholar-laundry-enclosure.trycloudflare.com';

const TeamDraw = () => {
    const [allDrivers, setAllDrivers] = useState([]);
    const [division, setDivision] = useState(3);
    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState('idle'); // 'idle', 'numbering', 'pairing', 'finished'
    const [pilots, setPilots] = useState([]);
    const [teams, setTeams] = useState([]);
    const [savedDiv3Teams, setSavedDiv3Teams] = useState([]); // Store Division 3 results
    const [savedDiv2Teams, setSavedDiv2Teams] = useState([]); // Store Division 2 results
    const [activeTeamId, setActiveTeamId] = useState(null);
    const [pairingPilots, setPairingPilots] = useState([]);
    const [manualNumbers, setManualNumbers] = useState({}); // { pilotName: number }
    const [reelIdx, setReelIdx] = useState(0); // Shuffle index for the spinning cards
    const resultsRef = useRef(null);
    const socketRef = useRef(null);

    // -- NEW: Slot Machine / Individual Draw State --
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [drawStatus, setDrawStatus] = useState({}); // { pilotName: { state: 'idle'|'spinning'|'revealed'|'saved', number: null } }


    // Audio Refs
    const drumrollRef = useRef(null);
    const revealRef = useRef(null);
    const scapesRef = useRef(null);

    useEffect(() => {
        // Initialize audio elements with proper sources
        drumrollRef.current = new Audio(drumrollSound);
        revealRef.current = new Audio(revealSound);
        scapesRef.current = new Audio(scapesSound);

        // Configure sounds
        drumrollRef.current.loop = true;
        drumrollRef.current.volume = 0.5;
        drumrollRef.current.preload = 'auto';

        revealRef.current.preload = 'auto';
        scapesRef.current.preload = 'auto';
        scapesRef.current.volume = 0.7;

        console.log("Audio elements initialized:", {
            drum: drumrollRef.current.src,
            bell: revealRef.current.src,
            scapes: scapesRef.current.src
        });

        return () => {
            // Cleanup audio on unmount
            [drumrollRef, revealRef, scapesRef].forEach(ref => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current.src = '';
                }
            });
        };
    }, []);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('name_number_data', ({ name, number }) => {
            console.log('Received number picked:', { name, number });
            setDrawStatus(prev => ({
                ...prev,
                [name]: { state: 'revealed', number: number }
            }));
            setManualNumbers(prev => ({
                ...prev,
                [name]: number
            }));
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLeaderboardData();
                setAllDrivers(data);
                loadDivision(data, 3);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let interval;
        if (phase === 'pairing' && activeTeamId && pairingPilots.length === 0) {
            interval = setInterval(() => {
                setReelIdx(prev => prev + 1);
            }, 120); // Velocidad de barajado
        }
        return () => clearInterval(interval);
    }, [phase, activeTeamId, pairingPilots]);

    useEffect(() => {
        const scapes = scapesRef.current;
        const handleEnded = () => {
            setPhase('finished');
            // Auto-scroll to results after celebration ends
            setTimeout(() => {
                if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500); // Small delay for smooth transition
        };

        if (phase === 'celebration') {
            console.log("Starting Celebration Audio: Silver Scrapes");
            scapes.currentTime = 0;
            scapes.play().catch(e => console.error("Scapes failed to play:", e));
            scapes.addEventListener('ended', handleEnded);
        }

        return () => {
            scapes.pause();
            scapes.removeEventListener('ended', handleEnded);
        };
    }, [phase]);

    const loadDivision = (data, divId) => {
        const filtered = data
            .filter(d => d.division === divId && d.season === '2026')
            .slice(0, 10)
            .map(d => ({
                ...d,
                number: null,
                isFlipped: false, // NEW: For 3D flip reveal
                isPaired: false,
                showNumber: false,
                teamId: null
            }));
        setPilots(filtered);
        setPhase('individual-draw'); // Start with individual draw
        setTeams([]);
        setActiveTeamId(null);
        setPairingPilots([]);

        // Initialize available numbers [1..10]
        const nums = Array.from({ length: 10 }, (_, i) => i + 1);
        setAvailableNumbers(shuffleArray(nums));

        // Initialize draw status to idle for all pilots (waiting for socket)
        const initialStatus = {};
        const initialManual = {};

        filtered.forEach((p) => {
            initialStatus[p.name] = { state: 'idle', number: null };
            initialManual[p.name] = '';
        });

        setDrawStatus(initialStatus);
        setManualNumbers(initialManual);
        setAvailableNumbers([]); // Not used in TV view anymore
    };

    // handleSpin removed as it is not used in TV view (Display Only)

    const allPilotsDrawn = pilots.length > 0 && pilots.every(p => {
        const s = drawStatus[p.name];
        return s && (s.state === 'saved' || s.state === 'revealed');
    });

    const handleNumberChange = (pilotName, val) => {
        const num = val === '' ? '' : parseInt(val);
        setManualNumbers(prev => ({
            ...prev,
            [pilotName]: num
        }));
    };

    // Kept for fallback manual editing if needed
    const validateNumbers = () => {
        const values = Object.values(manualNumbers).filter(v => v !== '' && v !== null && !isNaN(v));
        if (values.length < 10) return { valid: false, msg: "Faltan números por asignar." };

        const uniqueValues = new Set(values);
        if (uniqueValues.size < 10) return { valid: false, msg: "Hay números repetidos." };

        const allInRange = values.every(v => v >= 1 && v <= 10);
        if (!allInRange) return { valid: false, msg: "Los números deben ser del 1 al 10." };

        return { valid: true };
    };

    const handleDivisionChange = (e) => {
        const div = parseInt(e.target.value);
        setDivision(div);
        loadDivision(allDrivers, div);
    };

    const runEpicSorteo = async () => {
        if (pilots.length < 2) return;

        // Use local variable to avoid stale state issues in this long async function
        let currentPilots = [...pilots];

        // --- PHASE 1: Dramatic Flip (Hide everything) ---
        setPhase('numbering');

        // Use manually assigned numbers and flip all to back
        currentPilots = currentPilots.map(p => ({
            ...p,
            number: manualNumbers[p.name],
            isFlipped: true,
            isSpinning: false // Ensure slot is off
        }));
        setPilots(currentPilots);

        await new Promise(r => setTimeout(r, 1500)); // Suspense when everything flips

        // --- PHASE 2: Sequential Team Pairing (Fixed Pattern: 1-6, 2-7, etc.) ---
        setPhase('pairing');
        const finalTeams = [];

        // We pair 1 with 6, 2 with 7, 3 with 8, 4 with 9, 5 with 10
        for (let i = 1; i <= 5; i++) {
            const teamId = i;
            const n1 = i;
            const n2 = i + 5;

            const p1 = currentPilots.find(p => p.number === n1);
            const p2 = currentPilots.find(p => p.number === n2);
            const pair = [p1, p2];

            setActiveTeamId(teamId);
            setPairingPilots([]); // Clear previous team pilots immediately

            // Start Drumroll
            drumrollRef.current.currentTime = 0;
            console.log("Playing drumroll...");
            drumrollRef.current.play().catch(e => console.error("Drumroll failed:", e));

            // Phase 2a: Announce Team Number
            await new Promise(r => setTimeout(r, 7000)); // Suspense

            // Stop Drumroll & Play Reveal
            drumrollRef.current.pause();
            revealRef.current.currentTime = 0;
            console.log("Playing reveal chime...");
            revealRef.current.play().catch(e => console.error("Reveal chime failed:", e));

            // Phase 2b: Reveal Pilots in the announcement
            setPairingPilots(pair);

            // Mark pilots as paired, reveal their numbers, and FLIP BACK
            currentPilots = currentPilots.map(p => {
                if (pair.some(mapped => mapped.name === p.name)) {
                    return { ...p, isPaired: true, showNumber: true, isFlipped: false, teamId: teamId };
                }
                return p;
            });
            setPilots(currentPilots);

            await new Promise(r => setTimeout(r, 8000)); // 8s reveal

            finalTeams.push({ id: teamId, pilots: pair });
            setTeams([...finalTeams]);

            // FINAL TEAM OPTIMIZATION: Reduce pause for the last team (Team 5)
            const isLastTeam = i === 5;
            await new Promise(r => setTimeout(r, isLastTeam ? 1000 : 3000));

            setActiveTeamId(null);
            setPairingPilots([]);

            // Short delay before next team or finish
            if (!isLastTeam) {
                await new Promise(r => setTimeout(r, 800));
            }
        }

        setPhase('finished');
        setActiveTeamId(null);
        setPairingPilots([]);

        // Save division results for side-by-side display later
        if (division === 3) {
            setSavedDiv3Teams([...finalTeams]);
        } else if (division === 2) {
            setSavedDiv2Teams([...finalTeams]);
        }

        // GRAND FINALE: If Division 1, wait very short delay and show celebration
        if (division === 1) {
            await new Promise(r => setTimeout(r, 800)); // Quicker transition to banner
            setPhase('celebration');
        } else {
            // No automated scroll for intermediate divisions as results are hidden
        }
    };

    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Helper for slot machine rolling effect
    const RollingNumber = () => {
        const [num, setNum] = useState(1);
        useEffect(() => {
            const interval = setInterval(() => {
                setNum(Math.floor(Math.random() * 10) + 1);
            }, 80);
            return () => clearInterval(interval);
        }, []);
        return <span className="rolling-digit">{num}</span>;
    };

    const exportImage = async () => {
        if (resultsRef.current) {
            const canvas = await html2canvas(resultsRef.current, {
                backgroundColor: '#090d17',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `Sorteo_Equipos_Div${division}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    if (loading) return <div className="draw-loading">Cargando...</div>;

    return (
        <div className="draw-container fade-in">
            <div className="draw-hero-area">
                <h1 className="draw-title">Sorteo 2026</h1>

                <div className="draw-controls">
                    <select className="division-dropdown" value={division} onChange={handleDivisionChange}>
                        <option value="3">3ª DIVISIÓN (GRID)</option>
                        <option value="2">2ª DIVISIÓN (GRID)</option>
                        <option value="1">1ª DIVISIÓN (GRID)</option>
                    </select>

                    {phase === 'individual-draw' && (
                        <div className="draw-status-bar">
                            <div className="status-info">
                                NUMEROS DISPONIBLES: <span className="highlight">{availableNumbers.length}</span> / 10
                            </div>
                            {allPilotsDrawn && (
                                <button
                                    className="draw-btn primary pulse"
                                    onClick={() => {
                                        runEpicSorteo();
                                    }}
                                >
                                    <i className="fas fa-play"></i> INICIAR SORTEO DE EQUIPOS
                                </button>
                            )}
                        </div>
                    )}

                    {phase === 'idle' && (
                        /* Legacy/Fallback manual start */
                        <button
                            className="draw-btn primary pulse"
                            onClick={() => {
                                const validation = validateNumbers();
                                if (validation.valid) {
                                    runEpicSorteo();
                                } else {
                                    alert(validation.msg);
                                }
                            }}
                        >
                            <i className="fas fa-magic"></i> COMENZAR SORTEO MANUAL
                        </button>
                    )}

                    {phase === 'finished' && (
                        <div className="draw-actions">
                            <button className="export-btn" onClick={exportImage}>
                                📥 Descargar Resultados
                            </button>
                            {division === 3 && (
                                <button className="primary-nav-btn" onClick={() => loadDivision(allDrivers, 2)}>
                                    IR A SEGUNDA DIVISIÓN 🏎️💨
                                </button>
                            )}
                            {division === 2 && (
                                <button className="primary-nav-btn" onClick={() => loadDivision(allDrivers, 1)}>
                                    IR A PRIMERA DIVISIÓN 🏎️💨
                                </button>
                            )}
                            <button className="draw-btn secondary" onClick={() => loadDivision(allDrivers, division)}>
                                REPETIR SORTEO
                            </button>
                        </div>
                    )}
                </div>

                {/* Announcement Overlay during Pairing Phase */}
                {phase === 'pairing' && activeTeamId && (
                    <div className="pairing-announcer">
                        {pairingPilots.length > 0 && (
                            <div className="confetti-wrapper">
                                {[...Array(150)].map((_, i) => (
                                    <div key={i} className="confetti-piece" style={{
                                        '--x': `${Math.random() * 140 - 70}vmax`,
                                        '--y': `${Math.random() * 140 - 70}vmax`,
                                        '--r': `${Math.random() * 1000}deg`,
                                        '--c': ['#fbbf24', '#3b82f6', '#ffffff', '#ffd700', '#60a5fa'][i % 5]
                                    }}></div>
                                ))}
                            </div>
                        )}
                        <div className="announcer-content animate-announce" key={activeTeamId}>
                            <span className="announcer-label">FORMANDO</span>
                            <h2 className="announcer-team">
                                EQUIPO {activeTeamId}
                            </h2>
                            {pairingPilots.length === 0 && (
                                <div className="announcer-spinning-cards">
                                    {[1, 2].map(cardIdx => {
                                        const displayPilot = pilots[(reelIdx + (cardIdx * 3)) % pilots.length];
                                        return (
                                            <div key={cardIdx} className={`spinning-card-container reel-${cardIdx}`}>
                                                <div className="spinning-card">
                                                    <div className="spinning-card-inner">
                                                        <img src={displayPilot.photo} alt="" className="spinning-card-photo" />
                                                        <div className="spinning-card-info">
                                                            <span className="spinning-card-name">{displayPilot.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {pairingPilots.length > 0 && (
                                <div className="announcer-names reveal-anim">
                                    {pairingPilots.map((p, idx) => (
                                        <div key={idx} className="announcer-pilot">
                                            <div className="announcer-portrait-wrap">
                                                <img src={p.photo} alt={p.name} className="announcer-photo" />
                                                <div className="announcer-pilot-badge">{p.number}</div>
                                            </div>
                                            <div className="announcer-pilot-name">{p.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PILOT GRID - Blurs only during pairing phase */}
                <div className={`pilots-grid ${phase === 'finished' ? 'minimized' : ''} ${phase === 'pairing' ? 'soft-blur' : ''}`}>
                    {pilots.map((pilot) => {
                        const status = drawStatus[pilot.name] || { state: 'idle', number: null };
                        const hasNumber = status.state === 'saved' || status.state === 'revealed';

                        return (
                            <div key={pilot.name} className={`pilot-square ${pilot.isFlipped ? 'is-flipped' : ''} ${pilot.isPaired ? 'paired' : ''} ${hasNumber ? 'selected' : ''} team-${pilot.teamId}`}>
                                <div className="pilot-square-inner">
                                    {/* FRONT FACE */}
                                    <div className="card-face card-front">
                                        <img src={pilot.photo} alt={pilot.name} className="p-photo" />
                                        <div className="p-info">
                                            <span className="p-name">{pilot.name}</span>
                                        </div>
                                        {hasNumber && phase === 'individual-draw' && (
                                            <div className="p-assigned-number highlight-yellow">
                                                <div className="assigned-label">NUMERO SELECCIONADO</div>
                                            </div>
                                        )}
                                        {hasNumber && phase !== 'individual-draw' && (
                                            <div className="p-assigned-number highlight-yellow">
                                                <div className="assigned-label">NUMERO SELECCIONADO</div>
                                                <div className="assigned-val">#{status.number}</div>
                                            </div>
                                        )}
                                    </div>
                                    {/* BACK FACE (Mystery) */}
                                    <div className="card-face card-back">
                                        <div className="card-back-logo">CK</div>
                                        <div className="card-back-pattern"></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {phase === 'celebration' && (
                    <div className="celebration-overlay" onClick={() => setPhase('finished')}>
                        <div className="celebration-content">
                            <div className="glitch-title" data-text="BIENVENIDOS">BIENVENIDOS</div>
                            <div className="sub-title-wrap">
                                <span className="sub-text">A CANARY KARTING</span>
                            </div>
                            <div className="season-badge">
                                <span className="season-label">TEMPORADA</span>
                                <span className="season-year">2026</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FINAL TEAMS - Only show when fully finished after Div 1 celebration */}
            {phase === 'finished' && division === 1 && savedDiv3Teams.length > 0 && savedDiv2Teams.length > 0 && teams.length > 0 && (
                <div className="divisions-grid" ref={resultsRef}>
                    {/* Division 3 Column */}
                    <div className="division-column">
                        <h2 className="division-column-header">3ª DIVISIÓN</h2>
                        <div className="final-teams-layout">
                            {savedDiv3Teams.map((team) => (
                                <div key={team.id} className="team-stripe animate-entry">
                                    <div className="stripe-header">EQUIPO {team.id}</div>
                                    <div className="stripe-members">
                                        {team.pilots.map(p => (
                                            <div key={p.name} className="stripe-member">
                                                <img src={p.photo} alt={p.name} />
                                                <div className="sm-info">
                                                    <span className="sm-name">{p.name}</span>
                                                    <span className="sm-rank">Nº {p.number}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Division 2 Column */}
                    <div className="division-column">
                        <h2 className="division-column-header">2ª DIVISIÓN</h2>
                        <div className="final-teams-layout">
                            {savedDiv2Teams.map((team) => (
                                <div key={team.id} className="team-stripe animate-entry">
                                    <div className="stripe-header">EQUIPO {team.id}</div>
                                    <div className="stripe-members">
                                        {team.pilots.map(p => (
                                            <div key={p.name} className="stripe-member">
                                                <img src={p.photo} alt={p.name} />
                                                <div className="sm-info">
                                                    <span className="sm-name">{p.name}</span>
                                                    <span className="sm-rank">Nº {p.number}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Division 1 Column */}
                    <div className="division-column">
                        <h2 className="division-column-header">1ª DIVISIÓN</h2>
                        <div className="final-teams-layout">
                            {teams.map((team) => (
                                <div key={team.id} className="team-stripe animate-entry">
                                    <div className="stripe-header">EQUIPO {team.id}</div>
                                    <div className="stripe-members">
                                        {team.pilots.map(p => (
                                            <div key={p.name} className="stripe-member">
                                                <img src={p.photo} alt={p.name} />
                                                <div className="sm-info">
                                                    <span className="sm-name">{p.name}</span>
                                                    <span className="sm-rank">Nº {p.number}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamDraw;
