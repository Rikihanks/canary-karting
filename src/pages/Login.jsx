import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(username);

        if (result.success) {
            setIsSubmitted(true);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    if (isSubmitted) {
        return (
            <div style={{ padding: '30px', maxWidth: '500px', margin: '0 auto' }}>
                <i className="fa-solid fa-envelope-circle-check" style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '20px' }}></i>
                <h2 style={{ marginBottom: '15px' }}>¡Bienvenido!</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '20px' }}>
                    Te hemos mandado un correo para verificar tu identidad. Dentro hay un código que <strong> debes guardar </strong> porque te será necesario para confirmar tu asistencia a las carreras.
                    <br />
                </p>
                <button onClick={() => navigate('/')} >
                    Entendido
                </button>
                <style>
                    {`
                        button {
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
                    `}
                </style>
            </div>
        );
    }

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
                <input
                    type="text"
                    placeholder="piloto@email.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <small>Sólo los pilotos en competición pueden identificarse en la aplicación.</small>
                {error && <div style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{error}</div>}
                <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Entrar'}
                </button>
            </form>

            <style>
                {`
                  label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--text-main);
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

                button {
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
            `}
            </style>
        </div>
    );
};

export default Login;
