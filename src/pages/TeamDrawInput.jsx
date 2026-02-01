import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getLeaderboardData } from '../services/data';
import './TeamDraw.css'; // Reusing styles

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://julian-scholar-laundry-enclosure.trycloudflare.com';

const TeamDrawInput = () => {
    const [allDrivers, setAllDrivers] = useState([]);
    const [division, setDivision] = useState(3);
    const [loading, setLoading] = useState(true);
    const [pilots, setPilotos] = useState([]);

    // Independent State for Input Device
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [drawStatus, setDrawStatus] = useState({}); // { name: { state, number, temporaryNumber } }
    const socketRef = React.useRef(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
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

    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const loadDivision = (data, divId) => {
        const filtered = data
            .filter(d => d.division === divId && d.season === '2026')
            .slice(0, 10)
            .map(d => ({
                ...d,
                number: null,
            }));
        setPilotos(filtered);

        // Initialize available numbers
        const nums = Array.from({ length: 10 }, (_, i) => i + 1);
        setAvailableNumbers(shuffleArray(nums));

        // Initialize status
        const initialStatus = {};
        filtered.forEach(p => {
            initialStatus[p.name] = { state: 'idle', number: null };
        });
        setDrawStatus(initialStatus);
    };

    const handleSpin = async (pilotName) => {
        if (availableNumbers.length === 0 || drawStatus[pilotName]?.state !== 'idle') return;

        let drawnNumber;
        let newAvailable = [...availableNumbers];



        const numIndex = Math.floor(Math.random() * availableNumbers.length);
        drawnNumber = availableNumbers[numIndex];

        const finalIndex = newAvailable.indexOf(drawnNumber);
        if (finalIndex !== -1) {
            newAvailable.splice(finalIndex, 1);
        }
        setAvailableNumbers(newAvailable);

        // -- Phase 1: Spinning (Slot Machine) --
        setDrawStatus(prev => ({
            ...prev,
            [pilotName]: { state: 'spinning', number: null }
        }));

        // Simulate spinning for 2 seconds
        const spinDuration = 2000;
        const intervalTime = 100;
        let elapsed = 0;

        const spinInterval = setInterval(() => {
            const randomDisplay = Math.floor(Math.random() * 10) + 1;
            setDrawStatus(prev => ({
                ...prev,
                [pilotName]: { ...prev[pilotName], temporaryNumber: randomDisplay }
            }));
            elapsed += intervalTime;
            if (elapsed >= spinDuration) {
                clearInterval(spinInterval);
                finishSpin();
            }
        }, intervalTime);

        const finishSpin = () => {
            // -- Phase 2: Revealed (Show for 5 seconds) --
            setDrawStatus(prev => ({
                ...prev,
                [pilotName]: { state: 'revealed', number: drawnNumber }
            }));

            // Emit to socket IMMEDIATELY upon reveal
            if (socketRef.current) {
                socketRef.current.emit('name_number_data', {
                    name: pilotName,
                    number: drawnNumber
                });
            }

            // -- Phase 3: Hidden (Hide after 5 seconds) --
            setTimeout(() => {
                setDrawStatus(prev => ({
                    ...prev,
                    [pilotName]: { state: 'saved', number: drawnNumber } // 'saved' state hides it visually based on my plan
                }));
            }, 5000);
        };
    };

    const handleDivisionChange = (e) => {
        const div = parseInt(e.target.value);
        setDivision(div);
        loadDivision(allDrivers, div);
    };

    if (loading) return <div className="draw-loading">Cargando...</div>;

    return (
        <div className="draw-container fade-in" style={{ maxWidth: '800px' }}>
            <h1 className="draw-title" style={{ fontSize: '2rem' }}>Sorteo números</h1>

            <div className="draw-controls">
                <select className="division-dropdown" value={division} onChange={handleDivisionChange}>
                    <option value="3">3ª DIVISIÓN</option>
                    <option value="2">2ª DIVISIÓN</option>
                    <option value="1">1ª DIVISIÓN</option>
                </select>

                <div className="status-info" style={{ marginTop: '1rem' }}>
                    NUMEROS DISPONIBLES: <span className="highlight">{availableNumbers.length}</span> / 10
                </div>
            </div>

            <div className="individual-draw-list">
                {pilots.map((pilot) => {
                    const status = drawStatus[pilot.name] || { state: 'idle', number: null };
                    return (
                        <div key={pilot.name} className={`slot-machine-row ${status.state}`}>
                            <div className="slot-pilot-info">
                                <img src={pilot.photo} alt={pilot.name} className="slot-pilot-photo" />
                                <span className="slot-pilot-name">{pilot.name}</span>
                            </div>

                            <div className="slot-machine-action">
                                {status.state === 'idle' && (
                                    <button className="spin-btn" onClick={() => handleSpin(pilot.name)}>
                                        GIRAR
                                    </button>
                                )}

                                {status.state === 'spinning' && (
                                    <div className="slot-display spinning">
                                        <div className="slot-number-reel">
                                            {status.temporaryNumber}
                                        </div>
                                    </div>
                                )}

                                {status.state === 'revealed' && (
                                    <div className="slot-display revealed">
                                        <span className="reveal-text">#{status.number}</span>
                                    </div>
                                )}

                                {status.state === 'saved' && (
                                    <div className="slot-display completed">
                                        <span className="saved-icon">✔</span>
                                        <span className="saved-text hidden-number">LISTO</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamDrawInput;
