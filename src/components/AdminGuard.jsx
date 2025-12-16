import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';

const ADMIN_LIST_URL = "https://raw.githubusercontent.com/Rikihanks/canary-karting/refs/heads/react-app/admins.json"; // TODO: Replace with your actual Raw GitHub URL

const AdminGuard = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const session = sessionStorage.getItem('canary_admin_auth');
        if (session === 'true') {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userEmail = result.user.email;

            // Fetch allowed list
            const response = await fetch(ADMIN_LIST_URL);
            if (!response.ok) throw new Error("Failed to verify admin list");

            const text = await response.text();
            // Parse JSON if it's JSON, or split by lines/commas if it's text
            let allowedEmails = [];
            try {
                allowedEmails = JSON.parse(text);
            } catch (e) {
                // Fallback to text parsing (one email per line)
                allowedEmails = text.split(/[\r\n,]+/).map(e => e.trim()).filter(Boolean);
            }
            if (allowedEmails.includes(userEmail)) {
                setIsAuthenticated(true);
                sessionStorage.setItem('canary_admin_auth', 'true');
                sessionStorage.setItem('canary_admin_email', userEmail);
            } else {
                setError("Acceso denegado: Tu email no está autorizado.");
                await auth.signOut(); // Ensure they are signed out to try again
            }

        } catch (err) {
            console.error(err);
            setError("Error de autenticación: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px', maxWidth: '400px' }}>
                <div style={{
                    padding: '30px',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    <i className="fa-solid fa-shield-cat" style={{ fontSize: '3rem', color: '#fbbf24', marginBottom: '20px' }}></i>
                    <h2 style={{ marginBottom: '20px', fontFamily: 'Russo One' }}>Acceso Restringido</h2>
                    <p style={{ marginBottom: '30px', color: '#94a3b8' }}>Esta zona es exclusiva para administradores.</p>

                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '0.9rem'
                        }}>
                            <i className="fa-solid fa-triangle-exclamation"></i> {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'white',
                            color: '#333',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <i className="fa-brands fa-google" style={{ color: '#DB4437' }}></i> Identificarse con Google
                    </button>
                    <p style={{ marginTop: '15px', fontSize: '0.8em', color: '#64748b' }}>
                        Canary Karting Admin
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminGuard;
