import React, { useState } from 'react';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyFLHFaf3CYK8ylSv986J2-5XFK7NMxwButky-wHZTOirali6HdTvMuX2NXdEVbdnNE/exec";

const Inscripcion = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        experiencia: '',
        tiempos: '',
        peso: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [message, setMessage] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [pdfOpened, setPdfOpened] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setMessage('');

        const params = new URLSearchParams(formData);
        params.append('action', 'submitForm');

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: params,
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                setMessage('¡Inscripción enviada con éxito! Revisa tu correo.');
                setFormData({
                    nombre: '',
                    email: '',
                    telefono: '',
                    experiencia: '',
                    tiempos: '',
                    peso: ''
                });
            } else {
                throw new Error('El script de Google no devolvió éxito.');
            }
        } catch (error) {
            console.error('Error de envío:', error);
            setStatus('error');
            setMessage('Error al enviar la solicitud. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="main-wrapper">
            <div className="container">
                <h1><i className="fa-solid fa-flag-checkered"></i> Preinscripción Canary Karting</h1>

                <div className="form-group">
                    <label className="centered-text">¿Quieres correr con nosotros?
                        <p></p> Lee detenidamente nuestro documento de reglas y rellena el siguiente formulario.
                    </label>
                </div>

                <div className="form-group">
                    <a href="https://drive.google.com/file/d/18RiuNlUViofUXUaP6URrBIJwfPEFuGr3/view?usp=sharing"
                        target="_blank"
                        className="neon-link"
                        rel="noreferrer"
                        onClick={() => setPdfOpened(true)}
                    >
                        <i className="fa-solid fa-file-pdf"></i> Normativa Preinscripción
                    </a>
                </div>

                <form id="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre Completo</label>
                        <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="experiencia">¿Tienes experiencia previa en karting? ¿En qué circuitos de la isla has corrido?</label>
                        <input type="text" id="experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tiempos">¿Cuales son tus mejores tiempos por circuito? </label>
                        <small>Dejar en blanco si no los sabes</small>
                        <input type="text" id="tiempos" name="tiempos" value={formData.tiempos} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="peso">¿Peso aproximado? </label>
                        <input type="text" id="peso" name="peso" value={formData.peso} onChange={handleChange} />
                    </div>


                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            disabled={!pdfOpened}
                            style={{ width: '20px', height: '20px', marginTop: '3px', cursor: !pdfOpened ? 'not-allowed' : 'pointer' }}
                        />
                        <label htmlFor="terms" style={{ fontWeight: '400', fontSize: '0.9em', color: !pdfOpened ? '#94a3b8' : 'inherit' }}>
                            He leído y acepto la normativa y los términos de Canary Karting.
                            {!pdfOpened && <span style={{ display: 'block', color: 'var(--accent)', fontSize: '0.9em', marginTop: '4px', fontWeight: 'bold' }}>⚠️ Abre el documento PDF para activar esta casilla.</span>}
                        </label>
                    </div>

                    <button type="submit" id="submit-button" disabled={status === 'submitting' || !termsAccepted}>
                        {status === 'submitting' ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>

                    {message && (
                        <div id="form-message" className={status === 'success' ? 'success' : 'error'}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
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
            `}</style>
        </div>
    );
};

export default Inscripcion;
