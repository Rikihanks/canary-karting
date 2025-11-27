import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    // Close menu when route changes
    useEffect(() => {
        closeMenu();
    }, [location]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const navMenu = document.getElementById('mobile-menu');
            const toggleButton = document.querySelector('.menu-toggle');

            if (isMenuVisible && navMenu && !navMenu.contains(event.target) && !toggleButton.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuVisible]);

    return (
        <nav className="navbar-wrapper">
            <div className="navbar-top">
                <button
                    className="menu-toggle"
                    aria-controls="mobile-menu"
                    aria-expanded={isMenuVisible}
                    onClick={toggleMenu}
                >
                    <i className={`fa-solid ${isMenuVisible ? '' : 'fa-bars'}`}></i>
                </button>
                <span className="navbar-title">
                    Canary Karting
                </span>
            </div>

            <div id="mobile-menu" className="navbar-menu" data-visible={isMenuVisible}>
                <div className="menu-header">
                    <img src={`${import.meta.env.BASE_URL}icons/50.png`} alt="icon" className="app-icon" />
                    {user && <span className="app-name">{user.nombre}</span>}
                    {!user && <span className="app-name">Canary Karting</span>}
                </div>
                <Link to="/" className="nav-link">🏆 Clasificación Pilotos</Link>
                <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>🏆 Clasificación Equipos</a>
                <Link to="/inscripcion" className="nav-link">📝 Preinscripción</Link>
                <Link to="/sorteo" className="nav-link"><i className="fa-solid fa-dice"></i> Sorteo</Link>
                <Link to="/races" className="nav-link"> 🏎️ Carreras</Link>
                {!user && <Link to="/login" className="nav-link"><i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión</Link>}
                {user && (
                    <Link
                        className="nav-link"
                        onClick={() => {
                            logout();
                            closeMenu();
                            navigate('/');
                        }}
                        style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' }}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
