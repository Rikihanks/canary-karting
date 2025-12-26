import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleChoice = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <div className="welcome-modal-overlay">
            <div className="welcome-modal-content">
                <div className="welcome-modal-header">
                    <h2>¡Bienvenido a Canary Karting!</h2>
                </div>

                <div className="welcome-modal-actions">
                    <button
                        className="modal-btn competition-btn"
                        onClick={() => handleChoice('/inscripcion')}
                    >
                        <div className="btn-icon">
                            <i className="fa-solid fa-flag-checkered"></i>
                        </div>
                        <div className="btn-text">
                            <span className="btn-title">Competición</span>
                            <span className="btn-subtitle">Únete al campeonato oficial</span>
                        </div>
                    </button>

                    <button
                        className="modal-btn academia-btn"
                        onClick={() => handleChoice('/inscripcion-academia')}
                    >
                        <div className="btn-icon">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div className="btn-text">
                            <span className="btn-title">Academia</span>
                            <span className="btn-subtitle">Aprende y mejora tus tiempos</span>
                        </div>
                    </button>
                </div>
            </div>

            <style>{`
                .welcome-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease-out;
                }

                .welcome-modal-content {
                    background: #1e293b;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 40px;
                    width: 90%;
                    max-width: 500px;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.2);
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .modal-logo {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 20px;
                    border-radius: 16px;
                }

                .welcome-modal-header h2 {
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                    color: white;
                    font-weight: 800;
                }

                .welcome-modal-header p {
                    color: #94a3b8;
                    font-size: 1.1rem;
                    margin-bottom: 30px;
                }

                .welcome-modal-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 30px;
                }

                .modal-btn {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(255, 255, 255, 0.03);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: left;
                    width: 100%;
                }

                .btn-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--accent);
                }

                .btn-text {
                    display: flex;
                    flex-direction: column;
                }

                .btn-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    display: block;
                }

                .btn-subtitle {
                    font-size: 0.9rem;
                    color: #94a3b8;
                }

                .competition-btn:hover {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: rgba(59, 130, 246, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.5);
                }

                .academia-btn:hover {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: rgba(16, 185, 129, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -10px rgba(16, 185, 129, 0.5);
                }

                .academia-btn .btn-icon {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .modal-close-text {
                    background: none;
                    border: none;
                    color: #64748b;
                    font-size: 0.95rem;
                    cursor: pointer;
                    text-decoration: underline;
                    transition: color 0.2s;
                }

                .modal-close-text:hover {
                    color: #94a3b8;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default WelcomeModal;
