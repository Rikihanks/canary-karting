import { Router, Request, Response } from 'express';
import db from '../db.js';
import { config } from '../config.js';
import type { ApiResponse } from '../types.js';

const router = Router();

router.get('/api/v3/data', (req: Request, res: Response) => {
    if (!config.enableV3) {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' } satisfies ApiResponse);
    }

    const { season, temporada } = req.query;
    const filterValue = (season || temporada) as string | undefined;

    try {
        let pilotsQuery = 'SELECT * FROM pilots';
        let resultsQuery = 'SELECT * FROM results';
        let calendarQuery = 'SELECT * FROM calendar';
        const params: string[] = [];

        if (filterValue) {
            pilotsQuery += ' WHERE season = ?';
            resultsQuery += ' WHERE temporada = ?';
            calendarQuery += ' WHERE temporada = ?';
            params.push(filterValue);
        }

        const pilots = db.prepare(pilotsQuery).all(...params);
        const results = db.prepare(resultsQuery).all(...params).map(r => ({
            ...(r as Record<string, unknown>),
            es_vuelta_rapida: !!(r as Record<string, unknown>).es_vuelta_rapida,
        }));
        const teams = db.prepare('SELECT * FROM teams').all();
        const calendar = db.prepare(calendarQuery).all(...params);

        res.json({ success: true, data: { pilots, results, teams, calendar } } satisfies ApiResponse);
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message } satisfies ApiResponse);
    }
});

export default router;
