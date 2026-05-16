import { Router, Request, Response } from 'express';
import db from '../db.js';
import { config } from '../config.js';
import type { ApiResponse, ColumnInfo } from '../types.js';

const router = Router();

router.post('/api/v3/manage/:table', (req: Request, res: Response) => {
    if (!config.enableV3) {
        return res.status(503).json({ success: false, error: 'V3 API is currently disabled' } satisfies ApiResponse);
    }

    const { table } = req.params;
    const { action, ...payload } = req.body as Record<string, unknown>;

    try {
        const columnsInfo = db.prepare(`PRAGMA table_info(${table})`).all() as ColumnInfo[];
        if (!columnsInfo.length) {
            return res.status(404).json({ success: false, error: 'Table not found' } satisfies ApiResponse);
        }

        const validColumns = columnsInfo.map(c => c.name);
        const pkColumns = columnsInfo.filter(c => c.pk > 0).map(c => c.name);

        if (action === 'addItem' || action === 'add') {
            const keys = Object.keys(payload).filter(k => validColumns.includes(k) && k !== 'id');
            const values = keys.map(k => (typeof payload[k] === 'boolean' ? (payload[k] ? 1 : 0) : payload[k]));
            db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).run(...values);
            return res.json({ success: true, message: 'Item added' } satisfies ApiResponse);
        }

        if (action === 'updateItem' || action === 'update') {
            const updateKeys = Object.keys(payload).filter(k => validColumns.includes(k) && !pkColumns.includes(k));
            const values = [
                ...updateKeys.map(k => (typeof payload[k] === 'boolean' ? (payload[k] ? 1 : 0) : payload[k])),
                ...pkColumns.map(k => payload[k]),
            ];
            db.prepare(`UPDATE ${table} SET ${updateKeys.map(k => `${k} = ?`).join(', ')} WHERE ${pkColumns.map(k => `${k} = ?`).join(' AND ')}`).run(...values);
            return res.json({ success: true, message: 'Item updated' } satisfies ApiResponse);
        }

        if (action === 'deleteItem' || action === 'delete') {
            const values = pkColumns.map(k => payload[k]);
            db.prepare(`DELETE FROM ${table} WHERE ${pkColumns.map(k => `${k} = ?`).join(' AND ')}`).run(...values);
            return res.json({ success: true, message: 'Item deleted' } satisfies ApiResponse);
        }

        res.status(400).json({ success: false, error: 'Invalid action' } satisfies ApiResponse);
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message } satisfies ApiResponse);
    }
});

export default router;
