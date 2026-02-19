import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import './StoryShare.css';

const StoryShare = ({ newsItem, onShareComplete, onShareError, debug = false }) => {
    const templateRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (newsItem && !debug) {
            shareToStory();
        }
    }, [newsItem, debug]);

    const shareToStory = async () => {
        if (!templateRef.current || isGenerating) return;

        setIsGenerating(true);
        try {
            // Wait for images to load and layout to settle
            await new Promise(resolve => setTimeout(resolve, 800));

            const canvas = await html2canvas(templateRef.current, {
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#090d17',
                scale: 2,
                logging: false,
                width: 450,
                height: 800
            });

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    onShareError?.('No se pudo generar la imagen');
                    setIsGenerating(false);
                    return;
                }

                const file = new File([blob], `ck-noticia-${newsItem.id}.png`, { type: 'image/png' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: newsItem.title,
                            text: 'Canary Karting'
                        });
                        onShareComplete?.();
                    } catch (err) {
                        if (err.name !== 'AbortError') {
                            onShareError?.('Error al compartir');
                        }
                        onShareComplete?.(); // Reset state on cancel too
                    }
                } else {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `canary-karting-news.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                    onShareComplete?.();
                }
                setIsGenerating(false);
            }, 'image/png', 1.0);

        } catch (error) {
            console.error('Error sharing story:', error);
            onShareError?.('Error al generar la imagen');
            setIsGenerating(false);
            onShareComplete?.();
        }
    };

    if (!newsItem) return null;

    const renderTemplate = () => (
        <div className={`story-template-container ${debug ? 'debug-visible' : ''}`} ref={templateRef}>
            <div className="story-background-wrapper">
                <div
                    className="story-background"
                    style={{ backgroundImage: `url(${newsItem.image})` }}
                />
                <div className="story-overlay" />
            </div>

            <div className="story-content">
                <div className="story-category">{newsItem.category}</div>

                <div className="story-image-card">
                    <img src={newsItem.image} alt="" className="story-image" crossOrigin="anonymous" />
                </div>

                <div className="story-text-container">
                    <h1 className="story-title">{newsItem.title}</h1>
                </div>

                <div className="story-footer">
                    <div className="story-branding">Canary Karting</div>

                    <div className="story-date">
                        {new Date(newsItem.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
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
                    <div className="story-preview-header">Vista Previa Story</div>
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
                <div className="share-loading-overlay">
                    <div className="share-loader">
                        <i className="fa-solid fa-camera-retro fa-beat-fade"></i>
                        <span>Preparando Story...</span>
                    </div>
                </div>
            )}
            {renderTemplate()}
        </>
    );
};

export default StoryShare;
