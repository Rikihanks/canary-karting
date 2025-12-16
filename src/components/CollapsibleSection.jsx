import React, { useState } from 'react';

const CollapsibleSection = ({ title, icon, children, defaultOpen = false, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`collapsible-section ${className}`} style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            marginBottom: '1rem',
            overflow: 'hidden'
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-color)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderBottom: isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    transition: 'border-bottom 0.2s'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {icon && <i className={icon}></i>}
                    <span>{title}</span>
                </div>
                <i
                    className={`fa-solid fa-chevron-down`}
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                    }}
                ></i>
            </button>

            <div
                style={{
                    maxHeight: isOpen ? '2000px' : '0',
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease-in-out',
                    visibility: isOpen ? 'visible' : 'hidden'
                }}
            >
                <div style={{ padding: '1rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CollapsibleSection;
