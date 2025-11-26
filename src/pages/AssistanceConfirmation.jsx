import React, { useState } from 'react';
import { confirmAssistance } from '../services/data';

const AssistanceConfirmation = () => {
    const [selectedRace, setSelectedRace] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const race = { id: 1, name: 'Carrera 1 - 15 Diciembre 2024', date: '2024-12-15' };

    const divisions = [
        { id: 'senior', name: 'Senior' },
        { id: 'junior', name: 'Junior' },
        { id: 'master', name: 'Master' }
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

            if (result.success) {
                setStatus('success');
                setMessage(result.message || '¡Te hemos enviado un correo con la confirmación de tu asistencia, nos vemos en el circuito!');
                setShowModal(false);
                setSelectedRace('');
                setSelectedDivision('');
                setEmail('');
                setCodigo('');
            } else {
                setStatus('error');
                setMessage(result.message || 'Error al confirmar la asistencia. Verifica tu código.');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Error al conectar con el servidor. Inténtalo de nuevo.');
        }
    };

    const selectedDivisionName = divisions.find(d => d.id === selectedDivision)?.name;
    const isFormValid = selectedDivision && email && codigo.trim();

    return (
        <div className="main-wrapper">
            <div className="container">
                <div className="card">
                    <h1><i className="fa-solid fa-check-circle"></i> Confirmar Asistencia</h1>

                    <div className="form-group">
                        <div className="centered-text" style={{ marginBottom: '20px' }}>
                            <div id="race-info" style={{ backgroundColor: '#1a233a', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', color: '#93c5fd' }}>
                                <p className="race-info-date">Carrera: <strong>{race.name}</strong></p>
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>Selecciona la división en la que participarás.
                                <br /> <small style={{ color: 'var(--danger)' }}>Si corres en dos divisiones deberás confirmar ambas</small>
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleOpenModal}>
                        <div className="form-group">
                            <label htmlFor="division">División <i className="fa-solid fa-users"></i></label>
                            <select
                                id="division"
                                name="division"
                                className="division-dropdown"
                                value={selectedDivision}
                                onChange={(e) => setSelectedDivision(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una división</option>
                                {divisions.map(division => (
                                    <option key={division.id} value={division.id}>{division.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email <i className="fa-solid fa-envelope"></i></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="codigo">Código de Verificación <i className="fa-solid fa-key"></i></label>
                            <input
                                type="text"
                                id="codigo"
                                name="codigo"
                                required
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                placeholder="Ingresa tu código"
                            />
                        </div>

                        <button type="submit" disabled={!isFormValid || status === 'submitting'}>
                            Confirmar Asistencia
                        </button>

                        {message && (
                            <div id="form-message" className={status === 'success' ? 'success' : 'error'}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><i className="fa-solid fa-triangle-exclamation"></i> Confirmar Asistencia</h2>
                        </div>
                        <div className="modal-body">
                            <p>¿Confirmar tu asistencia con los siguientes datos?</p>
                            <div className="confirmation-details">
                                <p><strong>Carrera:</strong> {race.name}</p>
                                <p><strong>División:</strong> {selectedDivisionName}</p>
                                <p><strong>Email:</strong> {email}</p>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8em', marginTop: '15px' }}>
                                <i className="fa-solid fa-info-circle"></i> Esta acción no se puede deshacer fácilmente.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                Cancelar
                            </button>
                            <button type="button" className="btn-confirm" onClick={handleConfirm} disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Confirmando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                /* Inscripcion Specific Styles */
                .main-wrapper {
                    padding-top: 20px;
                    padding-bottom: 50px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .centered-text {
                    text-align: center;
                    font-weight: 400;
                    line-height: 1.6;
                }

                input[type="text"],
                input[type="email"],
                input[type="tel"] {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    background-color: #1e293b;
                    color: white;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }

                input:focus {
                    outline: none;
                    border-color: var(--accent);
                }

                button[type="submit"] {
                    width: 100%;
                    padding: 15px;
                    background-color: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    text-transform: uppercase;
                }

                button[type="submit"]:hover {
                    background-color: var(--accent-hover);
                }
                
                button[type="submit"]:disabled {
                    background-color: #64748b;
                    cursor: not-allowed;
                }

                .neon-link {
                    display: block;
                    text-align: center;
                    padding: 15px;
                    border: 2px solid var(--accent);
                    color: var(--accent);
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 700;
                    text-transform: uppercase;
                    transition: all 0.3s;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
                }

                .neon-link:hover {
                    background-color: var(--accent);
                    color: white;
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
                }

                #form-message {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 600;
                }

                .success {
                    background-color: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    border: 1px solid #10b981;
                }

                .error {
                    background-color: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid #ef4444;
                }
                
                small {
                    display: block;
                    margin-bottom: 5px;
                    color: #94a3b8;
                    font-size: 0.85rem;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.75);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease-out;
                }

                .modal-container {
                    background-color: var(--color-medium);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 1.4em;
                    color: var(--color-accent);
                }

                .modal-body {
                    padding: 20px;
                }

                .modal-body p {
                    margin: 0 0 15px 0;
                    line-height: 1.6;
                }

                .confirmation-details {
                    background-color: rgba(59, 130, 246, 0.1);
                    border-left: 3px solid var(--color-accent);
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                }

                .confirmation-details p {
                    margin: 8px 0;
                }

                .modal-footer {
                    padding: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }

                .btn-cancel, .btn-confirm {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                }

                .btn-cancel {
                    background-color: transparent;
                    color: var(--text-muted);
                    border: 1px solid var(--text-muted);
                }

                .btn-cancel:hover {
                    background-color: rgba(148, 163, 184, 0.1);
                    color: var(--text-main);
                }

                .btn-confirm {
                    background-color: var(--accent);
                    color: white;
                }

                .btn-confirm:hover {
                    background-color: var(--accent-hover);
                }

                .btn-confirm:disabled {
                    background-color: #64748b;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default AssistanceConfirmation;
