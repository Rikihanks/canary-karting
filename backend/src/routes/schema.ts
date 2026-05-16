import { Router, Request, Response } from 'express';
import db from '../db.js';
import { config } from '../config.js';
import type { ApiResponse, ColumnInfo } from '../types.js';

const router = Router();

router.get('/api/v3/tables', (_req: Request, res: Response) => {
    try {
        const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
        res.json({ success: true, tables: rows.map(r => r.name) } satisfies ApiResponse);
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message } satisfies ApiResponse);
    }
});

router.get('/api/v3/schema/:table', (req: Request, res: Response) => {
    const { table } = req.params;
    try {
        const columns = db.prepare(`PRAGMA table_info(${table})`).all() as ColumnInfo[];
        res.json({ success: true, columns });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message } satisfies ApiResponse);
    }
});

router.post('/api/v3/schema/modify', (req: Request, res: Response) => {
    if (!config.enableV3) {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' } satisfies ApiResponse);
    }

    const { table, action, columnName, newColumnName, columnType } = req.body as Record<string, string>;

    try {
        if (action === 'addColumn') {
            db.prepare(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnType || 'TEXT'}`).run();
            return res.json({ success: true, message: `Column ${columnName} added to ${table}` } satisfies ApiResponse);
        }

        if (action === 'renameColumn') {
            db.prepare(`ALTER TABLE ${table} RENAME COLUMN ${columnName} TO ${newColumnName}`).run();
            return res.json({ success: true, message: `Column ${columnName} renamed to ${newColumnName} in ${table}` } satisfies ApiResponse);
        }

        if (action === 'dropColumn') {
            db.prepare(`ALTER TABLE ${table} DROP COLUMN ${columnName}`).run();
            return res.json({ success: true, message: `Column ${columnName} dropped from ${table}` } satisfies ApiResponse);
        }

        res.status(400).json({ success: false, error: 'Invalid schema action' } satisfies ApiResponse);
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message } satisfies ApiResponse);
    }
});

export default router;
