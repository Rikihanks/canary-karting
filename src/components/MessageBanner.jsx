import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

const MessageBanner = () => {
    const config = useConfig();
    const [message, setMessage] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (config && config.motd && config.motd.length > 0) {
            setMessage(config.motd);
            const isCollapsed = localStorage.getItem(`motd_collapsed_${config.motd}`);

            // Initial animation delay
            setTimeout(() => {
                setIsLoaded(true);
                if (isCollapsed !== 'true') {
                    setIsExpanded(true);
                }
            }, 300);
        } else {
            setMessage('');
        }
    }, [config]);

    const toggleExpand = (newState) => {
        setIsExpanded(newState);
        if (message) {
            if (!newState) {
                localStorage.setItem(`motd_collapsed_${message}`, 'true');
            } else {
                localStorage.removeItem(`motd_collapsed_${message}`);
            }
        }
    };

    if (!message) return null;

    return (
        <div className={`message-banner-container ${isLoaded ? 'loaded' : ''}`}>
            {/* EXPANDED CONTENT */}
            <div
                className="banner-expanded"
                onClick={() => toggleExpand(false)}
                style={{
                    maxHeight: isExpanded ? '500px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                    pointerEvents: isExpanded ? 'auto' : 'none'
                }}
            >
                {/* Decorative Background Icon */}
                <i className="fa-solid fa-bullhorn bg-icon"></i>

                <div className="banner-content">
                    <div className="message-text">
                        <i className="fa-solid fa-bullhorn" style={{ marginRight: '12px', color: '#fbbf24', fontSize: '1.2em' }}></i>
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                    </div>
                    <button className="action-btn" title="Cerrar">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            {/* COLLAPSED HANDLE */}
            <div
                className="banner-collapsed"
                onClick={() => toggleExpand(true)}
                style={{
                    maxHeight: !isExpanded ? '40px' : '0px',
                    opacity: !isExpanded ? 1 : 0,
                    pointerEvents: !isExpanded ? 'auto' : 'none',
                    marginTop: !isExpanded ? '0' : '0' // Avoid double margin
                }}
            >
                <div className="handle-content">
                    <i className="fa-solid fa-circle-info" style={{ color: '#fbbf24' }}></i>
                    <span style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#cbd5e1' }}>Hay un mensaje de la organización</span>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.8em', marginLeft: 'auto', color: '#94a3b8' }}></i>
                </div>
            </div>

            <style>{`
                .message-banner-container {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    transition: all 0.5s ease;
                    opacity: 0;
                    transform: translateY(-20px);
                }

                .message-banner-container.loaded {
                    opacity: 1;
                    transform: translateY(0);
                    margin-top: 18px;
                    margin-bottom: 5px;
                }

                .banner-expanded {
                    /* Dark glass look to match collapsed state */
                    background: rgba(30, 41, 59, 0.95); 
                    border: 1px solid rgba(251, 191, 36, 0.3); /* Amber accent border */
                    border-radius: 8px;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Stronger shadow */
                    margin: 0 5px;
                    position: relative; /* For bg icon positioning */
                    cursor: pointer; /* Clickable */
                }

                .bg-icon {
                    position: absolute;
                    right: -10px;
                    bottom: -20px;
                    font-size: 5rem;
                    color: rgba(251, 191, 36, 0.05); /* Very subtle watermark */
                    transform: rotate(-15deg);
                    pointer-events: none;
                    z-index: 0;
                }

                .banner-content {
                    padding: 15px 20px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 15px;
                    color: #f1f5f9; /* Light text */
                    position: relative; /* Above bg icon */
                    z-index: 1;
                }

                .message-text {
                    font-weight: 500;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    display: flex;
                    align-items: baseline;
                    color: #e2e8f0;
                }

                .action-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #cbd5e1;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    transform: rotate(90deg);
                }

                .banner-collapsed {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin: 0 10px;
                    border-radius: 6px;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .banner-collapsed:hover {
                    background: rgba(30, 41, 59, 0.9);
                }

                .handle-content {
                    padding: 8px 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    height: 40px; /* Match max-height */
                }
            `}</style>
        </div>
    );
};

export default MessageBanner;
