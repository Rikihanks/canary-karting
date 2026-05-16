import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '100vh', padding: '20px', textAlign: 'center',
                    background: '#090d17', color: '#94a3b8', fontFamily: 'Montserrat, sans-serif'
                }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '20px' }}></i>
                    <h2 style={{ color: '#f1f5f9', margin: '0 0 10px', fontFamily: 'Russo One, sans-serif' }}>Algo salió mal</h2>
                    <p style={{ margin: '0 0 20px', maxWidth: '400px', lineHeight: '1.5' }}>Ocurrió un error inesperado. Prueba a recargar la página.</p>
                    <button onClick={() => window.location.reload()} style={{
                        padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none',
                        borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem'
                    }}>
                        <i className="fa-solid fa-rotate-right"></i> Recargar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
