import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getLeaderboardData } from '../services/data';
import { useConfig } from '../context/ConfigContext';
import { usePWAInstallStatus } from '../hooks/usePWAInstallStatus';

const Navbar = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null); // Track which submenu is open
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [userPhoto, setUserPhoto] = useState(null);
    const config = useConfig(); // Consume config context
    const isInstalled = usePWAInstallStatus();

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
        {
            to: "/clasificacion",
            label: "🏆 Clasificación Pilotos",
            subItems: [
                { to: "/clasificacion?season=2026", label: "Temporada 2026" },
                { to: "/clasificacion?season=2025", label: "Temporada 2025" }
            ]
        },
        {
            to: "/teams",
            label: "🏆 Clasificación Equipos",
            feature: "teams",
            subItems: [
                { to: "/teams?season=2026", label: "Temporada 2026" },
                { to: "/teams?season=2025", label: "Temporada 2025" }
            ]
        },
        //{ to: "/news", label: "📰 Noticias" },
        // { to: "/inscripcion", label: "📝 Preinscripción", feature: "inscripcion" },
        { to: "/votar", label: "🗳️ Piloto del día" },
        { to: "/races", label: "🏎️ Calendario Carreras", feature: "races" },
        { to: "/inscripcion-academia", label: "📝 Academia", feature: "inscripcion-academia" },
        { to: "https://drive.google.com/file/d/1dsxBpYSdYimvLtnnlaab-4KDTN9g1-z5/view?usp=sharing", label: "📃 Reglamento 2026", external: true },
        { to: "/install", label: "📱 Instalar App", hidden: isInstalled, className: "flash-animation" },
    ];

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    const renderNavLinks = (isMobile = false) => {
        return navItems.map((item, index) => {
            if (item.feature && !isEnabled(item.feature)) return null;
            if (item.hidden) return null;

            if (item.subItems) {
                return (
                    <div key={index} className="nav-item-container">
                        <div
                            className={isMobile ? "nav-link" : "nav-link-desktop"}
                            onClick={isMobile ? () => toggleSubmenu(index) : undefined}
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            {item.label}
                            {isMobile && <i className={`fa-solid fa-chevron-${openSubmenu === index ? 'up' : 'down'}`} style={{ fontSize: '0.8em' }}></i>}
                        </div>
                        <div
                            className={isMobile ? "nav-sub-menu-mobile" : "nav-sub-menu-desktop"}
                            data-open={isMobile ? (openSubmenu === index) : undefined}
                        >
                            {item.subItems.map((sub, subIdx) => (
                                <Link
                                    key={subIdx}
                                    to={sub.to}
                                    className={isMobile ? "nav-link sub-link" : "nav-link-desktop sub-link"}
                                    onClick={isMobile ? closeMenu : undefined}
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            }

            if (item.disabled) {
                return (
                    <div
                        key={index}
                        className={isMobile ? "nav-link disabled-link" : "nav-link-desktop disabled-link"}
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                        {item.label}
                    </div>
                );
            }

            if (item.external) {
                return (
                    <a
                        key={index}
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={isMobile ? "nav-link" : "nav-link-desktop"}
                    >
                        {item.label}
                    </a>
                );
            }

            return (
                <Link
                    key={index}
                    to={item.to}
                    className={(isMobile ? "nav-link" : "nav-link-desktop") + (item.className ? ` ${item.className}` : "")}
                >
                    {item.label}
                    {item.to === "/news" && config?.hasNewNews && (
                        isMobile ? (
                            <i className="fa-solid fa-circle-exclamation pulse-animation" style={{ color: 'var(--danger)', marginLeft: '10px' }}></i>
                        ) : (
                            <span className="notification-badge-dot pulse-animation"></span>
                        )
                    )}
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

                    {(!user && isEnabled('login')) && (
                        <>
                            <Link to="/configuracion" className="nav-link-desktop" title="Configuración">
                                <i className="fa-solid fa-gear"></i>
                                {config?.hasUpdate && <span className="notification-badge-dot pulse-animation"></span>}
                            </Link>
                            <Link to="/login" className="nav-link-desktop login-btn">
                                <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                            </Link>
                        </>
                    )}

                    {user && (
                        <div className="user-menu-desktop">
                            <Link to="/configuracion" className="nav-link-desktop" title="Configuración" style={{ padding: '0 10px' }}>
                                <i className="fa-solid fa-gear"></i>
                                {config?.hasUpdate && <span className="notification-badge-dot pulse-animation"></span>}
                            </Link>
                            <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 5px' }}></div>
                            <Link
                                to={`/profile?driver=${encodeURIComponent(user.nombre)}&season=2026`}
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
                            to={`/profile?driver=${encodeURIComponent(user.nombre)}&season=2026`}
                            className="podium-card-link">
                            <span className="app-name">{user.nombre}</span>
                        </Link>
                    }
                    {!user && <span className="app-name">Canary Karting</span>}
                </div>

                {renderNavLinks(true)}

                <div style={{ height: '5px', backgroundColor: 'var(--card-bg)' }}></div>

                <Link to="/configuracion" className="nav-link" onClick={closeMenu} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><i className="fa-solid fa-gear"></i> &nbsp;Configuración</span>
                    {config?.hasUpdate && <i className="fa-solid fa-circle-exclamation pulse-animation" style={{ color: 'var(--danger)', fontSize: '1.2em' }}></i>}
                </Link>

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
