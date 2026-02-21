import React, { useState, useEffect } from 'react';
import { getNewsData } from '../services/data';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useConfig } from '../context/ConfigContext';
import { Link } from 'react-router-dom';
import StoryShare from '../components/StoryShare';
import './News.css';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedNews, setExpandedNews] = useState(null);
    const [sharingItem, setSharingItem] = useState(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const { markNewsAsRead } = useConfig();

    const renderContentWithLinks = (text) => {
        if (!text) return null;
        // Match [[Pilot Name]] even with spaces or different bracket styles
        const parts = text.split(/(\[\[.+?\]\])/g);

        return parts.map((part, index) => {
            if (part && part.startsWith('[[') && part.endsWith(']]')) {
                const pilotName = part.replace('[[', '').replace(']]', '').trim();
                if (!pilotName) return part;

                return (
                    <Link
                        key={index}
                        to={`/profile?driver=${encodeURIComponent(pilotName)}&season=2026`}
                        className="pilot-link"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'underline',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {pilotName}
                    </Link>
                );
            }
            return part;
        });
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNewsData(true);
                const today = new Date();
                today.setHours(23, 59, 59, 999); // Set to end of day to include all of today

                const filteredAndSortedNews = data
                    .filter(item => {
                        if (window.location.hostname === 'localhost') return true;
                        const newsDate = new Date(item.date);
                        return newsDate <= today;
                    })
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setNews(filteredAndSortedNews);
                // Mark as read when news are loaded
                if (filteredAndSortedNews.length > 0) {
                    markNewsAsRead(filteredAndSortedNews.length);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const handleRefresh = async () => {
        const { clearCache } = await import('../services/data');
        clearCache();
        try {
            const data = await getNewsData();
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            const filteredAndSortedNews = data
                .filter(item => {
                    if (window.location.hostname === 'localhost') return true;
                    const newsDate = new Date(item.date);
                    return newsDate <= today;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setNews(filteredAndSortedNews);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleExpand = (id) => {
        if (expandedNews === id) {
            setExpandedNews(null);
        } else {
            setExpandedNews(id);
        }
    };

    const handleShare = (e, item) => {
        e.stopPropagation();
        setIsPreviewing(false);
        setSharingItem(item);
    };

    const handlePreview = (e, item) => {
        e.stopPropagation();
        setIsPreviewing(true);
        setSharingItem(item);
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                <i className="fa-solid fa-spinner fa-spin"></i> Cargando noticias...
            </div>
        );
    }

    return (
        <PullToRefresh onRefresh={handleRefresh} pullingContent={''}>
            <div className="container fade-in">
                <h1 className="news-title">Noticias</h1>
                <div className="news-list">
                    {news.map((item) => (
                        <div
                            key={item.id}
                            className={`news-card ${expandedNews === item.id ? 'expanded' : ''}`}
                            onClick={() => toggleExpand(item.id)}
                        >
                            <div className="news-image-container">
                                <img src={item.image} alt={item.title} className="news-image" />
                                <div className="news-category-badge">{item.category}</div>
                            </div>
                            <div className="news-content-wrapper">
                                <div className="news-header">
                                    <span className="news-date">
                                        <i className="fa-regular fa-calendar-days"></i> {new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                    <h2 className="news-card-title">{item.title}</h2>
                                </div>
                                <p className="news-summary">{renderContentWithLinks(item.summary)}</p>
                                {expandedNews === item.id && (
                                    <div className="news-full-content mt-fade-in">
                                        <div className="divider"></div>
                                        <p className="news-text">{renderContentWithLinks(item.content)}</p>
                                    </div>
                                )}
                                <div className="news-footer">
                                    <div className="news-card-actions">
                                        <button
                                            className="share-story-btn"
                                            onClick={(e) => handleShare(e, item)}
                                            title="Compartir noticia"
                                        >
                                            <i className="fa-solid fa-share"></i>
                                            <span>Compartir</span>
                                        </button>

                                        {import.meta.env.DEV && (
                                            <button
                                                className="preview-story-btn"
                                                onClick={(e) => handlePreview(e, item)}
                                                title="Previsualizar local"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                        )}
                                    </div>
                                    <button className="read-more-btn">
                                        {expandedNews === item.id ? 'Leer menos' : 'Leer más'}
                                        <i className={`fa-solid fa-chevron-${expandedNews === item.id ? 'up' : 'down'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <StoryShare
                newsItem={sharingItem}
                debug={isPreviewing}
                onShareComplete={() => {
                    setSharingItem(null);
                    setIsPreviewing(false);
                }}
                onShareError={(msg) => {
                    alert(msg);
                    setSharingItem(null);
                    setIsPreviewing(false);
                }}
            />
        </PullToRefresh>
    );
};

export default News;
