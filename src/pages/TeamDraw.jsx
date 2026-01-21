import React, { useState, useEffect, useRef } from 'react';
import { getLeaderboardData } from '../services/data';
import html2canvas from 'html2canvas';
import './TeamDraw.css';

const TeamDraw = () => {
    const [allDrivers, setAllDrivers] = useState([]);
    const [division, setDivision] = useState(1);
    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState('idle'); // 'idle', 'numbering', 'pairing', 'finished'
    const [pilots, setPilots] = useState([]);
    const [teams, setTeams] = useState([]);
    const [activeTeamId, setActiveTeamId] = useState(null);
    const [pairingPilots, setPairingPilots] = useState([]);
    const [manualNumbers, setManualNumbers] = useState({}); // { pilotName: number }
    const resultsRef = useRef(null);

    // Audio Refs
    const drumrollRef = useRef(new Audio('https://www.soundjay.com/misc/sounds/drum-roll-04.mp3'));
    const revealRef = useRef(new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'));

    useEffect(() => {
        // Configure sounds
        drumrollRef.current.loop = true;
        drumrollRef.current.volume = 0.5; // Ensure it's not too loud/too quiet
        drumrollRef.current.load();
        revealRef.current.load();

        console.log("Audio elements initialized:", { drum: drumrollRef.current.src, bell: revealRef.current.src });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLeaderboardData();
                setAllDrivers(data);
                loadDivision(data, 1);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const loadDivision = (data, divId) => {
        const filtered = data
            .filter(d => d.division === divId)
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
        setPhase('idle');
        setTeams([]);
        setActiveTeamId(null);
        setPairingPilots([]);
        setManualNumbers({});
    };

    const handleNumberChange = (pilotName, val) => {
        const num = val === '' ? '' : parseInt(val);
        setManualNumbers(prev => ({
            ...prev,
            [pilotName]: num
        }));
    };

    const validateNumbers = () => {
        const values = Object.values(manualNumbers).filter(v => v !== '');
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

            // CLEAR STATE FOR NEXT REVEAL (Prevent overlapping/lingering)
            // Added extra 3s delay between teams as requested
            await new Promise(r => setTimeout(r, 3000));
            setActiveTeamId(null);
            setPairingPilots([]);
            await new Promise(r => setTimeout(r, 800));
        }

        setPhase('finished');
        setActiveTeamId(null);
        setPairingPilots([]);

        // Auto-scroll to results after a short delay for the last confetti to start
        setTimeout(() => {
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 500);
    };

    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
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
            <h1 className="draw-title">SORTEO EXTRAORDINARIO</h1>

            <div className="draw-controls">
                <select className="division-dropdown" value={division} onChange={handleDivisionChange} disabled={phase !== 'idle'}>
                    <option value="1">1ª DIVISIÓN (GRID)</option>
                    <option value="2">2ª DIVISIÓN (GRID)</option>
                </select>

                {phase === 'idle' && (
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
                        <i className="fas fa-magic"></i> COMENZAR SORTEO
                    </button>
                )}

                {phase === 'finished' && (
                    <div className="draw-actions">
                        <button className="draw-btn secondary" onClick={() => loadDivision(allDrivers, division)}>
                            NUEVO SORTEO
                        </button>
                        <button className="draw-btn success" onClick={exportImage}>
                            DESCARGAR IMAGEN
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
                        {pairingPilots.length === 0 && <h2 className="announcer-team"> <span className="announcer-dots"> ...</span></h2>}
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

            <div className={`draw-content phase-${phase}`} ref={resultsRef}>

                {/* PILOT GRID - Blurs only during pairing phase */}
                <div className={`pilots-grid ${phase === 'finished' ? 'minimized' : ''} ${phase === 'pairing' ? 'soft-blur' : ''}`}>
                    {pilots.map((pilot) => (
                        <div key={pilot.name} className={`pilot-square ${pilot.isFlipped ? 'is-flipped' : ''} ${pilot.isPaired ? 'paired' : ''} team-${pilot.teamId}`}>
                            <div className="pilot-square-inner">
                                {/* FRONT FACE */}
                                <div className="card-face card-front">
                                    <img src={pilot.photo} alt={pilot.name} className="p-photo" />
                                    <div className="p-info">
                                        <span className="p-name">{pilot.name}</span>
                                    </div>
                                    <div className={`p-number ${pilot.number ? 'revealed' : ''}`}>
                                        {phase === 'idle' ? (
                                            <div className="manual-input-wrapper">
                                                <span className="manual-input-visual">
                                                    {manualNumbers[pilot.name] ? '•' : '?'}
                                                </span>
                                                <input
                                                    type="password"
                                                    className="manual-input-hidden"
                                                    maxLength="2"
                                                    value={manualNumbers[pilot.name] || ''}
                                                    onChange={(e) => handleNumberChange(pilot.name, e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            pilot.showNumber ? pilot.number : '*'
                                        )}
                                    </div>
                                </div>
                                {/* BACK FACE (Mystery) */}
                                <div className="card-face card-back">
                                    <div className="card-back-logo">CK</div>
                                    <div className="card-back-pattern"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FINAL TEAMS - Appear one by one in pairing phase or all in finished */}
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
    );
};

export default TeamDraw;
