import { Router, Request, Response } from 'express';
import db from '../db.js';
import { config } from '../config.js';
import type { ApiResponse, ColumnInfo } from '../types.js';

const router = Router();

router.post('/api/v3/results', (req: Request, res: Response) => {
    if (!config.enableV3) {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' } satisfies ApiResponse);
    }

    const { action, ...payload } = req.body as Record<string, unknown>;

    try {
        const columnsInfo = db.prepare('PRAGMA table_info(results)').all() as ColumnInfo[];
        const validColumns = columnsInfo.map(c => c.name);

        if (action === 'addResult') {
            const keys = Object.keys(payload).filter(k => validColumns.includes(k) && k !== 'id');
            const placeholders = keys.map(() => '?').join(', ');
            const values = keys.map(k => (typeof payload[k] === 'boolean' ? (payload[k] ? 1 : 0) : payload[k]));
            db.prepare(`INSERT INTO results (${keys.join(', ')}) VALUES (${placeholders})`).run(...values);
            return res.json({ success: true, message: 'Result added' } satisfies ApiResponse);
        }

        if (action === 'updateResult') {
            const updatable = columnsInfo.map(c => c.name).filter(c => !['id', 'pilot', 'id_circuito', 'date', 'division'].includes(c));
            const setParts: string[] = [];
            const values: unknown[] = [];

            Object.keys(payload).forEach(key => {
                if (updatable.includes(key)) {
                    setParts.push(`${key} = ?`);
                    values.push(typeof payload[key] === 'boolean' ? (payload[key] ? 1 : 0) : payload[key]);
                }
            });

            if (!setParts.length) {
                return res.status(400).json({ success: false, error: 'No valid columns to update' } satisfies ApiResponse);
            }

            values.push(payload.pilot, payload.id_circuito, payload.date, payload.division);
            db.prepare(`UPDATE results SET ${setParts.join(', ')} WHERE pilot = ? AND id_circuito = ? AND date = ? AND division = ?`).run(...values);
            return res.json({ success: true, message: 'Result updated' } satisfies ApiResponse);
        }

        if (action === 'deleteResult') {
            db.prepare('DELETE FROM results WHERE pilot = ? AND id_circuito = ? AND date = ? AND division = ?').run(
                payload.pilot, payload.id_circuito, payload.date, payload.division
            );
            return res.json({ success: true, message: 'Result deleted' } satisfies ApiResponse);
        }

        res.status(400).json({ success: false, error: 'Invalid action' } satisfies ApiResponse);
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message } satisfies ApiResponse);
    }
});

export default router;
