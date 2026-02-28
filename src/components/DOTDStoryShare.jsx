import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { DEFAULT_PILOT_PHOTO } from '../services/data';
import './DOTDStoryShare.css';

const DOTDStoryShare = ({ winner, division, totalVotes, onShareComplete, onShareError, debug = false }) => {
    const templateRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (winner && !debug) {
            shareToStory();
        }
    }, [winner, debug]);

    const shareToStory = async () => {
        if (!templateRef.current || isGenerating) return;

        setIsGenerating(true);

        try {
            await new Promise(r => setTimeout(r, 800));

            const canvas = await html2canvas(templateRef.current, {
                useCORS: true,
                backgroundColor: '#090d17',

                scale: Math.max(3, window.devicePixelRatio),

                logging: false,

                onclone: (doc) => {
                    // Quitar blur en captura
                    const bg = doc.querySelector('.dotd-story-bg');
                    if (bg) {
                        bg.style.filter = 'none';
                        bg.style.webkitFilter = 'none';
                    }

                    // Forzar tamaño exacto y circularidad perfecta
                    const root = doc.querySelector('.dotd-story-template');
                    if (root) {
                        root.style.width = '450px';
                        root.style.height = '800px';
                    }

                    const wrapper = doc.querySelector('.dotd-story-photo-wrapper');
                    if (wrapper) {
                        wrapper.style.width = '180px';
                        wrapper.style.height = '180px';
                        wrapper.style.display = 'block';
                        wrapper.style.margin = '0 auto 20px';
                    }

                    const photo = doc.querySelector('.dotd-story-photo');
                    if (photo) {
                        photo.style.width = '164px'; // 180 - border(4*2) - padding(4*2) approximately
                        photo.style.height = '164px';
                        photo.style.borderRadius = '50%';
                        photo.style.objectFit = 'cover';
                    }
                }
            });

            canvas.toBlob(async (blob) => {
                if (!blob) throw new Error();

                const file = new File(
                    [blob],
                    `ck-dotd-${winner.driver.replace(/\s+/g, '-')}.png`,
                    { type: 'image/png' }
                );

                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({ files: [file] });
                } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    a.click();
                    URL.revokeObjectURL(url);
                }

                onShareComplete?.();
                setIsGenerating(false);

            }, 'image/png', 1);

        } catch {
            onShareError?.('Error al generar imagen');
            setIsGenerating(false);
        }
    };

    if (!winner) return null;

    const votePercentage = totalVotes > 0 ? ((winner.votes / totalVotes) * 100).toFixed(0) : 0;

    const renderTemplate = () => (
        <div className={`dotd-story-template ${debug ? 'debug-visible' : ''}`} ref={templateRef}>
            <div className="dotd-story-bg-wrapper">
                <img
                    src={winner.photo || DEFAULT_PILOT_PHOTO}
                    alt=""
                    className="dotd-story-bg"
                    crossOrigin="anonymous"
                />
                <div className="dotd-story-overlay" />
            </div>

            <div className="dotd-story-content">
                <div className="dotd-story-badge">
                    <i className="fa-solid fa-trophy"></i>
                    PILOTO DEL DÍA
                </div>

                <div className="dotd-story-image-card">
                    <div className="dotd-story-photo-wrapper">
                        <img
                            src={winner.photo || DEFAULT_PILOT_PHOTO}
                            alt={winner.driver}
                            className="dotd-story-photo"
                            crossOrigin="anonymous"
                        />
                        <div className="dotd-story-crown-absolute">
                            <i className="fa-solid fa-crown"></i>
                        </div>
                    </div>

                    <div className="dotd-title-container">
                        <h1 className="dotd-story-name">{winner.driver}</h1>
                        <div className="dotd-story-team">{winner.team || 'INDEPENDIENTE'}</div>
                    </div>

                    <div className="dotd-story-stats-grid">
                        <div className="dotd-story-stat-box">
                            <span className="dotd-story-stat-val">{votePercentage}%</span>
                            <span className="dotd-story-stat-lbl">DE LOS VOTOS</span>
                        </div>
                        <div className="dotd-story-stat-box">
                            <span className="dotd-story-stat-val">{division}ª</span>
                            <span className="dotd-story-stat-lbl">DIVISIÓN</span>
                        </div>
                    </div>
                </div>

                <div className="dotd-story-footer">
                    <div className="dotd-story-branding">Canary Karting</div>
                    <div className="dotd-story-date">
                        {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    );

    if (debug) {
        return (
            <div className="story-preview-overlay" onClick={onShareComplete}>
                <div className="story-preview-modal" onClick={e => e.stopPropagation()}>
                    <button className="preview-close-btn" onClick={onShareComplete}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="story-preview-header">Vista Previa Driver of the Day</div>
                    <div className="story-preview-container">
                        {renderTemplate()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {isGenerating && (
                <div className="dotd-share-loading-overlay">
                    <div className="dotd-share-loader">
                        <i className="fa-solid fa-camera-retro fa-beat-fade"></i>
                        <span>Preparando Story...</span>
                    </div>
                </div>
            )}
            {renderTemplate()}
        </>
    );
};

export default DOTDStoryShare;
