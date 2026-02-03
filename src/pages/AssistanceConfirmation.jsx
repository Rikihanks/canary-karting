import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { confirmAssistance } from '../services/data';

const AssistanceConfirmation = () => {
    const location = useLocation();
    const { raceName, raceDate } = location.state || {};

    const [selectedRace, setSelectedRace] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const { user, isLoading } = useAuth(); // Destructure isLoading

    // Redirect if not logged in
    useEffect(() => {
        if (user && user.correo) {
            setEmail(user.correo);
        }
    }, [user]);

    // Auth Guard Logic
    if (isLoading) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em', color: 'var(--color-accent)' }}></i>
                <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>Cargando...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const race = {
        id: 1,
        name: raceName || 'Carrera 1 - 15 Diciembre 2024',
        date: raceDate || '11/09/2025'
    };

    const divisions = [
        { id: '1', name: 'Primera' },
        { id: '2', name: 'Segunda' },
        { id: '3', name: 'Tercera' }
    ];

    const handleOpenModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirm = async () => {
        setStatus('submitting');

        const payload = {
            raceDate: race.date,
            email: email,
            division: selectedDivisionName,
            codigo: codigo
        };

        try {
            const result = await confirmAssistance(payload);

            if (result && result.success) {
                setStatus('success');
                setMessage(result.message || '¡Te hemos enviado un correo con la confirmación de tu asistencia, nos vemos en el circuito!');
                setSelectedRace('');
                setSelectedDivision('');
                setCodigo('');
            } else {
                setStatus('error');
                setMessage(result?.message || 'Error al confirmar la asistencia. Verifica tu código.');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Error al conectar con el servidor.');
        } finally {
            setShowModal(false);
            //scroll down
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const selectedDivisionName = divisions.find(d => d.id === selectedDivision)?.name;
    const isFormValid = selectedDivision && email && codigo.trim();

    const circuitImages = {
        '1': 'https://iili.io/ftKPX2e.png',
        '2': 'https://iili.io/ftKPwpj.png'
    };
    // Finding circuit ID for background if possible, or using default
    const headerBackgroundImage = 'https://wikikarting.com/wp-content/uploads/2021/03/Instalaciones-Karting-Canarias.webp';

    return (
        <div className="main-wrapper">
            <div className="container">
                <div
                    id="race-info"
                    className="glass-header"
                    style={{ '--header-bg': `url(${headerBackgroundImage})` }}
                >
                    <div className="header-chips">
                        <span className="chip chip-assistance">
                            <i className="fa-solid fa-check-to-slot"></i> Asistencia
                        </span>
                    </div>
                    <h1 className="header-title">{race.name}</h1>
                    <p className="header-date">
                        <i className="fa-regular fa-calendar-days"></i> {race.date}
                    </p>
                </div>

                <div className="assistance-glass-card fade-in">
                    <div className="card-header-premium">
                        <h2>Confirmar Participación</h2>
                        <p>Completa tus datos para asegurar tu plaza</p>
                    </div>

                    <div className="division-warning">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>Si corres en dos divisiones deberás confirmar ambas por separado.</span>
                    </div>

                    <form onSubmit={handleOpenModal} className="assistance-form">
                        <div className="form-group-premium">
                            <label htmlFor="division">
                                <i className="fa-solid fa-users"></i> División
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="division"
                                    name="division"
                                    className="premium-select"
                                    value={selectedDivision}
                                    onChange={(e) => setSelectedDivision(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona tu división</option>
                                    {divisions.map(division => (
                                        <option key={division.id} value={division.id}>{division.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group-premium">
                            <label htmlFor="email">
                                <i className="fa-solid fa-envelope"></i> Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="premium-input"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                disabled={!!user}
                            />
                        </div>

                        <div className="form-group-premium">
                            <label htmlFor="codigo">
                                <i className="fa-solid fa-key"></i> Código de Verificación
                            </label>
                            <input
                                type="text"
                                id="codigo"
                                name="codigo"
                                className="premium-input"
                                required
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                placeholder="Introduce tu código"
                            />
                            <div className="input-tip">
                                ¿Has perdido tu código? Contacta con la organización.
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-confirm-premium"
                            disabled={!isFormValid || status === 'submitting'}
                        >
                            <span>Registrar Asistencia</span>
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>

                        {message && (
                            <div id="form-message" className={`message-banner-premium ${status === 'success' ? 'success' : 'error'}`}>
                                <i className={`fa-solid ${status === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                                <span>{message}</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-container-premium" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-premium">
                            <h2>Confirmar Datos</h2>
                        </div>
                        <div className="modal-body-premium">
                            <p>¿Tus datos de participación son correctos?</p>
                            <div className="confirmation-summary">
                                <div className="summary-item">
                                    <span className="label">Evento:</span>
                                    <span className="value">{race.name}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">División:</span>
                                    <span className="value">{selectedDivisionName}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Email:</span>
                                    <span className="value">{email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-premium">
                            <button className="btn-modal-cancel" onClick={handleCloseModal}>Cancelar</button>
                            <button
                                className="btn-modal-confirm"
                                onClick={handleConfirm}
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Enviando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .main-wrapper {
                    padding-bottom: 50px;
                }

                /* GLASS HEADER */
                .glass-header {
                    position: relative;
                    background-image: var(--header-bg);
                    background-size: cover;
                    background-position: center;
                    border-radius: 20px;
                    padding: 40px 25px;
                    margin: 10px 10px 12px;
                    overflow: hidden;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
                }

                .glass-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.7));
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    z-index: 1;
                }

                .header-chips, .header-title, .header-date {
                    position: relative;
                    z-index: 2;
                }

                .header-chips {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                    flex-direction: column
                }

                .chip {
                    padding: 4px 12px;
                    text-align: center;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .chip-assistance {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }

                .header-title {
                    font-family: 'Russo One', sans-serif;
                    font-size: 1.8rem;
                    color: white;
                    margin: 0 0 10px 0;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    line-height: 1.2;
                }

                .header-date {
                    flex-direction: column;
                    color: #94a3b8;
                    margin: 0;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .header-date i {
                    color: #3b82f6;
                }

                /* GLASS CARD */
                .assistance-glass-card {
                    margin: 0 10px;
                    background: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 24px;
                    padding: 25px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }

                .card-header-premium {
                    margin-bottom: 12px;
                    text-align: center;
                }

                .card-header-premium h2 {
                    font-family: 'Russo One', sans-serif;
                    color: white;
                    font-size: 1.4rem;
                    margin: 0 0 5px 0;
                }

                .card-header-premium p {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin: 0;
                }

                .division-warning {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    border-radius: 12px;
                    padding: 12px 15px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-bottom: 25px;
                    font-size: 0.85rem;
                    color: #fcd34d;
                }

                /* FORM PREMIUM */
                .form-group-premium {
                    margin-bottom: 20px;
                }

                .form-group-premium label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }

                .form-group-premium label i {
                    color: #3b82f6;
                    font-size: 0.8rem;
                }

                .premium-input, .premium-select {
                    width: 100%;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 14px 16px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .premium-input:focus, .premium-select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: rgba(15, 23, 42, 0.8);
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                .premium-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .input-tip {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin-top: 8px;
                }

                .btn-confirm-premium {
                    width: 100%;
                    margin-top: 10px;
                    padding: 16px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-family: 'Russo One', sans-serif;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
                }

                .btn-confirm-premium:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4);
                }

                .btn-confirm-premium:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-confirm-premium:disabled {
                    background: #334155;
                    color: #64748b;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .message-banner-premium {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 12px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    font-size: 0.9rem;
                    font-weight: 500;
                    animation: fadeIn 0.3s ease-out;
                }

                .message-banner-premium.success {
                    background: rgba(16, 185, 129, 0.15);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .message-banner-premium.error {
                    background: rgba(239, 68, 68, 0.15);
                    color: #f87171;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                /* MODAL PREMIUM */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(2, 6, 23, 0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .modal-container-premium {
                    background: #1e293b;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    width: 100%;
                    max-width: 400px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }

                .modal-header-premium {
                    padding: 20px;
                    background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .modal-header-premium h2 {
                    font-family: 'Russo One', sans-serif;
                    margin: 0;
                    font-size: 1.2rem;
                    color: white;
                }

                .modal-body-premium {
                    padding: 20px;
                }

                .modal-body-premium p {
                    color: #94a3b8;
                    margin: 0 0 15px 0;
                }

                .confirmation-summary {
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 16px;
                    padding: 15px;
                }

                .summary-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 12px;
                }

                .summary-item:last-child {
                    margin-bottom: 0;
                }

                .summary-item .label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #64748b;
                    font-weight: 700;
                }

                .summary-item .value {
                    color: #f1f5f9;
                    font-weight: 500;
                }

                .modal-footer-premium {
                    padding: 20px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .btn-modal-cancel {
                    padding: 12px;
                    background: transparent;
                    border: 1px solid #334155;
                    color: #94a3b8;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .btn-modal-confirm {
                    padding: 12px;
                    background: #3b82f6;
                    border: none;
                    color: white;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 700;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                /* Mobile Optimization */
                @media (max-width: 480px) {
                    .glass-header {
                        padding: 30px 20px;
                    }
                    .header-title {
                        font-size: 1.5rem;
                    }
                    .assistance-glass-card {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AssistanceConfirmation;
