import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getLeaderboardData } from '../services/data';
import { useConfig } from '../context/ConfigContext';

const Navbar = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isSeasonsOpen, setIsSeasonsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [userPhoto, setUserPhoto] = useState(null);
    const config = useConfig(); // Consume config context

    useEffect(() => {
        const fetchUserPhoto = async () => {
            if (user) {
                try {
                    const data = await getLeaderboardData();
                    const driver = data.find(d => d.name === user.nombre);
                    if (driver && driver.photo) {
                        setUserPhoto(driver.photo);
                    }
                } catch (error) {
                    console.error("Error fetching user photo:", error);
                }
            } else {
                setUserPhoto(null);
            }
        };

        fetchUserPhoto();
    }, [user]);

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

    // Helper to safely check config (defaults to true if config is loading/undefined, or handle loading state differently)
    const isEnabled = (key) => config && config[key] !== false;

    // Define navigation items
    const navItems = [
        { to: "/", label: "🏆 Clasificación Pilotos" },
        { to: "/teams", label: "🏆 Clasificación Equipos", feature: "teams" },
        { to: "/inscripcion", label: "📝 Preinscripción", feature: "inscripcion" },
        { to: "/sorteo", label: <span><i className="fa-solid fa-dice"></i> &nbsp;Sorteo</span>, feature: "sorteo" },
        { to: "/races", label: "🏎️ Carreras", feature: "races" },
    ];

    const renderNavLinks = (isMobile = false) => {
        return navItems.map((item, index) => {
            if (item.feature && !isEnabled(item.feature)) return null;
            return (
                <Link
                    key={index}
                    to={item.to}
                    className={isMobile ? "nav-link" : "nav-link-desktop"}
                >
                    {item.label}
                </Link>
            );
        });
    };

    return (
        <nav className="navbar-wrapper">
            <div className="navbar-top">
                <div className="navbar-left">
                    <button
                        className="menu-toggle"
                        aria-controls="mobile-menu"
                        aria-expanded={isMenuVisible}
                        onClick={toggleMenu}
                    >
                        <i className={`fa-solid ${isMenuVisible ? '' : 'fa-bars'}`}></i>
                    </button>
                    <div className="navbar-brand">
                        <span className="navbar-title">
                            Canary Karting
                        </span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-desktop">
                    {renderNavLinks(false)}

                    {/* Season Dropdown Desktop */}
                    {/* 
                    <div className="nav-link-desktop" style={{ cursor: 'pointer' }}>
                        Temp. 2025
                    </div>
                     */}

                    {(!user && isEnabled('login')) && (
                        <Link to="/login" className="nav-link-desktop login-btn">
                            <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                        </Link>
                    )}

                    {user && (
                        <div className="user-menu-desktop">
                            {/* Admin Link for Desktop */}
                            {(user.isAdmin || user.itsAdmin) && (
                                <Link to="/admin" className="nav-link-desktop" title="Panel de Administración" style={{ color: '#fbbf24' }}>
                                    <i className="fa-solid fa-lock"></i>
                                </Link>
                            )}

                            <Link
                                to={`/profile?driver=${encodeURIComponent(user.nombre)}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}
                            >
                                <span className="user-name">{user.nombre}</span>
                                {userPhoto && <img src={userPhoto} alt="Profile" className="mini-avatar-nav" />}
                            </Link>
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="logout-btn-desktop"
                                title="Cerrar Sesión"
                            >
                                <i className="fa-solid fa-power-off"></i>
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Mobile Sidebar */}
            <div id="mobile-menu" className="navbar-menu" data-visible={isMenuVisible}>
                <div className="menu-header">
                    {user && userPhoto ? (
                        <img src={userPhoto} alt={user.nombre} className="app-icon" style={{ width: '100px', height: '65px', borderRadius: '12px', objectFit: 'cover', objectPosition: 'top', border: 'none' }} />
                    ) : (
                        <img src={`${import.meta.env.BASE_URL}icons/50.png`} alt="icon" className="app-icon" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    )}
                    {user &&
                        <Link key={user.nombre}
                            to={`/profile?driver=${encodeURIComponent(user.nombre)}`}
                            className="podium-card-link">
                            <span className="app-name">{user.nombre}</span>
                        </Link>
                    }
                    {!user && <span className="app-name">Canary Karting</span>}
                </div>

                {renderNavLinks(true)}

                {/* Admin Link for Mobile */}
                {user && (user.isAdmin || user.itsAdmin) && (
                    <Link to="/admin" className="nav-link" style={{ color: '#fbbf24' }}>
                        <i className="fa-solid fa-lock"></i> &nbsp;Panel de Admin
                    </Link>
                )}

                <div style={{ height: '5px', backgroundColor: 'var(--card-bg)' }}></div>

                <div style={{
                    maxHeight: isSeasonsOpen ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-out',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}>
                    <div className="nav-link" style={{ paddingLeft: '30px', cursor: 'pointer', fontSize: '0.95em' }}>2026</div>
                    <div className="nav-link" style={{ paddingLeft: '30px', cursor: 'pointer', fontSize: '0.95em' }}>2025</div>
                    <div className="nav-link" style={{ paddingLeft: '30px', cursor: 'pointer', fontSize: '0.95em' }}>2024</div>
                </div>

                {(!user && isEnabled('login')) && <Link to="/login" className="nav-link"><i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión</Link>}

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
                        <i className="fa-solid fa-right-from-bracket"></i> &nbsp;Cerrar Sesión
                    </Link>
                )}

            </div>
        </nav>
    );
};

export default Navbar;
