import React, { useState, useEffect } from 'react';
import { getAssistanceData, getPilotEmailMap, getLeaderboardData } from '../services/data';

const DIV_MAP = { Primera: 1, Segunda: 2, Tercera: 3 };

const AdminAssistance = () => {
    const [assistance, setAssistance] = useState([]);
    const [emailMap, setEmailMap] = useState({});
    const [pilots, setPilots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const [filterDivision, setFilterDivision] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [assistanceData, map, pilotsData] = await Promise.all([
                getAssistanceData(true),
                getPilotEmailMap(true),
                getLeaderboardData(true)
            ]);
            setAssistance(assistanceData);
            setEmailMap(map);
            setPilots(pilotsData.filter(p => p.season === '2026'));
            setLoading(false);
        };
        fetchData();
    }, []);

    // Build reverse map: name → email
    const reverseMap = {};
    Object.keys(emailMap).forEach(e => { reverseMap[emailMap[e]] = e; });

    // Build a set of confirmed pilot names per (date, division)
    const confirmed = {};
    assistance.forEach(r => {
        if (r.confirmado !== 'OK') return;
        const key = `${r.fecha_carrera}|${r.division}`;
        if (!confirmed[key]) confirmed[key] = new Set();
        const name = emailMap[r.email.toLowerCase().trim()];
        if (name) confirmed[key].add(name);
    });

    // Group by (date, division) from assistance data
    const seenGroups = new Set();
    const groups = [];
    assistance.forEach(r => {
        const key = `${r.fecha_carrera}|${r.division}`;
        if (seenGroups.has(key)) return;
        seenGroups.add(key);
        const divNum = DIV_MAP[r.division];
        const pilotsInDiv = pilots.filter(p => p.division === divNum).sort((a, b) => a.name.localeCompare(b.name));
        const confirmedSet = confirmed[key] || new Set();
        const roster = pilotsInDiv.map(p => ({
            name: p.name,
            confirmed: confirmedSet.has(p.name)
        }));
        groups.push({ fecha: r.fecha_carrera, division: r.division, roster });
    });

    // Sort groups by date desc
    groups.sort((a, b) => {
        const [d1, m1, y1] = a.fecha.split('/');
        const [d2, m2, y2] = b.fecha.split('/');
        return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
    });

    const filteredGroups = groups.filter(g => {
        if (filterDate && g.fecha !== filterDate) return false;
        if (filterDivision && g.division !== filterDivision) return false;
        return true;
    });

    const dates = [...new Set(groups.map(g => g.fecha))];
    const divisions = [...new Set(groups.map(g => g.division))].sort((a, b) => {
        const order = { Primera: 1, Segunda: 2, Tercera: 3 };
        return (order[a] || 0) - (order[b] || 0);
    });

    const getDivisionColor = (div) => {
        if (div === 'Primera') return { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' };
        if (div === 'Segunda') return { bg: 'rgba(16,185,129,0.12)', color: '#34d399' };
        return { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' };
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em' }}></i>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}><i className="fa-solid fa-check-to-slot"></i> Asistencia por Carrera</h2>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{
                    background: '#1e293b', color: 'white', border: '1px solid #334155',
                    borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', flex: 1, minWidth: '160px'
                }}>
                    <option value="">Todas las fechas</option>
                    {dates.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
                <select value={filterDivision} onChange={(e) => setFilterDivision(e.target.value)} style={{
                    background: '#1e293b', color: 'white', border: '1px solid #334155',
                    borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', flex: 1, minWidth: '140px'
                }}>
                    <option value="">Todas las divisiones</option>
                    {divisions.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
                <button onClick={() => { setFilterDate(''); setFilterDivision(''); }} style={{
                    background: '#334155', color: 'white', border: 'none',
                    borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: 600
                }}>
                    <i className="fa-solid fa-rotate-left"></i> Limpiar
                </button>
            </div>

            {filteredGroups.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No hay datos</div>
            ) : filteredGroups.map((g, gi) => {
                const dc = getDivisionColor(g.division);
                const confirmedCount = g.roster.filter(p => p.confirmed).length;
                return (
                    <div key={gi} style={{
                        background: 'rgba(30,41,59,0.4)', borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', marginBottom: '16px'
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '14px 20px', background: 'rgba(15,23,42,0.5)',
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>{g.fecha}</span>
                                <span style={{ background: dc.bg, color: dc.color, padding: '4px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}>{g.division}</span>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                <span style={{ color: '#10b981', fontWeight: 700 }}>{confirmedCount}</span> / {g.roster.length} confirmados
                            </div>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                            {g.roster.map((p, pi) => (
                                <div key={pi} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '8px 20px',
                                    background: pi % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                                }}>
                                    <div style={{
                                        width: '22px', height: '22px', borderRadius: '6px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        background: p.confirmed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)',
                                        color: p.confirmed ? '#10b981' : '#ef4444',
                                        fontSize: '0.8rem', fontWeight: 700
                                    }}>
                                        <i className={`fa-solid ${p.confirmed ? 'fa-check' : 'fa-xmark'}`}></i>
                                    </div>
                                    <span style={{ color: '#f1f5f9', fontWeight: 500, fontSize: '0.9rem' }}>{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            <div style={{ textAlign: 'right', color: '#64748b', fontSize: '0.8rem', marginTop: '12px' }}>
                {filteredGroups.length} carrera(s){filterDate || filterDivision ? ` (de ${groups.length})` : ''}
            </div>
        </div>
    );
};

export default AdminAssistance;
