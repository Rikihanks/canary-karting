import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import './RaceResultStoryShare.css';

const RaceResultStoryShare = ({ results, circuitId, circuitName, date, division, fastestLapDriver, onShareComplete, onShareError, debug = false }) => {
    const templateRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (results && results.length > 0 && !debug) {
            shareToStory();
        }
    }, [results, debug]);

    const shareToStory = async () => {
        if (!templateRef.current || isGenerating) return;

        setIsGenerating(true);
        try {
            await new Promise(r => setTimeout(r, 800));

            const canvas = await html2canvas(templateRef.current, {
                useCORS: true,
                backgroundColor: '#090d17',
                scale: 3,
                logging: false,
                onclone: (doc) => {
                    const root = doc.querySelector('.race-story-template');
                    if (root) {
                        root.style.width = '450px';
                        root.style.height = '800px';
                        root.style.position = 'relative';
                        root.style.top = '0';
                        root.style.left = '0';
                    }
                }
            });

            canvas.toBlob(async (blob) => {
                if (!blob) throw new Error();

                const file = new File(
                    [blob],
                    `ck-results-${circuitName.replace(/\s+/g, '-').toLowerCase()}.png`,
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

        } catch (error) {
            console.error('Error generating race share:', error);
            onShareError?.('Error al generar imagen');
            setIsGenerating(false);
        }
    };

    if (!results || results.length === 0) return null;

    const sortedData = [...results].sort((a, b) => a.posicion - b.posicion);
    // Para la story mostramos el top 10 para que quepa bien
    const top10 = sortedData.slice(0, 10);

    const circuitImages = {
        '1': 'https://iili.io/ftKPX2e.png',
        '2': 'https://iili.io/ftKPwpj.png'
    };
    const headerBackgroundImage = circuitImages[circuitId] || 'https://wikikarting.com/wp-content/uploads/2021/03/Instalaciones-Karting-Canarias.webp';

    return (
        <div className={`race-story-template ${debug ? 'debug-visible' : ''}`} ref={templateRef}>
            <div className="container" style={{ padding: '0', width: '100%', maxWidth: '100%', margin: '0' }}>
                {/* ESTRUCTURA IDÉNTICA A RaceDetail.jsx */}
                <div
                    id="race-info"
                    className="glass-header"
                    style={{ '--header-bg': `url(${headerBackgroundImage})` }}
                >
                    <div className="header-chips">
                        <span className="chip chip-season">Temporada {results[0]?.temporada || '2026'}</span>
                        <span className="chip chip-division"> {division}ª División</span>
                    </div>
                    <h1 className="header-title">{circuitName}</h1>
                    <p className="header-date">
                        <i className="fa-regular fa-calendar-days"></i> {date}
                    </p>
                </div>

                <section id="resultado-section">
                    <h2
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            userSelect: 'none',
                            padding: '16px 20px',
                            margin: '0'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🏁 Resultado Final</span>
                        </div>
                        <i className="fa-solid fa-chevron-up" style={{ fontSize: '0.8em' }}></i>
                    </h2>

                    <div className="collapsible-content open" style={{ maxHeight: 'none', opacity: 1, padding: '0 10px' }}>
                        <div id="resultado-table" className="results-table-container">
                            <div className="grid-container" style={{ marginTop: '10px' }}>
                                {top10.map((item, index) => {
                                    let posClass = item.posicion === 1 ? 'pos-1' : '';
                                    if (item.posicion > 1 && item.posicion <= 3) {
                                        posClass += ' pos-podium';
                                    }

                                    return (
                                        <div key={index} className={`grid-item ${posClass}`} data-pos={item.posicion}>
                                            <div className="grid-piloto-container">
                                                <span className="grid-pos">{item.posicion}.</span>
                                                <div className="grid-piloto-link" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                                                    <span className="grid-piloto">{item.piloto}</span>
                                                    <br />
                                                    <span className="grid-piloto" style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', width: '100%', display: 'block' }}>{item.vuelta_rapida}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {fastestLapDriver && (
                            <div className="fastest-lap-banner" style={{ margin: '15px 0' }}>
                                <div className="fl-content">
                                    <div className="fl-label">
                                        <i className="fa-solid fa-stopwatch-20"></i> VUELTA RÁPIDA
                                    </div>
                                    <div className="fl-driver">
                                        {fastestLapDriver.piloto}
                                    </div>
                                    <div className="fl-time">
                                        ⏱️ {fastestLapDriver.vuelta_rapida}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="story-footer-branding">
                    Canary Karting
                </div>
            </div>
        </div>
    );
};

export default RaceResultStoryShare;
