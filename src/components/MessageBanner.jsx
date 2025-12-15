import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

const MessageBanner = () => {
    const config = useConfig();
    const [message, setMessage] = useState('');
    // Start collapsed so we can animate to open if needed
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (config && config.motd && config.motd.length > 0) {
            setMessage(config.motd);
            // Check storage for THIS specific message
            const isCollapsed = localStorage.getItem(`motd_collapsed_${config.motd}`);

            // If explicit "true", stay collapsed (default state)
            // If explicit "false" (unlikely unless we added logic) or null (new message), Expand!
            if (isCollapsed !== 'true') {
                // Slight delay to allow render, then animate open
                setTimeout(() => setIsExpanded(true), 100);
            }
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
        <div className={`message-banner ${!isExpanded ? 'collapsed' : ''}`}>
            <div className={`banner-content expanded-view ${isExpanded ? 'visible' : 'hidden'}`}
                style={{ pointerEvents: isExpanded ? 'auto' : 'none', position: isExpanded ? 'relative' : 'absolute' }}>
                <div className="message-content">
                    <i className="fa-solid fa-bullhorn feature-icon"></i>
                    <span dangerouslySetInnerHTML={{ __html: message }}></span>
                </div>
                <button onClick={() => toggleExpand(false)} className="toggle-btn" aria-label="Minimizar">
                    <i className="fa-solid fa-chevron-up"></i>
                </button>
            </div>

            <div className={`banner-content collapsed-view ${!isExpanded ? 'visible' : 'hidden'}`}
                onClick={() => !isExpanded && toggleExpand(true)}
                style={{ pointerEvents: !isExpanded ? 'auto' : 'none', position: !isExpanded ? 'relative' : 'absolute' }}>
                <i className="fa-solid fa-bullhorn feature-icon"></i>
                <span className="collapsed-text">Mensaje de la organización</span>
                <i className="fa-solid fa-chevron-down" style={{ marginLeft: 'auto' }}></i>
            </div>

            <style>{`
                .message-banner {
                    margin-top: 1rem;
                    margin-bottom: 0;
                    background: linear-gradient(90deg, #eab308 0%, #ca8a04 100%);
                    color: black;
                    padding: 0; /* Reset padding to handle inner content better */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    border-radius: 12px;
                    overflow: hidden;
                    /* Use max-width for smooth transition from "full" to "small" */
                    transition: max-width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.6s ease, border-radius 0.6s ease;
                    width: 100%; /* Always try to fill space */
                    
                    /* CRITICAL: Keep it centered during animation */
                    margin-left: auto;
                    margin-right: auto;
                }

                .message-banner.collapsed {
                    background: linear-gradient(90deg, #ca8a04 0%, #a16207 100%);
                    cursor: pointer;
                    max-width: 350px; /* Target width for collapsed state */
                    border-radius: 30px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                
                .message-banner:not(.collapsed) {
                    max-width: 100%; /* Fill screen when expanded */
                    border-radius: 12px;
                }

                .banner-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                    padding: 10px 20px;
                    box-sizing: border-box;
                    
                    /* The magic sequence: 
                       When showing: delay opacity (wait for resize)
                       When hiding: instant opacity (hide before resize) */
                    transition: opacity 0.2s ease; 
                }

                /* Expanded View Logic */
                .expanded-view.visible {
                    opacity: 1;
                    transition-delay: 0.3s; /* Wait for expand to finish */
                }
                .expanded-view.hidden {
                    opacity: 0;
                    transition-delay: 0s; /* Hide instantly */
                }

                /* Collapsed View Logic */
                .collapsed-view.visible {
                    opacity: 1;
                    transition-delay: 0.3s; /* Wait for collapse to finish */
                }
                .collapsed-view.hidden {
                    opacity: 0;
                    transition-delay: 0s; /* Hide instantly */
                }

                .message-content {
                    font-weight: 600;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                    justify-content: center;
                    line-height: 1.4;
                    white-space: nowrap; /* Prevent wrapping jumping during anim? No, we want wrap. */
                    white-space: normal;
                }

                .collapsed-text {
                    margin-left: 10px;
                    font-size: 0.9em;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }

                .feature-icon {
                    font-size: 1.2em;
                }

                .toggle-btn {
                    background: rgba(0,0,0,0.1);
                    border: none;
                    color: black;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    margin-left: 15px;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .toggle-btn:hover {
                    background: rgba(0,0,0,0.2);
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
};

export default MessageBanner;
